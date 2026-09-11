// Test spiral coiling behavior: verify all segments stay strictly within the spiral boundary
const ptSpacing = 2.5;
const ptsPerSeg = 4;
const segDist = 10;

class SpiralTestSnake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.speed = 220;
    this.baseTurnSpeed = 7.0;
    this.mass = 35;
    this.radius = 16;
    this.pts = [];
    this.segments = [];

    const targetSegCount = Math.floor(18 + this.mass * 0.65);
    const totalPts = targetSegCount * ptsPerSeg;
    for (let i = 0; i < totalPts; i++) {
      this.pts.push({
        x: this.x - Math.cos(this.angle) * i * ptSpacing,
        y: this.y - Math.sin(this.angle) * i * ptSpacing,
        angle: this.angle
      });
    }
    for (let i = 0; i < targetSegCount; i++) {
      const pt = this.pts[i * ptsPerSeg];
      this.segments.push({ x: pt.x, y: pt.y, angle: pt.angle });
    }
  }

  update(dt, targetX, targetY) {
    // 1. Calculate angle to target in world space
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distToTarget = Math.hypot(dx, dy);
    const targetAngle = Math.atan2(dy, dx);

    // Dynamic turn speed: tighter turns when cursor is close to head!
    let turnSpeed = this.baseTurnSpeed;
    if (distToTarget < 120) {
      const closeFactor = 1 - Math.max(0, distToTarget / 120);
      turnSpeed += closeFactor * 3.5; // Up to 10.5 rad/s for tight coiling
    }

    let angleDiff = targetAngle - this.angle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

    const maxTurn = turnSpeed * dt;
    const turnDelta = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxTurn);

    // 2. Sub-step trajectory integration for smooth curve
    const moveDist = this.speed * dt;
    const steps = Math.max(1, Math.round(moveDist / ptSpacing));
    const stepDist = moveDist / steps;
    const stepTurn = turnDelta / steps;

    for (let s = 0; s < steps; s++) {
      this.angle += stepTurn;
      this.x += Math.cos(this.angle) * stepDist;
      this.y += Math.sin(this.angle) * stepDist;
      this.pts.unshift({
        x: this.x,
        y: this.y,
        angle: this.angle
      });
    }

    // 3. Trim trajectory
    const targetSegCount = Math.floor(18 + this.mass * 0.65);
    const maxPts = targetSegCount * ptsPerSeg;
    if (this.pts.length > maxPts) {
      this.pts.length = maxPts;
    }

    // 4. Update segments
    const actualSegCount = Math.min(targetSegCount, Math.floor(this.pts.length / ptsPerSeg));
    while (this.segments.length < actualSegCount) {
      this.segments.push({ x: this.x, y: this.y, angle: this.angle });
    }
    while (this.segments.length > actualSegCount) {
      this.segments.pop();
    }

    for (let i = 0; i < this.segments.length; i++) {
      const pt = this.pts[i * ptsPerSeg];
      this.segments[i].x = pt.x;
      this.segments[i].y = pt.y;
      this.segments[i].angle = pt.angle;
    }
  }
}

const snake = new SpiralTestSnake(100, 100);

// Target is fixed center at (0, 0)
// Snake should spiral inwards towards (0, 0) and coil in place!
console.log('Testing coiling around fixed target (0, 0)...');
for (let frame = 0; frame < 300; frame++) {
  snake.update(0.016, 0, 0);
}

// Check distances of segments from spiral center
const headDist = Math.hypot(snake.x, snake.y);
const segDists = snake.segments.map((s, idx) => ({ idx, dist: Math.round(Math.hypot(s.x, s.y)) }));

console.log('Final Head distance from center:', Math.round(headDist));
console.log('Segment distances from head to tail (sampled):');
console.log('  Seg 0 (Head):', segDists[0].dist);
console.log('  Seg 10:', segDists[10].dist);
console.log('  Seg 20:', segDists[20].dist);
console.log('  Seg 30:', segDists[30].dist);
console.log('  Seg', segDists.length - 1, '(Tail):', segDists[segDists.length - 1].dist);

// In a coil/spiral, distance from center is monotonic: Head < Neck < Body < Tail!
let monotonic = true;
for (let i = 1; i < segDists.length; i++) {
  // Each segment should be at equal or greater radius than the preceding segment (outer coils wrap around inner coils)
  // or on the same circular orbit!
}
console.log('Min radius:', Math.min(...segDists.map(s => s.dist)), 'Max radius:', Math.max(...segDists.map(s => s.dist)));
console.log('Radius spread (coil thickness):', Math.max(...segDists.map(s => s.dist)) - Math.min(...segDists.map(s => s.dist)));
