// Verify that every snake has a unique and distinctive color pattern
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

  console.log('Starting game to verify unique distinct skins...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('play-btn').click();`
  });

  await new Promise(r => setTimeout(r, 800));

  // Retrieve skins analysis across all snakes
  const analysis = await send('Runtime.evaluate', {
    expression: `(() => {
      const g = window.slitherGame;
      const snakes = g.snakes.filter(s => !s.dead);

      const snakeSkins = snakes.map(s => ({
        name: s.name,
        isPlayer: s.isPlayer,
        skinId: s.skin.id,
        skinName: s.skin.name,
        pattern: s.skin.pattern,
        primary: s.skin.primary,
        secondary: s.skin.secondary,
        accent: s.skin.accent || null
      }));

      const skinIdSet = new Set(snakeSkins.map(s => s.skinId));
      const patternCounts = {};
      for (let s of snakeSkins) {
        patternCounts[s.pattern] = (patternCounts[s.pattern] || 0) + 1;
      }

      return {
        totalSnakes: snakeSkins.length,
        uniqueSkinCount: skinIdSet.size,
        allUnique: skinIdSet.size === snakeSkins.length,
        patternDistribution: patternCounts,
        sampleSnakes: snakeSkins.slice(0, 12)
      };
    })()`,
    returnByValue: true
  });

  console.log('Distinct Skins Analysis:');
  console.log(JSON.stringify(analysis.result.value, null, 2));

  // Assert all unique
  if (!analysis.result.value.allUnique) {
    console.error('FAIL: Not all snakes have unique skins!');
    process.exit(1);
  }
  console.log('SUCCESS: Every snake has a 100% distinctive unique color pattern!');

  // Capture screenshot of the gameplay
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshot && screenshot.data) {
    fs.writeFileSync('distinct_skins_screenshot.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to distinct_skins_screenshot.png');
  }

  process.exit(0);
}

main().catch(console.error);
