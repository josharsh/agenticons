# AI Iconography Landscape: What Exists, What Products Need, Where the Gaps Are

Researched 2026-07-07. Sources linked inline.

---

## 1. Existing AI icon sets

### Dedicated AI icon libraries

| Library | Size | What it covers | Style/format | Notes |
|---|---|---|---|---|
| **Lobe Icons** (`@lobehub/icons`) | 1,135+ | **Brand logos only** — OpenAI, Anthropic, model providers, incl. an MCP logo | SVG, React, RN | De facto standard for AI *brand* icons. Does **not** cover concepts (agent, RAG, tool call) |
| **Hugeicons AI category** | 1,370 | ai-art, ai-audio, ai-brain… mostly "AI + existing noun" composites | 9 styles | Mostly generative-media features (sparkle-on-thing); majority PRO-gated |
| **Streamline** | across 10,500+ system | "AI chip spark," "AI cloud spark" — sparkle composites | 4 families | Redesigned their AI sparkles for legibility — even vendors admit sparkles had problems |
| **Icons8 / Flaticon / Noun Project / Iconscout** | hundreds–thousands | Brains, chips, robots, circuit heads | mixed | Volume without system consistency |

### General-purpose libraries' AI coverage

- **Lucide** (default for shadcn/ui, and thus most AI startups): `sparkles`, `sparkle`, `bot`, `bot-message-square`, `brain`, `brain-circuit`, `brain-cog`, `wand`, `wand-sparkles`, `cpu` — **~10 icons for the entire AI domain**. No agent, RAG, MCP, token, or context-window concepts.
- **Material Symbols**: `smart_toy`, `psychology`, `auto_awesome`; Google put sparkles into ~100 system icons by 2024.
- **Figma Community**: largest conceptual set found is 87 icons ("AI Icons: Text and Image Generation"); all focus on 2023-era gen-media features, not agentic concepts.
- **npm**: essentially **nothing dedicated to AI concept icons** — only company-internal libraries. The niche is empty apart from Lobe's brand logos.

**Bottom line:** market splits into (a) brand logos (solved by Lobe), (b) stock brains/chips/robots (low quality), (c) 2023-era gen-media sets, (d) ~10 icons in mainstream dev libraries. Nobody has shipped a coherent, npm-distributed **agentic-concept** icon system.

---

## 2. What AI products actually need (and improvise)

- **ChatGPT**: globe = web search, **telescope = deep research**, **lightbulb = think longer** — OpenAI invents per-feature metaphors rather than reusing sparkles.
- **Google/Gemini**: sparkle as universal AI marker; their own research says it can't distinguish AI types.
- **Perplexity**: asterisk (citation symbol) as brand + UI motif — chosen because citing sources is their differentiator. Claude uses a starburst/asterisk too. The asterisk is the emerging "thoughtful" alternative to the sparkle.
- **Vercel AI Elements** (elements.ai-sdk.dev): 20+ components — Reasoning, Tool, Task, Sources/InlineCitation, Context — all need icons; they improvise with Lucide (`wrench` for tools, chevrons for reasoning, generic check/spinner/X for tool-call states). **Agentic UI primitives exist as components but have no dedicated icon language.**
- **MCP ecosystem**: the 2025-11-25 MCP spec (SEP-973) added `icons` metadata for servers/tools/prompts/resources — the protocol now assumes every tool ships an icon, but clients show a generic icon for custom servers and users file issues asking for custom MCP icons. **Demand for tool/server iconography is protocol-level.**
- **IBM Carbon for AI**: rejected the sparkle — uses an "AI label" component + gradient/glow "AI layer" (light as metaphor). Enterprise design systems treat "AI presence" as a *treatment*, not an icon.
- **Agent UX literature** (Shape of AI, agentic-design.ai, UX Magazine): plan review, fork points, confidence visualization, control handoff, guardrails, HITL approval — all described in prose/diagrams, **none with named icon conventions**.

Improvised today: agent (bot/orb), multi-agent (nothing), tool call (wrench), MCP server (plug/puzzle/generic), RAG (magnifier+database), vector DB (cylinder), embedding (nothing), context window (nothing), token (coin — misleading), prompt (chat bubble), system prompt (nothing), streaming (dots), reasoning (lightbulb/brain/chevron), guardrails (shield), HITL (user+check), handoff (arrows), memory (indistinct from save), eval (checklist), temperature (thermometer), citations (asterisk), sandbox (box), computer use (monitor+cursor), voice agent (waveform+sparkle).

---

## 3. The "sparkle problem" — documented and researched

- **NN/g "The Proliferation and Problem of the ✨ Sparkles ✨ Icon"** (n=107): shown in isolation, **not one participant said "AI."** Interpretations scattered across favoriting, visual effects, rewards; 73% associate stars with saving.
- **Slate** (Dec 2025): as of Sept 2024 only **17% of users correctly identified sparkles as AI**; magic metaphor inflates expectations and masks risk.
- **Google Design's own research** (2,000 participants, 8 countries): sparkle recognition improving but **cannot signal which kind of AI**; combined icons (mic+sparkle) outperform sparkle alone.
- **Shape of AI — Iconography pattern**: "when sparkles alone are applied everywhere, they lose meaning"; "no dominant convention has yet emerged."
- Brand-level convergence too: hexagons 4.6× overrepresented in AI logos; the circular-swirl monoculture is a meme ("AI logos look like buttholes").

**Alternatives proposed:** functional icons per task; the asterisk family; gradient/glow treatments instead of icons (IBM); combined base-icon + AI-modifier (Google's finding); labels over icon-only (NN/g). **No alternative has won; the field is explicitly unsettled.**

---

## 4. Gaps: agentic concepts with no icon convention (ranked)

**Tier 1 — no convention at all, high and rising demand:**
1. Context window / context usage (every agent UI has a meter; zero icon exists)
2. MCP server / MCP tool (protocol-level icon slots exist; no concept glyph)
3. Multi-agent / swarm / orchestration / subagent
4. Handoff (agent→human, agent→agent)
5. Token / tokenization (coins mislead)
6. Hallucination / grounding
7. Human-in-the-loop / approval gate
8. System prompt vs. user prompt distinction
9. Eval / benchmark (whole product category using generic checklists)
10. Model routing / model picker

**Tier 2 — weak/borrowed conventions, contested:**
11. Agent itself (robot head = dated, orb = trending consumer, `bot` reads "chatbot")
12. Tool call / function calling (wrench = settings/repair for 30 years)
13. RAG / retrieval, vector DB, embedding
14. Reasoning / chain-of-thought (lightbulb vs brain vs chevron — unsettled)
15. Memory (indistinguishable from save/history)
16. Guardrails, sandbox, computer use, browser agent, voice agent, fine-tuning, inference, streaming, temperature

**Well-served (don't bother):** AI brand logos (Lobe), generative image/video editing features, generic "AI = sparkle/brain/chip/robot."

---

## 5. Adjacent trends

- **Animated icons**: Lordicon at 45,900+ with trigger-based animation. AI states (thinking, streaming, tool-running) are inherently *temporal* — arguably need motion, not static glyphs.
- **Icons as MCP servers**: lucide-icons-mcp, better-icons, icon-mcp — icon distribution itself is becoming agent-native.
- **AI-generated icons**: Recraft (native SVG gen), IconScout AI, Figma plugins, Thiings (7K AI-generated 3D icons). Irony: "AI icon" products generate icons *with* AI rather than providing icons *for* AI concepts.
- **Variable icons**: Material Symbols — 2,500+ glyphs, one variable font, four axes (weight, fill, grade, optical size), animated state transitions via CSS interpolation. The technical bar for a modern system.
- **Two-channel future**: IBM Carbon suggests pairing *icons* (what the feature does) with *treatments* (that AI did it).

---

## Strategic read

1. **Whitespace is precise**: a consistent, Lucide-compatible (24px stroke, tree-shakeable React/npm) icon set for agentic concepts. Nothing occupies it.
2. **Two tailwinds**: MCP SEP-973 makes tool/server icons a protocol expectation; Vercel AI Elements gives exact component names (Reasoning, Tool, Task, Sources, Context) an icon set can map to 1:1.
3. **Differentiation**: explicitly anti-sparkle — the criticism (NN/g, Slate, Shape of AI) is the marketing copy.
4. **Motion**: agentic states are temporal; animated/stateful variants would be genuinely novel.
