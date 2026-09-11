// Verify diverse snake sizes and points hierarchy at game start
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

  // Reload page to start fresh
  await send('Page.reload');
  await new Promise(r => setTimeout(r, 1200));

  console.log('Clicking PLAY NOW...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('play-btn').click();`
  });

  await new Promise(r => setTimeout(r, 800));

  // Retrieve snake population statistics
  const data = await send('Runtime.evaluate', {
    expression: `(() => {
      const g = window.slitherGame;
      const snakes = g.snakes.filter(s => !s.dead);
      
      // Sort by mass descending
      snakes.sort((a, b) => b.mass - a.mass);

      const summary = snakes.map((s, index) => ({
        rank: index + 1,
        name: s.name,
        isPlayer: s.isPlayer,
        mass: Math.round(s.mass),
        score: Math.floor(s.mass * 10),
        segments: s.segments.length,
        radius: Math.round(s.radius)
      }));

      const top10 = summary.slice(0, 10);
      const player = summary.find(s => s.isPlayer);
      const smallest = summary[summary.length - 1];

      return {
        totalSnakes: summary.length,
        top10,
        player,
        smallest,
        scoreRange: {
          min: smallest.score,
          max: top10[0].score,
          spread: top10[0].score - smallest.score
        },
        segmentRange: {
          min: smallest.segments,
          max: top10[0].segments,
          spread: top10[0].segments - smallest.segments
        }
      };
    })()`,
    returnByValue: true
  });

  console.log('Tiered Snakes Population Analysis:');
  console.log(JSON.stringify(data.result.value, null, 2));

  // Take screenshot
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshot && screenshot.data) {
    fs.writeFileSync('tiered_snakes_screenshot.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to tiered_snakes_screenshot.png');
  }

  process.exit(0);
}

main().catch(console.error);
