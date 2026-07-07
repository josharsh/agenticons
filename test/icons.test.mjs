import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { icons, categories } from '../src/definitions.mjs';
import * as esm from '../dist/esm/index.js';

const require = createRequire(import.meta.url);
const names = Object.keys(icons);
const pascal = (n) => n.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');

test('every icon renders a spec-compliant SVG through React', () => {
  for (const name of names) {
    const Component = esm[pascal(name)];
    assert.ok(Component, `missing export ${pascal(name)}`);
    const markup = renderToStaticMarkup(createElement(Component));
    assert.match(markup, /^<svg /, `${name}: does not render an <svg>`);
    assert.match(markup, /viewBox="0 0 24 24"/, `${name}: wrong viewBox`);
    assert.match(markup, /stroke="currentColor"/, `${name}: stroke must default to currentColor`);
    assert.match(markup, /stroke-width="2"/, `${name}: stroke width must default to 2`);
    assert.match(markup, /fill="none"/, `${name}: fill must be none`);
    assert.match(markup, /aria-hidden="true"/, `${name}: unlabeled icon must be aria-hidden`);
    assert.doesNotMatch(markup, /<(g|defs|filter|style|text)\b/, `${name}: disallowed element`);
  }
});

test('size and absoluteStrokeWidth props behave like lucide', () => {
  const markup = renderToStaticMarkup(createElement(esm.Agent, { size: 16 }));
  assert.match(markup, /width="16"/);
  assert.match(markup, /height="16"/);
  // 16px icon keeps viewBox 24 — stroke scales down unless absoluteStrokeWidth
  const absolute = renderToStaticMarkup(
    createElement(esm.Agent, { size: 48, absoluteStrokeWidth: true })
  );
  assert.match(absolute, /stroke-width="1"/, 'absoluteStrokeWidth: 2 * 24 / 48 must be 1');
});

test('aria-label removes aria-hidden', () => {
  const markup = renderToStaticMarkup(
    createElement(esm.ToolCall, { 'aria-label': 'Tool call' })
  );
  assert.match(markup, /aria-label="Tool call"/);
  assert.doesNotMatch(markup, /aria-hidden/);
});

test('deep ESM imports work per icon', async () => {
  const { default: Agent, AgentIcon } = await import('../dist/esm/icons/agent.js');
  assert.equal(Agent, AgentIcon);
  assert.match(renderToStaticMarkup(createElement(Agent)), /agenticon-agent/);
});

test('CJS build works via require()', () => {
  const cjs = require('../dist/cjs/index.cjs');
  assert.ok(cjs.Agent);
  const markup = renderToStaticMarkup(createElement(cjs.ContextWindow));
  assert.match(markup, /agenticon-context-window/);
  const single = require('../dist/cjs/icons/mcp.cjs');
  assert.match(renderToStaticMarkup(createElement(single)), /agenticon-mcp/);
});

test('raw SVG files exist and carry the exact spec root attributes', async () => {
  const files = await readdir(new URL('../dist/svg/', import.meta.url));
  assert.equal(files.filter((f) => f.endsWith('.svg')).length, names.length);
  for (const name of names) {
    const svg = await readFile(new URL(`../dist/svg/${name}.svg`, import.meta.url), 'utf8');
    assert.ok(
      svg.startsWith(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      ),
      `${name}.svg: wrong root attributes`
    );
  }
});

test('metadata.json matches definitions', async () => {
  const meta = JSON.parse(await readFile(new URL('../dist/metadata.json', import.meta.url), 'utf8'));
  assert.equal(meta.count, names.length);
  assert.deepEqual(meta.categories, categories);
  for (const name of names) {
    assert.equal(meta.icons[name].category, icons[name].category, `${name}: category mismatch`);
    assert.ok(meta.icons[name].tags.length >= 2, `${name}: tags missing`);
  }
});

test('every category is used and every icon has a unique pascal name', () => {
  const used = new Set(names.map((n) => icons[n].category));
  assert.deepEqual([...used].sort(), [...categories].sort());
  const pascals = names.map(pascal);
  assert.equal(new Set(pascals).size, pascals.length, 'duplicate pascal name');
});
