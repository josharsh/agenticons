# Project State
Last touched: 2026-07-07

## Now
- Research + ideation phase for an AI/agentic-era icon library. Two research reports saved in `research/` (icon-library engineering teardown, AI icon landscape + gaps).

## Next
- Pick a name and lock the visual grammar (primitives + modifiers + state ring).
- Draft the first 12 "flagship" glyphs (agent, tool call, MCP, context window, token, handoff, HITL, grounding) in Figma or hand-coded SVG.
- Scaffold repo: `icons/*.svg` + per-icon JSON metadata → codegen React package (Lucide-spec-compatible: 24×24, 2px stroke, currentColor).

## Blockers / Open questions
- Name not chosen yet.
- Static-first vs animated-first for v1 (recommendation: static SVGs with CSS-animatable state variants, no Lottie).

## Decisions
- 2026-07-07: Target the agentic-concept whitespace (agent, tool call, MCP, context, token, handoff…) — brand logos (Lobe) and gen-media sparkle sets (Hugeicons) are saturated; npm has zero agentic-concept sets.
- 2026-07-07: Positioning = anti-sparkle "notation, not metaphor" — compositional symbol grammar + built-in state variants; Lucide-compatible spec for drop-in adoption via shadcn/AI Elements ecosystem.
