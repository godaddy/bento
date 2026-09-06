# Styling

Read this while writing or changing a `*.module.css`.

## Focus and disabled

- Focus: `&:where([data-focus-visible]) { outline: 2px solid Highlight; outline-offset: 2px; }`
- Disabled: `&:where([data-disabled]) { opacity: 0.4; cursor: not-allowed; }`. Use `&:where(:disabled)` only on native HTML elements.

## Values

- Border width is always `1px`. No other values, no variables.
- For bold text, prefer `bolder` when the element isn't already bold. Avoid `bold` and numeric weights in new code.
- Wiring a value back to a legacy `--ux-{hash}` var? The lookup recipes and the fallback order are in `references/tokens.md`.

## Spacing

Two token scales, split by what the space sits between:

- **Between components**: t-shirt sizes, through the layout props (`gap="md"`, `padding="sm"`). This is the public vocabulary that `Box`, `Flex`, and `Grid` expose, and it maps to `size-space-{xs…2xl}`. Values live in `components/layout/tokens.ts`.
- **Inside a component**: the numeric scale (`size-space-005` … `size-space-080`), declared as a private variable on the component's own root selector.

```css
.menu {
  /* token, then legacy intent, then literal */
  --_menu-padding: var(--size-space-010, calc(var(--ux-1sbfig8, 0.5rem) * 0.5));
}
```

Three rules for that chain:

- **Write all three links.** They cover a consumer who ships design tokens, legacy intents, or neither. A `var()` that points at nothing and has no literal fallback is invalid, so the property silently drops to its initial value. That is how `Menu` shipped with `padding: 0`.
- **Declare it on your own root selector**, never on an ancestor. In particular, don't use `--sp-*` in component CSS: it only exists on `.box`, so it resolves by luck of composition, and not at all inside a portal.
- **Keep the component name in the variable.** Custom properties inherit and CSS Modules does not scope them, so a bare `--_padding` collides with any nested component that picked the same name. `--_menu-padding` cannot.

GU count per tier, and the literal that goes with it: `docs/pdrs/antares/gu-spacing.md`.

## Custom properties

Private vars use the `--_` prefix and carry the component name, as above.

Customization normally happens through props, `className`, and data attributes. A public `--var` earns its place when one value feeds many internal elements, such as a font family or a size ramp, and a caller would otherwise have to re-target every child by hand. Their selector would need your slot names and would still tie at `0-1-0`, leaving stylesheet order to pick the winner.

Read a public var as `--_var: var(--var, fallback)`, and document it under **Customization** in the README. An undocumented var is not an API. Spacing is the exception: its public surface is the token scale, so spacing vars stay private.
