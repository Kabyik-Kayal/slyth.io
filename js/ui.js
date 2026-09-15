import { CONFIG, SKINS } from './config.js';
import { drawSkinSegment } from './skinRenderer.js';

// Helper to sanitize text before inserting into innerHTML
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, char => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });
}

// Safely retrieve persistent value with legacy fallback
function getSaved(key, legacyKey, fallback = '') {
  try {
    return localStorage.getItem(key) || localStorage.getItem(legacyKey) || fallback;
  } catch {
    return fallback;
  }
}

export class UIManager {
  constructor(game) {
    this.game = game;

    // DOM Elements
    this.hudElement = document.getElementById('hud');
    this.scoreVal = document.getElementById('score-val');
    this.lengthVal = document.getElementById('length-val');
    this.killsVal = document.getElementById('kills-val');
    this.rankVal = document.getElementById('rank-val');

    this.leaderboardList = document.getElementById('leaderboard-list');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas.getContext('2d');

    // Menus
    this.startMenu = document.getElementById('start-menu');
    this.gameOverMenu = document.getElementById('game-over-menu');
    this.nicknameInput = document.getElementById('nickname-input');
    this.playBtn = document.getElementById('play-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.changeSkinBtn = document.getElementById('change-skin-btn');
    this.skinPrevBtn = document.getElementById('skin-prev-btn');
    this.skinNextBtn = document.getElementById('skin-next-btn');
    this.skinNameLabel = document.getElementById('skin-name');
    this.skinCanvas = document.getElementById('skin-preview-canvas');
    this.skinCtx = this.skinCanvas.getContext('2d');

    // Stats
    this.finalScore = document.getElementById('final-score');
    this.finalLength = document.getElementById('final-length');
    this.finalKills = document.getElementById('final-kills');
    this.finalTime = document.getElementById('final-time');
    this.finalRank = document.getElementById('final-rank');
    this.bestScoreVal = document.getElementById('best-score-val');

    // Settings
    this.muteBtn = document.getElementById('mute-btn');
    this.volumeSlider = document.getElementById('volume-slider');
    this.botCountBtns = document.querySelectorAll('.bot-count-btn');

    // Skin previewer state
    this.selectedSkinIndex = 0;
    this.previewPhase = 0;
    this.highestRankAchieved = 999;

    // Load saved profile
    this.loadProfile();
    this.initEventListeners();
  }

  loadProfile() {
    const savedNick = getSaved('slyth_nickname', 'slither_nickname');
    if (savedNick) {
      this.nicknameInput.value = savedNick;
    }

    const savedSkin = getSaved('slyth_skin', 'slither_skin');
    const idx = SKINS.findIndex(s => s.id === savedSkin);
    if (idx !== -1) this.selectedSkinIndex = idx;

    const savedBest = getSaved('slyth_best_score', 'slither_best_score', '0');
    if (this.bestScoreVal) {
      this.bestScoreVal.textContent = savedBest;
    }
  }

  initEventListeners() {
    // Play button
    this.playBtn.addEventListener('click', () => {
      this.startGame();
    });

    // Enter key starts game
    this.nicknameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.startGame();
      }
    });

    // Restart button
    this.restartBtn.addEventListener('click', () => {
      this.gameOverMenu.classList.add('hidden');
      this.startGame();
    });

    // Customize skin button (from game over modal)
    if (this.changeSkinBtn) {
      this.changeSkinBtn.addEventListener('click', () => {
        this.gameOverMenu.classList.add('hidden');
        this.startMenu.classList.remove('hidden');
      });
    }

    // Skin navigation
    this.skinPrevBtn.addEventListener('click', () => {
      this.selectedSkinIndex = (this.selectedSkinIndex - 1 + SKINS.length) % SKINS.length;
      this.updateSkinPreview();
    });

    this.skinNextBtn.addEventListener('click', () => {
      this.selectedSkinIndex = (this.selectedSkinIndex + 1) % SKINS.length;
      this.updateSkinPreview();
    });

    // Mute toggle
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        const isMuted = !this.game.sound.muted;
        this.game.sound.setMuted(isMuted);
        this.updateMuteButtonUI();
      });
      this.updateMuteButtonUI();
    }

    // Volume slider
    if (this.volumeSlider) {
      this.volumeSlider.value = this.game.sound.volume;
      this.volumeSlider.addEventListener('input', (e) => {
        this.game.sound.setVolume(parseFloat(e.target.value));
        if (this.game.sound.muted) {
          this.game.sound.setMuted(false);
          this.updateMuteButtonUI();
        }
      });
    }

    // Bot count selection
    this.botCountBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.botCountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.game.setBotCount(parseInt(btn.dataset.count, 10));
      });
    });

    this.updateSkinPreview();
  }

  updateMuteButtonUI() {
    if (!this.muteBtn) return;
    if (this.game.sound.muted) {
      this.muteBtn.textContent = '🔇 Muted';
      this.muteBtn.classList.add('muted');
    } else {
      this.muteBtn.textContent = '🔊 Sound On';
      this.muteBtn.classList.remove('muted');
    }
  }

  startGame() {
    const nick = this.nicknameInput.value.trim() || 'Player';
    const skin = SKINS[this.selectedSkinIndex];

    localStorage.setItem('slyth_nickname', nick);
    localStorage.setItem('slyth_skin', skin.id);

    this.startMenu.classList.add('hidden');
    this.gameOverMenu.classList.add('hidden');
    this.hudElement.classList.remove('hidden');

    this.highestRankAchieved = 999;
    this.game.start(nick, skin.id);
  }

  showGameOver(stats) {
    this.hudElement.classList.add('hidden');
    this.gameOverMenu.classList.remove('hidden');

    const score = Math.floor(stats.mass * 10);
    const length = stats.segments.length;
    const kills = stats.kills;
    const timeSec = Math.floor(stats.timeAlive);
    const mins = Math.floor(timeSec / 60);
    const secs = timeSec % 60;
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    this.finalScore.textContent = score;
    this.finalLength.textContent = length;
    this.finalKills.textContent = kills;
    this.finalTime.textContent = timeFormatted;
    this.finalRank.textContent = `#${Math.min(this.highestRankAchieved, stats.rank || 1)}`;

    // Update personal best
    const best = parseInt(getSaved('slyth_best_score', 'slither_best_score', '0'), 10);
    const newBest = Math.max(best, score);
    if (score > best) {
      localStorage.setItem('slyth_best_score', score);
    }
    this.bestScoreVal.textContent = newBest;
  }

  updateSkinPreview() {
    const skin = SKINS[this.selectedSkinIndex];
    this.skinNameLabel.textContent = skin.name;
    this.renderSkinPreview(skin);
  }

  // Draw animated snake preview in the menu
  renderSkinPreview(skin) {
    const ctx = this.skinCtx;
    const w = this.skinCanvas.width;
    const h = this.skinCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const segmentCount = 14;
    const radius = 10;

    this.previewPhase += 0.05;

    // Draw snake in S-wave
    for (let i = segmentCount - 1; i >= 0; i--) {
      const x = centerX - (i - segmentCount / 2) * 11;
      const y = centerY + Math.sin(this.previewPhase + i * 0.45) * 16;

      drawSkinSegment(ctx, x, y, radius, skin, i, segmentCount, this.previewPhase * 1.6);

      // Head eyes
      if (i === 0) {
        ctx.fillStyle = skin.eyeColor || '#ffffff';
        ctx.beginPath();
        ctx.arc(x + 4, y - 4, 3.5, 0, Math.PI * 2);
        ctx.arc(x + 4, y + 4, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = skin.pupilColor || '#000000';
        ctx.beginPath();
        ctx.arc(x + 5, y - 4, 1.8, 0, Math.PI * 2);
        ctx.arc(x + 5, y + 4, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  updateHUD(player, totalSnakes) {
    if (!player || player.dead) return;

    this.scoreVal.textContent = Math.floor(player.mass * 10);
    this.lengthVal.textContent = player.segments.length;
    this.killsVal.textContent = player.kills;
    this.rankVal.textContent = `#${player.rank || 1} of ${totalSnakes}`;

    if (player.rank && player.rank < this.highestRankAchieved) {
      this.highestRankAchieved = player.rank;
    }
  }

  updateLeaderboard(rankedSnakes, player) {
    let html = '';
    const topCount = Math.min(10, rankedSnakes.length);

    for (let i = 0; i < topCount; i++) {
      const s = rankedSnakes[i];
      const isSelf = player && s.id === player.id;
      const score = Math.floor(s.mass * 10);
      const rowClass = isSelf ? 'leaderboard-row self' : 'leaderboard-row';
      const safeName = escapeHTML(s.name);

      html += `
        <div class="${rowClass}">
          <span class="rank">#${i + 1}</span>
          <span class="name" title="${safeName}">${safeName}</span>
          <span class="score">${score}</span>
        </div>
      `;
    }

    // If player is alive but outside top 10, pin at bottom
    if (player && !player.dead && player.rank > 10) {
      const safePlayerName = escapeHTML(player.name);
      html += `
        <div class="leaderboard-divider">...</div>
        <div class="leaderboard-row self pinned">
          <span class="rank">#${player.rank}</span>
          <span class="name">${safePlayerName}</span>
          <span class="score">${Math.floor(player.mass * 10)}</span>
        </div>
      `;
    }

    this.leaderboardList.innerHTML = html;
  }

  drawMinimap(snakes, player, foods) {
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;
    const mapRadius = (w / 2) - 4;
    const scale = mapRadius / CONFIG.WORLD_RADIUS;

    ctx.clearRect(0, 0, w, h);

    // 1. Radar Circular Border
    ctx.save();
    ctx.translate(w / 2, h / 2);

    ctx.fillStyle = 'rgba(10, 16, 26, 0.78)';
    ctx.beginPath();
    ctx.arc(0, 0, mapRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, mapRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Concentric grid circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, mapRadius * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    // 2. High-value prey & death food orbs on radar
    ctx.fillStyle = '#ffea00';
    for (let i = 0; i < foods.length; i++) {
      const f = foods[i];
      if (f.type === 'prey') {
        ctx.beginPath();
        ctx.arc(f.x * scale, f.y * scale, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Draw Bots
    ctx.fillStyle = 'rgba(255, 75, 75, 0.75)';
    for (let i = 0; i < snakes.length; i++) {
      const s = snakes[i];
      if (s.isPlayer || s.dead) continue;

      const mx = s.x * scale;
      const my = s.y * scale;
      const r = Math.max(1.5, Math.min(3.5, s.radius * scale * 1.8));

      ctx.beginPath();
      ctx.arc(mx, my, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Draw Player (Bright Pulsing Cyan Dot)
    if (player && !player.dead) {
      const px = player.x * scale;
      const py = player.y * scale;

      // Glow halo
      ctx.fillStyle = 'rgba(0, 243, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      // Main dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Heading indicator
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(player.angle) * 7, py + Math.sin(player.angle) * 7);
      ctx.stroke();
    }

    ctx.restore();
  }
}
