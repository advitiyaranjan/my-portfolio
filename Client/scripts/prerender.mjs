import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const vite = await createServer({
  configFile: './vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { default: MainApp } = await vite.ssrLoadModule('/src/app/pages/MainApp.tsx');
  const markup = renderToString(createElement(MainApp));
  const outputPath = new URL('../dist/index.html', import.meta.url);
  const html = await readFile(outputPath, 'utf8');

  if (!html.includes('<div id="root"></div>')) {
    throw new Error('Expected an empty #root mount point in the Vite output.');
  }

  await writeFile(outputPath, html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`));
  console.log(`Prerendered ${markup.length.toLocaleString()} characters into dist/index.html`);
} finally {
  await vite.close();
}
