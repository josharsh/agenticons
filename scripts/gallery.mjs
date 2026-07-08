/**
 * Generates gallery.html — a self-contained, offline viewer for all icons.
 * Search, category filter, size/stroke/absolute controls, theme toggle,
 * copy import/SVG. Screenshot-ready for the README (?theme=light|dark).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { icons, categories } from '../src/definitions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
).version;

const pascal = (n) => n.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
const attrString = (attrs) => Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
const inner = (elements) => elements.map(([tag, attrs]) => `<${tag} ${attrString(attrs)}/>`).join('');

const data = Object.keys(icons).sort().map((name) => ({
  name,
  pascal: pascal(name),
  category: icons[name].category,
  tags: icons[name].tags,
  inner: inner(icons[name].elements),
}));

const json = JSON.stringify({ categories, icons: data }).replaceAll('<', '\\u003c');

/* The grammar legend, built from the primitives as they actually ship. */
const legendSvg = (els) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner(els)}</svg>`;
const legend = [
  [legendSvg([icons.model.elements[0]]), 'model'],
  [legendSvg(icons.agent.elements), 'agency'],
  [legendSvg(icons['human-in-the-loop'].elements.slice(2)), 'autonomy'],
  [legendSvg(icons['human-in-the-loop'].elements.slice(0, 2)), 'human'],
  [legendSvg([icons.tool.elements[0]]), 'tool'],
  [legendSvg(icons['context-window'].elements.slice(0, 2)), 'context'],
  [legendSvg([icons.token.elements[0]]), 'token'],
  [legendSvg([['path', { d: 'M8 12h.01' }], ['path', { d: 'M16 12h.01' }], ['path', { d: 'M12 8.5h.01' }], ['path', { d: 'M12 15.5h.01' }]]), 'data'],
]
  .map(([svg, label]) => `<span class="lg-item">${svg}<span>${label}</span></span>`)
  .join('');

const LIGHT_VARS = `
    --paper: #faf9f7; --ink: #1c1917; --muted: #79716b;
    --line: #e5e2dd; --line-strong: #c9c4bc; --cell: #ffffff;
    --accent: #2455c3; --accent-ink: #ffffff;`;
const DARK_VARS = `
    --paper: #141210; --ink: #ece9e4; --muted: #9b948c;
    --line: #292623; --line-strong: #47423b; --cell: #1c1916;
    --accent: #8aadf5; --accent-ink: #10131c;`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>agenticons — symbol chart</title>
<style>
  :root {${LIGHT_VARS}
    --radius-control: 6px; --radius-container: 10px;
  }
  @media (prefers-color-scheme: dark) { :root {${DARK_VARS} } }
  :root[data-theme="light"] {${LIGHT_VARS} }
  :root[data-theme="dark"] {${DARK_VARS} }

  * { box-sizing: border-box; margin: 0; }
  html { color-scheme: light dark; }
  :root[data-theme="light"] { color-scheme: light; }
  :root[data-theme="dark"] { color-scheme: dark; }
  body {
    background: var(--paper); color: var(--ink);
    font: 15px/1.55 ui-sans-serif, system-ui, -apple-system, sans-serif;
    padding: 52px clamp(20px, 4vw, 64px) 64px;
  }
  .mono { font-family: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace; }

  header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
  h1 {
    font-family: ui-monospace, Menlo, monospace;
    font-size: 30px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2;
  }
  .spec {
    font: 12.5px ui-monospace, Menlo, monospace; color: var(--muted);
    margin-top: 6px; letter-spacing: 0.02em;
  }
  .sub { color: var(--muted); margin-top: 14px; max-width: 58ch; }
  .sub a { color: inherit; }
  #theme {
    flex: none; font: 13px ui-monospace, Menlo, monospace; color: var(--muted);
    background: transparent; border: 1px solid var(--line); border-radius: var(--radius-control);
    padding: 7px 12px; cursor: pointer;
  }
  #theme:hover { color: var(--ink); border-color: var(--line-strong); }

  .legend {
    display: flex; flex-wrap: wrap; gap: 8px 24px; align-items: center;
    margin-top: 24px; padding: 14px 18px;
    border: 1px solid var(--line); border-radius: var(--radius-container);
    width: fit-content;
  }
  .lg-title {
    font: 600 11px ui-monospace, Menlo, monospace; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--muted); margin-right: 4px;
  }
  .lg-item {
    display: inline-flex; align-items: center; gap: 8px;
    font: 12.5px ui-monospace, Menlo, monospace; color: var(--muted);
  }
  .lg-item svg { width: 19px; height: 19px; color: var(--ink); }

  .controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 28px; }
  .search { flex: 1 1 260px; max-width: 380px; position: relative; }
  .search input {
    width: 100%; padding: 8px 12px 8px 32px;
    font: 14px ui-monospace, Menlo, monospace; color: var(--ink);
    background: var(--cell); border: 1px solid var(--line); border-radius: var(--radius-control);
  }
  .search input::placeholder { color: var(--muted); }
  .search .slash {
    position: absolute; left: 10px; top: 50%; translate: 0 -50%;
    color: var(--muted); font: 13px ui-monospace, Menlo, monospace; pointer-events: none;
  }
  .seg { display: flex; border: 1px solid var(--line); border-radius: var(--radius-control); overflow: hidden; }
  .seg button {
    padding: 7px 12px; font: 13px ui-monospace, Menlo, monospace;
    background: transparent; color: var(--muted); border: 0; cursor: pointer;
  }
  .seg button + button { border-left: 1px solid var(--line); }
  .seg button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }
  .seg-label { font-size: 12px; color: var(--muted); margin-right: -4px; }

  .cats { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .cats button {
    padding: 5px 12px; font: 13px ui-monospace, Menlo, monospace;
    background: transparent; color: var(--muted);
    border: 1px solid var(--line); border-radius: 999px; cursor: pointer;
  }
  .cats button[aria-pressed="true"] { border-color: var(--ink); color: var(--ink); }

  button:hover { color: var(--ink); }
  .seg button[aria-pressed="true"]:hover { color: var(--paper); }
  :is(button, input, a):focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  button:active { transform: translateY(0.5px); }

  main { margin-top: 28px; }
  .cat-title {
    font: 600 12px ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--muted); margin: 40px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--line);
  }
  .cat-title .n { font-weight: 400; opacity: 0.7; }
  main > section:first-child .cat-title { margin-top: 0; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 12px; }

  .card {
    position: relative; text-align: left; cursor: pointer;
    background: var(--cell); border: 1px solid var(--line); border-radius: var(--radius-container);
    padding: 0; overflow: hidden; color: inherit; font: inherit;
  }
  .card:hover { border-color: var(--line-strong); }
  .card .well {
    display: grid; place-items: center; height: 92px;
    background-image: radial-gradient(var(--line) 1px, transparent 1px);
    background-size: 12px 12px; background-position: center;
  }
  .card svg { width: var(--icon-size, 24px); height: var(--icon-size, 24px); }
  .card .meta { padding: 8px 12px 10px; border-top: 1px solid var(--line); }
  .card .name { font: 12.5px ui-monospace, Menlo, monospace; display: block; }
  .card .hint { font: 11px ui-monospace, Menlo, monospace; color: var(--muted); display: block; margin-top: 2px; }
  .card .svgbtn {
    position: absolute; top: 8px; right: 8px; opacity: 0;
    font: 11px ui-monospace, Menlo, monospace; color: var(--muted);
    background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-control);
    padding: 3px 8px; cursor: pointer;
  }
  .card:hover .svgbtn, .card:focus-within .svgbtn { opacity: 1; }
  .card .svgbtn:hover { color: var(--ink); border-color: var(--line-strong); }

  .empty { padding: 56px 0; max-width: 56ch; }
  .empty .mono { font-size: 14px; }
  .empty p { color: var(--muted); margin-top: 8px; }
  .empty a { color: var(--accent); }
  .trylink {
    background: none; border: 0; padding: 0; cursor: pointer;
    color: var(--accent); font-size: 13px; text-decoration: underline;
  }
  [hidden] { display: none !important; }

  #toast {
    position: fixed; left: 50%; bottom: 28px; translate: -50% 0;
    background: var(--accent); color: var(--accent-ink);
    font: 13px ui-monospace, Menlo, monospace;
    padding: 9px 16px; border-radius: var(--radius-control);
    opacity: 0; pointer-events: none;
  }
  #toast.show { opacity: 1; }

  footer {
    margin-top: 56px; padding-top: 16px; border-top: 1px solid var(--line);
    display: flex; flex-wrap: wrap; gap: 8px 24px;
    font: 12px ui-monospace, Menlo, monospace; color: var(--muted);
  }
  footer a { color: inherit; }

  @media (prefers-reduced-motion: no-preference) {
    .card, .seg button, .cats button, .svgbtn, #theme { transition: border-color 150ms ease-out, color 150ms ease-out, background-color 150ms ease-out; }
    #toast { transition: opacity 200ms ease-out; }
  }
</style>
</head>
<body>
<header>
  <div>
    <h1>agenticons</h1>
    <p class="spec">${data.length} symbols · 24×24 grid · 2px stroke · currentColor · React · MIT</p>
    <p class="sub">A notation for AI primitives — agents, tool calls, MCP, context, retrieval.
    Click a symbol to copy its React import; hover for the raw SVG.
    <a href="https://github.com/josharsh/agenticons">GitHub</a> · <a href="https://www.npmjs.com/package/agenticons">npm</a></p>
  </div>
  <button id="theme" aria-label="Toggle color theme">◐ theme</button>
</header>

<div class="legend" aria-label="The grammar — primitives every icon composes from">
  <span class="lg-title">grammar</span>
  ${legend}
</div>

<div class="controls">
  <div class="search">
    <span class="slash" aria-hidden="true">/</span>
    <input id="q" type="search" placeholder="search name or tag — rag, safety, mcp…" aria-label="Search icons">
  </div>
  <span class="seg-label">size</span>
  <div class="seg" role="group" aria-label="Icon size" id="size-seg">
    <button data-size="16">16</button>
    <button data-size="24" aria-pressed="true">24</button>
    <button data-size="32">32</button>
    <button data-size="48">48</button>
  </div>
  <span class="seg-label">stroke</span>
  <div class="seg" role="group" aria-label="Stroke width" id="stroke-seg">
    <button data-stroke="1">1</button>
    <button data-stroke="1.5">1.5</button>
    <button data-stroke="2" aria-pressed="true">2</button>
  </div>
  <div class="seg" role="group" aria-label="Stroke scaling" id="abs-seg">
    <button data-abs="false" aria-pressed="true" title="Stroke scales with size (SVG default)">scaled</button>
    <button data-abs="true" title="Stroke stays at true px — the absoluteStrokeWidth prop">absolute</button>
  </div>
</div>
<div class="cats" id="cats" role="group" aria-label="Filter by category"></div>

<main id="main"></main>

<div class="empty" id="empty" hidden>
  <p class="mono">no symbol matches “<span id="empty-q"></span>”</p>
  <p>Tags are searchable too — try <button class="mono trylink" data-try="rag">rag</button>,
  <button class="mono trylink" data-try="safety">safety</button> or
  <button class="mono trylink" data-try="billing">billing</button>.
  Missing a concept the agentic era needs? <a href="https://github.com/josharsh/agenticons/issues">Propose it as an issue</a>.</p>
</div>

<div id="toast" role="status"></div>

<footer>
  <span>24×24 grid · 2px stroke · currentColor · MIT</span>
  <span>agenticons v${version}</span>
  <a href="https://github.com/josharsh/agenticons">github.com/josharsh/agenticons</a>
</footer>

<script>
const DATA = ${json};
const SVG_OPEN = (stroke) => \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="\${stroke}" stroke-linecap="round" stroke-linejoin="round">\`;

let stroke = '2';
let size = 24;
let absolute = false;
const main = document.getElementById('main');
const empty = document.getElementById('empty');
const q = document.getElementById('q');
const count = document.getElementById('count');
let activeCat = 'all';

/* theme */
const themeBtn = document.getElementById('theme');
function currentTheme() {
  return document.documentElement.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  themeBtn.textContent = t === 'dark' ? '◑ light' : '◐ dark';
}
const themeParam = new URLSearchParams(location.search).get('theme');
if (themeParam === 'light' || themeParam === 'dark') setTheme(themeParam);
else themeBtn.textContent = currentTheme() === 'dark' ? '◑ light' : '◐ dark';
themeBtn.addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark'));

/* build category filter */
const cats = document.getElementById('cats');
for (const c of ['all', ...DATA.categories]) {
  const b = document.createElement('button');
  b.textContent = c;
  b.dataset.cat = c;
  b.setAttribute('aria-pressed', c === 'all');
  cats.appendChild(b);
}

/* build grid grouped by category */
for (const c of DATA.categories) {
  const group = DATA.icons.filter((i) => i.category === c);
  const section = document.createElement('section');
  section.dataset.cat = c;
  section.innerHTML = '<h2 class="cat-title">' + c + ' <span class="n">· ' + group.length + '</span></h2>';
  const grid = document.createElement('div');
  grid.className = 'grid';
  for (const icon of group) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Copy React import for ' + icon.name);
    card.dataset.name = icon.name;
    card.dataset.hay = (icon.name + ' ' + icon.category + ' ' + icon.tags.join(' ')).toLowerCase();
    card.title = 'Copy import — tags: ' + icon.tags.join(', ');
    card.innerHTML =
      '<span class="well">' + SVG_OPEN(stroke) + icon.inner + '</svg></span>' +
      '<span class="meta"><span class="name">' + icon.name + '</span><span class="hint">' + icon.pascal + '</span></span>' +
      '<button class="svgbtn" aria-label="Copy raw SVG for ' + icon.name + '">svg</button>';
    grid.appendChild(card);
  }
  section.appendChild(grid);
  main.appendChild(section);
}

function apply() {
  const term = q.value.trim().toLowerCase();
  let visible = 0;
  for (const section of main.children) {
    let sectionVisible = 0;
    if (activeCat !== 'all' && section.dataset.cat !== activeCat) {
      section.hidden = true;
      continue;
    }
    for (const card of section.querySelectorAll('.card')) {
      const show = !term || card.dataset.hay.includes(term);
      card.hidden = !show;
      if (show) sectionVisible++;
    }
    section.hidden = sectionVisible === 0;
    visible += sectionVisible;
  }
  empty.hidden = visible !== 0;
  document.getElementById('empty-q').textContent = term;
}

function copy(text, label) {
  const done = () => showToast('copied  ' + label);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  document.execCommand('copy'); ta.remove(); done();
}
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}

main.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const icon = DATA.icons.find((i) => i.name === card.dataset.name);
  if (e.target.closest('.svgbtn')) {
    copy(SVG_OPEN(stroke) + icon.inner + '</svg>', icon.name + '.svg');
  } else {
    copy("import { " + icon.pascal + " } from 'agenticons';", icon.pascal);
  }
});

main.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('card')) {
    e.preventDefault();
    e.target.click();
  }
});

cats.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  activeCat = b.dataset.cat;
  for (const btn of cats.children) btn.setAttribute('aria-pressed', btn === b);
  apply();
});

function updateStrokes() {
  const w = absolute ? (Number(stroke) * 24) / size : Number(stroke);
  for (const svg of main.querySelectorAll('svg')) svg.setAttribute('stroke-width', +w.toFixed(3));
}

document.getElementById('size-seg').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  size = Number(b.dataset.size);
  for (const btn of b.parentElement.children) btn.setAttribute('aria-pressed', btn === b);
  document.body.style.setProperty('--icon-size', size + 'px');
  updateStrokes();
});

document.getElementById('stroke-seg').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  stroke = b.dataset.stroke;
  for (const btn of b.parentElement.children) btn.setAttribute('aria-pressed', btn === b);
  updateStrokes();
});

document.getElementById('abs-seg').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  absolute = b.dataset.abs === 'true';
  for (const btn of b.parentElement.children) btn.setAttribute('aria-pressed', btn === b);
  updateStrokes();
});

q.addEventListener('input', apply);
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); }
  if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; apply(); q.blur(); }
});
empty.addEventListener('click', (e) => {
  const b = e.target.closest('.trylink'); if (!b) return;
  q.value = b.dataset.try; apply();
});

apply();
</script>
</body>
</html>
`;

await writeFile(path.join(root, 'gallery.html'), html);
await mkdir(path.join(root, 'docs'), { recursive: true });
await writeFile(path.join(root, 'docs', 'index.html'), html);
console.log(`gallery.html + docs/index.html written (${data.length} icons, v${version})`);
