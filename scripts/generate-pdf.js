// Genera public/catalogo-mantilhue.pdf desde la página /catalogo-print
//
// Uso:
//   node scripts/generate-pdf.js
//     Levanta su propio dev server, genera el PDF y lo cierra.
//   node scripts/generate-pdf.js http://localhost:4321/catalogo-print
//     Usa un server ya corriendo (también acepta la URL vía env PDF_URL).

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(__dirname, '..');
const outPath = resolve(webRoot, 'public/catalogo-mantilhue.pdf');

const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

// Levanta `astro dev` y resuelve con la URL local real (puerto incluido)
function startDevServer() {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('npx astro dev', {
      cwd: webRoot,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const timeout = setTimeout(() => {
      kill(child);
      rejectPromise(new Error('El dev server no arrancó en 60s'));
    }, 60_000);

    let buffer = '';
    const onData = (chunk) => {
      buffer += stripAnsi(chunk.toString());
      const match = buffer.match(/Local\s+(http:\/\/localhost:\d+\/\S*)/);
      if (match) {
        clearTimeout(timeout);
        resolvePromise({ child, localUrl: match[1] });
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);

    child.on('exit', (code) => {
      clearTimeout(timeout);
      rejectPromise(new Error(`El dev server terminó antes de estar listo (código ${code})`));
    });
  });
}

function kill(child) {
  if (process.platform === 'win32') {
    // child.kill() no mata el árbol de procesos en Windows con shell:true
    spawn(`taskkill /pid ${child.pid} /T /F`, { shell: true });
  } else {
    child.kill();
  }
}

(async () => {
  let url = process.argv[2] || process.env.PDF_URL;
  let server = null;

  if (!url) {
    console.log('Levantando dev server...');
    server = await startDevServer();
    const base = server.localUrl.endsWith('/') ? server.localUrl : `${server.localUrl}/`;
    url = `${base}catalogo-print`;
  }

  console.log(`Generando PDF desde ${url}`);

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();

    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    if (!response || !response.ok()) {
      throw new Error(`La página respondió ${response ? response.status() : 'sin respuesta'} en ${url}`);
    }

    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
    });

    console.log(`PDF generado: ${outPath}`);
  } finally {
    if (browser) await browser.close();
    if (server) kill(server.child);
  }
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
