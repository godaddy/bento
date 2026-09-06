# Token and intent lookups

Read this when you need to wire a CSS custom-property fallback chain, or to resolve a UXCore intent to its legacy `--ux-{hash}`.

`token-intent-legacy-map.json` is the **source of truth** for the intent to `--ux-{hash}` mapping. There is no build step, so edit it directly when a mapping changes.

Its keys are UXCore intent paths, such as `ux.action.backgroundColor` or `ux.box.density`. Each entry holds:

| Field           | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `hash`          | Base36 hash segment (without `--ux-` prefix)                                    |
| `var`           | Full CSS custom property (`--ux-{hash}`)                                        |
| `legacyDefault` | Godaddy-antares theme value; `null` if unknown                                  |
| `token`         | Curated Antares design token name, when mapped                                  |
| `dtcgDefault`   | DTCG default for `token`, when mapped                                           |
| `tokens`        | Array of `{ token, dtcgDefault }` when multiple curated tokens share one intent |

**Entry shape.** Keys are intent paths, so match the quoting exactly when you grep:

```json
// single curated token
"ux.action.backgroundColor": {
  "hash": "1owc8nc",
  "var": "--ux-1owc8nc",
  "legacyDefault": "transparent",
  "token": "color-action-background-tertiary-default",
  "dtcgDefault": "white"
}

// several tokens share one intent: a "tokens" array, and no top-level "token" or "dtcgDefault"
"ux.box.backgroundColor": {
  "hash": "cao06b",
  "var": "--ux-cao06b",
  "legacyDefault": "#fff",
  "tokens": [
    { "token": "color-canvas-background", "dtcgDefault": "white" },
    { "token": "color-surface-background-base", "dtcgDefault": "white" },
    { "token": "color-surface-background-card", "dtcgDefault": "white" }
  ]
}
```

**Lookup examples:**

```bash
# intent to hash and legacy default
grep '"ux.action.backgroundColor"' token-intent-legacy-map.json

# Find by Antares token name
grep 'color-action-background-tertiary-default' token-intent-legacy-map.json

# Find by hash
grep '"1owc8nc"' token-intent-legacy-map.json
```

**CSS fallback chain.** The **literal fallback** is the innermost value in the `var()`. Pick it in this order:

1. `legacyDefault`, whenever it is not null
2. `dtcgDefault`, when `legacyDefault` is null and a curated `token` or `tokens` entry applies
3. a sensible default for that kind of property, when both are null (table below)

Always wire the full chain so themes can override at each layer:

```css
/* curated token, then legacy --ux-{hash}, then the resolved fallback */
/* legacyDefault is transparent, which wins even though dtcgDefault is "white" */
background: var(
  --color-action-background-tertiary-default,
  var(--ux-1owc8nc, transparent)
);

/* legacyDefault: #111 */
color: var(--color-action-text-tertiary-default, var(--ux-ut3xrx, #111));

/* legacyDefault is null, so use dtcgDefault */
background: var(--color-input-background-hovered, var(--ux-6k4dbq, snow));

/* intent only, no curated token */
/* legacyDefault: 0.25rem */
--box-density: var(--ux-1sbfig8, 0.25rem);
```

| Property kind                  | Sensible default (last resort)                   |
| ------------------------------ | ------------------------------------------------ |
| `backgroundColor`              | `transparent`                                    |
| `foregroundColor` / text       | `currentColor`                                   |
| `borderColor`                  | `transparent`                                    |
| `borderWidth`                  | `1px`                                            |
| `borderRadius`                 | `0`                                              |
| `lineHeight`                   | `1.5`                                            |
| `fontFamily`                   | `sans-serif`                                     |
| `fontSize`                     | `1rem`                                            |
| `fontWeight`                   | `500`                                            |
| `density` / spacing            | none, spacing follows its own scale rules        |
| `feedbackColor` / chart colors | pick from nearby mapped intent or `currentColor` |

When an intent has a `tokens` array, use the `dtcgDefault` of the specific Antares token you are styling.

Spacing is the exception to all of this. It has its own two scales and its own chain, so never take a spacing value from this table.
