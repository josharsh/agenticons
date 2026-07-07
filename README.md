# agenticons

**Icons for the agentic era.** 51 open-source icons for the concepts AI products actually ship — agents, tool calls, MCP, context windows, tokens, RAG, evals — drawn as a consistent notation instead of yet another sparkle. ✨🚫

[![npm](https://img.shields.io/npm/v/agenticons)](https://www.npmjs.com/package/agenticons)
[![license](https://img.shields.io/npm/l/agenticons)](./LICENSE)

![All agenticons](https://raw.githubusercontent.com/josharsh/agenticons/main/preview.svg)

## Why

Every AI feature ships behind the same sparkle icon — and [NN/g's research](https://www.nngroup.com/articles/ai-sparkles-icon-problem/) found that shown in isolation, *not one participant* read it as "AI". Meanwhile the concepts agentic products render every day — tool calls, handoffs, context windows, grounding, human-in-the-loop — have **no icons at all**. Lucide has ~10 AI-adjacent glyphs; npm has brand logos and little else.

`agenticons` treats AI iconography the way circuit diagrams treat electronics: as a **notation**. A few primitives compose into every concept, so once you've seen three icons you can read the rest:

| Primitive | Meaning |
|---|---|
| ◇ diamond | a model (LLM) |
| arcs orbiting a mark | autonomy |
| person | a human |
| ⬡ hexagon | a tool |
| `[ ]` brackets | context — what the model can see |
| ▢ rounded tile | a token |
| · dot | a data point |

So: **agent** = model + autonomy orbit. **Handoff** = model → model. **Tool call** = arrow into a hexagon. **RAG retrieval** = a lens over data points. **Grounding** = the electrical ground symbol. **Hallucination** = the same mark, cut off from ground.

## Install

```sh
npm install agenticons
```

React ≥16.8 is the only peer dependency.

## Usage

```tsx
import { Agent, ToolCall, ContextWindow, Mcp } from 'agenticons';

<Agent />
<ToolCall size={16} />
<ContextWindow strokeWidth={1.5} color="#7c3aed" />
<Mcp aria-label="MCP server" />
```

Drop-in compatible with the Lucide look: 24×24 grid, 2px stroke, round caps, `currentColor`. Mix freely with `lucide-react` in the same UI — no visual seams.

Every icon is also exported with an `Icon` suffix (`AgentIcon`) if you prefer that convention, and available as a deep import for maximal tree-shaking control:

```tsx
import Agent from 'agenticons/icons/agent';
```

### Props

All standard `SVGProps<SVGSVGElement>`, plus:

| Prop | Default | Description |
|---|---|---|
| `size` | `24` | Width and height |
| `strokeWidth` | `2` | Stroke width |
| `absoluteStrokeWidth` | `false` | Keep the stroke visually 2px at any size |
| `color` | `currentColor` | Stroke color |

Icons render `aria-hidden="true"` unless you pass `aria-label`/`aria-labelledby`.

### Raw SVGs and metadata

The package ships the raw SVG files and a searchable manifest:

```js
import metadata from 'agenticons/metadata.json' with { type: 'json' };
// { count, categories, icons: { 'tool-call': { pascalName, category, tags } } }
```

```
node_modules/agenticons/dist/svg/agent.svg
```

## The icons

**agents** — `agent` `agents` `subagent` `swarm` `orchestration` `handoff` `handoff-human` `human-in-the-loop` `agent-loop`

**models** — `model` `model-routing` `inference` `fine-tuning` `temperature`

**prompts** — `prompt` `system-prompt` `prompt-template`

**context** — `context-window` `context-compact` `memory` `token` `tokens`

**tools** — `tool` `tool-call` `mcp` `mcp-server`

**retrieval** — `retrieval` `vector-database` `embedding` `grounding` `citation` `hallucination`

**generation** — `generation` `streaming` `stop-generation` `regenerate` `structured-output`

**reasoning** — `reasoning` `chain-of-thought` `plan`

**ops** — `guardrails` `sandbox` `evaluation` `trace` `cost` `usage-meter` `rate-limit` `latency`

**modality** — `computer-use` `browser-agent` `voice-agent`

## Design spec

- 24×24 canvas, ≥1px padding, 2px centered stroke, round caps and joins
- `currentColor`, `fill="none"` — no fills, no transforms, no filters
- Elements limited to `path` `circle` `rect` `line` `polyline` `polygon` `ellipse`
- Named by **meaning**, not appearance — these are semantic notation, so `grounding`, not `lines-with-a-stem`
- The spec is enforced by the build (`scripts/build.mjs` validates before emitting)

## Contributing

Icon proposals are welcome as issues — describe the concept, where real products need it, and how it composes from the existing primitives. The single source of truth is [`src/definitions.mjs`](./src/definitions.mjs); `npm run build && npm test && npm run preview` regenerates and validates everything.

## License

[MIT](./LICENSE). The visual language is intentionally compatible with [Lucide](https://lucide.dev)'s stroke style so the two sets can be mixed; a few universal metaphors (thermometer, timer, refresh arrows) follow ecosystem-wide conventions.
