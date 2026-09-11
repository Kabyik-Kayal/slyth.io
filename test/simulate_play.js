// Simulate user playing the game and take screenshots / check diagnostics
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
    console.error('Page not found');
    return;
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

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description));
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
    }
  });

  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Clicking PLAY NOW...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('play-btn').click();
      })()
    `
  });

  // Wait 1 second
  await new Promise(r => setTimeout(r, 1000));

  // Check state after 1 sec
  let status = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const g = window.slitherGame;
        return {
          state: g.state,
          playerDead: g.player ? g.player.dead : null,
          playerPos: g.player ? { x: Math.round(g.player.x), y: Math.round(g.player.y), angle: g.player.angle } : null,
          playerMass: g.player ? Math.round(g.player.mass) : null,
          playerLength: g.player ? g.player.segments.length : null,
          snakesLiving: g.snakes.filter(s => !s.dead).length,
          snakesDead: g.snakes.filter(s => s.dead).length,
          camera: { x: Math.round(g.renderer.cameraX), y: Math.round(g.renderer.cameraY), zoom: g.renderer.zoom }
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Status after 1s:', status.result.value);

  // Simulate mouse moving in a circle to steer
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const mx = 382 + Math.cos(angle) * 150;
    const my = 242 + Math.sin(angle) * 150;

    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const g = window.slitherGame;
          g.mouseX = ${mx};
          g.mouseY = ${my};
          g.updatePlayerTargetAngle();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 100));
  }

  // Check state after 3 sec
  status = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const g = window.slitherGame;
        return {
          state: g.state,
          playerDead: g.player ? g.player.dead : null,
          playerPos: g.player ? { x: Math.round(g.player.x), y: Math.round(g.player.y), angle: g.player.angle } : null,
          playerMass: g.player ? Math.round(g.player.mass) : null,
          playerLength: g.player ? g.player.segments.length : null,
          snakesLiving: g.snakes.filter(s => !s.dead).length,
          snakesDead: g.snakes.filter(s => s.dead).length,
          camera: { x: Math.round(g.renderer.cameraX), y: Math.round(g.renderer.cameraY), zoom: g.renderer.zoom }
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Status after 3s steering:', status.result.value);

  // Take a screenshot
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshot && screenshot.data) {
    fs.writeFileSync('game_screenshot.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to game_screenshot.png');
  }

  process.exit(0);
}

main().catch(console.error);
