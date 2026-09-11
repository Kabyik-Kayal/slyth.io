// Food, Boost Orbs, Death Drops, and Fleeing Prey
import { CONFIG, normalizeAngle, randomInCircle } from './config.js';

export const FOOD_COLORS = [
  '#ff1744', '#f50057', '#d500f9', '#651fff',
  '#2979ff', '#00e5ff', '#1de9b6', '#00e676',
  '#76ff03', '#ffea00', '#ff9100', '#ff3d00'
];

export class Food {
  constructor(x, y, mass = 1, color = null, type = 'ambient') {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.type = type; // 'ambient', 'boost', 'death', 'prey'
    this.color = color || FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)];
    
    // Visual radius based on mass
    this.baseRadius = type === 'prey' 
      ? 9 
      : Math.min(12, Math.max(3, 2.5 + Math.sqrt(mass) * 1.6));
    this.radius = this.baseRadius;
    
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.driftAngle = Math.random() * Math.PI * 2;
    this.driftSpeed = 4 + Math.random() * 8;
    this.eaten = false;
    
    // For spatial grid internal caching
    this._lastQueryId = 0;

    // Special prey properties
    if (this.type === 'prey') {
      this.vx = (Math.random() - 0.5) * CONFIG.PREY_BASE_SPEED;
      this.vy = (Math.random() - 0.5) * CONFIG.PREY_BASE_SPEED;
      this.angle = Math.atan2(this.vy, this.vx);
      this.turnTimer = 0;
      this.isFleeing = false;
    }
  }

  update(dt, snakes = [], particleManager = null) {
    this.pulsePhase += dt * (this.type === 'prey' ? 7 : 3);
    const pulseFactor = 1 + Math.sin(this.pulsePhase) * (this.type === 'prey' ? 0.28 : 0.14);
    this.radius = this.baseRadius * pulseFactor;

    if (this.type === 'ambient') {
      // Gentle ambient drift
      this.x += Math.cos(this.driftAngle) * this.driftSpeed * dt;
      this.y += Math.sin(this.driftAngle) * this.driftSpeed * dt;

      // Keep within world circle
      const dist = Math.hypot(this.x, this.y);
      if (dist > CONFIG.WORLD_RADIUS - 50) {
        this.driftAngle = Math.atan2(-this.y, -this.x) + (Math.random() - 0.5) * 0.5;
      }
    } else if (this.type === 'prey') {
      this.updatePrey(dt, snakes, particleManager);
    }
  }

  updatePrey(dt, snakes, particleManager) {
    // Check for nearby snake heads to flee from
    let nearestDist = Infinity;
    let fleeDx = 0;
    let fleeDy = 0;

    for (let i = 0; i < snakes.length; i++) {
      const s = snakes[i];
      if (s.dead) continue;

      const dx = this.x - s.x;
      const dy = this.y - s.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 320 && dist < nearestDist) {
        nearestDist = dist;
        fleeDx = dx;
        fleeDy = dy;
      }
    }

    if (nearestDist < 320 && (fleeDx !== 0 || fleeDy !== 0)) {
      this.isFleeing = true;
      const targetAngle = Math.atan2(fleeDy, fleeDx);
      
      // Fast turn towards flee angle
      const diff = normalizeAngle(targetAngle - this.angle);
      this.angle += Math.sign(diff) * Math.min(Math.abs(diff), 8.0 * dt);

      const speed = CONFIG.PREY_FLEE_SPEED;
      this.vx = Math.cos(this.angle) * speed;
      this.vy = Math.sin(this.angle) * speed;
    } else {
      this.isFleeing = false;
      this.turnTimer -= dt;
      if (this.turnTimer <= 0) {
        this.turnTimer = 0.5 + Math.random() * 1.5;
        this.angle += (Math.random() - 0.5) * 1.5;
        const speed = CONFIG.PREY_BASE_SPEED;
        this.vx = Math.cos(this.angle) * speed;
        this.vy = Math.sin(this.angle) * speed;
      }
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Prevent escaping world boundary
    const distFromCenter = Math.hypot(this.x, this.y);
    if (distFromCenter > CONFIG.WORLD_RADIUS - 80) {
      const angleToCenter = Math.atan2(-this.y, -this.x);
      this.angle = angleToCenter + (Math.random() - 0.5) * 0.4;
      this.vx = Math.cos(this.angle) * CONFIG.PREY_BASE_SPEED;
      this.vy = Math.sin(this.angle) * CONFIG.PREY_BASE_SPEED;
    }

    // Sparkle trail
    if (particleManager && Math.random() < 0.6) {
      particleManager.spawnPreyTrail(this.x, this.y, '#ffff55');
    }
  }

  draw(ctx) {
    ctx.save();
    
    if (this.type === 'prey') {
      // Radiant glowing firefly
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'death') {
      // Large death energy drop
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Ambient or boost orb
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.type === 'boost' ? 8 : 4;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Soft bright center core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export class FoodManager {
  constructor(spatialGrid, particleManager) {
    this.spatialGrid = spatialGrid;
    this.particles = particleManager;
    this.foods = [];
    this.visibleFoods = [];
  }

  // Populate initial world foods
  init() {
    this.foods = [];
    for (let i = 0; i < CONFIG.MAX_FOOD_COUNT; i++) {
      this.spawnRandomAmbientFood();
    }
    for (let i = 0; i < CONFIG.SPECIAL_PREY_COUNT; i++) {
      this.spawnSpecialPrey();
    }
  }

  spawnRandomAmbientFood() {
    const { x, y } = randomInCircle(0, CONFIG.WORLD_RADIUS - 80);
    const mass = 0.35 + Math.random() * 0.45;
    const food = new Food(x, y, mass, null, 'ambient');
    this.foods.push(food);
  }

  spawnSpecialPrey() {
    const { x, y } = randomInCircle(0, CONFIG.WORLD_RADIUS - 200);
    const prey = new Food(x, y, CONFIG.PREY_MASS_VALUE, '#ffea00', 'prey');
    this.foods.push(prey);
  }

  // Spawn food dropped during snake boost
  spawnBoostDrop(x, y, color) {
    const spread = (Math.random() - 0.5) * 8;
    const food = new Food(x + spread, y + spread, 0.5, color, 'boost');
    this.foods.push(food);
  }

  // Spawn trail of orbs when a snake dies
  spawnDeathDrops(segments, skinColor) {
    const step = Math.max(2, Math.floor(segments.length / 35));
    for (let i = 0; i < segments.length; i += step) {
      const seg = segments[i];
      const count = 1 + (Math.random() < 0.35 ? 1 : 0);
      for (let k = 0; k < count; k++) {
        const offsetDist = Math.random() * (seg.radius || 10) * 0.7;
        const offsetAngle = Math.random() * Math.PI * 2;
        const x = seg.x + Math.cos(offsetAngle) * offsetDist;
        const y = seg.y + Math.sin(offsetAngle) * offsetDist;
        const mass = 1.0 + Math.random() * 1.5;
        const food = new Food(x, y, mass, skinColor, 'death');
        this.foods.push(food);
      }
    }
  }

  update(dt, snakes) {
    this.spatialGrid.clear();
    let preyCount = 0;

    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i];
      if (f.eaten) {
        this.foods.splice(i, 1);
        continue;
      }

      f.update(dt, snakes, this.particles);

      if (f.type === 'prey') {
        preyCount++;
      }

      // Insert into spatial grid
      this.spatialGrid.insert(f);
    }

    // Replenish ambient food at a steady natural pace.
    // When a large deficit exists (e.g. after a feast-sprint), spawn a small
    // batch per frame so the arena recovers quickly instead of trickling back.
    const missing = CONFIG.MAX_FOOD_COUNT - this.foods.length;
    if (missing > 0) {
      const batchSize = missing > 100 ? Math.min(8, Math.ceil(missing / 50)) : 1;
      if (Math.random() < 0.4) {
        for (let b = 0; b < batchSize; b++) {
          this.spawnRandomAmbientFood();
        }
      }
    }

    // Replenish prey
    if (preyCount < CONFIG.SPECIAL_PREY_COUNT && Math.random() < 0.05) {
      this.spawnSpecialPrey();
    }
  }

  draw(ctx, minX, minY, maxX, maxY) {
    // Only query and draw foods in camera viewport for max FPS
    this.visibleFoods.length = 0;
    this.spatialGrid.queryRect(minX, minY, maxX, maxY, this.visibleFoods);
    for (let i = 0; i < this.visibleFoods.length; i++) {
      if (typeof this.visibleFoods[i].draw === 'function') {
        this.visibleFoods[i].draw(ctx);
      }
    }
  }
}
