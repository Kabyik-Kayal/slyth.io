// Simulate player spiralling/coiling in Chrome and verify body segment containment
import http from 'http';
import fs from 'fs';

async function main() {
  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = targets.find(t => t.title.includes('Slither'));
  if (!page) {
    console.error('Slither page not found');
    process.exit(1);
  }

  const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => ws.addEventListener('open', resolve));

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Starting game...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('play-btn').click();`
  });

  await new Promise(r => setTimeout(r, 600));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const g = window.slitherGame;
      g.player.mass = 120;
      g.player.invulnerableTimer = 100;
    })()`
  });

  console.log('Simulating spiral coiling steering...');
  const center = await send('Runtime.evaluate', {
    expression: `({ cx: window.innerWidth / 2, cy: window.innerHeight / 2 })`,
    returnByValue: true
  });
  const { cx, cy } = center.result.value;

  for (let round = 0; round < 3; round++) {
    for (let step = 0; step < 24; step++) {
      const angle = (step / 24) * Math.PI * 2;
      const mx = cx + Math.cos(angle) * 75;
      const my = cy + Math.sin(angle) * 75;

      await send('Runtime.evaluate', {
        expression: `(() => {
          const g = window.slitherGame;
          g.mouseX = ${mx};
          g.mouseY = ${my};
          g.updatePlayerTargetAngle();
        })()`
      });
      await new Promise(r => setTimeout(r, 50));
    }
  }

  const diag = await send('Runtime.evaluate', {
    expression: `(() => {
      const g = window.slitherGame;
      const p = g.player;
      const segs = p.segments;
      let sumX = 0, sumY = 0;
      for (let s of segs) { sumX += s.x; sumY += s.y; }
      const avgX = sumX / segs.length;
      const avgY = sumY / segs.length;
      const dists = segs.map((s, idx) => ({
        idx,
        dist: Math.round(Math.hypot(s.x - avgX, s.y - avgY)),
        radius: Math.round(s.radius)
      }));
      const maxDist = Math.max(...dists.map(d => d.dist));
      const minDist = Math.min(...dists.map(d => d.dist));
      return {
        segCount: segs.length,
        turnRate: p.currentTurnRate,
        centerDistMin: minDist,
        centerDistMax: maxDist,
        coilSpread: maxDist - minDist,
        sampleSegments: [dists[0], dists[10], dists[20], dists[30], dists[dists.length - 1]]
      };
    })()`,
    returnByValue: true
  });

  console.log('Spiral Diagnostics:', JSON.stringify(diag.result.value, null, 2));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshot && screenshot.data) {
    fs.writeFileSync('spiral_screenshot.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved spiral screenshot to spiral_screenshot.png');
  }

  process.exit(0);
}

main().catch(console.error);
