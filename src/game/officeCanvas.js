// TaskVille Interactive 2.5D Isometric Virtual Office Canvas Engine

export class OfficeCanvas {
  constructor(canvasElement, agents, onAgentClick, onLocationClick) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.agents = agents;
    this.onAgentClick = onAgentClick;
    this.onLocationClick = onLocationClick;

    this.bgImage = new Image();
    this.bgImage.src = '/assets/virtual_office_bg.jpg';
    this.bgLoaded = false;
    this.bgImage.onload = () => {
      this.bgLoaded = true;
      this.render();
    };

    // Agent avatar images cache
    this.avatarImages = {};
    this.agents.forEach(agent => {
      const img = new Image();
      img.src = agent.avatar;
      this.avatarImages[agent.id] = img;
    });

    // Particles for delegation beams and sparkles
    this.particles = [];
    this.activeBeams = [];

    // Interaction state
    this.hoveredAgent = null;
    this.selectedAgent = null;
    this.time = 0;
    this.theme = 'cyber-neon'; // 'cyber-neon' | 'lo-fi' | 'tokyo-tech'

    this.setupListeners();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.startLoop();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.width = rect.width;
    this.height = rect.height;
    this.dpr = dpr;
  }

  setupListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = null;
      for (let i = this.agents.length - 1; i >= 0; i--) {
        const agent = this.agents[i];
        const screenX = agent.x * this.width;
        const screenY = agent.y * this.height;
        const dist = Math.hypot(mouseX - screenX, mouseY - screenY);

        // Expanded hitbox covering avatar, speech bubble, and name tag
        if (dist <= 36 || (Math.abs(mouseX - screenX) < 65 && mouseY >= screenY - 45 && mouseY <= screenY + 30)) {
          found = agent;
          break;
        }
      }

      this.hoveredAgent = found;
      this.canvas.style.cursor = found ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredAgent && this.onAgentClick) {
        this.selectedAgent = this.hoveredAgent;
        this.onAgentClick(this.hoveredAgent);
      }
    });
  }

  setTheme(theme) {
    this.theme = theme;
  }

  registerAgentAvatar(agent) {
    const img = new Image();
    img.src = agent.avatar;
    this.avatarImages[agent.id] = img;
  }

  // Create an animated delegation arc beam between two points
  sendDelegationBeam(fromAgent, toAgent, color = '#00f2fe') {
    const startX = fromAgent.x * this.width;
    const startY = fromAgent.y * this.height;
    const endX = toAgent.x * this.width;
    const endY = toAgent.y * this.height;

    // Create 15 animated trailing particles
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        startX,
        startY,
        endX,
        endY,
        progress: -(i * 0.05),
        color,
        size: 3 + Math.random() * 3,
        speed: 0.025,
        type: 'beam',
        controlX: (startX + endX) / 2,
        controlY: Math.min(startY, endY) - 80 - Math.random() * 40
      });
    }
  }

  // Spawn celebratory confetti or spark burst at an agent station
  spawnSparkleBurst(agent, color = '#00ff87') {
    const x = agent.x * this.width;
    const y = agent.y * this.height;
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
        type: 'sparkle'
      });
    }
  }

  startLoop() {
    const loop = () => {
      this.time += 0.03;
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update() {
    // Smooth agent movement interpolation
    this.agents.forEach(agent => {
      const dx = agent.targetX - agent.x;
      const dy = agent.targetY - agent.y;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        agent.x += dx * 0.08;
        agent.y += dy * 0.08;
      } else {
        agent.x = agent.targetX;
        agent.y = agent.targetY;
      }
    });

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.type === 'beam') {
        p.progress += p.speed;
        if (p.progress >= 1.0) {
          this.particles.splice(i, 1);
        }
      } else if (p.type === 'sparkle') {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Office Background Image
    if (this.bgLoaded) {
      // Draw background covering full canvas maintaining ratio
      const imgRatio = this.bgImage.width / this.bgImage.height;
      const canvasRatio = this.width / this.height;
      let drawW, drawH, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawW = this.width;
        drawH = this.width / imgRatio;
        drawX = 0;
        drawY = (this.height - drawH) / 2;
      } else {
        drawH = this.height;
        drawW = this.height * imgRatio;
        drawX = (this.width - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(this.bgImage, drawX, drawY, drawW, drawH);

      // Mood overlay tint
      if (this.theme === 'cyber-neon') {
        ctx.fillStyle = 'rgba(10, 11, 26, 0.28)';
        ctx.fillRect(0, 0, this.width, this.height);
      } else if (this.theme === 'lo-fi') {
        ctx.fillStyle = 'rgba(60, 20, 50, 0.25)';
        ctx.fillRect(0, 0, this.width, this.height);
      } else if (this.theme === 'tokyo-tech') {
        ctx.fillStyle = 'rgba(5, 25, 45, 0.22)';
        ctx.fillRect(0, 0, this.width, this.height);
      }
    } else {
      // Fallback dark gradient
      const grad = ctx.createLinearGradient(0, 0, this.width, this.height);
      grad.addColorStop(0, '#0a0d1a');
      grad.addColorStop(1, '#02040a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // 2. Draw Floor Neon Circuit Lines (Connecting rooms)
    this.drawFloorCircuits(ctx);

    // 3. Draw Room Status Tags & Hotspots
    this.drawRoomHotspots(ctx);

    // 4. Draw Delegation Particles
    this.drawParticles(ctx);

    // 5. Draw Agents (sorted by Y coordinate for isometric depth sorting)
    const sortedAgents = [...this.agents].sort((a, b) => a.y - b.y);
    sortedAgents.forEach(agent => this.drawAgent(ctx, agent));

    ctx.restore();
  }

  drawFloorCircuits(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);

    // Circuit from War Room to Server Core
    const warX = 0.22 * this.width;
    const warY = 0.26 * this.height;
    const srvX = 0.52 * this.width;
    const srvY = 0.45 * this.height;
    const resX = 0.23 * this.width;
    const resY = 0.65 * this.height;
    const creX = 0.76 * this.width;
    const creY = 0.33 * this.height;
    const brkX = 0.78 * this.width;
    const brkY = 0.78 * this.height;

    ctx.beginPath();
    ctx.moveTo(warX, warY);
    ctx.lineTo(srvX, srvY);
    ctx.lineTo(resX, resY);
    ctx.moveTo(srvX, srvY);
    ctx.lineTo(creX, creY);
    ctx.lineTo(brkX, brkY);
    ctx.stroke();

    // Subtle pulsing energy dot along paths
    const pulseT = (this.time * 0.4) % 1;
    const dotX = warX + (srvX - warX) * pulseT;
    const dotY = warY + (srvY - warY) * pulseT;
    ctx.fillStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawRoomHotspots(ctx) {
    const rooms = [
      { name: 'WAR ROOM (EXEC)', x: 0.22, y: 0.17, color: '#00f2fe' },
      { name: 'RESEARCH LAB', x: 0.23, y: 0.57, color: '#ffd166' },
      { name: 'SERVER VAULT', x: 0.52, y: 0.38, color: '#38ef7d' },
      { name: 'CREATIVE BAY', x: 0.78, y: 0.12, color: '#00ff87' },
      { name: 'WATERCOOLER & CAFE', x: 0.78, y: 0.88, color: '#f093fb' }
    ];

    rooms.forEach(room => {
      const rx = room.x * this.width;
      const ry = room.y * this.height;

      ctx.save();
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';

      // Subtle glass badge
      const textWidth = ctx.measureText(room.name).width;
      const pad = 8;
      ctx.fillStyle = 'rgba(7, 10, 20, 0.75)';
      ctx.strokeStyle = `${room.color}55`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(rx - textWidth / 2 - pad, ry - 11, textWidth + pad * 2, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = room.color;
      ctx.fillText(room.name, rx, ry + 3);
      ctx.restore();
    });
  }

  drawParticles(ctx) {
    this.particles.forEach(p => {
      if (p.type === 'beam' && p.progress >= 0 && p.progress <= 1) {
        // Quadratic bezier position
        const t = p.progress;
        const invT = 1 - t;
        const curX = invT * invT * p.startX + 2 * invT * t * p.controlX + t * t * p.endX;
        const curY = invT * invT * p.startY + 2 * invT * t * p.controlY + t * t * p.endY;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'sparkle') {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  }

  drawAgent(ctx, agent) {
    const x = agent.x * this.width;
    // Add subtle idle floating bobbing
    const bob = Math.sin(this.time * 2 + agent.id.charCodeAt(0)) * 3;
    const y = agent.y * this.height + bob;
    const isHovered = this.hoveredAgent === agent;
    const isWorking = agent.status === 'working';
    const isThinking = agent.status === 'thinking';
    const radius = isHovered ? 27 : 24;

    ctx.save();

    // 1. Station base aura / glow
    const glowRadius = isWorking ? 42 : isHovered ? 36 : 28;
    const aura = ctx.createRadialGradient(x, y, 10, x, y, glowRadius);
    aura.addColorStop(0, agent.accentColor);
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Working / Thinking animated ring
    if (isWorking || isThinking) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.time * 3);
      ctx.strokeStyle = isWorking ? agent.color : '#ffd166';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Selection ring
    if (this.selectedAgent === agent) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Avatar circle clipping & drawing
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();

    const avatarImg = this.avatarImages[agent.id];
    if (avatarImg && avatarImg.complete) {
      ctx.drawImage(avatarImg, x - radius, y - radius, radius * 2, radius * 2);
    } else {
      ctx.fillStyle = agent.color;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    ctx.restore();

    // 5. Avatar Border
    ctx.strokeStyle = isHovered ? '#ffffff' : agent.color;
    ctx.lineWidth = isHovered ? 3 : 2;
    ctx.shadowColor = agent.color;
    ctx.shadowBlur = isHovered ? 12 : 6;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 6. Status dot (Bottom-Right of avatar)
    const dotX = x + radius * 0.72;
    const dotY = y + radius * 0.72;
    const statusColor = isWorking ? '#00ff87' : isThinking ? '#ffd166' : agent.status === 'break' ? '#f093fb' : '#4facfe';

    ctx.fillStyle = statusColor;
    ctx.shadowColor = statusColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#070a14';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 7. Agent Name Tag below avatar
    ctx.shadowBlur = 0;
    ctx.font = '700 11px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    const tagText = `${agent.name.split(' ')[0]} (Lv.${agent.level})`;
    const tagWidth = ctx.measureText(tagText).width;

    ctx.fillStyle = 'rgba(10, 14, 28, 0.88)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - tagWidth / 2 - 6, y + radius + 4, tagWidth + 12, 18, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(tagText, x, y + radius + 17);

    // 8. Speech / Thought Bubble (Above avatar)
    if (agent.speechBubble) {
      this.drawSpeechBubble(ctx, agent, x, y - radius - 10);
    }

    ctx.restore();
  }

  drawSpeechBubble(ctx, agent, x, bubbleBottomY) {
    ctx.save();
    ctx.font = '500 11px "Outfit", sans-serif';
    ctx.textAlign = 'center';

    let text = agent.speechBubble;
    if (text.length > 42) {
      text = text.substring(0, 39) + '...';
    }

    const textWidth = ctx.measureText(text).width;
    const padX = 10;
    const padY = 6;
    const bubbleW = textWidth + padX * 2;
    const bubbleH = 24;
    const bubbleX = x - bubbleW / 2;
    const bubbleY = bubbleBottomY - bubbleH;

    // Glass speech bubble
    ctx.fillStyle = 'rgba(14, 18, 36, 0.92)';
    ctx.strokeStyle = agent.color;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = agent.color;
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 7);
    ctx.fill();
    ctx.stroke();

    // Speech bubble tail pointer
    ctx.beginPath();
    ctx.moveTo(x - 5, bubbleBottomY);
    ctx.lineTo(x, bubbleBottomY + 5);
    ctx.lineTo(x + 5, bubbleBottomY);
    ctx.fillStyle = 'rgba(14, 18, 36, 0.92)';
    ctx.fill();

    // Text & icon
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f0f4ff';
    ctx.fillText(text, x, bubbleY + 16);

    ctx.restore();
  }
}
