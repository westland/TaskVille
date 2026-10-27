// TaskVille Multi-Agent Autonomous Orchestrator Engine
import { soundEngine } from '../audio/soundEngine.js';

export class Orchestrator {
  constructor(agentManager, officeCanvas, onMissionStep, onMissionComplete, onFeedMessage) {
    this.agentManager = agentManager;
    this.officeCanvas = officeCanvas;
    this.onMissionStep = onMissionStep;
    this.onMissionComplete = onMissionComplete;
    this.onFeedMessage = onFeedMessage;

    this.isExecuting = false;
    this.currentMission = null;
  }

  // Execute a multi-agent mission
  async executeMission(missionTemplate, customPrompt = null) {
    if (this.isExecuting) return false;
    this.isExecuting = true;
    this.currentMission = missionTemplate;

    const nova = this.agentManager.getAgentById('nova');
    soundEngine.playDelegationWhoosh();

    // 1. Mission Kickoff - Nova Decomposes
    this.feedLog('SYSTEM', '⚡ Mission Initialized', `Goal: "${customPrompt || missionTemplate.prompt}"`);
    this.agentManager.setAgentStatus('nova', 'thinking', 'Analyzing goal and decomposing workflow dependencies...');

    await this.delay(1600);

    const steps = missionTemplate.steps;
    const totalSteps = steps.length;

    // 2. Dispatch each step through specialists
    for (let i = 0; i < totalSteps; i++) {
      const step = steps[i];
      const specialist = this.agentManager.getAgentById(step.agentId);

      if (specialist) {
        // Beam from Nova to specialist
        if (specialist.id !== 'nova') {
          this.officeCanvas.sendDelegationBeam(nova, specialist, specialist.color);
          soundEngine.playDelegationWhoosh();
        }

        // Specialist accepts task
        this.agentManager.setAgentStatus(specialist.id, 'thinking', `Receiving subtask: ${step.action}`);
        await this.delay(900);

        // Specialist working with typing clicks & sparkles
        this.agentManager.setAgentStatus(specialist.id, 'working', step.speech);
        this.officeCanvas.spawnSparkleBurst(specialist, specialist.color);

        // Simulate typing clicks
        this.simulateTyping(8);

        this.feedLog(specialist.name, `🛠️ Working on Subtask ${i + 1}/${totalSteps}`, step.action);

        if (this.onMissionStep) {
          this.onMissionStep({
            stepIndex: i,
            totalSteps,
            currentAgent: specialist,
            action: step.action
          });
        }

        await this.delay(2200);

        // Subtask done
        soundEngine.playHoverTick();
        this.agentManager.awardXp(specialist.id, 80);
      }
    }

    // 3. Live Peer Review / Inter-Agent Collaboration Phase
    if (missionTemplate.peerReview && missionTemplate.peerReview.length > 0) {
      this.feedLog('SYSTEM', '💬 Inter-Agent Peer Review', 'Agents cross-examining deliverables and optimizing output...');
      await this.delay(800);

      for (const review of missionTemplate.peerReview) {
        const fromAgent = this.agentManager.getAgentById(review.from);
        const toAgent = review.to === 'all' ? null : this.agentManager.getAgentById(review.to);

        if (fromAgent) {
          this.agentManager.setAgentStatus(fromAgent.id, 'collaborating', review.text);
          if (toAgent) {
            this.officeCanvas.sendDelegationBeam(fromAgent, toAgent, fromAgent.color);
          }
          this.feedLog(fromAgent.name, `Review to ${review.to.toUpperCase()}`, review.text);
          soundEngine.playHoverTick();
          await this.delay(1800);
        }
      }
    }

    // 4. Mission Finalized
    soundEngine.playTaskComplete();
    this.officeCanvas.spawnSparkleBurst(nova, '#00f2fe');

    // Reward all participating agents
    steps.forEach(s => {
      this.agentManager.awardXp(s.agentId, 120);
      this.agentManager.setAgentStatus(s.agentId, 'idle', 'Subtask complete. Deliverable ready.');
    });

    this.feedLog('Nova Valerius', '🎉 Mission Completed', 'Executive package synthesized and ready for deployment.');

    this.isExecuting = false;

    if (this.onMissionComplete) {
      this.onMissionComplete(missionTemplate);
    }

    return true;
  }

  simulateTyping(clicksCount = 6) {
    for (let c = 0; c < clicksCount; c++) {
      setTimeout(() => {
        soundEngine.playTypeClick();
      }, c * 180 + Math.random() * 40);
    }
  }

  feedLog(author, title, message) {
    if (this.onFeedMessage) {
      this.onFeedMessage({
        id: 'msg_' + Date.now() + Math.random(),
        author,
        title,
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
