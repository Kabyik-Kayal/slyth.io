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

  // Test Boost
  console.log('Testing Boost...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const g = window.slitherGame;
        g.isMouseDown = true; // start boost
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  let boostStatus = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const g = window.slitherGame;
        return {
          playerSpeed: Math.round(g.player.speed),
          isBoosting: g.player.isBoosting,
          mass: Math.round(g.player.mass)
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Boost status:', boostStatus.result.value);

  // Stop boost
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.slitherGame.isMouseDown = false;
      })()
    `
  });

  // Test Collision & Death
  console.log('Testing Collision & Death...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const g = window.slitherGame;
        g.player.invulnerableTimer = 0; // expire shield
        // Drive player head into world boundary to trigger death
        g.player.x = 3250;
        g.player.y = 0;
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  let deathStatus = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const g = window.slitherGame;
        const gameOverVisible = !document.getElementById('game-over-menu').classList.contains('hidden');
        return {
          state: g.state,
          playerDead: g.player.dead,
          gameOverModalVisible: gameOverVisible,
          finalScore: document.getElementById('final-score').textContent,
          finalLength: document.getElementById('final-length').textContent
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Death status:', deathStatus.result.value);

  // Take screenshot of Game Over Modal
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshot && screenshot.data) {
    fs.writeFileSync('game_over_screenshot.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved game over screenshot to game_over_screenshot.png');
  }

  // Test Restart button
  console.log('Clicking PLAY AGAIN...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('restart-btn').click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 600));

  let restartStatus = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const g = window.slitherGame;
        return {
          state: g.state,
          playerDead: g.player ? g.player.dead : null,
          hudVisible: !document.getElementById('hud').classList.contains('hidden')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Restart status:', restartStatus.result.value);

  process.exit(0);
}

main().catch(console.error);
