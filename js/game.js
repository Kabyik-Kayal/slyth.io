// Main Game Coordinator, Animation Loop, Input Management, and Bot Spawner
import { CONFIG, SKINS, BOT_NAMES, randomInCircle } from './config.js';
import { sound } from './audio.js';
import { SpatialGrid } from './spatialGrid.js';
import { ParticleManager } from './particle.js';
import { FoodManager } from './food.js';
import { Snake } from './snake.js';
import { BotSnake } from './bot.js';
import { Renderer } from './renderer.js';
import { UIManager } from './ui.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new Renderer(this.canvas);
    this.foodGrid = new SpatialGrid(CONFIG.SPATIAL_CELL_SIZE);
    this.snakeGrid = new SpatialGrid(CONFIG.SPATIAL_CELL_SIZE);
    this.particleManager = new ParticleManager();
    this.foodManager = new FoodManager(this.foodGrid, this.particleManager);
    this.sound = sound;

    this.state = 'MENU'; // 'MENU', 'PLAYING', 'GAMEOVER', 'PAUSED'
    this.player = null;
    this.snakes = [];
    this.botCount = CONFIG.BOT_COUNT;
    this.botRespawnQueue = [];

    // Timers & intervals
    this.lastTime = performance.now();
    this.leaderboardTimer = 0;
    this.minimapTimer = 0;
    this.skinPreviewTimer = 0;

    // Input state
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.isMouseDown = false;
    this.isSpaceDown = false;
    this.keys = {};

    this.ui = new UIManager(this);
    this.initInputs();
    this.initWorld();

    // Start loop
    requestAnimationFrame((t) => this.loop(t));
  }

  initWorld() {
    this.foodManager.init();
  }

  setBotCount(count) {
    this.botCount = Math.max(CONFIG.MIN_BOT_COUNT, Math.min(CONFIG.MAX_BOT_COUNT, count));
  }

  initInputs() {
    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.updatePlayerTargetAngle();
    });

    // Mouse buttons (Left click boost)
    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#start-menu') || e.target.closest('#game-over-menu')) return;
      if (e.button === 0) { // Left click
        this.isMouseDown = true;
        this.sound.init();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      }
    });

    // Prevent context menu
    window.addEventListener('contextmenu', (e) => {
      if (this.state === 'PLAYING') {
        e.preventDefault();
      }
    });

    // Keyboard (Space to boost, ESC to pause)
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space') {
        this.isSpaceDown = true;
        e.preventDefault();
      }
      if (e.code === 'Escape' && this.state === 'PLAYING') {
        // Toggle pause
        this.state = 'PAUSED';
      } else if (e.code === 'Escape' && this.state === 'PAUSED') {
        this.state = 'PLAYING';
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'Space') {
        this.isSpaceDown = false;
      }
    });

    // Touch & Mobile support
    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('#start-menu') || e.target.closest('#game-over-menu')) return;
      if (e.touches.length > 0) {
        this.mouseX = e.touches[0].clientX;
        this.mouseY = e.touches[0].clientY;
        this.updatePlayerTargetAngle();
        this.sound.init();
      }
      if (e.touches.length > 1) {
        this.isMouseDown = true; // Multi-touch boost
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouseX = e.touches[0].clientX;
        this.mouseY = e.touches[0].clientY;
        this.updatePlayerTargetAngle();
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        this.isMouseDown = false;
      }
    });

    // Virtual boost button for touch
    const touchBoostBtn = document.getElementById('touch-boost-btn');
    if (touchBoostBtn) {
      touchBoostBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.isMouseDown = true;
      });
      touchBoostBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.isMouseDown = false;
      });
    }
  }

  updatePlayerTargetAngle() {
    if (!this.player || this.player.dead || this.state !== 'PLAYING') return;

    // Angle from center of screen (where camera is focused on player head)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = this.mouseX - centerX;
    const dy = this.mouseY - centerY;
    const dist = Math.hypot(dx, dy);

    this.player.distToCursor = dist;

    if (dist > 10) {
      this.player.targetAngle = Math.atan2(dy, dx);
    }
  }

  start(playerName, skinId) {
    this.sound.init();

    // Spawn player near center
    const startX = (Math.random() - 0.5) * 600;
    const startY = (Math.random() - 0.5) * 600;
    this.player = new Snake('player', playerName, startX, startY, skinId, true);

    // Initialize bot population with varied sizes and points
    this.snakes = [this.player];
    this.botRespawnQueue = [];

    // Distinct names pool for leaderboard clarity
    const shuffledNames = [...BOT_NAMES].sort(() => Math.random() - 0.5);

    // Ensure every bot has a distinctive unique skin from the 36-skin library!
    // Filter out player's chosen skin so the player's appearance is 100% exclusive
    const playerSkinId = (typeof skinId === 'string' && skinId) ? skinId : 'neon-cyan';
    const availableSkins = SKINS.filter(s => s.id !== playerSkinId);
    const shuffledSkins = [...availableSkins].sort(() => Math.random() - 0.5);

    // Dynamic initial population hierarchy across the bot count:
    // 1. Titans (Top 2-3 leaderboard rulers): mass 400 - 750 (score 4,000 - 7,500)
    const titanCount = Math.max(2, Math.round(this.botCount * 0.08));
    // 2. Heavyweights (4-5 veteran snakes): mass 170 - 330 (score 1,700 - 3,300)
    const heavyCount = Math.max(3, Math.round(this.botCount * 0.15));
    // 3. Challengers (8-10 mid-tier snakes): mass 60 - 140 (score 600 - 1,400)
    const challengerCount = Math.max(6, Math.round(this.botCount * 0.28));
    // 4. Juveniles (remaining bots): mass 20 - 45 (score 200 - 450)
    const juvenileCount = Math.max(0, this.botCount - (titanCount + heavyCount + challengerCount));

    const personalities = ['HUNTER', 'FORAGER', 'SCAVENGER', 'COILER'];
    let nameIdx = 0;

    const botTiers = [
      {
        count: titanCount,
        getMass: i => Math.round(520 + Math.random() * 220 - (i * 120)),
        getKills: () => Math.floor(4 + Math.random() * 4),
        getPersonality: i => (i % 2 === 0 ? 'COILER' : 'HUNTER')
      },
      {
        count: heavyCount,
        getMass: () => Math.round(170 + Math.random() * 150),
        getKills: () => Math.floor(2 + Math.random() * 3),
        getPersonality: i => personalities[(i + 1) % personalities.length]
      },
      {
        count: challengerCount,
        getMass: () => Math.round(60 + Math.random() * 80),
        getKills: () => Math.floor(Math.random() * 2),
        getPersonality: i => personalities[(i + 2) % personalities.length]
      },
      {
        count: juvenileCount,
        getMass: () => Math.round(CONFIG.START_MASS + Math.random() * 25),
        getKills: () => 0,
        getPersonality: i => personalities[i % personalities.length]
      }
    ];

    for (const tier of botTiers) {
      for (let i = 0; i < tier.count; i++) {
        const skin = shuffledSkins[nameIdx % shuffledSkins.length].id;
        const bot = this.spawnBot(tier.getPersonality(i), tier.getMass(i), tier.getKills(), skin);
        if (shuffledNames[nameIdx]) bot.name = shuffledNames[nameIdx];
        nameIdx++;
      }
    }

    // Compute immediate rankings so HUD & leaderboard are populated on frame 1
    this.updateLeaderboardAndRankings();

    this.state = 'PLAYING';
    this.lastTime = performance.now();
  }

  spawnBot(personality = null, customMass = null, customKills = null, customSkin = null) {
    const id = `bot_${Math.random().toString(36).substring(2, 9)}`;
    const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    
    // Distinct skin selection: prioritize skins not currently held by living snakes
    let skinId = customSkin;
    if (!skinId) {
      const livingSkinIds = new Set(this.snakes.filter(s => !s.dead).map(s => s.skin.id));
      const unusedSkins = SKINS.filter(s => !livingSkinIds.has(s.id));
      if (unusedSkins.length > 0) {
        skinId = unusedSkins[Math.floor(Math.random() * unusedSkins.length)].id;
      } else {
        skinId = SKINS[Math.floor(Math.random() * SKINS.length)].id;
      }
    }

    // Determine mass tier if not explicitly passed
    let mass;
    let kills = 0;
    if (typeof customMass === 'number') {
      mass = customMass;
      kills = typeof customKills === 'number' ? customKills : 0;
    } else {
      // Varied respawn roll
      const roll = Math.random();
      if (roll < 0.68) {
        // Juvenile (68%)
        mass = Math.round(CONFIG.START_MASS + Math.random() * 25);
        kills = 0;
      } else if (roll < 0.92) {
        // Challenger (24%)
        mass = Math.round(55 + Math.random() * 75);
        kills = Math.floor(1 + Math.random() * 2);
      } else {
        // Heavyweight (8%)
        mass = Math.round(150 + Math.random() * 140);
        kills = Math.floor(2 + Math.random() * 3);
      }
    }

    // Spawn safely distributed in arena, far away from player
    let x, y, distToPlayer;
    let attempts = 0;
    // Massive snakes spawn in central/mid territory, smaller snakes can roam further
    const maxRadius = mass > 200 ? (CONFIG.WORLD_RADIUS * 0.65) : (CONFIG.WORLD_RADIUS - 1000);
    const minRadius = mass > 200 ? 900 : 700;

    do {
      const pos = randomInCircle(minRadius, maxRadius);
      x = pos.x;
      y = pos.y;
      distToPlayer = this.player ? Math.hypot(x - this.player.x, y - this.player.y) : 2500;
      attempts++;
    } while (distToPlayer < CONFIG.BOT_SAFE_SPAWN_MIN_DIST && attempts < CONFIG.BOT_SAFE_SPAWN_ATTEMPTS);

    const bot = new BotSnake(id, name, x, y, skinId, personality || 'HUNTER');
    bot.mass = mass;
    bot.kills = kills;
    bot.initSegments();
    this.snakes.push(bot);
    return bot;
  }

  loop(currentTime) {
    requestAnimationFrame((t) => this.loop(t));

    const dt = Math.min(0.06, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // Skin previewer update when menu is visible
    if (this.state === 'MENU') {
      this.skinPreviewTimer += dt;
      if (this.skinPreviewTimer > 0.03) {
        this.skinPreviewTimer = 0;
        this.ui.updateSkinPreview();
      }
      return;
    }

    if (this.state === 'PAUSED') return;

    this.update(dt);
    this.render();
  }

  update(dt) {
    // 0. Update player steering angle and cursor distance continuously each frame
    this.updatePlayerTargetAngle();

    // 1. Process player boost input
    if (this.player && !this.player.dead) {
      this.player.isBoosting = this.isMouseDown || this.isSpaceDown;
    }

    // 2. Clear snake grid and rebuild with living snake segments
    this.snakeGrid.clear();
    for (let i = 0; i < this.snakes.length; i++) {
      const s = this.snakes[i];
      if (s.dead) continue;

      // Insert segments into snake spatial hash grid
      for (let j = 0; j < s.segments.length; j++) {
        this.snakeGrid.insert(s.segments[j]);
      }
    }

    // 2b. Build an id→Snake map for O(1) lookups in bot AI and collision detection.
    // Avoids O(n) allSnakes.find() calls that previously ran thousands of times per frame.
    const snakeMap = new Map();
    for (let i = 0; i < this.snakes.length; i++) {
      snakeMap.set(this.snakes[i].id, this.snakes[i]);
    }

    // 3. Update food and replenish (uses foodGrid internally)
    this.foodManager.update(dt, this.snakes);

    // 4. Update particles
    this.particleManager.update(dt);

    // 5. Update bots AI (using snakeGrid for sensory feelers)
    for (let i = 0; i < this.snakes.length; i++) {
      const s = this.snakes[i];
      if (s instanceof BotSnake && !s.dead) {
        s.updateAI(dt, this.snakes, this.foodManager, this.snakeGrid, snakeMap);
      }
    }

    // 6. Update snake physics & eat food
    for (let i = 0; i < this.snakes.length; i++) {
      const s = this.snakes[i];
      if (!s.dead) {
        s.update(dt, this.foodManager, this.particleManager, this.sound);
        s.eatFood(this.foodManager, this.sound, this.particleManager);
      }
    }

    // 7. Collision checks using snakeGrid (after all snakes moved)
    for (let i = 0; i < this.snakes.length; i++) {
      const s = this.snakes[i];
      if (!s.dead) {
        const died = s.checkCollisions(this.snakes, this.snakeGrid, this.sound, this.particleManager, this.foodManager, snakeMap);
        if (died && s.isPlayer) {
          this.handlePlayerDeath();
        } else if (died) {
          // Schedule bot respawn after BOT_RESPAWN_DELAY seconds
          this.botRespawnQueue.push({ time: CONFIG.BOT_RESPAWN_DELAY });
        }
      }
    }

    // 8. Respawn bots from queue
    for (let i = this.botRespawnQueue.length - 1; i >= 0; i--) {
      this.botRespawnQueue[i].time -= dt;
      if (this.botRespawnQueue[i].time <= 0) {
        this.botRespawnQueue.splice(i, 1);
        if (this.snakes.filter(s => !s.isPlayer && !s.dead).length < this.botCount) {
          this.spawnBot();
        }
      }
    }

    // Remove dead snakes immediately (death animations are particles, already spawned in die()).
    // The player snake is kept alive in the array until the game-over screen is dismissed.
    this.snakes = this.snakes.filter(s => !s.dead || s.isPlayer);

    // 9. Update camera tracking
    if (this.player && !this.player.dead) {
      this.renderer.updateCamera(this.player.x, this.player.y, this.player.radius, dt);
    }

    // 10. Periodic Leaderboard and Minimap updates
    this.leaderboardTimer += dt;
    if (this.leaderboardTimer >= 0.25) {
      this.leaderboardTimer = 0;
      this.updateLeaderboardAndRankings();
    }

    this.minimapTimer += dt;
    if (this.minimapTimer >= 0.08) {
      this.minimapTimer = 0;
      this.ui.drawMinimap(this.snakes, this.player, this.foodManager.foods);
    }
  }

  updateLeaderboardAndRankings() {
    const livingSnakes = this.snakes.filter(s => !s.dead);
    livingSnakes.sort((a, b) => b.mass - a.mass);

    // Assign ranks
    for (let i = 0; i < livingSnakes.length; i++) {
      livingSnakes[i].rank = i + 1;
    }

    this.ui.updateLeaderboard(livingSnakes, this.player);
    this.ui.updateHUD(this.player, livingSnakes.length);
  }

  handlePlayerDeath() {
    this.state = 'GAMEOVER';
    setTimeout(() => {
      this.ui.showGameOver(this.player);
    }, 650);
  }

  render() {
    this.renderer.render({
      player: this.player,
      snakes: this.snakes,
      foodManager: this.foodManager,
      particleManager: this.particleManager
    });
  }
}

// Instantiate game on window load
window.addEventListener('DOMContentLoaded', () => {
  window.slitherGame = new Game();
});
