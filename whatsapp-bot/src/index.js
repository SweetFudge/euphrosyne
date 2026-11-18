import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  normalizeMessageContent,
  getContentType,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import {
  digitsOnly,
  parseList,
  isFromTarget,
  isMentioned,
  isGroupAllowed,
  pickReply,
} from './matcher.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env;

// ---------- Configuration ----------
const config = {
  target: {
    number: digitsOnly(env.TARGET_NUMBER),
    lid: env.TARGET_LID || '',
    pushName: env.TARGET_PUSHNAME || '',
  },
  myNames: parseList(env.MY_NAMES),
  pairingPhone: digitsOnly(env.PAIRING_PHONE_NUMBER),
  groupIds: parseList(env.GROUP_IDS),
  groupNames: parseList(env.GROUP_NAMES),
  cooldownMs: Number(env.REPLY_COOLDOWN_SECONDS ?? 30) * 1000,
  delayMin: Number(env.REPLY_DELAY_MIN_MS ?? 2000),
  delayMax: Number(env.REPLY_DELAY_MAX_MS ?? 6000),
  quote: (env.QUOTE_MESSAGE ?? 'true') !== 'false',
  logSenders: env.LOG_SENDERS === 'true',
  authDir: env.AUTH_DIR || './auth',
};

if (!config.target.number && !config.target.lid && !config.target.pushName) {
  console.error('❌ Définis TARGET_NUMBER (ex: 33612345678) dans les variables d\'environnement.');
  process.exit(1);
}

const replies = JSON.parse(
  fs.readFileSync(env.REPLIES_FILE || path.join(__dirname, 'replies.json'), 'utf8'),
);

const logger = pino({ level: env.LOG_LEVEL || 'warn' });
const log = (...args) => console.log(new Date().toISOString(), ...args);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- État ----------
const groupSubjects = new Map(); // jid -> nom du groupe
let lastReplyAt = 0;
let lastReply = null;
let pairingRequested = false;

async function getGroupSubject(sock, jid) {
  if (groupSubjects.has(jid)) return groupSubjects.get(jid);
  try {
    const meta = await sock.groupMetadata(jid);
    groupSubjects.set(jid, meta.subject || '');
    return meta.subject || '';
  } catch {
    return '';
  }
}

/** Extrait texte + mentions d'un message, quel que soit son type. */
function extractContent(message) {
  const content = normalizeMessageContent(message);
  if (!content) return { text: '', mentionedJids: [] };
  const type = getContentType(content);
  const inner = content[type];
  const text =
    typeof inner === 'string' ? inner : inner?.text || inner?.caption || content.conversation || '';
  const mentionedJids = inner?.contextInfo?.mentionedJid || [];
  return { text, mentionedJids };
}

async function handleMessage(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid?.endsWith('@g.us')) return; // groupes uniquement
  if (msg.key.fromMe || !msg.message) return;

  const senderIds = [msg.key.participant, msg.key.participantPn, msg.key.participantAlt, msg.participant];

  if (config.logSenders) {
    log('👀 message de', senderIds.filter(Boolean).join(' | '), `(${msg.pushName || '?'})`, 'dans', jid);
  }

  if (!isFromTarget({ senderIds, pushName: msg.pushName }, config.target)) return;

  const subject = await getGroupSubject(sock, jid);
  if (!isGroupAllowed({ jid, subject }, config)) return;

  const { text, mentionedJids } = extractContent(msg.message);
  const myIds = [sock.user?.id, sock.user?.lid];
  if (!isMentioned({ mentionedJids, text }, { myIds, myNames: config.myNames })) return;

  const now = Date.now();
  if (now - lastReplyAt < config.cooldownMs) {
    log('⏳ cooldown actif, message ignoré');
    return;
  }
  lastReplyAt = now;

  const reply = pickReply(replies, lastReply);
  if (!reply) return;
  lastReply = reply;

  // Petit délai + "est en train d'écrire…" pour faire naturel
  const delay = config.delayMin + Math.random() * Math.max(0, config.delayMax - config.delayMin);
  try {
    await sock.presenceSubscribe(jid);
    await sock.sendPresenceUpdate('composing', jid);
    await sleep(delay);
    await sock.sendPresenceUpdate('paused', jid);
    await sock.sendMessage(jid, { text: reply }, config.quote ? { quoted: msg } : undefined);
    log(`💬 réponse envoyée dans "${subject || jid}" : ${reply}`);
  } catch (err) {
    log('❌ envoi impossible :', err?.message || err);
  }
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: ['Ubuntu', 'Chrome', '120.0.0'],
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    // Jumelage : code à 8 caractères (si PAIRING_PHONE_NUMBER) sinon QR code
    if (qr && !sock.authState.creds.registered) {
      if (config.pairingPhone) {
        if (!pairingRequested) {
          pairingRequested = true;
          try {
            const code = await sock.requestPairingCode(config.pairingPhone);
            log(`🔗 CODE DE JUMELAGE : ${code}`);
            log('   WhatsApp > Appareils connectés > Connecter un appareil > "Associer avec le numéro de téléphone"');
          } catch (err) {
            pairingRequested = false;
            log('❌ impossible de générer le code :', err?.message || err);
          }
        }
      } else {
        log('📱 Scanne ce QR code avec WhatsApp > Appareils connectés :');
        qrcode.generate(qr, { small: true });
      }
    }

    if (connection === 'open') {
      pairingRequested = false;
      log(`✅ Connecté en tant que ${sock.user?.id}`);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        log('🚪 Session déconnectée depuis le téléphone. Supprime le dossier auth et redéploie pour te reconnecter.');
        process.exit(1);
      }
      log(`🔌 Connexion fermée (code ${code}), reconnexion…`);
      setTimeout(start, 3000);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        await handleMessage(sock, msg);
      } catch (err) {
        log('❌ erreur de traitement :', err?.message || err);
      }
    }
  });
}

log('🚀 Démarrage…');
log(`   Contact ciblé : ${config.target.number || config.target.lid || config.target.pushName}`);
log(`   Groupes : ${config.groupIds.concat(config.groupNames).join(', ') || 'tous'}`);
start();
