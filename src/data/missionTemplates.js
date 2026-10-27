// TaskVille Pre-Engineered Multi-Agent Mission Templates

export const MISSION_TEMPLATES = [
  {
    id: 'campaign-launch',
    title: '🚀 Launch AI SaaS Growth Campaign & Social Blitz',
    badge: 'Marketing & Growth',
    prompt: 'Launch a full multi-channel product marketing blitz for our new AI workflow automation suite, including competitor research, email newsletters, viral social hooks, visual direction, and automated webhook dispatch.',
    steps: [
      {
        agentId: 'nova',
        action: 'Decomposing mission into 5 specialized subtasks, defining ICP, and aligning deliverables.',
        speech: 'Decomposing Q4 launch roadmap. Disagree-and-commit milestones set.'
      },
      {
        agentId: 'atlas',
        action: 'Conducting competitor intelligence analysis against Zapier Central, Make, and Taskade.',
        speech: 'Synthesized 14 competitor weak-points: onboarding friction and lack of autonomous agents.'
      },
      {
        agentId: 'lyra',
        action: 'Drafting 3 high-converting email sequences and 5 viral LinkedIn/X narrative hooks.',
        speech: 'Drafted 3 email sequences with 44% predicted open rate & 5 viral hooks!'
      },
      {
        agentId: 'pixel',
        action: 'Generating visual art direction, UI teaser wireframes, and diffusion prompt moodboard.',
        speech: 'Visual identity locked: Cyber-minimalist dark mode with electric teal glow.'
      },
      {
        agentId: 'vance',
        action: 'Assembling 7-day multi-channel distribution calendar and viral engagement timing.',
        speech: 'Distribution blueprint ready: Tier-1 posting windows mapped across X, LinkedIn, and Reddit.'
      },
      {
        agentId: 'cipher',
        action: 'Constructing webhook payload, Zapier relay scripts, and CRM lead tagging rules.',
        speech: 'Webhook endpoints verified. Automated Hubspot pipeline triggers armed.'
      }
    ],
    peerReview: [
      { from: 'vance', to: 'lyra', text: 'Lyra, hook #2 is strong, but let’s punch up the opening line for LinkedIn algorithm retention.' },
      { from: 'lyra', to: 'vance', text: 'Done! Shifted to: "Most teams waste 22 hours/week on manual ops. Here is how our agents fixed it."' },
      { from: 'pixel', to: 'vance', text: 'I attached the high-contrast 1200x675 card mockup to match hook #2.' },
      { from: 'nova', to: 'all', text: 'Flawless synergy team. Packaging executive deliverable now.' }
    ],
    deliverables: {
      summary: 'Comprehensive Multi-Channel Launch Blueprint deployed across 6 autonomous workflows.',
      tabs: [
        {
          id: 'executive',
          title: '📋 Executive Summary',
          content: `### Executive Campaign Brief: Q4 Autonomous AI Suite Launch
- **Objective:** Acquire 2,500 qualified solopreneur & SMB trials in 30 days.
- **Core Value Proposition:** "Hire your first autonomous AI team that operates 24/7 without manual prompting."
- **Target Audience:** Solopreneurs, Growth Agencies, Freelancers, SaaS Founders.
- **Projected CAC:** $14.20 | **Target LTV:** $280 | **Est. Viral Reach:** 450,000+ impressions.`
        },
        {
          id: 'research',
          title: '🔍 Competitor Intelligence (Atlas)',
          content: `### Market Landscape & Vulnerabilities
1. **Zapier Central / Make:** Powerful backends, but zero gamification, high setup friction, and no intuitive visual workplace.
2. **Taskade / Notion AI:** Good collaborative docs, but agents lack persistent role identity and true autonomous multi-agent delegation.
3. **TaskVille Positioning:** Position as the "SimCity meets Autonomous Workforce" where you don't prompt — you hire and supervise.`
        },
        {
          id: 'copywriting',
          title: '✍️ High-Converting Copy (Lyra)',
          content: `#### Email #1: The Wake-Up Call (Subject: "Why are you still doing your own data entry?")
> Hey {{first_name}},
> 
> How many hours did you spend this week replying to routine emails, updating your CRM, and scheduling social posts?
> 
> If you answered more than zero, you're paying yourself $15/hr for CEO-level time.
> 
> Today, we're introducing your new digital staff: an executive orchestrator, market researcher, copywriter, and growth specialist living right inside your virtual office.
> 
> [Claim Your Free AI Office Desk →]

#### 5 Viral Social Media Hooks (X & LinkedIn)
1. "The era of prompting chatbots is dead. The era of managing autonomous AI teams has arrived."
2. "How 1 solopreneur did the work of a 6-person agency using autonomous agent swarms (Full playbook inside):"
3. "Stop writing code to automate your business. Here is how an AI office runs on autopilot:"
4. "We ran 40 competitor audits in 12 minutes without touching a spreadsheet. Here's our workflow:"
5. "If your AI can't collaborate with other AI agents, you don't have an employee. You have a typewriter."`
        },
        {
          id: 'design',
          title: '🎨 Visual Art Direction (Pixel)',
          content: `### Design Tokens & Visual Specs
- **Primary Aesthetic:** Cyber-Minimalist Glassmorphism (Deep Obsidian #0a0b10, Cyan Beam #00f2fe, Electric Purple #7928ca).
- **Typography:** Outfit (Display / Headers), Inter (Body), JetBrains Mono (Stats / Terminal).
- **Hero Visual Concept:** Isometric floating glass office pod with glowing hologram workers and live metric HUDs.
- **Aspect Ratios Prepared:** 16:9 for X/Twitter cards (1200x675), 1:1 for Instagram/LinkedIn carousels (1080x1080).`
        },
        {
          id: 'automation',
          title: '⚡ Automation & API (Cipher)',
          content: `\`\`\`json
{
  "event": "campaign_triggered",
  "campaign_id": "q4_ai_launch",
  "channels": ["gmail_outreach", "twitter_api_v2", "linkedin_shares", "hubspot_deals"],
  "orchestration": {
    "lead_agent": "Nova",
    "subagents": ["Atlas", "Lyra", "Pixel", "Vance"],
    "webhook_url": "https://api.taskville.internal/v1/dispatch",
    "status": "ARMED",
    "auth": "Bearer tkv_live_9a8f27..."
  }
}
\`\`\``
        }
      ]
    }
  },
  {
    id: 'competitor-audit',
    title: '🔍 Deep Competitor Intelligence & Pricing Teardown',
    badge: 'Research & Strategy',
    prompt: 'Conduct a comprehensive competitive teardown on top 3 industry alternatives, extract pricing models, analyze feature gaps, and produce an executive sales battlecard.',
    steps: [
      { agentId: 'nova', action: 'Scoping audit criteria and key market battleground metrics.', speech: 'Scoping 4 evaluation dimensions: pricing, features, UX, and AI autonomy.' },
      { agentId: 'atlas', action: 'Deep crawling competitor pricing tiers, reviews (G2/Capterra), and changelogs.', speech: 'Crawled 320 reviews. Major complaint found: confusing token credit pricing.' },
      { agentId: 'lyra', action: 'Writing objection handling scripts and executive battlecard talking points.', speech: 'Crafted 4 killer objection-handling responses for sales reps.' },
      { agentId: 'pixel', action: 'Building visual feature-matrix comparison table.', speech: 'Rendered side-by-side feature comparison matrix with green check badges.' },
      { agentId: 'cipher', action: 'Syncing battlecard to Notion sales wiki and updating CRM deal stages.', speech: 'Notion database updated with live competitor matrix.' }
    ],
    peerReview: [
      { from: 'atlas', to: 'lyra', text: 'Competitor B just increased their base seat price by 30%. Add that to the value comparison!' },
      { from: 'lyra', to: 'atlas', text: 'Added! Highlighted our flat-rate pricing advantage in the battlecard.' },
      { from: 'nova', to: 'all', text: 'Insight synthesized. Ready for sales team consumption.' }
    ],
    deliverables: {
      summary: 'Executive Battlecard & Competitive Pricing Teardown ready for immediate sales execution.',
      tabs: [
        {
          id: 'executive',
          title: '📋 Executive Summary',
          content: `### Competitive Intelligence Brief
- **Key Vulnerability:** Incumbents are charging per-seat and per-prompt, frustrating teams who want continuous background agents.
- **Our Wedge:** "All-inclusive virtual office with unlimited agent collaboration."
- **Win Rate Opportunity:** +28% projected increase against legacy chatbot wrappers.`
        },
        {
          id: 'research',
          title: '🔍 Market Teardown (Atlas)',
          content: `| Feature | Legacy Chatbot | Zapier Pipeline | TaskVille AI Office |
| :--- | :--- | :--- | :--- |
| **Agent Collaboration** | ❌ None | ⚠️ Fragile links | ✅ Full Autonomous Team |
| **Interface** | 💬 Plain chatbox | 🧩 Complex node graph | 🏢 Gamified Virtual Office |
| **Autopilot Schedules**| ❌ Manual prompt | ⚠️ Webhook triggers | ✅ Native Cron Autopilot |
| **Setup Time** | Instant (Basic) | 4-12 hours | 30 seconds |`
        }
      ]
    }
  },
  {
    id: 'inbound-qualification',
    title: '🎯 Automated Lead Triage & Personalized Outreach',
    badge: 'Sales & CRM',
    prompt: 'Inspect new inbound leads from HubSpot, enrich firmographic data, calculate qualification scores, and auto-draft hyper-personalized outreach emails.',
    steps: [
      { agentId: 'nova', action: 'Setting scoring thresholds and routing criteria.', speech: 'Lead qualification threshold set to 80/100.' },
      { agentId: 'cipher', action: 'Pulling 12 unassigned inbound leads from HubSpot CRM API.', speech: 'Ingested 12 recent leads. Extracting corporate domains.' },
      { agentId: 'atlas', action: 'Enriching tech stack, company funding, and employee headcount via web search.', speech: 'Enriched 12 companies: 4 Series-A SaaS, 5 Growth Agencies, 3 SMBs.' },
      { agentId: 'lyra', action: 'Generating tailored email openers referencing their recent company milestones.', speech: 'Drafted 4 custom CEO outreach emails tailored to their latest tech stack.' },
      { agentId: 'vance', action: 'Generating accompanying LinkedIn connection notes with mutual interests.', speech: 'Generated 4 LinkedIn warm touch messages ready for founder send.' }
    ],
    peerReview: [
      { from: 'cipher', to: 'atlas', text: 'Lead #4 had an updated domain redirect to an AI agency. Verify their current headcount.' },
      { from: 'atlas', to: 'cipher', text: 'Confirmed: 38 employees, grew 40% YoY. Priority elevated to Tier-1.' },
      { from: 'nova', to: 'all', text: 'Outreach queued with personalized hooks. Awaiting founder approval.' }
    ],
    deliverables: {
      summary: '12 Inbound Leads Triaged, Enriched, and 4 Hyper-Personalized Sequences Drafted.',
      tabs: [
        {
          id: 'executive',
          title: '📋 Lead Triage Summary',
          content: `### Inbound Lead Qualification Batch #418
- **Total Leads Evaluated:** 12
- **Qualified (Score ≥ 80):** 4 (High ICP Match)
- **Nurture Queue (Score 50-79):** 6
- **Disqualified / Spam:** 2
- **Estimated Pipeline Value:** $38,400 ARR`
        },
        {
          id: 'copywriting',
          title: '✉️ Sample Drafted Founder Email',
          content: `**To:** sarah.connors@hyperflow.io
**Subject:** Congrats on the Series A, Sarah + quick idea on agent ops

> Hi Sarah,
> 
> Saw the TechCrunch mention on HyperFlow's $4M Series A announcement yesterday — massive congrats to you and the team!
> 
> Having scaled high-growth remote teams, I know the next bottleneck is usually operational drag (coordinating lead research, daily briefings, and customer outreach).
> 
> We built TaskVille so founders like you can spin up a dedicated virtual office of autonomous AI agents (researchers, copywriters, and ops bots) that handle those workflows 24/7 without code.
> 
> Open to a 5-minute virtual office tour on Thursday?
> 
> Best,
> Chris`
        }
      ]
    }
  }
];
