// TaskVille Autopilot & Autonomous Scheduling Engine

export const INITIAL_AUTOPILOT_JOBS = [
  {
    id: 'job-morning-brief',
    title: 'Morning 8:00 AM Executive Intelligence Briefing',
    frequency: 'Daily @ 08:00 AM',
    cron: '0 8 * * *',
    agents: ['nova', 'atlas'],
    status: 'active',
    lastRun: 'Today at 08:00 AM',
    nextRun: 'Tomorrow at 08:00 AM',
    executionsCount: 38,
    actionSummary: 'Scrape top 10 industry news sources, competitor updates, and compile bulleted executive audio & text digest to Slack #leadership.',
    tags: ['Intelligence', 'Slack', 'Research']
  },
  {
    id: 'job-social-growth',
    title: 'Daily 1:00 PM Multi-Channel Social Content Drop',
    frequency: 'Daily @ 01:00 PM',
    cron: '0 13 * * *',
    agents: ['lyra', 'vance', 'pixel'],
    status: 'active',
    lastRun: 'Today at 01:00 PM',
    nextRun: 'Tomorrow at 01:00 PM',
    executionsCount: 42,
    actionSummary: 'Generate 1 high-converting LinkedIn carousel, 3 Twitter/X hooks with visual cards, and publish to buffer/social queues.',
    tags: ['Marketing', 'X/Twitter', 'LinkedIn']
  },
  {
    id: 'job-competitor-watchdog',
    title: 'Weekly Friday 5:00 PM Competitor & Pricing Audit',
    frequency: 'Weekly on Friday @ 05:00 PM',
    cron: '0 17 * * 5',
    agents: ['atlas', 'cipher'],
    status: 'active',
    lastRun: 'Last Friday at 05:00 PM',
    nextRun: 'Friday at 05:00 PM',
    executionsCount: 12,
    actionSummary: 'Deep crawl 5 key competitor landing pages for copy changes, new feature releases, and pricing tier changes. Output Notion report.',
    tags: ['Audit', 'Notion', 'Pricing']
  },
  {
    id: 'job-inbound-leads',
    title: 'Hourly Inbound Lead Qualification & Enrichment',
    frequency: 'Hourly',
    cron: '0 * * * *',
    agents: ['cipher', 'atlas', 'lyra'],
    status: 'active',
    lastRun: '14 minutes ago',
    nextRun: 'In 46 minutes',
    executionsCount: 284,
    actionSummary: 'Check HubSpot CRM for new signups. Enrich company size and tech stack via Atlas. If score > 80, draft personalized founder email.',
    tags: ['CRM', 'HubSpot', 'Sales']
  }
];

export const INITIAL_AUTOPILOT_LOGS = [
  {
    id: 'log-101',
    jobId: 'job-morning-brief',
    time: 'Today, 08:00:14 AM',
    status: 'SUCCESS',
    duration: '4.2s',
    summary: 'Executive Briefing generated: 4 competitor shifts detected, 1 AI model benchmark published. Dispatched to Slack #leadership.'
  },
  {
    id: 'log-102',
    jobId: 'job-inbound-leads',
    time: 'Today, 09:00:02 AM',
    status: 'SUCCESS',
    duration: '2.8s',
    summary: 'Enriched 6 inbound leads. 2 flagged as High Value Enterprise. Cold personalized outreach drafted for Lyra review.'
  },
  {
    id: 'log-103',
    jobId: 'job-social-growth',
    time: 'Today, 01:00:18 PM',
    status: 'SUCCESS',
    duration: '6.1s',
    summary: 'Published "How Multi-Agent AI Replaces Busywork" thread to X/Twitter (reach score 94) and LinkedIn PDF carousel.'
  }
];
