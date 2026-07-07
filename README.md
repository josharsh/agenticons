<p align="center">
  <a href="https://josharsh.github.io/agenticons/">
    <img src="https://raw.githubusercontent.com/josharsh/agenticons/main/preview.svg" alt="All 51 agenticons — icons for agents, MCP, tool calls, RAG, tokens, context windows" width="920">
  </a>
</p>

<h1 align="center">agenticons</h1>

<p align="center"><b>The missing icons for AI products.</b><br>
51 stroke icons for the concepts agentic UIs actually render — agents, tool calls, MCP, context windows, tokens, RAG, evals — designed as one consistent notation. Zero sparkles. ✨🚫</p>

<p align="center">
  <a href="https://www.npmjs.com/package/agenticons"><img src="https://img.shields.io/npm/v/agenticons?color=2455c3" alt="npm version"></a>
  <a href="https://bundlephobia.com/package/agenticons"><img src="https://img.shields.io/bundlephobia/minzip/agenticons?label=minzip" alt="bundle size"></a>
  <a href="https://www.npmjs.com/package/agenticons"><img src="https://img.shields.io/npm/types/agenticons" alt="TypeScript types included"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/agenticons" alt="MIT license"></a>
</p>

<p align="center">
  <a href="https://josharsh.github.io/agenticons/"><b>Browse &amp; search all icons →</b></a><br>
  <sub><a href="https://github.com/josharsh/agenticons">GitHub</a> · <a href="https://www.npmjs.com/package/agenticons">npm</a> · <a href="https://github.com/josharsh/agenticons/issues/new">Propose an icon</a></sub>
</p>

---

## Install

```sh
npm install agenticons
# pnpm add agenticons · yarn add agenticons · bun add agenticons
```

```tsx
import { Agent, ToolCall, Mcp, ContextWindow } from 'agenticons';

<Agent />
<ToolCall size={16} />
<ContextWindow strokeWidth={1.5} color="#7c3aed" />
<Mcp className="text-violet-500" aria-label="MCP server" />
```

That's it. Icons are React components on the same spec as Lucide — 24×24 grid, 2px stroke, `currentColor` — so they sit next to `lucide-react` in a shadcn/ui app with **zero visual seams**.

## Why this exists

Every AI feature ships behind the same sparkle icon, and [NN/g's research](https://www.nngroup.com/articles/ai-sparkles-icon-problem/) found that shown in isolation, **not one participant read it as "AI."** Meanwhile the concepts agent products render every day have no icons anywhere:

- Your agent UI shows a **context meter** — there is no context-window icon in any major set.
- The MCP spec now has [protocol-level icon slots](https://modelcontextprotocol.io/specification/2025-11-25/changelog) — and clients fall back to a generic glyph.
- Vercel AI Elements ships `Reasoning`, `Tool`, `Task`, `Sources`, `Context` components — improvised with wrenches and chevrons.
- Lucide, the default icon set of the AI era, has ~10 AI-adjacent glyphs. **No agent, no tool call, no MCP, no token, no handoff, no RAG.**

`agenticons` fills exactly that gap — nothing more. It's a companion to your icon set, not a replacement.

## A notation, not 51 drawings

Like circuit symbols or map legends, everything composes from a few primitives — learn three icons and you can read the rest:

| Primitive | Meaning |
|---|---|
| ◇ diamond | a model (LLM) |
| arcs orbiting a mark | autonomy |
| person | a human |
| ⬡ hexagon | a tool |
| `[ ]` brackets | context — what the model can see |
| ▢ rounded tile | a token |
| · dot | a data point |

So **agent** = model + autonomy orbit. **Handoff** = model → model. **Tool call** = arrow into a hexagon. **Grounding** = the electrical ground symbol. **Hallucination** = the same mark, cut off from ground. **Human-in-the-loop** = a person inside the orbit.

## What's inside

**51 icons · 10 categories · 0 dependencies** (React is the only peer)

| Category | Icons |
|---|---|
| **agents** | `agent` `agents` `subagent` `swarm` `orchestration` `handoff` `handoff-human` `human-in-the-loop` `agent-loop` |
| **models** | `model` `model-routing` `inference` `fine-tuning` `temperature` |
| **prompts** | `prompt` `system-prompt` `prompt-template` |
| **context** | `context-window` `context-compact` `memory` `token` `tokens` |
| **tools** | `tool` `tool-call` `mcp` `mcp-server` |
| **retrieval** | `retrieval` `vector-database` `embedding` `grounding` `citation` `hallucination` |
| **generation** | `generation` `streaming` `stop-generation` `regenerate` `structured-output` |
| **reasoning** | `reasoning` `chain-of-thought` `plan` |
| **ops** | `guardrails` `sandbox` `evaluation` `trace` `cost` `usage-meter` `rate-limit` `latency` |
| **modality** | `computer-use` `browser-agent` `voice-agent` |

## Props

Every icon accepts all `SVGProps<SVGSVGElement>`, plus:

| Prop | Default | Description |
|---|---|---|
| `size` | `24` | Width and height |
| `strokeWidth` | `2` | Stroke width |
| `absoluteStrokeWidth` | `false` | Keep the stroke visually 2px at any size |
| `color` | `currentColor` | Stroke color (inherits from CSS by default) |

Icons render `aria-hidden="true"` unless you pass `aria-label` / `aria-labelledby`.

## FAQ

### Does it tree-shake?

Yes — every icon is its own ESM file with `sideEffects: false`, so you bundle only what you import (the whole package is ~24 kB unpacked for all 51). For maximum control there are per-icon deep imports:

```tsx
import Agent from 'agenticons/icons/agent';
```

### Can I mix it with Lucide / Heroicons?

That's the intended use. Same grid, same stroke, same prop API as `lucide-react` — use Lucide for files and folders, agenticons for agents and tool calls, in the same toolbar.

### How does it compare?

| | AI concept coverage | Style | License |
|---|---|---|---|
| **agenticons** | 51 agentic concepts (agents, MCP, RAG, tokens…) | 1 (stroke) | MIT, all icons free |
| lucide | ~10 AI-adjacent glyphs (sparkles, bot, brain) | 1 (stroke) | ISC |
| @lobehub/icons | 1,100+ AI **brand logos** (OpenAI, Anthropic…) | brand | MIT |
| hugeicons free | AI category is mostly gen-media (ai-art, ai-audio) | 1 free / 10 pro | MIT / paid |

Different jobs: Lobe for brand logos, Lucide for general UI, **agenticons for agentic concepts**.

### Other frameworks?

React today. The source of truth is framework-agnostic (SVG paths + JSON metadata, [one file](./src/definitions.mjs)), and the raw SVGs ship in the package at `agenticons/dist/svg/*.svg` — usable anywhere. Vue/Svelte wrappers are on the roadmap; PRs welcome.

### Is there a catch?

No. All 51 icons are MIT. No pro tier, no email wall, no attribution requirement.

### Where do I see them all?

**[josharsh.github.io/agenticons](https://josharsh.github.io/agenticons/)** — searchable by name and tag (`rag`, `safety`, `billing`…), with size/stroke controls and click-to-copy imports. Also shipped in the package as `metadata.json` for programmatic search.

## Design spec

24×24 canvas · 2px centered stroke, round caps · corners rounded in the path geometry (radius scales with shape size) · `currentColor`, `fill="none"` · element whitelist, no transforms · named by **meaning** (`grounding`), not appearance. The spec is enforced by the build — every icon is validated before it can ship.

## Contributing

Icon proposals welcome as [issues](https://github.com/josharsh/agenticons/issues) — describe the concept, where real products need it, and how it composes from the primitives. Source of truth is [`src/definitions.mjs`](./src/definitions.mjs); `npm run build && npm test && npm run gallery` regenerates and validates everything.

## License

[MIT](./LICENSE) © Harsh Joshi. Visual language intentionally compatible with [Lucide](https://lucide.dev)'s stroke style; a few universal metaphors (thermometer, timer, refresh arrows) follow ecosystem-wide conventions.
