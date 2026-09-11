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

  // Reload page to get fresh bundle
  console.log('Reloading page with latest combat bundle...');
  await send('Page.reload');
  await new Promise(r => setTimeout(r, 1500));

  console.log('Clicking Play...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('play-btn').click();`
  });

  await new Promise(r => setTimeout(r, 1200));

  console.log('Monitoring bot combat over 8 seconds...');
  const maneuverStats = {};
  let totalKillsObserved = 0;

  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 1000));

    const stepReport = await send('Runtime.evaluate', {
      expression: `(() => {
        const g = window.slitherGame;
        const snakes = g.snakes;
        const liveBots = snakes.filter(s => !s.isPlayer && !s.dead);
        const maneuvers = {};
        let boostingCount = 0;
        let totalKills = 0;

        for (const b of liveBots) {
          const m = b.tacticalMode || 'NONE';
          maneuvers[m] = (maneuvers[m] || 0) + 1;
          if (b.isBoosting) boostingCount++;
          totalKills += (b.kills || 0);
        }

        const topKillers = snakes
          .slice()
          .sort((a, b) => (b.kills || 0) - (a.kills || 0))
          .slice(0, 5)
          .map(s => ({ name: s.name, kills: s.kills || 0, mass: Math.round(s.mass), mode: s.tacticalMode }));

        return {
          aliveCount: liveBots.length,
          totalSnakes: snakes.length,
          boostingCount,
          maneuvers,
          totalKills,
          topKillers
        };
      })()`,
      returnByValue: true
    });

    if (stepReport.exceptionDetails) {
      console.error('Eval error:', stepReport.exceptionDetails);
      continue;
    }

    const val = stepReport.result.value;
    totalKillsObserved = val.totalKills;
    for (const [k, v] of Object.entries(val.maneuvers)) {
      maneuverStats[k] = (maneuverStats[k] || 0) + v;
    }
    console.log(`[Second ${i + 1}] Live bots: ${val.aliveCount}, Boosting: ${val.boostingCount}, Total Kills: ${val.totalKills}, Maneuvers: ${JSON.stringify(val.maneuvers)}`);
    if (val.topKillers && val.topKillers.length > 0) {
      console.log(`  Top Combatants: ${JSON.stringify(val.topKillers)}`);
    }
  }

  // Capture screenshot of combat
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(screenshot.data, 'base64');
  const screenshotPath = 'C:\\Users\\screw\\.gemini\\antigravity\\brain\\a2f121c0-1e5d-441b-8b51-a9f7c199ad70\\smart_combat_verified.png';
  fs.writeFileSync(screenshotPath, buffer);
  console.log(`Screenshot saved to ${screenshotPath}`);

  console.log('\n--- Final Combat Analysis ---');
  console.log('Cumulative Maneuver distribution across live bots:');
  for (const [k, v] of Object.entries(maneuverStats)) {
    console.log(`  ${k.padEnd(12)}: ${v} observations`);
  }
  console.log('Total Kills Observed in Arena:', totalKillsObserved);

  ws.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
