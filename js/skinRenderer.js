// Skin segment renderer: outer sphere, procedural pattern overlays, and 3D specular highlight.
// Shared between the in-game snake renderer and the menu skin-preview canvas.

export function drawSkinSegment(ctx, x, y, radius, skin, index, totalSegments, phase = 0, angle = 0, perpAngle = Math.PI / 2) {
  const pattern = skin.pattern || 'stripes';
  const secColor = skin.secondary || skin.primary;
  const accentColor = skin.accent || secColor;

  let segColor = skin.primary;
  let drawDot = false;
  let drawSpine = false;
  let drawScales = false;
  let drawNeonRim = false;

  if (pattern === 'stripes') {
    segColor = (Math.floor(index / 2) % 2 === 0) ? skin.primary : secColor;
  } else if (pattern === 'candy') {
    segColor = (index % 2 === 0) ? skin.primary : secColor;
  } else if (pattern === 'rings') {
    segColor = (index % 4 === 0) ? secColor : skin.primary;
  } else if (pattern === 'tricolor') {
    const mod = index % 3;
    segColor = mod === 0 ? skin.primary : (mod === 1 ? secColor : accentColor);
  } else if (pattern === 'gradient') {
    const t = index / totalSegments;
    segColor = t < 0.4 ? skin.primary : (t < 0.75 ? secColor : accentColor);
  } else if (pattern === 'rainbow') {
    const hue = (phase * 25 + index * 9) % 360;
    segColor = `hsl(${hue}, 95%, 55%)`;
  } else if (pattern === 'dots') {
    segColor = skin.primary;
    drawDot = (index % 2 === 0);
  } else if (pattern === 'spine') {
    segColor = skin.primary;
    drawSpine = true;
  } else if (pattern === 'scales') {
    segColor = (index % 2 === 0) ? skin.primary : secColor;
    drawScales = true;
  } else if (pattern === 'neon-rim') {
    drawNeonRim = true;
    segColor = skin.primary;
  }

  // Draw segment outer body
  ctx.fillStyle = segColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Distinctive pattern detail overlays
  if (drawNeonRim) {
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.66, 0, Math.PI * 2);
    ctx.fill();
  } else if (drawDot) {
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();
  } else if (drawSpine) {
    ctx.fillStyle = secColor;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();
  } else if (drawScales) {
    ctx.fillStyle = accentColor;
    const scaleR = radius * 0.52;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * scaleR, y + Math.sin(angle) * scaleR);
    ctx.lineTo(x + Math.cos(perpAngle) * (scaleR * 0.65), y + Math.sin(perpAngle) * (scaleR * 0.65));
    ctx.lineTo(x - Math.cos(angle) * scaleR, y - Math.sin(angle) * scaleR);
    ctx.lineTo(x - Math.cos(perpAngle) * (scaleR * 0.65), y - Math.sin(perpAngle) * (scaleR * 0.65));
    ctx.closePath();
    ctx.fill();
  }

  // Soft center highlight for 3D sphere illusion
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.beginPath();
  ctx.arc(x - radius * 0.22, y - radius * 0.22, radius * 0.44, 0, Math.PI * 2);
  ctx.fill();
}
