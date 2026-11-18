import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_CRITERIA =
  'sujet léger, drôle ou inattendu, adapté à une conversation entre amis, sans politique ni sujet sensible';

const SYSTEM_PROMPT = `Tu génères des sujets de conversation pour un groupe WhatsApp d'amis.

Règles :
- Réponds avec UN seul sujet, formulé comme un vrai message WhatsApp en français : 1 à 2 phrases, ton naturel et décontracté, éventuellement un emoji.
- Le sujet peut être une question, un débat, un "tu préfères", une anecdote à raconter, un défi... mais il doit donner envie de répondre.
- Respecte strictement les critères fournis par l'utilisateur.
- N'écris ni introduction, ni explication, ni guillemets : uniquement le message à envoyer.
- Ne répète pas et n'imite pas les sujets déjà utilisés.`;

/** Construit le message utilisateur (fonction pure, testable). */
export function buildUserPrompt({ criteria, recentTopics = [], context = '' }) {
  const parts = [`Critères du sujet : ${criteria || DEFAULT_CRITERIA}`];
  if (context) {
    parts.push(
      `Message qui vient d'être écrit dans le groupe (à titre de contexte, ne pas le citer) :\n<message>\n${context}\n</message>`,
    );
  }
  if (recentTopics.length > 0) {
    parts.push(`Sujets déjà utilisés (à éviter) :\n${recentTopics.map((t) => `- ${t}`).join('\n')}`);
  }
  parts.push('Génère le sujet.');
  return parts.join('\n\n');
}

/**
 * Crée un générateur de sujets. Retourne null si ANTHROPIC_API_KEY est absente,
 * afin que le bot retombe sur les réponses aléatoires locales.
 */
export function createTopicGenerator({
  apiKey = process.env.ANTHROPIC_API_KEY,
  model = process.env.CLAUDE_MODEL || 'claude-opus-5-5',
  criteria = process.env.TOPIC_CRITERIA || DEFAULT_CRITERIA,
  timeoutMs = Number(process.env.CLAUDE_TIMEOUT_MS ?? 20000),
  historySize = Number(process.env.TOPIC_HISTORY_SIZE ?? 15),
} = {}) {
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey, timeout: timeoutMs, maxRetries: 1 });
  const recentTopics = [];

  return {
    model,
    criteria,
    /** Retourne le texte du sujet, ou null en cas d'échec/refus. */
    async generate({ context = '' } = {}) {
      try {
        const response = await client.messages.create({
          model,
          // la réflexion consomme aussi des tokens max_tokens : on laisse de la marge
          max_tokens: 2000,
          thinking: { type: 'adaptive' },
          output_config: { effort: 'low' },
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildUserPrompt({ criteria, recentTopics, context }) }],
        });

        if (response.stop_reason === 'refusal') return null;

        const text = response.content
          .filter((b) => b.type === 'text')
          .map((b) => b.text)
          .join('')
          .trim();
        if (!text) return null;

        recentTopics.push(text);
        while (recentTopics.length > historySize) recentTopics.shift();
        return text;
      } catch (err) {
        console.error('❌ Claude API :', err?.status || '', err?.message || err);
        return null;
      }
    },
  };
}
