// TaskVille Main Application Controller
// Orchestrates 2.5D Isometric Virtual AI Office, Autopilot, Integrations, and Autonomous Swarms

import { INITIAL_AGENTS, OFFICE_LOCATIONS } from './data/agents.js';
import { INITIAL_AUTOPILOT_JOBS, INITIAL_AUTOPILOT_LOGS } from './data/autopilot.js';
import { INTEGRATIONS_DATA } from './data/integrations.js';
import { MISSION_TEMPLATES } from './data/missionTemplates.js';
import { soundEngine } from './audio/soundEngine.js';
import { AgentManager } from './game/agentManager.js';
import { OfficeCanvas } from './game/officeCanvas.js';
import { Orchestrator } from './game/orchestrator.js';
import { geminiService } from './services/geminiService.js';

// --- Global Application State ---
const state = {
  agents: [...INITIAL_AGENTS],
  autopilotJobs: [...INITIAL_AUTOPILOT_JOBS],
  autopilotLogs: [...INITIAL_AUTOPILOT_LOGS],
  integrations: [...INTEGRATIONS_DATA],
  activeDeliverable: MISSION_TEMPLATES[0].deliverables,
  selectedDeliverableTab: 0,
  selectedAgentForDossier: null,
  activeSidebarTab: 'feed',
  activeCategoryFilter: 'all',
  soundEnabled: true
};

// --- DOM Element References ---
const dom = {
  // Navigation & Stats
  statActiveAgents: document.getElementById('statActiveAgents'),
  btnNewMission: document.getElementById('btnNewMission'),
  btnOpenHire: document.getElementById('btnOpenHire'),
  btnOpenAutopilot: document.getElementById('btnOpenAutopilot'),
  btnOpenIntegrations: document.getElementById('btnOpenIntegrations'),
  btnOpenDeliverables: document.getElementById('btnOpenDeliverables'),
  btnToggleSound: document.getElementById('btnToggleSound'),
  soundIcon: document.getElementById('soundIcon'),
  brandHomeBtn: document.getElementById('brandHomeBtn'),

  // Office HUD & Canvas
  officeCanvas: document.getElementById('officeCanvas'),
  btnCoffeeBreak: document.getElementById('btnCoffeeBreak'),
  btnGatherWarRoom: document.getElementById('btnGatherWarRoom'),
  themeSelector: document.getElementById('themeSelector'),

  // Mission Input & Progress Bar
  quickTemplatesContainer: document.getElementById('quickTemplatesContainer'),
  missionInput: document.getElementById('missionInput'),
  btnDispatchMission: document.getElementById('btnDispatchMission'),
  missionProgressBanner: document.getElementById('missionProgressBanner'),
  progressTitle: document.getElementById('progressTitle'),
  progressStep: document.getElementById('progressStep'),
  progressPercent: document.getElementById('progressPercent'),

  // Sidebar Feed & Roster
  tabFeedBtn: document.getElementById('tabFeedBtn'),
  tabRosterBtn: document.getElementById('tabRosterBtn'),
  tabFeedContent: document.getElementById('tabFeedContent'),
  tabRosterContent: document.getElementById('tabRosterContent'),

  // Modals
  dossierModal: document.getElementById('dossierModal'),
  dossierModalBody: document.getElementById('dossierModalBody'),
  btnSendDirectChat: document.getElementById('btnSendDirectChat'),
  
  hiringModal: document.getElementById('hiringModal'),
  hiringForm: document.getElementById('hiringForm'),
  hireName: document.getElementById('hireName'),
  hireTitle: document.getElementById('hireTitle'),
  hireDept: document.getElementById('hireDept'),
  hireTrait: document.getElementById('hireTrait'),
  avatarPickerGrid: document.getElementById('avatarPickerGrid'),
  hirePrompt: document.getElementById('hirePrompt'),
  btnSubmitHire: document.getElementById('btnSubmitHire'),

  autopilotModal: document.getElementById('autopilotModal'),
  autopilotJobsList: document.getElementById('autopilotJobsList'),
  autopilotLogsList: document.getElementById('autopilotLogsList'),
  btnRunAllAutopilot: document.getElementById('btnRunAllAutopilot'),

  integrationsModal: document.getElementById('integrationsModal'),
  integrationsFilterBar: document.getElementById('integrationsFilterBar'),
  integrationsGrid: document.getElementById('integrationsGrid'),
  btnTestAllWebhooks: document.getElementById('btnTestAllWebhooks'),

  deliverablesModal: document.getElementById('deliverablesModal'),
  deliverableTitle: document.getElementById('deliverableTitle'),
  deliverableMeta: document.getElementById('deliverableMeta'),
  deliverablesTabs: document.getElementById('deliverablesTabs'),
  deliverableContentBox: document.getElementById('deliverableContentBox'),
  btnCopyDeliverable: document.getElementById('btnCopyDeliverable'),
  btnDownloadDeliverable: document.getElementById('btnDownloadDeliverable')
};

// --- Toast Notification Helper ---
function showToast(message, icon = '⚡') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const pill = document.createElement('div');
  pill.className = 'toast-pill';
  pill.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(pill);

  setTimeout(() => {
    if (pill.parentElement) {
      pill.remove();
    }
  }, 3500);
}

// --- Initialize Agent Manager & Canvas ---
const agentManager = new AgentManager(
  state.agents,
  (updatedAgent) => {
    // When an agent's status/level/position updates
    updateHeaderStats();
    if (state.activeSidebarTab === 'roster') {
      renderRosterTab();
    }
    if (state.selectedAgentForDossier && state.selectedAgentForDossier.id === updatedAgent.id) {
      renderDossierContent(updatedAgent);
    }
  },
  (activityEntry) => {
    // When an agent or the office logs an activity
    addFeedItem({
      author: activityEntry.agentName,
      title: activityEntry.type,
      message: activityEntry.text,
      time: activityEntry.timestamp
    });
  }
);

// Instantiate Isometric Canvas Engine
const officeCanvas = new OfficeCanvas(
  dom.officeCanvas,
  state.agents,
  (clickedAgent) => {
    // On clicking an agent in the canvas: open Dossier
    openAgentDossier(clickedAgent);
  },
  (clickedLocation) => {
    showToast(`Navigated to ${clickedLocation.name}`, '📍');
  }
);

// Instantiate Multi-Agent Orchestrator
const orchestrator = new Orchestrator(
  agentManager,
  officeCanvas,
  (stepData) => {
    // Mission step progress update
    const percent = Math.round(((stepData.stepIndex + 1) / stepData.totalSteps) * 100);
    dom.progressTitle.textContent = `Executing: ${stepData.currentAgent.name} (${stepData.currentAgent.title})`;
    dom.progressStep.textContent = stepData.action;
    dom.progressPercent.textContent = `${percent}%`;
  },
  (completedTemplate) => {
    // Mission completed callback
    dom.progressTitle.textContent = 'Mission Complete! Executive Package Ready';
    dom.progressStep.textContent = 'All deliverables reviewed and verified by swarm.';
    dom.progressPercent.textContent = '100%';

    showToast('🎉 Swarm Mission Complete! Executive pack generated.', '🚀');
    state.activeDeliverable = completedTemplate.deliverables;
    state.selectedDeliverableTab = 0;

    // Refresh Roster to show updated XP & Levels
    renderRosterTab();

    setTimeout(() => {
      dom.missionProgressBanner.classList.remove('active');
      openModal('deliverablesModal');
      renderDeliverablesModal();
    }, 2000);
  },
  (feedMsg) => {
    // Mission feed log message
    addFeedItem(feedMsg);
  }
);

// --- Header Stats Updater ---
function updateHeaderStats() {
  const count = agentManager.getAgents().length;
  dom.statActiveAgents.textContent = `${count} AI Workers Online`;
}

// --- Universal Modal Helpers ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    soundEngine.playHoverTick();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modals when clicking backdrop or close buttons
document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modalId = btn.getAttribute('data-close-modal');
    closeModal(modalId);
  });
});

document.querySelectorAll('.modal-backdrop').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

// --- Feed & Banter System ---
function addFeedItem({ author, title, message, time }) {
  const card = document.createElement('div');
  card.className = 'feed-card';

  const formattedTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isSystem = author === 'SYSTEM' || author.includes('HQ') || author.includes('War Room');

  card.innerHTML = `
    <div class="feed-header">
      <div class="feed-author" style="color: ${isSystem ? 'var(--accent-amber)' : 'var(--accent-cyan)'}">
        <span>${isSystem ? '⚙️' : '🤖'}</span>
        <span>${author}</span>
      </div>
      <div class="feed-time">${formattedTime}</div>
    </div>
    <div class="feed-title">${title}</div>
    <div class="feed-body">${message}</div>
  `;

  dom.tabFeedContent.prepend(card);

  // Keep max 50 items
  if (dom.tabFeedContent.children.length > 50) {
    dom.tabFeedContent.removeChild(dom.tabFeedContent.lastChild);
  }
}

// Initial populate of realistic office activity banter
function populateInitialFeed() {
  const initialMessages = [
    {
      author: 'Nova Valerius',
      title: 'Swarm Orchestration Ready',
      message: 'All 6 specialized agents synchronized across memory nodes and API relays. Ready for executive dispatch.',
      time: 'Just now'
    },
    {
      author: 'Cipher (Systems)',
      title: '250+ Integrations Health Check',
      message: 'Connected webhooks: Gmail, Slack, HubSpot CRM, X/Twitter, Stripe, Notion. Zero connection timeouts detected.',
      time: '1m ago'
    },
    {
      author: 'Atlas Vance',
      title: 'Autonomous Market Radar',
      message: 'Scraped 40 AI agent platform release notes. Noted growing demand for gamified team environments with zero-prompt autonomy.',
      time: '3m ago'
    },
    {
      author: 'Lyra Mercer',
      title: 'High-Converting Copy Engine',
      message: 'Calibrated tone algorithms to "Bold Solopreneur High-ROI" style. Viral social templates primed.',
      time: '5m ago'
    }
  ];

  initialMessages.forEach(msg => addFeedItem(msg));
}

// --- Swarm Roster Tab System ---
function renderRosterTab() {
  const agents = agentManager.getAgents();
  dom.tabRosterContent.innerHTML = '';

  agents.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'roster-card';

    const xpPercent = Math.min(100, Math.round((agent.xp / agent.maxXp) * 100));
    const statusColor = agent.status === 'working' ? 'var(--accent-green)' :
                        agent.status === 'thinking' ? 'var(--accent-amber)' :
                        agent.status === 'break' ? 'var(--accent-pink)' : 'var(--accent-cyan)';

    card.innerHTML = `
      <img src="${agent.avatar}" class="roster-avatar" alt="${agent.name} Avatar">
      <div class="roster-details">
        <div class="roster-name-row">
          <div class="roster-name">${agent.name}</div>
          <div class="roster-lvl">Lv.${agent.level}</div>
        </div>
        <div class="roster-role">${agent.role}</div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; font-size: 0.7rem; font-family: var(--font-mono);">
          <span style="color: ${statusColor}; text-transform: uppercase;">● ${agent.status}</span>
          <span style="color: var(--text-muted);">${agent.xp}/${agent.maxXp} XP</span>
        </div>
        <div class="xp-bar-bg">
          <div class="xp-bar-fill" style="width: ${xpPercent}%;"></div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openAgentDossier(agent);
    });

    dom.tabRosterContent.appendChild(card);
  });
}

// Sidebar Tab Switching
dom.tabFeedBtn.addEventListener('click', () => {
  state.activeSidebarTab = 'feed';
  dom.tabFeedBtn.classList.add('active');
  dom.tabRosterBtn.classList.remove('active');
  dom.tabFeedContent.style.display = 'flex';
  dom.tabRosterContent.style.display = 'none';
  soundEngine.playHoverTick();
});

dom.tabRosterBtn.addEventListener('click', () => {
  state.activeSidebarTab = 'roster';
  dom.tabRosterBtn.classList.add('active');
  dom.tabFeedBtn.classList.remove('active');
  dom.tabFeedContent.style.display = 'none';
  dom.tabRosterContent.style.display = 'flex';
  renderRosterTab();
  soundEngine.playHoverTick();
});

// --- Modal 1: Agent Dossier ---
function openAgentDossier(agent) {
  state.selectedAgentForDossier = agent;
  renderDossierContent(agent);
  openModal('dossierModal');
}

function renderDossierContent(agent) {
  const xpPercent = Math.min(100, Math.round((agent.xp / agent.maxXp) * 100));

  dom.dossierModalBody.innerHTML = `
    <div class="dossier-hero">
      <img src="${agent.avatar}" class="dossier-avatar-large" alt="${agent.name}">
      <div class="dossier-meta">
        <div class="dossier-name">
          <span>${agent.name}</span>
          <span class="roster-lvl">Level ${agent.level}</span>
        </div>
        <div class="dossier-role">${agent.title}</div>
        <div class="dossier-dept">DEPARTMENT: ${agent.dept.toUpperCase()} &bull; STATION: ${agent.stationName}</div>
        <div style="margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 4px;">
            <span>XP PROGRESSION</span>
            <span>${agent.xp} / ${agent.maxXp} XP</span>
          </div>
          <div class="xp-bar-bg" style="height: 6px;">
            <div class="xp-bar-fill" style="width: ${xpPercent}%;"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="dossier-stats-grid">
      <div class="stat-box">
        <div class="stat-val">${agent.tasksCompleted}</div>
        <div class="stat-lbl">Tasks Done</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" style="color: var(--accent-cyan);">${agent.efficiency}</div>
        <div class="stat-lbl">Efficiency</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" style="color: var(--accent-amber);">${agent.stats.coordination || agent.stats.uptime || 98}%</div>
        <div class="stat-lbl">Synergy Rating</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" style="color: var(--accent-pink);">${agent.stats.tokensUsed}</div>
        <div class="stat-lbl">Token Bandwidth</div>
      </div>
    </div>

    <div class="dossier-section-title">
      <span>⚡ Live Thought Stream & Autonomous Focus</span>
    </div>
    <div class="thought-stream-box">
      <span class="pulse-dot"></span>
      <span id="dossierThoughtStreamText">"${agent.thoughtStream}"</span>
    </div>

    <div class="dossier-section-title">
      <span>🛠️ Integrated Tools & Autonomous Capabilities</span>
    </div>
    <div class="tools-pill-group">
      ${agent.tools.map(tool => `<div class="tool-pill"><span>🔧</span> ${tool}</div>`).join('')}
    </div>

    <div class="dossier-section-title">
      <span>📜 System Directive & Behavioral Persona</span>
    </div>
    <div class="system-prompt-box">
      "${agent.systemPrompt}"
    </div>

    <div class="dossier-section-title">
      <span>💬 Send Direct Autonomous Command</span>
    </div>
    <div class="direct-chat-wrapper">
      <input type="text" id="directDirectiveInput" class="direct-chat-input" placeholder="Instruct ${agent.name.split(' ')[0]} to execute a specialized task directly...">
      <button class="btn btn-primary" id="btnSendDirectDirectiveAction">Direct ⚡</button>
    </div>
  `;

  // Attach direct directive action
  const directInput = document.getElementById('directDirectiveInput');
  const directBtn = document.getElementById('btnSendDirectDirectiveAction');

  const executeDirect = async () => {
    const text = directInput.value.trim();
    if (!text) return;

    agent.status = 'working';
    agent.speechBubble = text;
    agent.thoughtStream = `Executing direct directive: "${text}"`;

    soundEngine.playDelegationWhoosh();
    officeCanvas.spawnSparkleBurst(agent, agent.color);

    addFeedItem({
      author: 'Operator (You)',
      title: `⚡ Direct Instruction to ${agent.name}`,
      message: text
    });

    showToast(`Instruction sent to ${agent.name.split(' ')[0]}!`, '⚡');
    directInput.value = '';
    closeModal('dossierModal');

    // Live AI reasoning via Gemini Service
    const aiResponse = await geminiService.directDirective(agent, text);

    agentManager.awardXp(agent.id, 60);
    const resultMsg = aiResponse || `Executed directive "${text}" with 99.8% precision. Deliverables integrated into office repository.`;
    agent.speechBubble = resultMsg.length > 40 ? resultMsg.substring(0, 37) + '...' : resultMsg;
    agent.thoughtStream = resultMsg;

    addFeedItem({
      author: agent.name,
      title: '✅ Direct Task Executed',
      message: resultMsg
    });
    soundEngine.playTaskComplete();
  };

  directBtn.addEventListener('click', executeDirect);
  directInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeDirect();
  });
}

// Modal 1 Footer Send Direct Chat Button
dom.btnSendDirectChat.addEventListener('click', () => {
  const input = document.getElementById('directDirectiveInput');
  if (input) {
    input.focus();
  }
});

// --- Modal 2: Hiring Hall ---
let selectedAvatarSrc = '/assets/agent_nova.jpg';

dom.avatarPickerGrid.querySelectorAll('.avatar-select-option').forEach(avatarEl => {
  avatarEl.addEventListener('click', () => {
    dom.avatarPickerGrid.querySelectorAll('.avatar-select-option').forEach(a => a.classList.remove('selected'));
    avatarEl.classList.add('selected');
    selectedAvatarSrc = avatarEl.getAttribute('data-src');
    soundEngine.playHoverTick();
  });
});

dom.btnSubmitHire.addEventListener('click', (e) => {
  e.preventDefault();
  const name = dom.hireName.value.trim();
  const title = dom.hireTitle.value.trim();
  const dept = dom.hireDept.value;
  const trait = dom.hireTrait.value;
  const prompt = dom.hirePrompt.value.trim();

  if (!name || !title) {
    showToast('Please specify an agent name and job title.', '⚠️');
    return;
  }

  // Trait color mapping
  const traitColors = {
    speed: '#00f2fe',
    precision: '#00ff87',
    creativity: '#f093fb',
    connector: '#ffd166'
  };

  const hired = agentManager.hireAgent({
    name,
    title,
    role: `${title} (${dept})`,
    dept,
    avatar: selectedAvatarSrc,
    color: traitColors[trait] || '#00f2fe',
    systemPrompt: prompt || `Autonomous ${title} in the ${dept} department.`
  });

  officeCanvas.registerAgentAvatar(hired);
  updateHeaderStats();
  renderRosterTab();
  closeModal('hiringModal');
  showToast(`🤝 ${name} deployed to the virtual office floor!`, '🎉');

  // Reset form
  dom.hireName.value = '';
  dom.hireTitle.value = '';
  dom.hirePrompt.value = '';
});

// --- Modal 3: Autopilot & Schedules Hub ---
function renderAutopilotModal() {
  dom.autopilotJobsList.innerHTML = '';
  state.autopilotJobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'autopilot-job-card';

    // Get agent avatars for assigned agents
    const assignedAgents = job.agents.map(id => agentManager.getAgentById(id)).filter(Boolean);

    card.innerHTML = `
      <div class="job-header-row">
        <div>
          <span class="job-title">${job.title}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="job-timing-chip">${job.frequency}</span>
          <div class="switch-wrapper">
            <label class="cyber-switch" title="Arm / Disarm Autopilot Schedule">
              <input type="checkbox" ${job.status === 'active' ? 'checked' : ''} data-job-id="${job.id}">
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="job-action-desc">${job.actionSummary}</div>
      <div class="job-footer-row">
        <div class="job-assigned-agents">
          <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); margin-right: 4px;">TEAM:</span>
          ${assignedAgents.map(a => `<img src="${a.avatar}" class="mini-agent-bubble" title="${a.name} (${a.title})" alt="${a.name}">`).join('')}
        </div>
        <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted);">
          <span>Next run: <strong style="color: var(--accent-cyan);">${job.nextRun}</strong></span>
          &bull;
          <span>${job.executionsCount} runs</span>
        </div>
      </div>
    `;

    // Toggle switch listener
    const toggle = card.querySelector('input[type="checkbox"]');
    toggle.addEventListener('change', (e) => {
      job.status = e.target.checked ? 'active' : 'paused';
      soundEngine.playHoverTick();
      showToast(`${job.title.split(' ')[0]} ${job.title.split(' ')[1]} Autopilot ${job.status.toUpperCase()}`, job.status === 'active' ? '⚡' : '⏸️');

      addFeedItem({
        author: 'AUTOPILOT SCHEDULER',
        title: `Schedule ${job.status === 'active' ? 'Armed' : 'Paused'}`,
        message: `Task: "${job.title}" status switched to ${job.status.toUpperCase()}.`
      });
    });

    dom.autopilotJobsList.appendChild(card);
  });

  // Render logs
  dom.autopilotLogsList.innerHTML = '';
  state.autopilotLogs.forEach(log => {
    const logEl = document.createElement('div');
    logEl.style.cssText = 'background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.76rem; display: flex; align-items: center; justify-content: space-between;';
    logEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: var(--accent-green);">● SUCCESS</span>
        <span style="color: #ffffff; font-weight: 600;">${log.jobTitle}</span>
        <span style="color: var(--text-muted);">${log.summary}</span>
      </div>
      <div style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.72rem;">${log.time}</div>
    `;
    dom.autopilotLogsList.appendChild(logEl);
  });
}

// Trigger all active autopilot routines simultaneously
dom.btnRunAllAutopilot.addEventListener('click', async () => {
  closeModal('autopilotModal');
  showToast('⚡ Triggering all active autonomous routines...', '⏱️');

  for (const job of state.autopilotJobs) {
    if (job.status === 'active') {
      const assigned = job.agents.map(id => agentManager.getAgentById(id)).filter(Boolean);
      if (assigned.length > 0) {
        assigned.forEach(a => {
          agentManager.setAgentStatus(a.id, 'working', `Executing autopilot: ${job.title.split(' ')[0]}`);
          officeCanvas.spawnSparkleBurst(a, a.color);
        });

        soundEngine.playDelegationWhoosh();
        addFeedItem({
          author: 'AUTOPILOT BOT',
          title: `⚡ Executed: ${job.title}`,
          message: job.actionSummary
        });

        await new Promise(r => setTimeout(r, 1200));

        assigned.forEach(a => {
          agentManager.awardXp(a.id, 50);
          agentManager.setAgentStatus(a.id, 'idle', 'Autopilot task logged.');
        });
      }
    }
  }

  soundEngine.playTaskComplete();
  showToast('🎉 All Autopilot routines executed and synced to integrations!', '✅');
});

// --- Modal 4: 250+ Integrations Hub ---
function renderIntegrationsModal() {
  dom.integrationsGrid.innerHTML = '';
  const filtered = state.activeCategoryFilter === 'all'
    ? state.integrations
    : state.integrations.filter(i => i.category === state.activeCategoryFilter);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'integration-card';

    card.innerHTML = `
      <div>
        <div class="integration-header">
          <div class="integration-icon">${item.icon}</div>
          <div>
            <div class="integration-name">${item.name}</div>
            <div class="integration-cat">${item.category}</div>
          </div>
        </div>
        <div class="integration-desc" style="margin-top: 10px;">${item.description}</div>
      </div>
      <div class="integration-footer">
        <div class="badge-connected">
          <span>●</span>
          <span>${item.status === 'connected' ? 'CONNECTED' : 'STANDBY'}</span>
        </div>
        <div style="color: var(--text-muted);">${item.authType} &bull; ${item.lastSync}</div>
      </div>
    `;

    dom.integrationsGrid.appendChild(card);
  });
}

// Category filter buttons
dom.integrationsFilterBar.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    dom.integrationsFilterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeCategoryFilter = btn.getAttribute('data-category');
    soundEngine.playHoverTick();
    renderIntegrationsModal();
  });
});

// Test Webhook Handshakes
dom.btnTestAllWebhooks.addEventListener('click', () => {
  const cipher = agentManager.getAgentById('cipher');
  if (cipher) {
    officeCanvas.spawnSparkleBurst(cipher, '#38ef7d');
    agentManager.setAgentStatus('cipher', 'working', 'Ping-testing 250+ API webhook endpoints...');
  }

  soundEngine.playDelegationWhoosh();
  showToast('Testing 250+ SaaS Webhook handshakes...', '🔌');

  setTimeout(() => {
    if (cipher) {
      agentManager.setAgentStatus('cipher', 'idle', 'All 250+ endpoints active & responding.');
      agentManager.awardXp('cipher', 50);
    }
    soundEngine.playTaskComplete();
    addFeedItem({
      author: 'Cipher (Systems)',
      title: '🔌 Webhook Diagnostic Complete',
      message: 'Verified 250+ webhook endpoints: Gmail, Slack, HubSpot CRM, Notion, Stripe, Twitter API v2. Latency: 12ms avg. 100% healthy.'
    });
    showToast('✅ All 250+ Webhook endpoints verified with 0 errors!', '⚡');
  }, 1600);
});

// --- Modal 5: Deliverables & Executive Pack Modal ---
function renderDeliverablesModal() {
  const deliverable = state.activeDeliverable;
  if (!deliverable) return;

  dom.deliverablesTabs.innerHTML = '';
  deliverable.tabs.forEach((tab, index) => {
    const tabBtn = document.createElement('button');
    tabBtn.className = `deliv-tab-btn ${index === state.selectedDeliverableTab ? 'active' : ''}`;
    tabBtn.textContent = tab.title;

    tabBtn.addEventListener('click', () => {
      state.selectedDeliverableTab = index;
      renderDeliverablesModal();
      soundEngine.playHoverTick();
    });

    dom.deliverablesTabs.appendChild(tabBtn);
  });

  const activeTab = deliverable.tabs[state.selectedDeliverableTab] || deliverable.tabs[0];
  if (activeTab) {
    dom.deliverableContentBox.innerHTML = formatMarkdownToHtml(activeTab.content);
  }
}

// Simple Markdown to rich HTML renderer for deliverables
function formatMarkdownToHtml(md) {
  let html = md
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Code blocks
    .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code style="background: rgba(0, 242, 254, 0.1); color: var(--accent-cyan); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.8rem;">$1</code>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li style="margin-left: 18px; margin-bottom: 4px;">$1</li>')
    // Line breaks
    .replace(/\n\n/gim, '<br>');

  return html;
}

// Copy Deliverables Content
dom.btnCopyDeliverable.addEventListener('click', () => {
  const activeTab = state.activeDeliverable.tabs[state.selectedDeliverableTab];
  if (activeTab) {
    navigator.clipboard.writeText(activeTab.content).then(() => {
      soundEngine.playHoverTick();
      showToast(`Copied "${activeTab.title}" to clipboard!`, '📋');
    });
  }
});

// Download Deliverables Markdown File
dom.btnDownloadDeliverable.addEventListener('click', () => {
  const deliverable = state.activeDeliverable;
  let fullMarkdown = `# TaskVille Executive Deliverables Pack\n\n`;
  fullMarkdown += `**Summary:** ${deliverable.summary}\n\n---\n\n`;

  deliverable.tabs.forEach(tab => {
    fullMarkdown += `\n\n## ${tab.title}\n\n${tab.content}\n\n---\n`;
  });

  const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TaskVille_Swarm_Deliverables_${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(a);

  soundEngine.playTaskComplete();
  showToast('Downloaded full deliverables markdown file!', '💾');
});

// --- Mission Dispatch & Command Bar ---
async function dispatchMission(customPrompt = null, templateId = null) {
  let template = null;

  if (templateId) {
    template = MISSION_TEMPLATES.find(t => t.id === templateId);
  }

  dom.missionProgressBanner.classList.add('active');
  dom.progressTitle.textContent = `Nova decomposing workflow with Gemini AI...`;
  dom.progressStep.textContent = `Analyzing: "${(customPrompt || 'Swarm Mission').substring(0, 50)}..."`;
  dom.progressPercent.textContent = `10%`;

  if (!template && customPrompt) {
    // Attempt live AI decomposition from Gemini Service
    const aiDecomposed = await geminiService.decomposeMission(customPrompt);
    if (aiDecomposed && aiDecomposed.steps && aiDecomposed.deliverables) {
      template = {
        id: 'ai-mission-' + Date.now(),
        title: aiDecomposed.title || 'Autonomous Swarm Operation',
        prompt: customPrompt,
        steps: aiDecomposed.steps,
        peerReview: aiDecomposed.peerReview || [],
        deliverables: aiDecomposed.deliverables
      };
      showToast('⚡ Live Gemini AI swarm workflow synthesized!', '🤖');
    } else {
      template = MISSION_TEMPLATES.find(t => customPrompt.toLowerCase().includes(t.id)) || MISSION_TEMPLATES[0];
    }
  }

  if (!template) {
    template = MISSION_TEMPLATES[0];
  }

  orchestrator.executeMission(template, customPrompt);
}

dom.btnDispatchMission.addEventListener('click', () => {
  const prompt = dom.missionInput.value.trim();
  if (!prompt) {
    showToast('Please type a mission instruction or choose a preset chip.', '⚡');
    dom.missionInput.focus();
    return;
  }
  dispatchMission(prompt);
  dom.missionInput.value = '';
});

dom.missionInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const prompt = dom.missionInput.value.trim();
    if (prompt) {
      dispatchMission(prompt);
      dom.missionInput.value = '';
    }
  }
});

// Preset Chips
dom.quickTemplatesContainer.querySelectorAll('.quick-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const templateId = chip.getAttribute('data-template-id');
    const template = MISSION_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      dom.missionInput.value = template.prompt;
      soundEngine.playHoverTick();
      showToast(`Loaded preset: ${template.title}`, '🚀');
    }
  });
});

// Header New Mission Button
dom.btnNewMission.addEventListener('click', () => {
  dom.missionInput.focus();
  dom.missionInput.scrollIntoView({ behavior: 'smooth' });
  showToast('Enter your autonomous mission command below!', '⚡');
});

// --- Navigation Buttons ---
dom.btnOpenHire.addEventListener('click', () => {
  openModal('hiringModal');
});

dom.btnOpenAutopilot.addEventListener('click', () => {
  renderAutopilotModal();
  openModal('autopilotModal');
});

dom.btnOpenIntegrations.addEventListener('click', () => {
  renderIntegrationsModal();
  openModal('integrationsModal');
});

dom.btnOpenDeliverables.addEventListener('click', () => {
  renderDeliverablesModal();
  openModal('deliverablesModal');
});

// Sound Toggle
dom.btnToggleSound.addEventListener('click', () => {
  state.soundEnabled = soundEngine.toggleSound();
  dom.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
  showToast(state.soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted', state.soundEnabled ? '🔊' : '🔇');
});

// Office Controls: Break & War Room Sync
dom.btnCoffeeBreak.addEventListener('click', () => {
  agentManager.sendTeamToBreak();
  showToast('☕ Team headed to the lounge for a cold brew recharge!', '☕');
});

dom.btnGatherWarRoom.addEventListener('click', () => {
  agentManager.gatherTeamInWarRoom();
  const nova = agentManager.getAgentById('nova');
  state.agents.forEach(a => {
    if (a.id !== 'nova') {
      officeCanvas.sendDelegationBeam(nova, a, a.color);
    }
  });
  soundEngine.playDelegationWhoosh();
  showToast('🎯 Gathering team in War Room for strategic sync!', '🎯');
});

// Theme Selector
dom.themeSelector.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    dom.themeSelector.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const theme = btn.getAttribute('data-theme');
    officeCanvas.setTheme(theme);
    soundEngine.playHoverTick();
    showToast(`Visual Theme: ${btn.textContent}`, '🎨');
  });
});

// --- Initialization ---
updateHeaderStats();
populateInitialFeed();
renderRosterTab();

// Greet user
setTimeout(() => {
  showToast('Welcome to TaskVille Autonomous HQ! Click any agent to inspect.', '🏢');
}, 1000);
