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

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const g = window.slitherGame;
        g.start('Test', 'neon-cyan');
        
        console.log('Initial player:', g.player.x, g.player.y, g.player.angle, g.player.speed, g.player.mass);
        
        // Check after each step in update
        const dt = 0.016;
        
        // Step 1: clear & insert
        g.spatialGrid.clear();
        for (let s of g.snakes) {
          for (let seg of s.segments) g.spatialGrid.insert(seg);
        }
        console.log('After grid insert:', g.player.x);
        
        // Step 2: foodManager.update
        g.foodManager.update(dt, g.snakes);
        console.log('After food update:', g.player.x);
        
        // Step 3: player.update
        g.player.update(dt, g.foodManager, g.particleManager, g.sound);
        console.log('After player.update:', g.player.x, g.player.y, g.player.angle, g.player.speed, g.player.mass);
        
        // Step 4: player.eatFood
        g.player.eatFood(g.foodManager, g.sound, g.particleManager);
        console.log('After player.eatFood:', g.player.x, g.player.mass);
        
        return {
          x: g.player.x,
          y: g.player.y,
          angle: g.player.angle,
          mass: g.player.mass,
          speed: g.player.speed
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Trace result:', evalRes);
  process.exit(0);
}

main().catch(console.error);
