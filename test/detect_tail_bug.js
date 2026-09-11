// Run headless chrome simulation for 20 seconds of gameplay and log any segment/tail anomalies
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
        if (g.state !== 'PLAYING') {
          g.start('Hunter', 'neon-cyan');
        }

        const anomalies = [];

        // Run 600 update ticks (~10 seconds)
        for (let tick = 0; tick < 600; tick++) {
          g.update(0.016);

          for (const s of g.snakes) {
            if (s.dead) continue;

            // Check mass
            if (s.mass > 2000) {
              anomalies.push({ type: 'giant_mass', snake: s.name, mass: s.mass, tick });
            }

            // Check segments
            const segCount = s.segments.length;
            if (segCount > 500) {
              anomalies.push({ type: 'giant_length', snake: s.name, length: segCount, tick });
            }

            for (let i = 1; i < segCount; i++) {
              const cur = s.segments[i];
              const prev = s.segments[i - 1];
              const d = Math.hypot(cur.x - prev.x, cur.y - prev.y);

              if (d > 40) {
                anomalies.push({ type: 'stretched_tail', snake: s.name, segIndex: i, dist: d, totalSegs: segCount, tick });
                break;
              }
              if (cur.radius > 60 || cur.radius < 0) {
                anomalies.push({ type: 'abnormal_radius', snake: s.name, segIndex: i, radius: cur.radius, tick });
                break;
              }
            }
            if (anomalies.length > 10) break;
          }
          if (anomalies.length > 10) break;
        }

        return {
          anomaliesCount: anomalies.length,
          anomalies: anomalies.slice(0, 10),
          snakesLiving: g.snakes.filter(s => !s.dead).length,
          playerMass: g.player ? g.player.mass : null,
          maxBotMass: Math.max(...g.snakes.map(s => s.mass))
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Detection results:', JSON.stringify(evalRes.result.value, null, 2));
  process.exit(0);
}

main().catch(console.error);
