// Verify new balanced growth rate, expanded space, and reduced food density in Chrome
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

  console.log('Starting game to check balance...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('play-btn').click();`
  });

  await new Promise(r => setTimeout(r, 1200));

  // Inspect state
  const metrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const g = window.slitherGame;
      const p = g.player;
      const visibleFoods = g.foodManager.spatialGrid.queryRect(
        g.renderer.viewport.minX,
        g.renderer.viewport.minY,
        g.renderer.viewport.maxX,
        g.renderer.viewport.maxY
      );

      return {
        worldRadius: g.config?.WORLD_RADIUS || 5200,
        playerMass: Math.round(p.mass),
        playerRadius: Math.round(p.radius),
        playerSegments: p.segments.length,
        cameraZoom: Math.round(g.renderer.zoom * 100) / 100,
        viewportWidth: Math.round(g.renderer.viewport.maxX - g.renderer.viewport.minX),
        viewportHeight: Math.round(g.renderer.viewport.maxY - g.renderer.viewport.minY),
        totalFoods: g.foodManager.foods.length,
        visibleFoodCount: visibleFoods.length,
        botsLiving: g.snakes.filter(s => !s.dead).length
      };
    })()`,
    returnByValue: true
  });

  console.log('Game Balance Metrics:', JSON.stringify(metrics.result.value, null, 2));

  // Simulate 3 seconds of forward slither
  await new Promise(r => setTimeout(r, 2000));

  const afterMove = await send('Runtime.evaluate', {
    expression: `(() => {
      const g = window.slitherGame;
      const p = g.player;
      return {
        playerMass: Math.round(p.mass),
        playerSegments: p.segments.length,
        playerRadius: Math.round(p.radius),
        foodEaten: p.foodEatenCount
      };
    })()`,
    returnByValue: true
  });

  console.log('After 2s cruising:', JSON.stringify(afterMove.result.value, null, 2));

  // Take screenshot
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshot && screenshot.data) {
    fs.writeFileSync('balanced_gameplay.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to balanced_gameplay.png');
  }

  process.exit(0);
}

main().catch(console.error);
