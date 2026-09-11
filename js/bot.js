// AI Bot Controller: Feeler Raycasting, Sprint Cut-Offs, Encirclement Coiling, Head Ramming, and Feast Sprinting
import { CONFIG, BOT_PERSONALITIES, normalizeAngle } from './config.js';
import { Snake } from './snake.js';

export class BotSnake extends Snake {
  constructor(id, name, x, y, skinId, personalityType = 'HUNTER') {
    super(id, name, x, y, skinId, false);

    this.personality = BOT_PERSONALITIES[personalityType] || BOT_PERSONALITIES.HUNTER;
    this.personalityType = personalityType;

    // AI decision & tactical state
    this.decisionTimer = 0;
    this.huntTarget = null;
    this.wanderAngle = this.angle;
    this.wanderTimer = 0;
    this.tacticalMode = 'WANDER'; // 'CUT_OFF', 'COIL', 'HEAD_JOUST', 'FEAST', 'WANDER'
    this.cutOffTimer = 0;
    this._scratchCandidates = [];
  }

  // snakeMap: Map<id, Snake> built once per frame in Game.update() for O(1) lookups.
  updateAI(dt, allSnakes, foodManager, spatialGrid, snakeMap) {
    if (this.dead) return;

    this.decisionTimer -= dt;
    this.wanderTimer -= dt;
    if (this.cutOffTimer > 0) this.cutOffTimer -= dt;

    // 1. Boundary Safety Check (World Perimeter)
    const distFromCenter = Math.hypot(this.x, this.y);
    if (distFromCenter > CONFIG.WORLD_RADIUS - CONFIG.BOT_BOUNDARY_WARN_DIST) {
      const toCenter = Math.atan2(-this.y, -this.x);
      this.targetAngle = toCenter + (Math.random() - 0.5) * 0.4;
      this.isBoosting = false;
      this.tacticalMode = 'WANDER';
      return;
    }

    // 2. Sensory Feeler Emergency Collision Avoidance
    const avoidance = this.evaluateSensoryFeelers(spatialGrid, snakeMap);
    if (avoidance.danger) {
      this.targetAngle = avoidance.suggestedAngle;
      // Boost only if urgent escape needed and not cutting into another wall
      if (avoidance.highDanger && this.mass > 25 && Math.random() < this.personality.boostChance) {
        this.isBoosting = true;
      } else {
        this.isBoosting = false;
      }
      return;
    }

    // 3. Reactive Defense: Detect when an enemy is attempting to cut us off!
    const defense = this.detectIncomingCutOff(allSnakes);
    if (defense.threat) {
      this.targetAngle = defense.evasiveAngle;
      this.isBoosting = false; // Tap the brakes so the attacker overshoots!
      return;
    }

    // 4. Tactical Action Selection
    if (this.decisionTimer <= 0) {
      this.decisionTimer = 0.12 + Math.random() * 0.14; // Fast tactical refresh
      this.evaluateTactics(allSnakes, foodManager, spatialGrid);
    }
  }

  // Cast 5 ray feelers forward to detect real obstacles (enemy bodies, walls).
  // snakeMap: Map<id, Snake> for O(1) id->snake lookup inside the tight feeler loop.
  evaluateSensoryFeelers(spatialGrid, snakeMap) {
    const feelerDist = this.personality.feelerLength + this.radius * 1.2;
    const feelerAngles = [
      0,                  // Center
      -Math.PI * 0.14,    // Mid-left (~25 deg)
      Math.PI * 0.14,     // Mid-right (~25 deg)
      -Math.PI * 0.32,    // Wide-left (~58 deg)
      Math.PI * 0.32      // Wide-right (~58 deg)
    ];

    let leftPressure = 0;
    let rightPressure = 0;
    let dangerFound = false;
    let highDanger = false;

    for (let f = 0; f < feelerAngles.length; f++) {
      const rayAngle = this.angle + feelerAngles[f];
      const rayEndX = this.x + Math.cos(rayAngle) * feelerDist;
      const rayEndY = this.y + Math.sin(rayAngle) * feelerDist;

      // Arena boundary danger
      const endDistFromCenter = Math.hypot(rayEndX, rayEndY);
      if (endDistFromCenter >= CONFIG.WORLD_RADIUS - CONFIG.BOT_FEELER_BOUNDARY_MARGIN) {
        dangerFound = true;
        highDanger = true;
        if (feelerAngles[f] < 0) leftPressure += 3.5;
        else if (feelerAngles[f] > 0) rightPressure += 3.5;
        else {
          leftPressure += 2.0;
          rightPressure += 2.0;
        }
      }

      // Check segments along feeler
      const samplePoints = 3;
      for (let s = 1; s <= samplePoints; s++) {
        const sampleDist = (feelerDist / samplePoints) * s;
        const sx = this.x + Math.cos(rayAngle) * sampleDist;
        const sy = this.y + Math.sin(rayAngle) * sampleDist;

        this._scratchCandidates.length = 0;
        spatialGrid.queryCircle(sx, sy, this.radius + 12, this._scratchCandidates);
        for (let c = 0; c < this._scratchCandidates.length; c++) {
          const item = this._scratchCandidates[c];
          if (item.snakeId === undefined || item.snakeId === this.id) continue;

          // If the item is an enemy HEAD:
          if (item.isHead) {
            // O(1) lookup via pre-built map rather than O(n) allSnakes.find()
            const otherSnake = snakeMap.get(item.snakeId);
            // If our mass is larger by 15%, head-on collision favors us!
            if (otherSnake && this.mass > otherSnake.mass * 1.15) {
              // Not a deterrent! Head-to-head collision will kill the smaller snake.
              continue;
            }
          }

          // Real lethal body segment in trajectory!
          dangerFound = true;
          const threatWeight = (samplePoints - s + 1) * 2.2;
          if (s === 1) highDanger = true;

          if (feelerAngles[f] < 0) {
            leftPressure += threatWeight;
          } else if (feelerAngles[f] > 0) {
            rightPressure += threatWeight;
          } else {
            leftPressure += threatWeight * 0.6;
            rightPressure += threatWeight * 0.6;
          }
        }
      }
    }

    if (!dangerFound) {
      return { danger: false };
    }

    let steerDelta = 0;
    if (leftPressure > rightPressure) {
      steerDelta = Math.PI * 0.52; // Hard steer right
    } else if (rightPressure > leftPressure) {
      steerDelta = -Math.PI * 0.52; // Hard steer left
    } else {
      steerDelta = (Math.random() < 0.5 ? 1 : -1) * Math.PI * 0.6;
    }

    return {
      danger: true,
      highDanger,
      suggestedAngle: this.angle + steerDelta
    };
  }

  // Detect when another snake is boosting across our nose to cut us off
  detectIncomingCutOff(allSnakes) {
    for (let i = 0; i < allSnakes.length; i++) {
      const other = allSnakes[i];
      if (other.id === this.id || other.dead || other.invulnerableTimer > 0) continue;

      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < CONFIG.BOT_CUT_OFF_DETECT_DIST && other.isBoosting) {
        // Angle to other snake's head
        const angleToOther = Math.atan2(dy, dx);
        const relAngle = normalizeAngle(angleToOther - this.angle);

        // Is the enemy in front of us (within 60 degrees) and heading across?
        if (Math.abs(relAngle) < Math.PI * 0.35) {
          const cross = dx * Math.sin(other.angle) - dy * Math.cos(other.angle);
          // Evasive turn inside
          const evasiveDelta = cross > 0 ? -Math.PI * 0.55 : Math.PI * 0.55;
          return {
            threat: true,
            evasiveAngle: this.angle + evasiveDelta
          };
        }
      }
    }
    return { threat: false };
  }

  // Tactical combat evaluator
  evaluateTactics(allSnakes, foodManager, spatialGrid) {
    // 1. Opportunistic Feast Rush: Sprint to high-energy death drops
    const deathDropCluster = this.findDeathDropCluster(foodManager);
    if (deathDropCluster && (this.personality.foodAttraction >= 1.0 || Math.random() < 0.6)) {
      this.targetAngle = Math.atan2(deathDropCluster.y - this.y, deathDropCluster.x - this.x);
      this.isBoosting = deathDropCluster.dist > 60 && deathDropCluster.dist < CONFIG.BOT_FEAST_SEARCH_RADIUS && this.mass > 25;
      this.tacticalMode = 'FEAST';
      return;
    }

    // 2. Sprint Cut-Off Kill (Aggressively hunt and assassinate other snakes!)
    if (this.personality.huntingAggression > 0.6 && this.mass > 22) {
      const prey = this.findHuntingTarget(allSnakes);
      if (prey) {
        const distToPrey = Math.hypot(prey.x - this.x, prey.y - this.y);

        // Head-to-Head Joust: If we are bigger by 35% and close, ram straight at their face!
        if (this.mass > prey.mass * 1.35 && distToPrey < CONFIG.BOT_HEAD_JOUST_DIST) {
          this.targetAngle = Math.atan2(prey.y - this.y, prey.x - this.x);
          this.isBoosting = this.mass > 25;
          this.tacticalMode = 'HEAD_JOUST';
          return;
        }

        // Precision Sprint Cut-Off
        const leadDist = Math.max(70, Math.min(CONFIG.BOT_HEAD_JOUST_DIST, prey.speed * 0.7));
        const predX = prey.x + Math.cos(prey.angle) * leadDist;
        const predY = prey.y + Math.sin(prey.angle) * leadDist;

        // Cut across the victim's nose
        const cross = (this.x - prey.x) * Math.sin(prey.angle) - (this.y - prey.y) * Math.cos(prey.angle);
        const cutSide = cross >= 0 ? -1 : 1;
        const offset = this.radius * 1.4 + prey.radius * 1.2;
        const cutTargetX = predX + cutSide * Math.sin(prey.angle) * offset;
        const cutTargetY = predY - cutSide * Math.cos(prey.angle) * offset;

        this.targetAngle = Math.atan2(cutTargetY - this.y, cutTargetX - this.x);

        // Sprint boost when close enough to shut the trap
        if (distToPrey < CONFIG.BOT_CUT_OFF_MAX_DIST && distToPrey > CONFIG.BOT_CUT_OFF_MIN_DIST && Math.random() < this.personality.boostChance) {
          this.isBoosting = true;
          this.cutOffTimer = 0.5;
        } else if (this.cutOffTimer <= 0) {
          this.isBoosting = false;
        }

        this.tacticalMode = 'CUT_OFF';
        return;
      }
    }

    // 3. Encirclement Death Spiral (Coiler / Titan tactics)
    if (this.mass > CONFIG.BOT_COIL_MIN_MASS && (this.personalityType === 'COILER' || this.mass > 250)) {
      const coilPrey = this.findCoilTarget(allSnakes);
      if (coilPrey) {
        const angleToVictim = Math.atan2(coilPrey.y - this.y, coilPrey.x - this.x);
        // Tangential inward spiral (~75 degrees off victim center)
        const orbitDir = (this.id.charCodeAt(0) % 2 === 0) ? 1 : -1;
        this.targetAngle = angleToVictim + orbitDir * (Math.PI * 0.5 + 0.22);
        this.isBoosting = this.mass > 50 && Math.random() < 0.4;
        this.tacticalMode = 'COIL';
        return;
      }
    }

    // 4. Default: Wander and forage ambient food / firefly prey
    const bestFood = this.findBestFood(foodManager);
    if (bestFood && bestFood.dist < CONFIG.BOT_FOOD_SEARCH_RADIUS) {
      this.targetAngle = Math.atan2(bestFood.y - this.y, bestFood.x - this.x);
      this.isBoosting = false;
      this.tacticalMode = 'WANDER';
      return;
    }

    if (this.wanderTimer <= 0) {
      this.wanderTimer = 1.0 + Math.random() * 2.0;
      this.wanderAngle = this.angle + (Math.random() - 0.5) * 1.0;
    }
    this.targetAngle = this.wanderAngle;
    this.isBoosting = false;
    this.tacticalMode = 'WANDER';
  }

  // Find nearest high-value death drop cluster
  findDeathDropCluster(foodManager) {
    let best = null;
    let highestValue = 0;
    const nearby = foodManager.spatialGrid.queryCircle(this.x, this.y, CONFIG.BOT_FEAST_SEARCH_RADIUS);

    for (let i = 0; i < nearby.length; i++) {
      const f = nearby[i];
      if (f.eaten || f.mass === undefined) continue;
      if (f.type === 'death' || f.type === 'prey' || f.mass > 1.8) {
        const dist = Math.hypot(f.x - this.x, f.y - this.y);
        const val = (f.mass * 20) / (dist + 30);
        if (val > highestValue) {
          highestValue = val;
          best = { x: f.x, y: f.y, mass: f.mass, dist };
        }
      }
    }
    return best;
  }

  // Find best enemy snake to hunt and kill
  findHuntingTarget(allSnakes) {
    let bestTarget = null;
    let bestScore = -Infinity;

    for (let i = 0; i < allSnakes.length; i++) {
      const other = allSnakes[i];
      if (other.id === this.id || other.dead || other.invulnerableTimer > 0) continue;

      const dist = Math.hypot(other.x - this.x, other.y - this.y);
      if (dist > CONFIG.BOT_HUNT_RADIUS) continue;

      // Calculate vulnerability score:
      // Closer is better; equal or smaller mass is safer; player is a prime target
      let score = (CONFIG.BOT_HUNT_RADIUS - dist) * 1.5;

      if (other.isPlayer) {
        score += 200; // Human player is high-priority target!
      }

      if (other.mass < this.mass) {
        score += 120; // Easy prey
      } else if (other.mass > this.mass * 2.5) {
        // Giant titan: huge reward if we manage a cut-off!
        score += 80;
      }

      if (score > bestScore) {
        bestScore = score;
        bestTarget = other;
      }
    }

    return bestTarget;
  }

  // Find smaller snake to enclose in a death coil
  findCoilTarget(allSnakes) {
    for (let i = 0; i < allSnakes.length; i++) {
      const other = allSnakes[i];
      if (other.id === this.id || other.dead || other.invulnerableTimer > 0) continue;

      if (other.mass < this.mass * 0.5) {
        const dist = Math.hypot(other.x - this.x, other.y - this.y);
        if (dist < CONFIG.BOT_COIL_TARGET_DIST) {
          return other;
        }
      }
    }
    return null;
  }

  // Find ambient food
  findBestFood(foodManager) {
    let best = null;
    let highestScore = -Infinity;
    const nearby = foodManager.spatialGrid.queryCircle(this.x, this.y, CONFIG.BOT_FOOD_SEARCH_RADIUS);

    for (let i = 0; i < nearby.length; i++) {
      const f = nearby[i];
      if (f.eaten || f.mass === undefined) continue;

      const dist = Math.hypot(f.x - this.x, f.y - this.y);
      if (dist < 5) continue;

      const score = (f.mass * 15) / (dist + 25);
      if (score > highestScore) {
        highestScore = score;
        best = { x: f.x, y: f.y, mass: f.mass, dist };
      }
    }
    return best;
  }
}
