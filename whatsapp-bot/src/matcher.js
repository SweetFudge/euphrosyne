// Logique pure (sans réseau) : qui parle, est-ce que je suis tagué, etc.

/** "33612345678:12@s.whatsapp.net" -> "33612345678" */
export function userPart(jid = '') {
  return String(jid).split('@')[0].split(':')[0];
}

export function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '');
}

/** Découpe une variable d'env "a, b ,c" en tableau propre. */
export function parseList(value = '') {
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Le message vient-il du contact ciblé ?
 * WhatsApp peut identifier un expéditeur par numéro (@s.whatsapp.net) ou par LID (@lid),
 * donc on compare tous les identifiants connus du message.
 */
export function isFromTarget({ senderIds = [], pushName = '' }, target) {
  const wanted = digitsOnly(target.number);
  const ids = senderIds.filter(Boolean).map(userPart);
  if (wanted && ids.some((id) => digitsOnly(id) === wanted)) return true;
  if (target.lid && ids.includes(userPart(target.lid))) return true;
  if (target.pushName && pushName && pushName.trim().toLowerCase() === target.pushName.trim().toLowerCase()) {
    return true;
  }
  return false;
}

/**
 * Suis-je tagué ? Soit via un vrai tag WhatsApp (mentionedJid),
 * soit parce qu'un de mes noms apparaît dans le texte.
 */
export function isMentioned({ mentionedJids = [], text = '' }, { myIds = [], myNames = [] }) {
  const mine = new Set(myIds.filter(Boolean).map(userPart));
  if (mentionedJids.some((jid) => mine.has(userPart(jid)))) return true;

  // Un tag écrit à la main "@33612345678" ou "@Adriano"
  const lower = text.toLowerCase();
  for (const id of mine) {
    if (id && lower.includes(`@${id}`)) return true;
  }
  for (const name of myNames) {
    const escaped = name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`(^|[^\\p{L}\\p{N}])@?${escaped}(?![\\p{L}\\p{N}])`, 'u').test(lower)) return true;
  }
  return false;
}

/** Le groupe fait-il partie de ceux écoutés ? (aucun filtre = tous) */
export function isGroupAllowed({ jid, subject = '' }, { groupIds = [], groupNames = [] }) {
  if (groupIds.length === 0 && groupNames.length === 0) return true;
  if (groupIds.includes(jid)) return true;
  const s = subject.toLowerCase();
  return groupNames.some((n) => s.includes(n.toLowerCase()));
}

/** Tire une réponse au hasard, en évitant de répéter la précédente. */
export function pickReply(replies, last, rng = Math.random) {
  if (replies.length === 0) return null;
  if (replies.length === 1) return replies[0];
  let choice;
  do {
    choice = replies[Math.floor(rng() * replies.length)];
  } while (choice === last);
  return choice;
}
