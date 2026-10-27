// TaskVille Live Gemini AI Service
// Connects the Autonomous Swarm to Google Gemini Generative AI for real-time task decomposition and directives

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export class GeminiService {
  constructor() {
    this.apiKey = API_KEY;
    this.hasKey = Boolean(API_KEY && !API_KEY.includes('your_'));
  }

  // Decompose a custom mission into specialized agent subtasks and deliverable
  async decomposeMission(customPrompt) {
    if (!this.hasKey) {
      return null;
    }

    try {
      const systemInstruction = `You are Nova Valerius, Lead AI Orchestrator at TaskVille.
Given a user's business mission, break it down into specialized subtasks for our 6 virtual office agents:
1. Nova (Orchestrator - planning & decomposition)
2. Atlas (Research - market research, data extraction, competitor audit)
3. Lyra (Creative Copywriter - emails, viral social hooks, narrative)
4. Pixel (Visual Media - art direction, UI wireframes, visual branding)
5. Vance (Growth Hacker - distribution timing, community blitz, channels)
6. Cipher (Systems & Integrations - webhooks, SaaS workflows, Zapier/HubSpot payloads)

Return pure JSON matching this exact structure:
{
  "title": "A punchy mission title",
  "steps": [
    { "agentId": "nova", "action": "Subtask description", "speech": "What agent says out loud in office" },
    { "agentId": "atlas", "action": "Subtask description", "speech": "What agent says out loud in office" },
    { "agentId": "lyra", "action": "Subtask description", "speech": "What agent says out loud in office" },
    { "agentId": "pixel", "action": "Subtask description", "speech": "What agent says out loud in office" },
    { "agentId": "vance", "action": "Subtask description", "speech": "What agent says out loud in office" },
    { "agentId": "cipher", "action": "Subtask description", "speech": "What agent says out loud in office" }
  ],
  "peerReview": [
    { "from": "vance", "to": "lyra", "text": "Quick constructive feedback to improve output" },
    { "from": "lyra", "to": "vance", "text": "Acknowledging and optimized output" },
    { "from": "pixel", "to": "vance", "text": "Visual asset confirmation" },
    { "from": "nova", "to": "all", "text": "Executive wrap-up statement" }
  ],
  "deliverables": {
    "summary": "Executive summary of generated assets and outcomes.",
    "tabs": [
      { "id": "executive", "title": "📋 Executive Summary", "content": "Markdown text with bullets and KPIs" },
      { "id": "research", "title": "🔍 Market & Intel Brief", "content": "Markdown research breakdown" },
      { "id": "copy", "title": "✍️ Copy & Sequences", "content": "Markdown email sequences and social posts" },
      { "id": "visuals", "title": "🎨 Art & Visual Direction", "content": "Markdown visual specifications and prompts" },
      { "id": "distribution", "title": "🚀 Distribution Plan", "content": "Markdown multi-channel roadmap" },
      { "id": "tech", "title": "🔌 Tech & Webhook Spec", "content": "Markdown integration JSON payloads and webhooks" }
    ]
  }
}`;

      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nUser Mission: "${customPrompt}"` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        console.warn('Gemini API call returned status:', response.status);
        return null;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return null;

      const parsed = JSON.parse(rawText);
      return parsed;
    } catch (err) {
      console.warn('Live Gemini mission decomposition fallback to template:', err);
      return null;
    }
  }

  // Handle direct directive to a specific agent
  // Handle direct directive to a specific agent and produce complete deliverables
  async directDirective(agent, userMessage) {
    if (!this.hasKey) {
      return null;
    }

    try {
      const prompt = `You are ${agent.name}, ${agent.title} (${agent.role}) at TaskVille virtual AI office.
Your personality and behavioral persona:
"${agent.systemPrompt}"
Tools you have access to: ${agent.tools.join(', ')}.

The human operator has given you this direct instruction:
"${userMessage}"

Fulfill this instruction completely and produce the real, tangible deliverable (e.g. if asked to write a poem, write the full poem; if asked for an email sequence, write the full email copy; if asked for research, write the full structured briefing; if asked for code, write the full code).

Return pure JSON matching this exact structure:
{
  "speech": "One short confirmation sentence spoken out loud in the office (max 12 words, e.g. 'I wrote your poem! It is stored in the Deliverables Vault.')",
  "title": "A short, crisp title for this deliverable (e.g. 'Poem: Whispers of the Silicon Dawn')",
  "content": "The COMPLETE, FULL markdown text of the work (actual full poem with stanzas, full email sequence, full technical analysis, or full code). Do NOT summarize or say you will do it—provide the complete finished deliverable here in clean markdown."
}`;

      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) return null;
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return null;

      try {
        const parsed = JSON.parse(rawText);
        return parsed;
      } catch (parseErr) {
        return {
          speech: 'Task executed and stored in Deliverables Vault.',
          title: `Directive Result`,
          content: rawText
        };
      }
    } catch (err) {
      console.warn('Gemini direct directive error:', err);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
