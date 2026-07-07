# Icon Library Teardown: Engineering & Business of Modern Icon Systems

Researched 2026-07-07. Libraries: Lucide, Heroicons, Phosphor, Tabler, Iconoir, Radix Icons, Hugeicons, Streamline.

---

## 0. At-a-glance comparison

| Library | Icons | Grid | Stroke | Styles | License | Model |
|---|---|---|---|---|---|---|
| Lucide | 1,745 | 24×24 | 2px, round caps/joins | 1 (outline only) | ISC | Open Collective donations |
| Heroicons | 316 | 24 / 20 / 16 | 1.5px (24 outline) | 4 (outline, solid, mini, micro) | MIT | Tailwind Labs loss-leader |
| Phosphor | 1,248+ ×6 | designed at 16×16, ships 256 viewBox | flattened fills (raw strokes Figma-only) | 6 weights via prop | MIT | Donations (OC/Ko-fi/Patreon) |
| Tabler | 6,146 (5,093 outline + 1,053 filled) | 24×24 | 2px, adjustable | 2 (outline/filled) | MIT | Sponsors + $9/$69 paid bundles |
| Iconoir | 1,600+ | 24×24 | 1.5px, round caps/joins | 2 (regular/solid folders) | MIT | Open Collective |
| Radix Icons | 318 | **15×15** | fills | 1 | MIT | WorkOS-subsidized |
| Hugeicons | 5,400+ free / 54,000+ pro | 24×24 | 1.5px default (1/1.5/2 variants) | **10 styles** | MIT (free pkg) / commercial | Freemium, $99/yr or $1,197 lifetime |
| Streamline | ~100K free / ~360K total | varies per family | varies | 4 families × 6 variations + legacy sets | attribution-free / commercial | Subscription $19–29/mo |

---

## 1. Design pipeline

**Grid + stroke conventions cluster around 24×24:**

- **Lucide** publishes the most explicit spec ([icon design guide](https://lucide.dev/contribute/icon-design-guide)): 24×24 canvas with ≥1px inner padding (22×22 live area), 2px centered stroke, round caps/joins, **2px corner radius on shapes ≥8px, 1px radius below**, 2px minimum spacing between distinct elements, arc centers snapped to grid for low-DPI crispness, and optical centering against circle/square keyline reference icons ("center of gravity"). SVG element whitelist only (`path/line/polygon/polyline/circle/ellipse/rect`), **no transforms, no fills, no filters**, paths minified to 3 decimals. Required root attrs on every file: `width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`. Naming: kebab-case, named by appearance not function ("floppy-disk" not "save").
- **Heroicons**: 24 outline at **1.5px stroke**, plus 24 solid, 20 solid (mini), 16 solid (micro). Designed in-house by Steve Schoger / Tailwind team.
- **Tabler**: 24×24, 2px default stroke, designed so stroke width is user-adjustable at runtime.
- **Iconoir**: 24×24, 1.5px stroke, `currentColor`, round caps/joins.
- **Phosphor**: designed at 16×16 "to read well small and scale up big", but ships **flattened outline fills on `viewBox="0 0 256 256"`** — no live strokes in distributed SVGs; editable strokes exist only in the Figma "Raw" assets. Designed by Helena Zhang, engineered by Tobias Fried.
- **Radix Icons**: **15×15** — odd-dimension grid so icons stay pixel-sharp at small sizes (buttons, dropdowns, dense UIs).
- **Hugeicons**: 24×24, 1.5px default stroke, rounded caps; web CSS exposes `.icon-thin` (1px), `.icon-regular` (1.5px), `.icon-bold` (2px).

**How consistency is enforced at scale — two models:**

1. **Community contributions + CI enforcement (Lucide only).** Per-editor contribution guides plus **Lucide Studio** (studio.lucide.dev), a purpose-built web SVG editor that formats icons into Lucide style. GitHub Actions police everything: PR icon-preview rendering, icon linting, filename linting, SVGO normalization, AJV JSON-schema validation of per-icon metadata, and auto-suggested tags/categories on PRs.
2. **In-house design, PRs rejected (everyone else).** Phosphor doesn't accept icon design contributions; Iconoir routes new icons through issues only; Heroicons accepts bug fixes only; Hugeicons/Streamline are commercial in-house teams. Consistency comes from one designer or a small team owning the whole set.

---

## 2. Build pipeline

**Universal pattern:** checked-in source SVGs → SVGO optimization → codegen of **one file per icon per framework** (ESM + CJS + per-icon `.d.ts`) → barrel `index` of named exports → `"sideEffects": false`. SVGO is universal; SVGR is not.

- **Lucide**: pnpm workspaces (`packages/*`, `tools/*`, `docs`). In-house CLI **`@lucide/build-icons`** (svgo, svgson, prettier) parses `icons/*.svg` into an AST and renders per-package templates — one `.ts` per icon + index + deprecated-aliases file. Rollup + `rollup-plugin-dts` for bundles. Svelte via `svelte-package`, Angular via ng-packagr. Also `tools/build-font` (icon font via ttf2woff2). Snapshot tests (Vitest + jest-serializer-html) per framework. All packages release in lockstep.
- **Heroicons**: minimalist reference — plain Node script, @svgr/core v5 + Babel JSX transform for React, @vue/compiler-dom for Vue, no bundler. Generates `forwardRef` components with `title` prop, `/*#__PURE__*/` annotations, CJS + ESM per icon, hand-written conditional `exports` maps.
- **Tabler**: pnpm + Turborepo, 14 packages (icons, react, vue, svelte, svelte-runes, preact, solidjs, react-native, angular, webfont, png, pdf, eps, sprite). Shared generator `/.build/build-icons.mjs`; svgo v4. Webfont via svgtofont stack (`svgicons2svgfont` → `svg2ttf` → `ttf2woff` → `wawoff2`) with `svg-outline-stroke` to convert strokes to fills first. Uses **OpenAI API** to generate icon tag metadata (`generate-ai-tags.mjs`).
- **Phosphor**: `core` repo (raw SVGs by weight folder + catalog with tags/categories/codepoints, published as `@phosphor-icons/core`) consumed as a **git submodule**; `scripts/assemble.ts` generates per-icon `forwardRef` components fed a `Map<IconWeight, ReactElement>` of all six weights, CSR and SSR variants.
- **Iconoir**: pnpm monorepo; per-target generators (css/flutter/react/vue) using @svgr/core; generated component source is not committed — produced at publish time.
- **Radix Icons**: components generated **straight from the Figma API** (`generate-icon-lib` takes a Figma file key + token, emits TSX directly), then plain `tsc` twice for ESM + CJS. No checked-in SVG source of truth.
- **Hugeicons**: closed-source build, but shipped architecture is notable — **icons are data, not components**: per-style data packages export `IconSvgElement` objects consumed by one generic `<HugeiconsIcon icon={SearchIcon} size={24} strokeWidth={1.5} />` wrapper per framework. One wrapper package + N data packages instead of N×M component packages.

**Tree-shaking (the recurring failure mode):** Barrel files with thousands of re-exports made dev servers crawl — Vercel measured lucide-react at 5.8s/1,583 modules → 3s/333 modules with `optimizePackageImports`; Tabler v2 barrels produced 8–10MB Next.js bundles. Fixes: per-icon ESM files + `sideEffects: false` + `#__PURE__`; deep-import escape hatches; Next.js `optimizePackageImports` defaults include lucide-react, @tabler/icons-react, @heroicons/react. Lucide ships `DynamicIcon` for string-named icons but explicitly discourages it.

---

## 3. Distribution

- **npm surface.** Lucide: `lucide` (vanilla), `lucide-react/-preact/-solid/-react-native/-static`, `@lucide/vue`, `@lucide/svelte`, `@lucide/angular`, `@lucide/astro`, `@lucide/lab`. `lucide-static` = raw SVGs + sprite.svg + icon font for CDN hotlinking. Tabler: 14 packages incl. PNG/PDF/EPS/sprite/webfont. Phosphor: `@phosphor-icons/{core,react,vue,web}` + Flutter/Swift/Elm/Kotlin repos. Heroicons: just React + Vue. Radix: `@radix-ui/react-icons` only.
- **Hugeicons Pro packaging** — free `@hugeicons/core-free-icons` (MIT) + free wrappers on public npm; **Pro via private registry at `npm.hugeicons.com` authenticated with the license key as npm `_authToken`**, scope `@hugeicons-pro`, one package per style. Registry access requires active subscription (except lifetime tier).
- **Streamline abandoned npm entirely** (packages deleted Nov 2022) — distribution is web app, Mac app, Figma/Framer/VS Code/Webflow plugins, REST API (Pro capped at 1,000 assets/week), and an official MCP server.
- **Figma**: official plugins/files for all; Hugeicons plugin gates Pro styles and supports variant switching without breaking overrides.
- **Iconify as the meta-layer**: ingests 200+ sets, auto-publishes `@iconify-json/{prefix}`, serves api.iconify.design, powers unplugin-icons (compile-on-demand components for every bundler/framework), the Iconify Figma plugin, and the Iconify IntelliSense VS Code extension.

---

## 4. Business model

**Freemium (direct monetization):**

- **Hugeicons**: Free = 5,400+ Stroke Rounded icons (MIT). **Pro $99/yr/seat** (54,000+ icons, 10 styles, metered CDN — 300K pageviews + 2GB, overages $1/GB — Figma source files). **Pro Plus lifetime $1,197/seat** (900K pageviews/4GB, 500 custom icon uploads). No redistribution, no embedding in icon pickers, per-seat.
- **Streamline**: Free = ~100,000 assets **with mandatory attribution link**. Paid: Icons from $19/mo, Full Access from $29/mo, lifetime per-set purchases. Premium caps usage at 100 icons/50 illustrations per project.
- Reference: Font Awesome raised Pro pricing 2025 — Pro $99→$120, Pro Max $499→$600 per seat/yr.

**Free with a sustainability story:**

- **Corporate loss-leader**: Heroicons (Tailwind Labs), Radix Icons (WorkOS).
- **Donations**: Lucide (Open Collective only, infra by Vercel/DigitalOcean); Phosphor; Iconoir.
- **Adjacent-product monetization**: Tabler is MIT but sells $9 precompiled bundle and $69 "All Package" (icons + admin template + illustrations + email templates).
- Lucide history: fork of unmaintained Feather Icons (2020), grew ~280 → 1,745 icons.

---

## 5. Variants / styles — three architectures

1. **Runtime prop (Phosphor, Hugeicons):** Phosphor bakes all 6 weights into each component (`weight="bold"` prop + `IconContext.Provider`; duotone = two paths, background at `opacity="0.2"`). Hugeicons: one style = one data package, generic wrapper is style-agnostic — same icon names across all 10 styles, so swapping style = changing an import path; `altIcon`/`showAlt` props enable hover stroke→solid swaps. Keeps the free/pro boundary clean.
2. **Path-level separation, one package (Heroicons, Tabler, Iconoir, Radix):** subpath exports (`@heroicons/react/24/outline` vs `/24/solid`) or folders.
3. **No variants (Lucide):** deliberately single-style; runtime knobs (`strokeWidth`, `absoluteStrokeWidth`, `size`) substitute for weights; experimental icons live in @lucide/lab until promoted.

---

## 6. Search / discovery

- **Metadata is the substrate**: Lucide pairs every SVG with a JSON file (tags, categories, contributors, aliases with structured deprecation) validated against a JSON schema; Phosphor exports a catalog array; Tabler generates additional tags with the OpenAI API.
- **Client-side fuzzy search dominates**: Lucide uses Fuse.js v7 over prebuilt indexes (incl. icon-popularity index); Phosphor uses fuse.js + Zustand; Heroicons/Iconoir do plain client-side filtering.
- **AI/semantic is the commercial differentiator**: Streamline's "Expert" (2026) recommends icons from natural-language product context; Hugeicons lists "AI-powered search" as a Pro benefit. **No open-source library uses embeddings on its own site yet — visible gap.**

---

## Synthesis: the playbook

1. **One spec, ruthlessly enforced**: 24×24 / fixed stroke / element whitelist / `currentColor` / no transforms. Lucide's CI is state of the art for community-scale consistency; everyone else refuses outside icons.
2. **SVG + JSON metadata as single source of truth**, codegen everything else (components, sprites, fonts, PNGs) with a shared template-driven build tool in a pnpm monorepo. Per-icon ESM files + `sideEffects: false` is non-negotiable.
3. **Hugeicons' data-package architecture** (generic renderer + per-style icon-data packages + private npm registry keyed by license token) is the cleanest freemium mechanism in the space.
4. **Free libraries don't make money and mostly don't try** — subsidized marketing or donation-run. The two real businesses (Hugeicons, Streamline) monetize catalog breadth + styles + tooling, not base icons.
5. **Semantic search is the unclaimed engineering edge** for open libraries.
