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
    console.error('Slither page not found in targets:', targets);
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

  console.log('Clicking Play...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('play-btn').click();`
  });

  await new Promise(r => setTimeout(r, 1500));

  // Spectate active combatant
  console.log('Moving player near combat action with spawn protection...');
  for (let i = 0; i < 4; i++) {
    await new Promise(r => setTimeout(r, 600));
    await send('Runtime.evaluate', {
      expression: `(() => {
        const g = window.slitherGame;
        if (g.player) {
          g.player.spawnProtection = 15;
          const hunter = g.snakes.find(s => !s.isPlayer && !s.dead && s.mass > 120);
          if (hunter) {
            g.player.x = hunter.x - 220;
            g.player.y = hunter.y - 140;
            g.player.angle = Math.atan2(hunter.y - g.player.y, hunter.x - g.player.x);
            g.updatePlayerTargetAngle();
          }
        }
      })()`
    });
  }

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(screenshot.data, 'base64');
  const screenshotPath = 'C:\\Users\\screw\\.gemini\\antigravity\\brain\\a2f121c0-1e5d-441b-8b51-a9f7c199ad70\\smart_combat_action.png';
  fs.writeFileSync(screenshotPath, buffer);
  console.log(`Action screenshot saved to ${screenshotPath}`);

  ws.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
