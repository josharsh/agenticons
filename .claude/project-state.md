# Project State
Last touched: 2026-07-08

## Latest
- v0.2.2 published: launch-ready README (visual-first template from npm-marketing research, saved knowledge in git log + this session), search-tuned description/keywords (incl. lucide/heroicons intercept terms), gallery hosted at https://josharsh.github.io/agenticons/ (docs/index.html, GitHub Pages).
- v0.2.0–0.2.1: craft pass — rounded corner geometry via `roundedPolygon()/diamond()/hexagon()` helpers; human-in-the-loop spacing fix; gallery has theme toggle (?theme=light|dark), grammar legend, scaled/absolute stroke.
- Launch playbook (user actions, from research): set GitHub social preview card; seed stars from network BEFORE public launch; fire HN+Twitter+Reddit within 48h; answer every HN comment; patch-publish npm right before launch so README snapshot is fresh.

## Now
- **Shipped**: `agenticons@0.1.0` live on npm; repo public at github.com/josharsh/agenticons with v0.1.0 release. 51 icons, 10 categories, React ESM/CJS/types + raw SVGs + metadata.json, tests + typecheck green, verified end-to-end from the public registry.

## Next
- Launch content: anti-sparkle post (NN/g data is the hook) for HN/design Twitter; research reports in `research/` are the raw material.
- Docs site with icon search (embedding-powered search = unclaimed edge; see research/01).
- Grow the set: tier-2 gaps still open — `eval-suite`, `model-picker`, `approval-gate` variants, stateful/animated tier (pending/running/error states per icon).
- Icons-as-MCP-server distribution + SEP-973 icon CDN idea (see research/02 §5).

## Blockers / Open questions
- None. npm + gh auth both work from this machine.

## Decisions
- 2026-07-07: Name = `agenticons` (npm was free; `agentic-icons` taken). Single React package, per-icon files, `sideEffects: false`.
- 2026-07-07: Source of truth = `src/definitions.mjs` (JS objects, not SVG files); build validates spec then emits esm/cjs/types/svg/metadata. Deviation from Lucide's per-SVG-file convention, chosen for iteration speed.
- 2026-07-07: Lucide-compatible spec (24×24, 2px stroke, round caps, currentColor) so icons mix seamlessly with lucide-react in shadcn apps — that's the adoption path.
- 2026-07-07: Icons named by meaning (`grounding`), not appearance — this is semantic notation; documented in README.
- 2026-07-07: Target agentic-concept whitespace; anti-sparkle positioning (research saved in `research/`).
