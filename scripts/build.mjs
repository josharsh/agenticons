/**
 * agenticons build.
 *
 * From src/definitions.mjs, generates:
 *   dist/esm/icons/<name>.js     per-icon ESM component
 *   dist/cjs/icons/<name>.cjs    per-icon CJS component
 *   dist/esm/index.js            barrel of named exports
 *   dist/cjs/index.cjs
 *   dist/types/                  hand-generated .d.ts per icon + index
 *   dist/svg/<name>.svg          raw SVGs
 *   dist/metadata.json           names, categories, tags, pascal names
 *
 * Also validates every icon against the spec before emitting anything.
 */
import { mkdir, rm, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { icons, categories } from '../src/definitions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

/* ---------------------------------------------------------------- spec */

const ALLOWED_TAGS = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);
const ALLOWED_ATTRS = {
  path: ['d'],
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  rect: ['x', 'y', 'width', 'height', 'rx'],
  line: ['x1', 'y1', 'x2', 'y2'],
  polyline: ['points'],
  polygon: ['points'],
};
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validate() {
  const errors = [];
  for (const [name, icon] of Object.entries(icons)) {
    if (!NAME_RE.test(name)) errors.push(`${name}: invalid name (must be kebab-case)`);
    if (!categories.includes(icon.category)) errors.push(`${name}: unknown category "${icon.category}"`);
    if (!Array.isArray(icon.tags) || icon.tags.length < 2) errors.push(`${name}: needs at least 2 tags`);
    if (!Array.isArray(icon.elements) || icon.elements.length === 0) errors.push(`${name}: no elements`);
    for (const [tag, attrs] of icon.elements) {
      if (!ALLOWED_TAGS.has(tag)) {
        errors.push(`${name}: element <${tag}> not allowed`);
        continue;
      }
      for (const key of Object.keys(attrs)) {
        if (!ALLOWED_ATTRS[tag].includes(key)) errors.push(`${name}: <${tag}> attr "${key}" not allowed`);
      }
      // every coordinate must stay on the 24×24 canvas
      const numbers = Object.entries(attrs)
        .flatMap(([k, v]) => (k === 'd' || k === 'points' ? String(v).match(/-?\d+(\.\d+)?/g) ?? [] : [v]))
        .map(Number);
      if (numbers.some((n) => Number.isNaN(n))) errors.push(`${name}: non-numeric attr value`);
      if (tag !== 'path' && numbers.some((n) => n < 0 || n > 24)) {
        errors.push(`${name}: <${tag}> coordinate out of the 0–24 canvas`);
      }
    }
  }
  if (errors.length) {
    console.error('Spec validation failed:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
}

/* ------------------------------------------------------------- helpers */

const pascal = (name) =>
  name
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

const svgAttrString = (attrs) =>
  Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');

function toSvg(icon) {
  const body = icon.elements.map(([tag, attrs]) => `  <${tag} ${svgAttrString(attrs)} />`).join('\n');
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    body,
    '</svg>',
    '',
  ].join('\n');
}

const nodeLiteral = (elements) =>
  JSON.stringify(elements.map(([tag, attrs]) => [tag, attrs]));

/* -------------------------------------------------------------- emit */

async function build() {
  validate();

  await rm(dist, { recursive: true, force: true });
  for (const dir of ['esm/icons', 'cjs/icons', 'types/icons', 'svg']) {
    await mkdir(path.join(dist, dir), { recursive: true });
  }

  const names = Object.keys(icons).sort();
  const writes = [];

  for (const name of names) {
    const icon = icons[name];
    const Pascal = pascal(name);
    const node = nodeLiteral(icon.elements);

    writes.push(
      writeFile(
        path.join(dist, 'esm/icons', `${name}.js`),
        `import { createIcon } from '../createIcon.js';\n\nconst ${Pascal} = /*#__PURE__*/ createIcon('${name}', ${node});\n\nexport default ${Pascal};\nexport { ${Pascal}, ${Pascal} as ${Pascal}Icon };\n`
      ),
      writeFile(
        path.join(dist, 'cjs/icons', `${name}.cjs`),
        `'use strict';\nconst { createIcon } = require('../createIcon.cjs');\n\nconst ${Pascal} = createIcon('${name}', ${node});\n\nmodule.exports = ${Pascal};\nmodule.exports.${Pascal} = ${Pascal};\nmodule.exports.${Pascal}Icon = ${Pascal};\nmodule.exports.default = ${Pascal};\n`
      ),
      writeFile(
        path.join(dist, 'types/icons', `${name}.d.ts`),
        `import type { Agenticon } from '../index';\ndeclare const ${Pascal}: Agenticon;\nexport default ${Pascal};\nexport { ${Pascal}, ${Pascal} as ${Pascal}Icon };\n`
      ),
      writeFile(path.join(dist, 'svg', `${name}.svg`), toSvg(icon))
    );
  }

  // barrels
  writes.push(
    writeFile(
      path.join(dist, 'esm', 'index.js'),
      names
        .map((n) => `export { ${pascal(n)}, ${pascal(n)}Icon } from './icons/${n}.js';`)
        .join('\n') + `\nexport { createIcon } from './createIcon.js';\n`
    ),
    writeFile(
      path.join(dist, 'cjs', 'index.cjs'),
      `'use strict';\n` +
        names.map((n) => `const ${pascal(n)} = require('./icons/${n}.cjs');`).join('\n') +
        `\nconst { createIcon } = require('./createIcon.cjs');\n\nmodule.exports = {\n  createIcon,\n` +
        names.map((n) => `  ${pascal(n)},\n  ${pascal(n)}Icon: ${pascal(n)},`).join('\n') +
        `\n};\n`
    ),
    writeFile(
      path.join(dist, 'types', 'index.d.ts'),
      `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';\n\nexport interface AgenticonProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {\n  /** Width and height, defaults to 24 */\n  size?: string | number;\n  /** Stroke width, defaults to 2 */\n  strokeWidth?: string | number;\n  /** Keep the stroke visually 2px regardless of size */\n  absoluteStrokeWidth?: boolean;\n}\n\nexport type Agenticon = ForwardRefExoticComponent<AgenticonProps & RefAttributes<SVGSVGElement>>;\n\nexport type IconNode = Array<[tag: string, attrs: Record<string, string | number>]>;\nexport declare function createIcon(iconName: string, iconNode: IconNode): Agenticon;\n\n` +
        names
          .map((n) => `export declare const ${pascal(n)}: Agenticon;\nexport declare const ${pascal(n)}Icon: Agenticon;`)
          .join('\n') +
        '\n'
    ),
    writeFile(
      path.join(dist, 'metadata.json'),
      JSON.stringify(
        {
          count: names.length,
          categories,
          icons: Object.fromEntries(
            names.map((n) => [n, { pascalName: pascal(n), category: icons[n].category, tags: icons[n].tags }])
          ),
        },
        null,
        2
      ) + '\n'
    ),
    copyFile(path.join(root, 'src/createIcon.js'), path.join(dist, 'esm', 'createIcon.js')),
    copyFile(path.join(root, 'src/createIcon.cjs'), path.join(dist, 'cjs', 'createIcon.cjs'))
  );

  await Promise.all(writes);
  console.log(`Built ${names.length} icons → dist/ (esm, cjs, types, svg, metadata.json)`);
}

await build();
