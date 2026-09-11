// Connect to Chrome DevTools Protocol to inspect console, runtime errors, and DOM
import http from 'http';

async function main() {
  // Get targets
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
    return;
  }

  console.log('Found page target:', page.title, page.url, page.webSocketDebuggerUrl);

  const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);

  ws.addEventListener('open', () => {
    let id = 1;
    function send(method, params = {}) {
      ws.send(JSON.stringify({ id: id++, method, params }));
    }

    send('Runtime.enable');
    send('Console.enable');
    send('Log.enable');

    // Evaluate window.slitherGame
    send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            hasGame: !!window.slitherGame,
            state: window.slitherGame ? window.slitherGame.state : null,
            canvasSize: {
              width: window.slitherGame?.canvas?.width,
              height: window.slitherGame?.canvas?.height,
              cssW: window.slitherGame?.canvas?.style?.width,
              cssH: window.slitherGame?.canvas?.style?.height
            },
            player: window.slitherGame?.player ? {
              x: window.slitherGame.player.x,
              y: window.slitherGame.player.y,
              mass: window.slitherGame.player.mass,
              dead: window.slitherGame.player.dead,
              segments: window.slitherGame.player.segments.length
            } : null,
            snakesCount: window.slitherGame?.snakes?.length,
            foodsCount: window.slitherGame?.foodManager?.foods?.length
          };
        })()
      `,
      returnByValue: true
    });
  });

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description));
    } else if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
    } else if (msg.result && msg.result.result) {
      console.log('[EVAL RESULT]', JSON.stringify(msg.result.result.value, null, 2));
      setTimeout(() => process.exit(0), 1000);
    }
  });
}

main().catch(console.error);
