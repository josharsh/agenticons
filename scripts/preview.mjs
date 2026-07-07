/**
 * Renders a contact sheet of all icons (at 24px and 16px) to preview.svg,
 * for visual QA. Run `npm run build` first.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { icons } from '../src/definitions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const names = Object.keys(icons).sort();

const COLS = 6;
const CELL_W = 150;
const CELL_H = 96;
const rows = Math.ceil(names.length / COLS);

let cells = '';
for (let i = 0; i < names.length; i++) {
  const name = names[i];
  const x = (i % COLS) * CELL_W;
  const y = Math.floor(i / COLS) * CELL_H;
  const svg = await readFile(path.join(root, 'dist/svg', `${name}.svg`), 'utf8');
  const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  cells += `
  <g transform="translate(${x + 20}, ${y + 16})">
    <g stroke="#111" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>
    <g transform="translate(44, 4) scale(0.6667)" stroke="#111" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>
    <g transform="translate(74, 8) scale(0.5)" stroke="#111" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>
    <text x="0" y="46" font-family="ui-monospace, monospace" font-size="10" fill="#555">${name}</text>
  </g>`;
}

const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${COLS * CELL_W}" height="${rows * CELL_H}" viewBox="0 0 ${COLS * CELL_W} ${rows * CELL_H}">
  <rect width="100%" height="100%" fill="#fff"/>${cells}
</svg>
`;

await writeFile(path.join(root, 'preview.svg'), sheet);
console.log(`preview.svg written (${names.length} icons at 24/16/12px)`);
