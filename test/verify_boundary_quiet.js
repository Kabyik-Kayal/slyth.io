import http from 'http';

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

  await send('Page.reload');
  await new Promise(r => setTimeout(r, 1200));

  console.log('Clicking Play...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('play-btn').click();`
  });

  await new Promise(r => setTimeout(r, 800));

  console.log('Positioning player right next to the boundary shield (within 100px of perimeter)...');
  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      try {
        const g = window.slitherGame;
        const R = 5200;
        // Position player at R - 100
        g.player.x = R - 100;
        g.player.y = 0;
        g.player.angle = 0;

        // Track if any audio context calls happen
        let borderAlertCalled = false;
        g.sound.playBorderAlert = () => {
          borderAlertCalled = true;
        };

        // Run 60 frames of collision checks
        for (let i = 0; i < 60; i++) {
          g.player.checkCollisions(g.snakes, g.snakeGrid, g.sound, g.particleManager, g.foodManager);
        }

        return {
          playerDistFromCenter: Math.hypot(g.player.x, g.player.y),
          borderRadius: R,
          isDead: g.player.dead,
          borderAlertCalled
        };
      } catch (err) {
        return { error: err.message, stack: err.stack };
      }
    })()`,
    returnByValue: true
  });

  console.log('Boundary proximity test result:', result.result.value);
  if (result.result.value.borderAlertCalled) {
    console.error('FAIL: border alert was called!');
    process.exit(1);
  } else {
    console.log('PASS: No annoying border sound triggered near perimeter!');
  }

  // Verify that touching the wall still lethally eliminates the snake
  const wallDeathTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const g = window.slitherGame;
      const R = 5200;
      // Position player exactly on the wall
      g.player.x = R;
      g.player.y = 0;
      const died = g.player.checkCollisions(g.snakes, g.snakeGrid, g.sound, g.particleManager, g.foodManager);
      return { died, playerDead: g.player.dead };
    })()`,
    returnByValue: true
  });

  console.log('Wall death collision test result:', wallDeathTest.result.value);
  if (wallDeathTest.result.value.died && wallDeathTest.result.value.playerDead) {
    console.log('PASS: Boundary wall collision correctly eliminates snake!');
  } else {
    console.error('FAIL: Snake did not die on wall collision!');
    process.exit(1);
  }

  ws.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
