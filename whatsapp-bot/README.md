# WhatsApp Random Replier

Se connecte à ton WhatsApp (comme un « appareil connecté »), écoute un ou plusieurs groupes, et quand **un contact précis te tague**, répond avec une phrase aléatoire.

> ⚠️ Utilise la librairie non officielle Baileys. WhatsApp tolère mal les bots sur un compte perso : le risque de bannissement existe. Le bot ne répond qu'à un seul contact, avec un cooldown et un délai « humain », ce qui limite le risque mais ne l'annule pas. Les réponses partent **de ton numéro**.

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `TARGET_NUMBER` | **Obligatoire.** Numéro du contact (international, chiffres seuls) |
| `MY_NAMES` | Noms qui comptent comme tag s'ils sont écrits dans le texte (`Adriano,Adri`) |
| `PAIRING_PHONE_NUMBER` | Ton numéro → génère un **code de jumelage** dans les logs (sinon QR code) |
| `GROUP_NAMES` / `GROUP_IDS` | Groupes écoutés, vide = tous |
| `REPLY_COOLDOWN_SECONDS` | Délai min entre deux réponses (30) |
| `REPLY_DELAY_MIN_MS` / `MAX_MS` | Délai avant d'envoyer (« écrit… » affiché) |
| `QUOTE_MESSAGE` | Répondre en citant le message (`true`) |
| `REPLIES_FILE` | JSON perso : `["phrase 1", "phrase 2"]` (défaut : `src/replies.json`) |
| `TARGET_LID`, `TARGET_PUSHNAME` | Secours si WhatsApp identifie le contact par LID (voir Dépannage) |
| `LOG_SENDERS` | `true` pour voir l'identifiant de chaque expéditeur |
| `AUTH_DIR` | Dossier de session. **Sur Railway : `/data/auth`** |

Voir `.env.example`.

## Déploiement sur Railway

1. Pousse le repo sur GitHub, puis sur Railway : **New Project → Deploy from GitHub repo**.
2. Dans le service → **Settings → Root Directory** : `whatsapp-bot`.
3. **Settings → Volumes → Add Volume**, monté sur `/data` (indispensable : sans lui, la session WhatsApp est perdue à chaque redéploiement et il faut se reconnecter).
4. **Variables** : `AUTH_DIR=/data/auth`, `TARGET_NUMBER`, `MY_NAMES`, `PAIRING_PHONE_NUMBER`, etc.
5. Déploie, ouvre les **Logs** : tu verras `🔗 CODE DE JUMELAGE : XXXX-XXXX`.
6. Sur ton téléphone : WhatsApp → **Appareils connectés → Connecter un appareil → Associer avec le numéro de téléphone** → saisis le code.
7. Les logs affichent `✅ Connecté`. C'est fini. Le service n'a pas besoin de port HTTP (worker).

Ne garde qu'**une seule instance** du service (pas de réplicas), sinon WhatsApp déconnecte l'une des deux.

## Lancer en local

```bash
cd whatsapp-bot
npm install
cp .env.example .env   # puis exporte les variables, ex: export $(grep -v '^#' .env | xargs)
npm start              # QR code dans le terminal si PAIRING_PHONE_NUMBER est vide
npm test
```

## Dépannage

- **Le bot ne réagit pas** : mets `LOG_SENDERS=true`. Si l'expéditeur apparaît sous la forme `123456@lid` (et non `33…@s.whatsapp.net`), copie cet identifiant dans `TARGET_LID`, ou mets le nom affiché dans `TARGET_PUSHNAME`.
- **Le tag n'est pas détecté** : ajoute ton nom tel que le contact l'écrit dans `MY_NAMES`.
- **Session déconnectée (`loggedOut`)** : supprime le contenu du volume `/data/auth` et redéploie pour te reconnecter.

## Personnaliser les réponses

Édite `src/replies.json` (tableau de phrases). Une phrase est tirée au hasard, jamais la même deux fois de suite.
