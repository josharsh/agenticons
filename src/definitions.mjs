/**
 * agenticons — single source of truth.
 *
 * Every icon is a list of SVG elements drawn on a 24×24 grid with a 2px
 * centered stroke, round caps/joins, currentColor. No fills, no transforms.
 *
 * The visual grammar (see README):
 *   diamond   = a model (LLM)
 *   orbit     = autonomy (arcs circling a mark)
 *   person    = a human
 *   hexagon   = a tool
 *   brackets  = context (a container the model can see)
 *   tile      = a token
 *   dot ("h.01") = a data point
 *
 * Craft rules (why the helpers exist): corners are rounded IN the path
 * geometry — sharp polygon joins read as machine-drawn. Radius scales
 * with shape size (~2px on large shapes, ~1px on small), matching the
 * corner language of the wider Lucide-style ecosystem.
 */

const f = (n) => +n.toFixed(2);

/** Rounded polygon: points in clockwise screen order, corner radius cr. */
const roundedPolygon = (pts, cr) => {
  let d = '';
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[i];
    const [ax, ay] = pts[(i - 1 + n) % n];
    const [bx, by] = pts[(i + 1) % n];
    const v1 = [ax - px, ay - py];
    const v2 = [bx - px, by - py];
    const l1 = Math.hypot(...v1);
    const l2 = Math.hypot(...v2);
    const u1 = [v1[0] / l1, v1[1] / l1];
    const u2 = [v2[0] / l2, v2[1] / l2];
    const angle = Math.acos(u1[0] * u2[0] + u1[1] * u2[1]);
    const t = cr / Math.tan(angle / 2);
    const p1 = [px + u1[0] * t, py + u1[1] * t];
    const p2 = [px + u2[0] * t, py + u2[1] * t];
    d += `${i === 0 ? 'M' : 'L'}${f(p1[0])} ${f(p1[1])}`;
    d += `A${f(cr)} ${f(cr)} 0 0 1 ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
};

/** The model/agent mark: a diamond with rounded vertices. */
const diamond = (cx, cy, r, cr = Math.max(1, f(r * 0.3))) =>
  roundedPolygon([[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]], cr);

/** The tool mark: a pointy-top hexagon with rounded vertices. */
const hexagon = (cx, cy, r, cr = Math.max(1, f(r * 0.22))) => {
  const w = f(r * Math.cos(Math.PI / 6));
  const h = f(r / 2);
  return roundedPolygon(
    [[cx, cy - r], [cx + w, cy - h], [cx + w, cy + h], [cx, cy + r], [cx - w, cy + h], [cx - w, cy - h]],
    cr
  );
};

export const icons = {
  /* ------------------------------------------------------------------ *
   * agents
   * ------------------------------------------------------------------ */
  agent: {
    category: 'agents',
    tags: ['ai', 'autonomous', 'assistant', 'bot', 'llm'],
    elements: [
      ['path', { d: diamond(12, 12, 5.5) }],
      ['path', { d: 'M12 3a9 9 0 0 1 9 9' }],
      ['path', { d: 'M12 21a9 9 0 0 1-9-9' }],
    ],
  },
  agents: {
    category: 'agents',
    tags: ['multi-agent', 'team', 'fleet', 'parallel'],
    elements: [
      ['path', { d: diamond(8, 8, 5) }],
      ['path', { d: diamond(16, 16, 5) }],
    ],
  },
  subagent: {
    category: 'agents',
    tags: ['child', 'spawn', 'delegate', 'worker', 'task'],
    elements: [
      ['path', { d: diamond(8.5, 8.5, 5.5) }],
      ['path', { d: diamond(17.5, 17.5, 3.5) }],
    ],
  },
  swarm: {
    category: 'agents',
    tags: ['multi-agent', 'distributed', 'collective', 'parallel'],
    elements: [
      ['path', { d: diamond(12, 5.5, 3.5) }],
      ['path', { d: diamond(5.5, 17, 3.5) }],
      ['path', { d: diamond(18.5, 17, 3.5) }],
    ],
  },
  orchestration: {
    category: 'agents',
    tags: ['coordinator', 'conductor', 'router', 'supervisor', 'fan-out'],
    elements: [
      ['circle', { cx: '12', cy: '4.5', r: '2' }],
      ['path', { d: 'M12 6.5V13' }],
      ['path', { d: 'M10.6 6 6 13.5' }],
      ['path', { d: 'M13.4 6 18 13.5' }],
      ['path', { d: diamond(5, 17.5, 3) }],
      ['path', { d: diamond(12, 17.5, 3) }],
      ['path', { d: diamond(19, 17.5, 3) }],
    ],
  },
  handoff: {
    category: 'agents',
    tags: ['transfer', 'delegate', 'agent-to-agent', 'pass'],
    elements: [
      ['path', { d: diamond(5.5, 12, 3.5) }],
      ['path', { d: 'm10.75 9.5 2.5 2.5-2.5 2.5' }],
      ['path', { d: diamond(18.5, 12, 3.5) }],
    ],
  },
  'handoff-human': {
    category: 'agents',
    tags: ['escalation', 'transfer', 'agent-to-human', 'support'],
    elements: [
      ['path', { d: diamond(5.5, 12, 3.5) }],
      ['path', { d: 'm10.25 9.5 2.5 2.5-2.5 2.5' }],
      ['circle', { cx: '17.5', cy: '9', r: '2.5' }],
      ['path', { d: 'M21.5 17a4 4 0 0 0-8 0' }],
    ],
  },
  'human-in-the-loop': {
    category: 'agents',
    tags: ['approval', 'review', 'oversight', 'hitl', 'supervision'],
    elements: [
      ['circle', { cx: '12', cy: '9', r: '3' }],
      ['path', { d: 'M17 18a5 5 0 0 0-10 0' }],
      ['path', { d: 'M12 2.5a9.5 9.5 0 0 1 9.5 9.5' }],
      ['path', { d: 'M12 21.5A9.5 9.5 0 0 1 2.5 12' }],
    ],
  },
  'agent-loop': {
    category: 'agents',
    tags: ['autonomy', 'iterate', 'while-loop', 'self-directed', 'cycle'],
    elements: [
      ['path', { d: 'M4 12a8 8 0 0 1 13.7-5.7' }],
      ['path', { d: 'M18 2.2v4.3h-4.3' }],
      ['path', { d: 'M20 12a8 8 0 0 1-13.7 5.7' }],
      ['path', { d: 'M6 21.8v-4.3h4.3' }],
      ['path', { d: diamond(12, 12, 3.5) }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * models
   * ------------------------------------------------------------------ */
  model: {
    category: 'models',
    tags: ['llm', 'foundation-model', 'neural-network', 'ai'],
    elements: [
      ['path', { d: diamond(12, 12, 8, 2.2) }],
      ['path', { d: 'M12 12h.01' }],
    ],
  },
  'model-routing': {
    category: 'models',
    tags: ['router', 'fallback', 'gateway', 'load-balancer', 'picker'],
    elements: [
      ['path', { d: diamond(5.5, 12, 3.5) }],
      ['path', { d: 'M9.5 12h4' }],
      ['path', { d: 'M13.5 12 17.5 7' }],
      ['path', { d: 'M13.5 12h5' }],
      ['path', { d: 'M13.5 12 17.5 17' }],
      ['path', { d: 'M19.7 6h.01' }],
      ['path', { d: 'M20.7 12h.01' }],
      ['path', { d: 'M19.7 18h.01' }],
    ],
  },
  inference: {
    category: 'models',
    tags: ['generate', 'forward-pass', 'predict', 'run', 'output'],
    elements: [
      ['path', { d: diamond(8, 12, 5) }],
      ['path', { d: 'M15.5 12H21' }],
      ['path', { d: 'm18.5 9.5 2.5 2.5-2.5 2.5' }],
    ],
  },
  'fine-tuning': {
    category: 'models',
    tags: ['training', 'adapt', 'lora', 'customize', 'sliders'],
    elements: [
      ['path', { d: diamond(12, 7.5, 4.5) }],
      ['path', { d: 'M5 16.5h14' }],
      ['circle', { cx: '9.5', cy: '16.5', r: '1.5' }],
      ['path', { d: 'M5 20.5h14' }],
      ['circle', { cx: '14.5', cy: '20.5', r: '1.5' }],
    ],
  },
  temperature: {
    category: 'models',
    tags: ['sampling', 'randomness', 'creativity', 'top-p', 'parameter'],
    elements: [
      ['path', { d: 'M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z' }],
      ['path', { d: 'M12 13.5V9' }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * prompts
   * ------------------------------------------------------------------ */
  prompt: {
    category: 'prompts',
    tags: ['input', 'query', 'instruction', 'message', 'chat'],
    elements: [
      ['path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }],
      ['path', { d: 'm8 8 2.5 2.5L8 13' }],
      ['path', { d: 'M13 13h3' }],
    ],
  },
  'system-prompt': {
    category: 'prompts',
    tags: ['instructions', 'persona', 'configuration', 'preamble'],
    elements: [
      ['path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }],
      ['path', { d: 'M7.5 7.5h9' }],
      ['path', { d: 'M7.5 11h6' }],
    ],
  },
  'prompt-template': {
    category: 'prompts',
    tags: ['variables', 'placeholder', 'interpolation', 'braces'],
    elements: [
      ['path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }],
      ['path', { d: 'M10 7.5c-1 0-1.5.5-1.5 1.5v1c0 .7-.5 1-.5 1s.5.3.5 1v1c0 1 .5 1.5 1.5 1.5' }],
      ['path', { d: 'M14 7.5c1 0 1.5.5 1.5 1.5v1c0 .7.5 1 .5 1s-.5.3-.5 1v1c0 1-.5 1.5-1.5 1.5' }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * context
   * ------------------------------------------------------------------ */
  'context-window': {
    category: 'context',
    tags: ['context', 'window', 'capacity', 'working-memory'],
    elements: [
      ['path', { d: 'M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2' }],
      ['path', { d: 'M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2' }],
      ['path', { d: 'M9.5 9h5' }],
      ['path', { d: 'M9.5 12h5' }],
      ['path', { d: 'M9.5 15h2.5' }],
    ],
  },
  'context-compact': {
    category: 'context',
    tags: ['compaction', 'summarize', 'compress', 'condense'],
    elements: [
      ['path', { d: 'M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2' }],
      ['path', { d: 'M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2' }],
      ['path', { d: 'm9.5 5.5 2.5 2.5L14.5 5.5' }],
      ['path', { d: 'M9 12h6' }],
      ['path', { d: 'm9.5 18.5 2.5-2.5 2.5 2.5' }],
    ],
  },
  memory: {
    category: 'context',
    tags: ['long-term', 'store', 'recall', 'persistence', 'archive'],
    elements: [
      ['rect', { x: '3', y: '4', width: '18', height: '4', rx: '1' }],
      ['path', { d: 'M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8' }],
      ['path', { d: 'M9 14.5h1.5l1.25-2.5 1.75 4 1.25-2.5H16' }],
    ],
  },
  token: {
    category: 'context',
    tags: ['unit', 'text', 'billing', 'tokenize', 'piece'],
    elements: [
      ['rect', { x: '7', y: '7', width: '10', height: '10', rx: '3' }],
      ['path', { d: 'M12 12h.01' }],
    ],
  },
  tokens: {
    category: 'context',
    tags: ['tokenization', 'segments', 'text', 'pieces', 'count'],
    elements: [
      ['rect', { x: '2.5', y: '8', width: '5.5', height: '8', rx: '1.5' }],
      ['rect', { x: '9.25', y: '8', width: '5.5', height: '8', rx: '1.5' }],
      ['rect', { x: '16', y: '8', width: '5.5', height: '8', rx: '1.5' }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * tools
   * ------------------------------------------------------------------ */
  tool: {
    category: 'tools',
    tags: ['function', 'capability', 'action', 'plugin'],
    elements: [
      ['path', { d: hexagon(12, 12, 9, 2) }],
      ['circle', { cx: '12', cy: '12', r: '2.5' }],
    ],
  },
  'tool-call': {
    category: 'tools',
    tags: ['function-calling', 'invoke', 'execute', 'action'],
    elements: [
      ['path', { d: hexagon(15.5, 12, 6, 1.6) }],
      ['circle', { cx: '15.5', cy: '12', r: '2' }],
      ['path', { d: 'M2.5 12h5' }],
      ['path', { d: 'm5.5 9.5 2.5 2.5-2.5 2.5' }],
    ],
  },
  mcp: {
    category: 'tools',
    tags: ['model-context-protocol', 'connection', 'integration', 'protocol', 'socket'],
    elements: [
      ['rect', { x: '4', y: '4', width: '16', height: '16', rx: '4' }],
      ['path', { d: 'M9.5 10v4' }],
      ['path', { d: 'M14.5 10v4' }],
    ],
  },
  'mcp-server': {
    category: 'tools',
    tags: ['server', 'connector', 'integration', 'plug', 'host'],
    elements: [
      ['rect', { x: '3.5', y: '7.5', width: '17', height: '9', rx: '2' }],
      ['path', { d: 'M9.5 4v3.5' }],
      ['path', { d: 'M14.5 4v3.5' }],
      ['path', { d: 'M7.5 12h.01' }],
      ['path', { d: 'M11 12h.01' }],
      ['path', { d: 'M12 16.5V20' }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * retrieval
   * ------------------------------------------------------------------ */
  retrieval: {
    category: 'retrieval',
    tags: ['rag', 'search', 'semantic-search', 'lookup', 'query'],
    elements: [
      ['circle', { cx: '10.5', cy: '10.5', r: '6.5' }],
      ['path', { d: 'm15.2 15.2 5.3 5.3' }],
      ['path', { d: 'M8.5 10.5h.01' }],
      ['path', { d: 'M12.5 10.5h.01' }],
      ['path', { d: 'M10.5 8.5h.01' }],
      ['path', { d: 'M10.5 12.5h.01' }],
    ],
  },
  'vector-database': {
    category: 'retrieval',
    tags: ['embeddings', 'index', 'store', 'pinecone', 'similarity'],
    elements: [
      ['ellipse', { cx: '12', cy: '6', rx: '8', ry: '3' }],
      ['path', { d: 'M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6' }],
      ['path', { d: 'M9.5 16.5 14.5 11.5' }],
      ['path', { d: 'M14.5 14.5v-3h-3' }],
    ],
  },
  embedding: {
    category: 'retrieval',
    tags: ['vector', 'representation', 'encode', 'latent-space'],
    elements: [
      ['path', { d: 'M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2' }],
      ['path', { d: 'M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2' }],
      ['path', { d: 'M9 12h.01' }],
      ['path', { d: 'M12 9.5h.01' }],
      ['path', { d: 'M15 12h.01' }],
      ['path', { d: 'M12 14.5h.01' }],
    ],
  },
  grounding: {
    category: 'retrieval',
    tags: ['grounded', 'factual', 'evidence', 'anchored', 'truth'],
    elements: [
      ['path', { d: 'M12 4v8' }],
      ['path', { d: 'M5 12h14' }],
      ['path', { d: 'M8 15.5h8' }],
      ['path', { d: 'M10.5 19h3' }],
    ],
  },
  citation: {
    category: 'retrieval',
    tags: ['source', 'reference', 'attribution', 'footnote', 'asterisk'],
    elements: [
      ['path', { d: 'M7.5 4.5v7' }],
      ['path', { d: 'M4.5 6.25l6 3.5' }],
      ['path', { d: 'M10.5 6.25l-6 3.5' }],
      ['path', { d: 'M14.5 6h5.5' }],
      ['path', { d: 'M14.5 10h5.5' }],
      ['path', { d: 'M4 15h16' }],
      ['path', { d: 'M4 19h11' }],
    ],
  },
  hallucination: {
    category: 'retrieval',
    tags: ['ungrounded', 'confabulation', 'error', 'fabrication'],
    elements: [
      ['circle', { cx: '12', cy: '6', r: '2.5' }],
      ['path', { d: 'M12 10v2' }],
      ['path', { d: 'M12 14.5v2' }],
      ['path', { d: 'M4.5 19H10' }],
      ['path', { d: 'M14 19h5.5' }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * generation
   * ------------------------------------------------------------------ */
  generation: {
    category: 'generation',
    tags: ['output', 'completion', 'response', 'writing', 'produce'],
    elements: [
      ['path', { d: 'M4 6h16' }],
      ['path', { d: 'M4 11h16' }],
      ['path', { d: 'M4 16h6.5' }],
      ['path', { d: 'M13.5 14v4' }],
    ],
  },
  streaming: {
    category: 'generation',
    tags: ['stream', 'sse', 'realtime', 'flow', 'chunks'],
    elements: [
      ['path', { d: 'M3 7h4' }],
      ['path', { d: 'M10 7h4' }],
      ['path', { d: 'M17 7h4' }],
      ['path', { d: 'M5 12h4' }],
      ['path', { d: 'M12 12h4' }],
      ['path', { d: 'M19 12h2' }],
      ['path', { d: 'M3 17h4' }],
      ['path', { d: 'M10 17h4' }],
      ['path', { d: 'M17 17h4' }],
    ],
  },
  'stop-generation': {
    category: 'generation',
    tags: ['stop', 'abort', 'cancel', 'interrupt', 'halt'],
    elements: [
      ['circle', { cx: '12', cy: '12', r: '9' }],
      ['rect', { x: '9', y: '9', width: '6', height: '6', rx: '1' }],
    ],
  },
  regenerate: {
    category: 'generation',
    tags: ['retry', 'refresh', 'redo', 'again', 'resample'],
    elements: [
      ['path', { d: 'M4 12a8 8 0 0 1 13.7-5.7' }],
      ['path', { d: 'M18 2.2v4.3h-4.3' }],
      ['path', { d: 'M20 12a8 8 0 0 1-13.7 5.7' }],
      ['path', { d: 'M6 21.8v-4.3h4.3' }],
      ['path', { d: 'M12 12h.01' }],
    ],
  },
  'structured-output': {
    category: 'generation',
    tags: ['json', 'schema', 'typed', 'format', 'parse'],
    elements: [
      ['path', { d: 'M9 4c-1.5 0-2.5 1-2.5 2.5v3c0 1-.7 1.6-1.5 2 .8.4 1.5 1 1.5 2v3C6.5 18 7.5 19 9 19' }],
      ['path', { d: 'M15 4c1.5 0 2.5 1 2.5 2.5v3c0 1 .7 1.6 1.5 2-.8.4-1.5 1-1.5 2v3c0 1.5-1 2.5-2.5 2.5' }],
      ['path', { d: 'M12 9h.01' }],
      ['path', { d: 'M12 14h.01' }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * reasoning
   * ------------------------------------------------------------------ */
  reasoning: {
    category: 'reasoning',
    tags: ['thinking', 'extended-thinking', 'deliberate', 'plan'],
    elements: [
      ['path', { d: 'M4 19h4a2 2 0 0 0 2-2v-3a2 2 0 0 1 2-2h3a2 2 0 0 0 2-2V5' }],
      ['path', { d: 'M14.5 7.5 17 5l2.5 2.5' }],
    ],
  },
  'chain-of-thought': {
    category: 'reasoning',
    tags: ['cot', 'steps', 'trace', 'sequential', 'thought'],
    elements: [
      ['circle', { cx: '5', cy: '19', r: '2' }],
      ['circle', { cx: '12', cy: '12', r: '2' }],
      ['circle', { cx: '19', cy: '5', r: '2' }],
      ['path', { d: 'M6.4 17.6 10.6 13.4' }],
      ['path', { d: 'M13.4 10.6 17.6 6.4' }],
    ],
  },
  plan: {
    category: 'reasoning',
    tags: ['tasks', 'todo', 'steps', 'checklist', 'strategy'],
    elements: [
      ['rect', { x: '3', y: '4.5', width: '3', height: '3', rx: '0.75' }],
      ['rect', { x: '3', y: '10.5', width: '3', height: '3', rx: '0.75' }],
      ['rect', { x: '3', y: '16.5', width: '3', height: '3', rx: '0.75' }],
      ['path', { d: 'M9.5 6h11' }],
      ['path', { d: 'M9.5 12h11' }],
      ['path', { d: 'M9.5 18h6' }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * ops
   * ------------------------------------------------------------------ */
  guardrails: {
    category: 'ops',
    tags: ['safety', 'constraints', 'policy', 'limits', 'moderation'],
    elements: [
      ['path', { d: 'M5 4v16' }],
      ['path', { d: 'M19 4v16' }],
      ['path', { d: 'M12 5v3' }],
      ['path', { d: 'M12 10.5v3' }],
      ['path', { d: 'M12 16v3' }],
    ],
  },
  sandbox: {
    category: 'ops',
    tags: ['isolation', 'vm', 'container', 'safe-execution', 'test'],
    elements: [
      ['path', { d: 'M8 3.5H6A2.5 2.5 0 0 0 3.5 6v2' }],
      ['path', { d: 'M16 3.5h2A2.5 2.5 0 0 1 20.5 6v2' }],
      ['path', { d: 'M3.5 16v2A2.5 2.5 0 0 0 6 20.5h2' }],
      ['path', { d: 'M20.5 16v2a2.5 2.5 0 0 1-2.5 2.5h-2' }],
      ['path', { d: roundedPolygon([[12, 8], [15.5, 10], [15.5, 14], [12, 16], [8.5, 14], [8.5, 10]], 0.9) }],
      ['path', { d: 'm8.7 10.2 3.3 1.9 3.3-1.9' }],
      ['path', { d: 'M12 12.1V16' }],
    ],
  },
  evaluation: {
    category: 'ops',
    tags: ['eval', 'benchmark', 'score', 'test', 'quality'],
    elements: [
      ['path', { d: 'M4 20h16' }],
      ['path', { d: 'M7 20v-5' }],
      ['path', { d: 'M12 20v-9' }],
      ['path', { d: 'M17 20v-7' }],
      ['path', { d: 'm14.5 7 2.5 2.5L21.5 5' }],
    ],
  },
  trace: {
    category: 'ops',
    tags: ['observability', 'spans', 'waterfall', 'debug', 'telemetry'],
    elements: [
      ['path', { d: 'M4 6h7' }],
      ['path', { d: 'M8 12h9' }],
      ['path', { d: 'M13 18h7' }],
    ],
  },
  cost: {
    category: 'ops',
    tags: ['price', 'billing', 'spend', 'budget', 'usage'],
    elements: [
      ['path', { d: 'M12.9 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.5a2 2 0 0 0 .6 1.4l8.5 8.5a2.4 2.4 0 0 0 3.4 0l6.9-6.9a2.4 2.4 0 0 0 0-3.4Z' }],
      ['path', { d: 'M7 7h.01' }],
    ],
  },
  'usage-meter': {
    category: 'ops',
    tags: ['quota', 'consumption', 'capacity', 'limit', 'level'],
    elements: [
      ['rect', { x: '3', y: '8.5', width: '18', height: '7.5', rx: '2' }],
      ['path', { d: 'M7 11v2.5' }],
      ['path', { d: 'M11 11v2.5' }],
    ],
  },
  'rate-limit': {
    category: 'ops',
    tags: ['throttle', '429', 'quota', 'requests', 'gauge'],
    elements: [
      ['path', { d: 'M4 16.5a8 8 0 0 1 16 0' }],
      ['path', { d: 'M12 16.5 16.2 11.3' }],
      ['circle', { cx: '12', cy: '16.5', r: '1' }],
    ],
  },
  latency: {
    category: 'ops',
    tags: ['speed', 'time-to-first-token', 'performance', 'timer', 'ttft'],
    elements: [
      ['circle', { cx: '12', cy: '14', r: '7.5' }],
      ['path', { d: 'M12 14v-4' }],
      ['path', { d: 'M10 2.5h4' }],
    ],
  },

  /* ------------------------------------------------------------------ *
   * modality
   * ------------------------------------------------------------------ */
  'computer-use': {
    category: 'modality',
    tags: ['desktop', 'automation', 'screen', 'cursor', 'operator'],
    elements: [
      ['rect', { x: '3', y: '4', width: '18', height: '12', rx: '2' }],
      ['path', { d: 'M12 16v4' }],
      ['path', { d: 'M8.5 20h7' }],
      ['path', { d: 'm9.5 7 6 2.5-2.7.9-.9 2.7Z' }],
    ],
  },
  'browser-agent': {
    category: 'modality',
    tags: ['web', 'browsing', 'automation', 'navigate', 'scrape'],
    elements: [
      ['rect', { x: '3', y: '4', width: '18', height: '16', rx: '2' }],
      ['path', { d: 'M3 9h18' }],
      ['path', { d: 'M6 6.5h.01' }],
      ['path', { d: 'M9 6.5h.01' }],
      ['path', { d: diamond(12, 14.5, 3) }],
    ],
  },
  'voice-agent': {
    category: 'modality',
    tags: ['speech', 'audio', 'realtime', 'waveform', 'assistant'],
    elements: [
      ['path', { d: 'M3 10v4' }],
      ['path', { d: 'M7 7v10' }],
      ['path', { d: diamond(12, 12, 3.5) }],
      ['path', { d: 'M17 7v10' }],
      ['path', { d: 'M21 10v4' }],
    ],
  },
};

export const categories = [
  'agents',
  'models',
  'prompts',
  'context',
  'tools',
  'retrieval',
  'generation',
  'reasoning',
  'ops',
  'modality',
];
