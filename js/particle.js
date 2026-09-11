// Particle System with object pooling for 60fps zero-GC performance
import { CONFIG } from './config.js';

class Particle {
  constructor() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = 2;
    this.color = '#ffffff';
    this.alpha = 1;
    this.decay = 0.02;
    this.type = 'spark'; // 'spark', 'ring', 'glow'
    this.maxRadius = 10;
  }

  reset(x, y, vx, vy, radius, color, decay, type = 'spark', maxRadius = 10) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.alpha = 1;
    this.decay = decay;
    this.type = type;
    this.maxRadius = maxRadius;
  }

  update(dt) {
    if (!this.active) return false;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.alpha -= this.decay * dt * 60;

    if (this.type === 'ring') {
      this.radius += (this.maxRadius - this.radius) * 8 * dt;
    } else {
      this.radius = Math.max(0.5, this.radius - 1.2 * dt);
      this.vx *= Math.pow(0.92, dt * 60);
      this.vy *= Math.pow(0.92, dt * 60);
    }

    if (this.alpha <= 0.01) {
      this.active = false;
      return false;
    }
    return true;
  }

  draw(ctx) {
    if (!this.active || this.alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));

    if (this.type === 'ring') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = Math.max(1, 3 * this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export class ParticleManager {
  constructor(maxParticles = CONFIG.MAX_PARTICLES) {
    this.pool = [];
    this.maxParticles = maxParticles;
    this.poolIdx = 0;
    for (let i = 0; i < this.maxParticles; i++) {
      this.pool.push(new Particle());
    }
  }

  getFreeParticle() {
    for (let i = 0; i < this.maxParticles; i++) {
      const idx = (this.poolIdx + i) % this.maxParticles;
      if (!this.pool[idx].active) {
        this.poolIdx = (idx + 1) % this.maxParticles;
        return this.pool[idx];
      }
    }
    // If pool is full, reuse particles in a round-robin cycle so oldest are recycled
    const p = this.pool[this.poolIdx];
    this.poolIdx = (this.poolIdx + 1) % this.maxParticles;
    return p;
  }

  // Emit boost trail embers
  spawnBoostParticle(x, y, angle, color) {
    const p = this.getFreeParticle();
    if (!p) return;

    const spread = (Math.random() - 0.5) * 0.8;
    const speed = 40 + Math.random() * 70;
    const dir = angle + Math.PI + spread;

    const vx = Math.cos(dir) * speed;
    const vy = Math.sin(dir) * speed;

    p.reset(
      x + (Math.random() - 0.5) * 6,
      y + (Math.random() - 0.5) * 6,
      vx,
      vy,
      2 + Math.random() * 2.5,
      color,
      0.035 + Math.random() * 0.02,
      'spark'
    );
  }

  // Emit burst when food orbs are eaten
  spawnEatSparkle(x, y, color) {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const p = this.getFreeParticle();
      if (!p) continue;

      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 90;
      p.reset(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        1.8 + Math.random() * 2,
        color,
        0.04 + Math.random() * 0.03,
        'spark'
      );
    }
  }

  // Emit dramatic death shockwave & explosion debris
  spawnDeathExplosion(x, y, color, radius) {
    // Shockwave expansion ring
    const ring = this.getFreeParticle();
    if (ring) {
      ring.reset(x, y, 0, 0, 10, color, 0.03, 'ring', radius * 3.5);
    }

    // Radial debris blast
    const count = 18 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const p = this.getFreeParticle();
      if (!p) continue;

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 120 + Math.random() * 220;
      p.reset(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        3 + Math.random() * 4,
        color,
        0.025 + Math.random() * 0.02,
        'spark'
      );
    }
  }

  // Firefly prey sparkle trail
  spawnPreyTrail(x, y, color) {
    const p = this.getFreeParticle();
    if (!p) return;

    p.reset(
      x + (Math.random() - 0.5) * 8,
      y + (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      2.5 + Math.random() * 2,
      color,
      0.05,
      'spark'
    );
  }

  update(dt) {
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.pool[i].active) {
        this.pool[i].update(dt);
      }
    }
  }

  draw(ctx, minX, minY, maxX, maxY) {
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (p.active) {
        // Culling
        if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
          p.draw(ctx);
        }
      }
    }
  }
}
