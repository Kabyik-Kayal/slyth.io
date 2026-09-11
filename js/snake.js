import { CONFIG, SKINS, normalizeAngle } from './config.js';
export { drawSkinSegment } from './skinRenderer.js';
import { drawSkinSegment } from './skinRenderer.js';



export class Snake {
  constructor(id, name, x, y, skinId = 'neon-cyan', isPlayer = false) {
    this.id = id;
    this.name = name || 'Snake';
    this.isPlayer = isPlayer;
    this.skin = SKINS.find(s => s.id === skinId) || SKINS[0];

    // Position and orientation
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.targetAngle = this.angle;
    this.speed = CONFIG.BASE_SPEED;
    this.isBoosting = false;

    // Mass & dimensions
    this.mass = CONFIG.START_MASS;
    this.radius = CONFIG.BASE_RADIUS;
    this.dead = false;
    this.kills = 0;
    this.score = 0;

    // Slither animation state
    this.wigglePhase = Math.random() * 100;
    this.boostTimer = 0;
    this.invulnerableTimer = isPlayer ? 3.0 : 1.5; // Spawn shield protection
    // distToCursor: distance from screen centre to cursor, used for tight-coil turn boost.
    // Initialised to Infinity so the close-cursor branch is never triggered before the first mousemove.
    this.distToCursor = Infinity;
    // ptsStart: logical start index into this.pts (ring-buffer approach, avoids O(n) splice).
    this.ptsStart = 0;

    // Body segments array: [{x, y, radius, angle, _lastQueryId}]
    this.segments = [];
    this.initSegments();

    // Stats
    this.foodEatenCount = 0;
    this.timeAlive = 0;
  }

  initSegments() {
    this.pts = [];
    this.ptsStart = 0; // reset ring-buffer start offset
    this.segments = [];

    // Ensure radius correctly reflects mass
    const excessMass = Math.max(0, this.mass - CONFIG.START_MASS);
    this.radius = Math.min(
      CONFIG.MAX_RADIUS,
      CONFIG.BASE_RADIUS + Math.pow(excessMass, CONFIG.MASS_TO_RADIUS_EXP) * 0.95
    );

    const targetSegCount = Math.floor(16 + this.mass * CONFIG.MASS_TO_LENGTH_RATIO);
    const segDist = CONFIG.SEGMENT_DISTANCE;
    const ptSpacing = 2.5;
    const ptsPerSeg = 4;
    const totalPts = targetSegCount * ptsPerSeg;

    // For larger snakes, curve the initial spine so they spawn in a natural posture
    const curveRate = targetSegCount > 35 ? (Math.random() < 0.5 ? 0.006 : -0.006) : 0;
    let curX = this.x;
    let curY = this.y;
    let curAngle = this.angle;

    for (let i = 0; i < totalPts; i++) {
      this.pts.push({
        x: curX,
        y: curY,
        angle: curAngle
      });
      curAngle += curveRate;
      curX -= Math.cos(curAngle) * ptSpacing;
      curY -= Math.sin(curAngle) * ptSpacing;
    }

    // Reverse initial points so oldest tail point is at index 0 and newest head is at the end
    this.pts.reverse();

    const headIdx = this.pts.length - 1;
    for (let i = 0; i < targetSegCount; i++) {
      const ptIndex = Math.max(0, headIdx - i * ptsPerSeg);
      const pt = this.pts[ptIndex];
      const taper = (i > targetSegCount - 8)
        ? Math.max(0.35, (targetSegCount - i) / 8)
        : 1.0;

      this.segments.push({
        x: pt.x,
        y: pt.y,
        radius: this.radius * taper,
        angle: pt.angle,
        _lastQueryId: 0,
        snakeId: this.id,
        isHead: i === 0,
        index: i
      });
    }

    this.score = Math.floor(this.mass * 10 + this.kills * 250);
  }

  update(dt, foodManager, particleManager, soundEngine) {
    if (this.dead) return;

    this.timeAlive += dt;
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
    }

    if (isNaN(this.mass) || this.mass < 1) {
      this.mass = CONFIG.START_MASS;
    }

    // 1. Calculate dynamic radius based on excess mass (natural, non-ballooning growth)
    const excessMass = Math.max(0, this.mass - CONFIG.START_MASS);
    this.radius = Math.min(
      CONFIG.MAX_RADIUS,
      CONFIG.BASE_RADIUS + Math.pow(excessMass, CONFIG.MASS_TO_RADIUS_EXP) * 0.95
    );

    // 2. Boosting mechanics
    const canBoost = this.isBoosting && this.mass > CONFIG.MIN_BOOST_MASS;
    const currentSpeed = canBoost ? CONFIG.BOOST_SPEED : CONFIG.BASE_SPEED;
    this.speed += (currentSpeed - this.speed) * Math.min(1, 10 * dt);

    if (canBoost) {
      // Consume mass
      this.mass = Math.max(CONFIG.MIN_BOOST_MASS, this.mass - CONFIG.BOOST_MASS_RATE * dt);

      // Spawn boost drop food and particles behind tail
      this.boostTimer += dt;
      if (this.boostTimer >= CONFIG.BOOST_DROP_INTERVAL) {
        this.boostTimer = 0;
        const tail = this.segments[this.segments.length - 1];
        if (tail) {
          foodManager.spawnBoostDrop(tail.x, tail.y, this.skin.primary);
        }
      }

      if (particleManager && this.segments.length > 0) {
        const tail = this.segments[this.segments.length - 1];
        particleManager.spawnBoostParticle(tail.x, tail.y, tail.angle, this.skin.glow);
      }

      if (this.isPlayer && soundEngine) {
        soundEngine.startBoost();
      }
    } else {
      this.boostTimer = 0;
      if (this.isPlayer && soundEngine) {
        soundEngine.stopBoost();
      }
    }

    // 3. Smooth steering interpolation with close-cursor turning boost
    const turnScale = Math.max(0.55, 1 - (this.radius - CONFIG.BASE_RADIUS) * 0.012);
    let turnSpeed = CONFIG.BASE_TURN_SPEED * turnScale;

    // Tight coiling boost when player holds cursor close to head
    if (this.isPlayer && this.distToCursor < 120) {
      const closeFactor = Math.max(0, 1 - this.distToCursor / 120);
      turnSpeed += closeFactor * 3.6; // Up to 9.1 rad/s for tight spirals/coiling
    }

    const maxTurn = turnSpeed * dt;
    const angleDiff = normalizeAngle(this.targetAngle - this.angle);
    const turnAmount = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxTurn);
    this.currentTurnRate = Math.abs(turnAmount) / (maxTurn || 1);

    // 4. Move head forward and append to trajectory history using sub-step integration
    const moveDist = this.speed * dt;
    const ptSpacing = 2.5;
    const ptsPerSeg = 4;
    const steps = Math.max(1, Math.round(moveDist / ptSpacing));
    const stepDist = moveDist / steps;
    const stepTurn = turnAmount / steps;

    for (let s = 0; s < steps; s++) {
      this.angle += stepTurn;
      this.x += Math.cos(this.angle) * stepDist;
      this.y += Math.sin(this.angle) * stepDist;
      this.pts.push({
        x: this.x,
        y: this.y,
        angle: this.angle
      });
    }

    // 5. Constrain history length to desired snake length (tail only trims when history exceeds max).
    // Instead of splice(0, n) — which is O(n) — we advance a start-index pointer (ring-buffer style).
    // The backing array is only compacted (sliced once) when the start pointer drifts past maxPts,
    // which happens far less frequently than every frame.
    const targetSegCount = Math.floor(16 + this.mass * CONFIG.MASS_TO_LENGTH_RATIO);
    const maxPts = targetSegCount * ptsPerSeg;

    const ptsLen = this.pts.length - this.ptsStart;
    const excess = ptsLen - maxPts;
    if (excess > 40) {
      this.ptsStart += excess;
      // Compact the backing array when the wasted prefix exceeds maxPts to prevent
      // unbounded memory growth. This O(n) copy happens only once every ~maxPts frames.
      if (this.ptsStart > maxPts) {
        this.pts = this.pts.slice(this.ptsStart);
        this.ptsStart = 0;
      }
    }

    // 6. Update segments from trajectory history (tail stays still when growing!)
    const activePtsLen = this.pts.length - this.ptsStart;
    const actualSegCount = Math.min(targetSegCount, Math.floor(activePtsLen / ptsPerSeg) + 1);

    while (this.segments.length < actualSegCount) {
      const idx = this.segments.length;
      this.segments.push({
        x: this.x,
        y: this.y,
        radius: this.radius,
        angle: this.angle,
        _lastQueryId: 0,
        snakeId: this.id,
        isHead: idx === 0,
        index: idx
      });
    }
    while (this.segments.length > actualSegCount && this.segments.length > 15) {
      this.segments.pop();
    }

    const headIdx = this.pts.length - 1;
    for (let i = 0; i < this.segments.length; i++) {
      // Clamp at ptsStart so we never read from the logically-trimmed prefix
      const ptIndex = Math.max(this.ptsStart, headIdx - i * ptsPerSeg);
      const pt = this.pts[ptIndex];
      const cur = this.segments[i];

      cur.x = pt.x;
      cur.y = pt.y;
      cur.angle = pt.angle;
      cur.index = i;
      cur.isHead = i === 0;

      // Actual tapered radius: visual AND collision match 100%!
      const taper = (i > this.segments.length - 8)
        ? Math.max(0.35, (this.segments.length - i) / 8)
        : 1.0;
      cur.radius = this.radius * taper;
    }


    // 7. Update wiggle phase
    const wiggleSpeed = (this.speed / CONFIG.BASE_SPEED) * 12;
    this.wigglePhase += wiggleSpeed * dt;

    // Score calculation
    this.score = Math.floor(this.mass * 10 + this.kills * 250);
  }

  // Check and consume nearby food orbs
  eatFood(foodManager, soundEngine, particleManager) {
    if (this.dead) return;

    const eatRadius = this.radius + 10;
    const nearby = foodManager.spatialGrid.queryCircle(this.x, this.y, eatRadius);

    for (let i = 0; i < nearby.length; i++) {
      const food = nearby[i];
      if (food.eaten) continue;

      const dx = this.x - food.x;
      const dy = this.y - food.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= this.radius + food.radius + 2) {
        food.eaten = true;
        const foodMass = (typeof food.mass === 'number' && !isNaN(food.mass)) ? food.mass : 0.45;
        this.mass = (isNaN(this.mass) ? CONFIG.START_MASS : this.mass) + foodMass;
        this.foodEatenCount++;

        if (this.isPlayer && soundEngine) {
          if (food.type === 'prey') {
            soundEngine.playPreyCaught();
          } else {
            soundEngine.playEat(foodMass);
          }
        }

        if (particleManager) {
          particleManager.spawnEatSparkle(food.x, food.y, food.color || '#00f3ff');
        }
      }
    }
  }

  // Check collision against world boundary and other snakes.
  // snakeMap: Map<id, Snake> built once per frame in Game.update() for O(1) lookups.
  checkCollisions(allSnakes, spatialGrid, soundEngine, particleManager, foodManager, snakeMap) {
    if (this.dead) return false;

    // 1. Boundary check: World is a circle (boundary always kills)
    const distFromCenter = Math.hypot(this.x, this.y);
    if (distFromCenter + this.radius >= CONFIG.WORLD_RADIUS) {
      this.die(foodManager, particleManager, soundEngine);
      return true;
    }

    // Spawn protection: immune to enemy snake collisions
    if (this.invulnerableTimer > 0) return false;

    // 2. Head-to-body collision against other snakes
    // Query spatial grid around this snake's head
    const checkRadius = this.radius * 1.1;
    const candidates = spatialGrid.queryCircle(this.x, this.y, checkRadius + CONFIG.MAX_RADIUS);

    const resolvedSnakeMap = snakeMap || (allSnakes ? new Map(allSnakes.map(s => [s.id, s])) : new Map());

    for (let i = 0; i < candidates.length; i++) {
      const seg = candidates[i];
      // Skip non-segments (e.g. food) or own segments (safe self-coiling!)
      if (seg.snakeId === undefined || seg.snakeId === this.id) continue;

      // O(1) lookup via pre-built map rather than O(n) allSnakes.find()
      const otherSnake = resolvedSnakeMap.get(seg.snakeId);
      if (!otherSnake || otherSnake.dead || otherSnake.invulnerableTimer > 0) continue;

      // Head-to-head collision against enemy head
      if (seg.isHead) {
        const headDist = Math.hypot(this.x - otherSnake.x, this.y - otherSnake.y);
        if (headDist < this.radius + otherSnake.radius) {
          if (this.mass < otherSnake.mass) {
            otherSnake.kills++;
            this.die(foodManager, particleManager, soundEngine);
            return true;
          } else if (this.mass === otherSnake.mass) {
            // Equal mass: mutual destruction
            this.die(foodManager, particleManager, soundEngine);
            otherSnake.die(foodManager, particleManager, soundEngine);
            return true;
          }
        }
        continue;
      }

      // Check distance from head to body segment
      const dx = this.x - seg.x;
      const dy = this.y - seg.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.radius * 0.85 + seg.radius * 0.85) {
        // Attribute kill to otherSnake
        otherSnake.kills++;
        if (otherSnake.isPlayer && soundEngine) {
          soundEngine.playKill();
        }

        this.die(foodManager, particleManager, soundEngine);
        return true;
      }
    }

    return false;
  }

  die(foodManager, particleManager, soundEngine) {
    if (this.dead) return;
    this.dead = true;

    if (this.isPlayer && soundEngine) {
      soundEngine.stopBoost();
      soundEngine.playDeath();
    }

    // Drop mass as glowing food orbs along spine
    foodManager.spawnDeathDrops(this.segments, this.skin.primary);

    // Dramatic death shockwave & debris
    if (particleManager) {
      particleManager.spawnDeathExplosion(this.x, this.y, this.skin.primary, this.radius);
    }
  }

  // Render snake with animated eyes, expressive skins, and slither wiggle
  draw(ctx, minX, minY, maxX, maxY) {
    if (this.dead || this.segments.length === 0) return;

    // Viewport bounds check for the entire snake
    const margin = this.radius * 3;
    let anyVisible = false;
    for (let i = 0; i < this.segments.length; i += 4) {
      const s = this.segments[i];
      if (s.x >= minX - margin && s.x <= maxX + margin && s.y >= minY - margin && s.y <= maxY + margin) {
        anyVisible = true;
        break;
      }
    }
    if (!anyVisible) return;

    ctx.save();

    // 1. Draw body segments from tail to head (index 0 is the head, drawn separately)
    // Turn-damped wiggle: when spiralling/turning, wiggle flattens to 0 so all segments stay strictly within the spiral
    const turnDamping = Math.max(0, 1 - (this.currentTurnRate || 0) * 1.8);
    const wiggleAmp = Math.min(5, 1.8 + (this.speed / CONFIG.BASE_SPEED) * 1.5) * turnDamping;

    for (let i = this.segments.length - 1; i >= 1; i--) {
      const seg = this.segments[i];

      // Slither wave displacement perpendicular to movement
      const perpAngle = seg.angle + Math.PI / 2;
      const waveFactor = Math.min(1, i / 6);
      const wiggleOffset = Math.sin(this.wigglePhase - i * 0.32) * wiggleAmp * waveFactor;
      const drawX = seg.x + Math.cos(perpAngle) * wiggleOffset;
      const drawY = seg.y + Math.sin(perpAngle) * wiggleOffset;

      // Segment radius matches collision radius exactly
      drawSkinSegment(
        ctx, drawX, drawY, seg.radius,
        this.skin, i, this.segments.length,
        this.wigglePhase, seg.angle, perpAngle
      );
    }

    // 2. Draw head & expressive animated eyes
    this.drawHead(ctx);

    // 3. Draw nametag above head
    this.drawNameTag(ctx);

    ctx.restore();
  }

  drawHead(ctx) {
    const head = this.segments[0];
    const headRadius = this.radius * 1.08;

    // Spawn protection shield effect
    if (this.invulnerableTimer > 0) {
      ctx.save();
      const pulse = 1 + Math.sin(this.timeAlive * 12) * 0.1;
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 14;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -this.timeAlive * 28;
      ctx.beginPath();
      ctx.arc(head.x, head.y, headRadius * 1.45 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Head base circle
    ctx.fillStyle = this.skin.primary;
    ctx.shadowColor = this.skin.glow;
    ctx.shadowBlur = this.isBoosting ? 18 : 8;
    ctx.beginPath();
    ctx.arc(head.x, head.y, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eye sockets placement relative to head angle
    const eyeForwardOffset = headRadius * 0.38;
    const eyeLateralOffset = headRadius * 0.55;
    const eyeRadius = Math.max(3.5, headRadius * 0.36);

    const perpAngle = this.angle + Math.PI / 2;
    const fwdX = Math.cos(this.angle) * eyeForwardOffset;
    const fwdY = Math.sin(this.angle) * eyeForwardOffset;
    const latX = Math.cos(perpAngle) * eyeLateralOffset;
    const latY = Math.sin(perpAngle) * eyeLateralOffset;

    const leftEyeX = head.x + fwdX + latX;
    const leftEyeY = head.y + fwdY + latY;
    const rightEyeX = head.x + fwdX - latX;
    const rightEyeY = head.y + fwdY - latY;

    // Eye whites
    ctx.fillStyle = this.skin.eyeColor || '#ffffff';
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
    ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Pupil dilation: pupils expand during boost
    const pupilRadius = this.isBoosting ? eyeRadius * 0.65 : eyeRadius * 0.48;

    // Pupils look in the target angle / look direction
    const lookDiff = normalizeAngle(this.targetAngle - this.angle);
    const lookAngle = this.angle + lookDiff * 0.7;

    const lookDist = eyeRadius * 0.35;
    const pupilOffX = Math.cos(lookAngle) * lookDist;
    const pupilOffY = Math.sin(lookAngle) * lookDist;

    ctx.fillStyle = this.skin.pupilColor || '#000000';
    ctx.beginPath();
    ctx.arc(leftEyeX + pupilOffX, leftEyeY + pupilOffY, pupilRadius, 0, Math.PI * 2);
    ctx.arc(rightEyeX + pupilOffX, rightEyeY + pupilOffY, pupilRadius, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle reflection dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(leftEyeX + pupilOffX - pupilRadius * 0.35, leftEyeY + pupilOffY - pupilRadius * 0.35, pupilRadius * 0.35, 0, Math.PI * 2);
    ctx.arc(rightEyeX + pupilOffX - pupilRadius * 0.35, rightEyeY + pupilOffY - pupilRadius * 0.35, pupilRadius * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  drawNameTag(ctx) {
    const head = this.segments[0];
    const tagY = head.y - this.radius - 14;

    ctx.save();
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Background tag pill
    const metrics = ctx.measureText(this.name);
    const tagWidth = metrics.width + 14;
    const tagHeight = 18;

    ctx.fillStyle = 'rgba(10, 15, 25, 0.72)';
    ctx.beginPath();
    ctx.roundRect(head.x - tagWidth / 2, tagY - tagHeight / 2, tagWidth, tagHeight, 6);
    ctx.fill();

    // Player vs Bot text color
    ctx.fillStyle = this.isPlayer ? '#00f3ff' : '#ffffff';
    ctx.fillText(this.name, head.x, tagY);
    ctx.restore();
  }
}
