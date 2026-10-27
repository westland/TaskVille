// TaskVille Agent Lifecycle, Behavior, and Progression Manager
import { soundEngine } from '../audio/soundEngine.js';
import { OFFICE_LOCATIONS } from '../data/agents.js';

export class AgentManager {
  constructor(initialAgents, onAgentUpdate, onActivityLog) {
    this.agents = initialAgents;
    this.onAgentUpdate = onAgentUpdate;
    this.onActivityLog = onActivityLog;
    this.wanderingInterval = null;

    this.startAutonomousLifeCycle();
  }

  getAgents() {
    return this.agents;
  }

  getAgentById(id) {
    return this.agents.find(a => a.id === id);
  }

  // Award XP and handle level up
  awardXp(agentId, amount) {
    const agent = this.getAgentById(agentId);
    if (!agent) return;

    agent.xp += amount;
    agent.tasksCompleted += 1;

    if (agent.xp >= agent.maxXp) {
      agent.level += 1;
      agent.xp -= agent.maxXp;
      agent.maxXp = Math.floor(agent.maxXp * 1.25);
      soundEngine.playHireFanfare();

      this.logActivity({
        agentId: agent.id,
        agentName: agent.name,
        type: 'LEVEL_UP',
        text: `🎉 ${agent.name} leveled up to Level ${agent.level}! Efficiency rating boosted.`
      });
    }

    if (this.onAgentUpdate) this.onAgentUpdate(agent);
  }

  // Update speech & status
  setAgentStatus(agentId, status, speech = null) {
    const agent = this.getAgentById(agentId);
    if (!agent) return;

    agent.status = status;
    if (speech !== null) {
      agent.speechBubble = speech;
    }
    if (this.onAgentUpdate) this.onAgentUpdate(agent);
  }

  // Move agent to normalized coordinate (with smooth pathing)
  moveAgentTo(agentId, x, y, onArrival = null) {
    const agent = this.getAgentById(agentId);
    if (!agent) return;

    agent.targetX = x;
    agent.targetY = y;
    agent.status = 'walking';

    const checkArrival = setInterval(() => {
      const dist = Math.hypot(agent.x - x, agent.y - y);
      if (dist < 0.015) {
        clearInterval(checkArrival);
        agent.x = x;
        agent.y = y;
        if (onArrival) onArrival(agent);
      }
    }, 100);
  }

  // Return agent to designated desk
  returnAgentToDesk(agentId) {
    const agent = this.getAgentById(agentId);
    if (!agent) return;

    this.moveAgentTo(agentId, agent.deskX, agent.deskY, (a) => {
      a.status = 'idle';
      a.speechBubble = 'At station. Ready for next mission.';
      if (this.onAgentUpdate) this.onAgentUpdate(a);
    });
  }

  // Hire a new custom agent
  hireAgent(newAgentData) {
    const newId = 'agent_' + Date.now();
    const deskOffset = (this.agents.length % 4) * 0.08;

    const agent = {
      id: newId,
      name: newAgentData.name || 'Agent X',
      title: newAgentData.title || 'Autonomous Specialist',
      role: newAgentData.role || 'Autonomous Operations',
      dept: newAgentData.dept || 'Operations',
      avatar: newAgentData.avatar || 'assets/taskville_logo.jpg',
      color: newAgentData.color || '#00f2fe',
      accentColor: `${newAgentData.color || '#00f2fe'}33`,
      level: 1,
      xp: 0,
      maxXp: 1000,
      tasksCompleted: 0,
      efficiency: '95.0%',
      status: 'idle',
      speechBubble: 'Reporting for duty! Ready to automate.',
      thoughtStream: 'Calibrating subagent tools and API connections...',
      deskX: 0.55 + deskOffset,
      deskY: 0.65,
      x: 0.78, // spawns near reception/breakroom
      y: 0.85,
      targetX: 0.55 + deskOffset,
      targetY: 0.65,
      stationName: `${newAgentData.dept} Station`,
      stats: {
        coordination: 90,
        speed: 92,
        precision: 91,
        tokensUsed: '0k'
      },
      tools: newAgentData.tools || ['Antigravity Dispatcher', 'Web Search'],
      systemPrompt: newAgentData.systemPrompt || 'You are an autonomous AI agent working inside TaskVille.'
    };

    this.agents.push(agent);
    soundEngine.playHireFanfare();

    this.logActivity({
      agentId: agent.id,
      agentName: agent.name,
      type: 'HIRED',
      text: `🤝 New AI Worker hired: ${agent.name} (${agent.title}) assigned to ${agent.dept}!`
    });

    if (this.onAgentUpdate) this.onAgentUpdate(agent);
    return agent;
  }

  // Periodic autonomous life (coffee breaks, casual chats, watercooler banter)
  startAutonomousLifeCycle() {
    const banters = [
      { speech: 'Grabbing a quick cold brew at the lounge ☕', dest: OFFICE_LOCATIONS.BREAK_ROOM },
      { speech: 'Checking token consumption charts...', dest: null },
      { speech: 'Stopping by the watercooler. Anyone seen Vance’s new post?', dest: OFFICE_LOCATIONS.WATERCOOLER },
      { speech: 'Optimizing local prompt cache for speed.', dest: null },
      { speech: 'Syncing with the server vault.', dest: OFFICE_LOCATIONS.SERVER }
    ];

    this.wanderingInterval = setInterval(() => {
      // Pick a random idle agent
      const idleAgents = this.agents.filter(a => a.status === 'idle');
      if (idleAgents.length === 0) return;

      const agent = idleAgents[Math.floor(Math.random() * idleAgents.length)];
      // 50% chance to wander or just speak
      const banter = banters[Math.floor(Math.random() * banters.length)];

      if (banter.dest) {
        agent.status = 'break';
        agent.speechBubble = banter.speech;
        soundEngine.playCoffeeBrew();

        // Move to destination, wait 6 seconds, return to desk
        this.moveAgentTo(agent.id, banter.dest.x + (Math.random() * 0.04 - 0.02), banter.dest.y + (Math.random() * 0.04 - 0.02), (a) => {
          setTimeout(() => {
            this.returnAgentToDesk(a.id);
          }, 6000);
        });
      } else {
        agent.speechBubble = banter.speech;
        if (this.onAgentUpdate) this.onAgentUpdate(agent);
        setTimeout(() => {
          if (agent.status === 'idle') {
            agent.speechBubble = 'At station. Ready for next mission.';
            if (this.onAgentUpdate) this.onAgentUpdate(agent);
          }
        }, 5000);
      }
    }, 14000);
  }

  gatherTeamInWarRoom() {
    this.agents.forEach((agent, idx) => {
      const offsetX = (idx % 3 - 1) * 0.04;
      const offsetY = (Math.floor(idx / 3) - 0.5) * 0.05;
      const targetX = OFFICE_LOCATIONS.WAR_ROOM.x + offsetX;
      const targetY = OFFICE_LOCATIONS.WAR_ROOM.y + offsetY;

      this.moveAgentTo(agent.id, targetX, targetY, (a) => {
        a.status = 'collaborating';
        a.speechBubble = 'Executive standup in War Room 🎯';
        if (this.onAgentUpdate) this.onAgentUpdate(a);
      });
    });

    this.logActivity({
      agentId: 'system',
      agentName: 'HQ War Room',
      type: 'SYNC',
      text: '🎯 All agents summoned to the Executive War Room for strategic sync.'
    });

    setTimeout(() => {
      this.agents.forEach(agent => {
        this.returnAgentToDesk(agent.id);
      });
    }, 10000);
  }

  sendTeamToBreak() {
    this.agents.forEach((agent, idx) => {
      const offsetX = (idx % 3 - 1) * 0.035;
      const offsetY = (Math.floor(idx / 3) - 0.5) * 0.04;
      const targetX = OFFICE_LOCATIONS.BREAK_ROOM.x + offsetX;
      const targetY = OFFICE_LOCATIONS.BREAK_ROOM.y + offsetY;

      this.moveAgentTo(agent.id, targetX, targetY, (a) => {
        a.status = 'break';
        a.speechBubble = 'Cold brew refill & recharge ☕';
        if (this.onAgentUpdate) this.onAgentUpdate(a);
      });
    });

    soundEngine.playCoffeeBrew();
    this.logActivity({
      agentId: 'system',
      agentName: 'Coffee Bar',
      type: 'BREAK',
      text: '☕ Team sent on a cold brew coffee break at the lounge.'
    });

    setTimeout(() => {
      this.agents.forEach(agent => {
        this.returnAgentToDesk(agent.id);
      });
    }, 8000);
  }

  logActivity(entry) {
    if (this.onActivityLog) {
      this.onActivityLog({
        ...entry,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    }
  }
}
