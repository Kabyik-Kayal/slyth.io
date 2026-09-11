import { CONFIG } from './config.js';

// Precomputed hexagon vertex offsets to eliminate 12,000+ trig calls per frame
const HEX_VERTEX_OFFSETS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i + Math.PI / 6;
  return {
    dx: CONFIG.HEX_SIZE * Math.cos(angle),
    dy: CONFIG.HEX_SIZE * Math.sin(angle)
  };
});

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });

    // Display sizing
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Camera state
    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraInitialized = false;
    this.zoom = CONFIG.BASE_ZOOM || 0.78;
    this.targetZoom = CONFIG.BASE_ZOOM || 0.78;

    // Viewport world bounds
    this.viewport = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

    // Boundary animation
    this.boundaryPulse = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Use setTransform (absolute) rather than scale (multiplicative) so that
    // repeated resize events — e.g. mobile orientation change or browser zoom —
    // don't compound the DPR scale.
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  resetCamera(x, y) {
    this.cameraX = x;
    this.cameraY = y;
    this.cameraInitialized = true;
  }

  updateCamera(targetX, targetY, targetRadius, isBoosting = false, dt = 0.016) {
    if (!this.cameraInitialized) {
      this.cameraX = targetX;
      this.cameraY = targetY;
      this.cameraInitialized = true;
    } else {
      // Smooth camera follow: allows the snake head to visually surge forward during boost
      // instead of being rigidly frozen in the screen center (which caused the optical illusion that other snakes were speeding up)
      const followSpeed = isBoosting ? 14 : 9.5;
      const lerp = Math.min(1, followSpeed * dt);
      this.cameraX += (targetX - this.cameraX) * lerp;
      this.cameraY += (targetY - this.cameraY) * lerp;
    }

    // Smooth zoom scaling based on player size AND dynamic boost FOV expansion
    const baseZoom = CONFIG.BASE_ZOOM || 0.78;
    const sizeZoomRatio = baseZoom - (targetRadius - CONFIG.BASE_RADIUS) * 0.010;
    // When boosting, camera smoothly pulls back by 10% creating a genuine sense of forward acceleration
    const boostZoomMultiplier = isBoosting ? 0.90 : 1.0;
    this.targetZoom = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, sizeZoomRatio * boostZoomMultiplier));
    this.zoom += (this.targetZoom - this.zoom) * Math.min(1, 0.08 * dt * 60);

    // Calculate visible world bounding box
    const halfW = (this.width / (2 * this.zoom)) + 100;
    const halfH = (this.height / (2 * this.zoom)) + 100;

    this.viewport.minX = this.cameraX - halfW;
    this.viewport.minY = this.cameraY - halfH;
    this.viewport.maxX = this.cameraX + halfW;
    this.viewport.maxY = this.cameraY + halfH;

    this.boundaryPulse += dt * 2.5;
  }

  render(gameState) {
    const { player, snakes, foodManager, particleManager } = gameState;
    const ctx = this.ctx;

    // Reset transform & clear background
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, this.width, this.height);

    // Apply Camera Transform
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.cameraX, -this.cameraY);

    // 1. Draw Hexagonal Grid inside arena
    this.drawHexGrid(ctx);

    // 2. Draw Arena Boundary Forcefield
    this.drawBoundary(ctx);

    // 3. Draw Food Orbs (Viewport Culled)
    foodManager.draw(ctx, this.viewport.minX, this.viewport.minY, this.viewport.maxX, this.viewport.maxY);

    // 4. Draw Particles (Under snakes)
    particleManager.draw(ctx, this.viewport.minX, this.viewport.minY, this.viewport.maxX, this.viewport.maxY);

    // 5. Draw Bots
    for (let i = 0; i < snakes.length; i++) {
      const s = snakes[i];
      if (!s.isPlayer && !s.dead) {
        s.draw(ctx, this.viewport.minX, this.viewport.minY, this.viewport.maxX, this.viewport.maxY);
      }
    }

    // 6. Draw Player on top
    if (player && !player.dead) {
      player.draw(ctx, this.viewport.minX, this.viewport.minY, this.viewport.maxX, this.viewport.maxY);
    }

    ctx.restore();
  }

  // Draw optimized hexagonal honeycomb grid
  drawHexGrid(ctx) {
    const size = CONFIG.HEX_SIZE;
    const h = size * Math.sqrt(3);
    const vertDist = size * 1.5;
    const horizDist = h;

    const startRow = Math.floor(this.viewport.minY / vertDist) - 1;
    const endRow = Math.ceil(this.viewport.maxY / vertDist) + 1;
    const startCol = Math.floor(this.viewport.minX / horizDist) - 1;
    const endCol = Math.ceil(this.viewport.maxX / horizDist) + 1;

    ctx.strokeStyle = 'rgba(25, 45, 75, 0.45)';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    for (let r = startRow; r <= endRow; r++) {
      const y = r * vertDist;
      const xOffset = (r % 2 !== 0) ? horizDist / 2 : 0;

      for (let c = startCol; c <= endCol; c++) {
        const x = c * horizDist + xOffset;

        // Skip if outside world radius
        if (Math.hypot(x, y) > CONFIG.WORLD_RADIUS + size) continue;

        // Draw hexagon with precalculated vertex offsets
        for (let i = 0; i < 6; i++) {
          const v = HEX_VERTEX_OFFSETS[i];
          if (i === 0) ctx.moveTo(x + v.dx, y + v.dy);
          else ctx.lineTo(x + v.dx, y + v.dy);
        }
        ctx.closePath();
      }
    }
    ctx.stroke();
  }

  // Draw energetic circular boundary forcefield
  drawBoundary(ctx) {
    const R = CONFIG.WORLD_RADIUS;
    const pulse = Math.sin(this.boundaryPulse);

    ctx.save();

    // 1. Dark danger void outside arena
    ctx.beginPath();
    ctx.arc(0, 0, R + 3000, 0, Math.PI * 2);
    ctx.arc(0, 0, R, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(5, 7, 12, 0.88)';
    ctx.fill();

    // 2. Boundary outer glow ring
    ctx.strokeStyle = 'rgba(255, 30, 80, 0.35)';
    ctx.lineWidth = 18 + pulse * 4;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Bright inner laser shield
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Rotating dashed energy ring
    ctx.save();
    ctx.setLineDash([20, 25]);
    ctx.lineDashOffset = -this.boundaryPulse * 15;
    ctx.strokeStyle = 'rgba(255, 230, 240, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, R - 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}
