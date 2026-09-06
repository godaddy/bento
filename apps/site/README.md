# site

The Antares design library documentation site — a Next.js app built with [Fumadocs](https://fumadocs.dev).

Run the development server:

```bash
npx nx run site:dev
```

Open <http://localhost:3000> with your browser to see the result.

## Content sources

Content is pulled from two places, merged into a single Fumadocs source:

- `content/docs/` — hand-authored documentation pages
- `packages/@godaddy/antares/components/**/README.mdx` — per-component docs, served at `/docs/components/*`

See `source.config.ts` for the full MDX pipeline configuration.

## Project structure

| Route | Description |
| --- | --- |
| `app/(home)` | Landing page |
| `app/docs` | Documentation layout and pages |
| `app/og/docs` | Open Graph image generation |
| `app/api/search` | Full-text search route handler |

Notable files in `lib/`:

| File | Description |
| --- | --- |
| `source.ts` | Content source adapter; merges docs and component collections |
| `layout.shared.tsx` | Shared layout options reused across route layouts |
| `remark-strip-leading-heading.ts` | Remark plugin that removes the leading `#` heading from MDX files |
| `remark-arg-types.ts` | Remark plugin that replaces `<ArgTypes of={Stories.X}>` with a `<PropTable>` generated from the component's `*.stories.tsx` via `@bento/storybook-addon-helpers/docs` (the same type engine Storybook uses) |
| `remark-raw-loader.ts` | Remark plugin that inlines raw source file content |
| `github-path.ts` | Resolves GitHub source URLs for component files |
| `storybook-bridge/` | Helpers for sharing Storybook metadata with the docs site |

## Component preview theming

Component examples render inline on each component page. Because the page is a
Fumadocs document styled with Tailwind, two things had to be settled: the site's
styles must not reach into the components, and the components must render against
the same theme Storybook uses.

### How it works

| Piece | Where | Purpose |
| --- | --- | --- |
| `gdsherpa-font.ts` import | `app/layout.tsx` | The `@font-face` and preload links for GD Sherpa, matching uxcore2's generated Storybook faces. Shared with Storybook (`apps/docs/.storybook/main.ts`). Without it, text falls back to Helvetica/Arial |
| `legacy-tokens.css` import | `app/layout.tsx` | The theme, shared verbatim with Storybook (`apps/docs/.storybook/addons/theme-tokens/recipes.ts`) and the browser test projects (`configs/vitest.setup.mts`). Defines the `--ux-*` custom properties every component's CSS reads. Imported **before** `global.css` so its own `body` rule loses the cascade to Fumadocs' and only the custom properties apply site-wide |
| `.ux-surface` | `apps/docs/.storybook/legacy-tokens.css` | Shares the theme's `body` rule, so any element can become an on-theme surface. Used by the preview element here, since this site's `body` belongs to Fumadocs |
| `not-prose` | `story-renderer.tsx` | Fumadocs' typography selectors exclude `.not-prose` subtrees. Same mechanism as Storybook's `sb-unstyled`, which is why previews match across both sites |
| Preflight revert | `app/global.css` | Tailwind's preflight zeroes `margin`/`padding`/`border` on every element; Storybook has no preflight. A zero-specificity `:where()` rule reverts those three properties to user-agent values inside preview surfaces |

### Deliberate choices

- **Previews are always light.** The theme has no dark variant (no
  `prefers-color-scheme`, `.dark` or `light-dark()` anywhere in the theme or
  component CSS), so the site's dark mode is not forwarded into previews. The
  frame around a preview stays dark-aware; the surface inside does not.
- **A wrapper, not an iframe.** An iframe would isolate more strictly, but
  overlays would then be confined to a content-sized viewport, which affects
  roughly a third of the library. The wrapper keeps overlays working exactly as
  they do in Storybook.
- **Only `Legacy` is applied.** Storybook's theme switcher (`Legacy`, `Nextgen`,
  `Both`, `None`) has no equivalent here; the site pins `Legacy`, which is also
  Storybook's default.

### Known gaps

- Preflight is reverted only for flow elements, not form controls, where
  reverting would resurrect native user-agent control styling.
- **Overlay text renders in the site font.** Overlays (modal, popover, menu,
  select, tooltip, drawer) portal to `<body>`, outside `.ux-surface`. Their colors
  and sizes are correct because components declare those from `--ux-*` tokens, but
  most component CSS does not declare `font-family`, so overlay text inherits
  Inter instead of the theme's font. The durable fix belongs in the components,
  which are inconsistent here: of 28 CSS modules, 3 declare `font-family` from a
  token, 2 declare `inherit`, and 23 declare nothing.
- Isolation is by convention, not by boundary. A future Fumadocs or Tailwind rule
  that targets descendants would leak into previews without failing loudly.
- Class names differ between the two sites: this site consumes the package's
  `dist` (`gda_<hash>_<local>`, set in `tsdown.config.ts`), while Storybook
  aliases to source and gets the bundler default. Rendering is unaffected.

## Learn more

- [Fumadocs](https://fumadocs.dev) — documentation framework
- [Next.js Documentation](https://nextjs.org/docs) — Next.js features and API
