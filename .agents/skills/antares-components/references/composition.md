# Composition

Read this when a component has an interior the consumer fills in (regions, slots), or when it renders several layers such as an overlay, a positioned panel, and a dialog.

## Expose the interior, don't configure it

A component with an interior **exposes** it instead of taking props like `title`, `actions`, or `media`. The consumer composes generic regions (`Header`, `Content`, `Footer`, `ButtonGroup`) and the component only positions and spaces them.

Rule of thumb: props describe behavior, the consumer owns structure.

## Regions

A region works on its own with its own defaults, and picks up a parent's styling when the parent provides its context. Order of precedence: **defaults < parent context < consumer props**, which `useContextProps` gives you:

```tsx
export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(props, ref) {
  [props, ref] = useContextProps(props, ref, HeaderContext);

  return <Flex as="header" justifyContent="space-between" padding="md" {...props} ref={ref} />;
});
```

- **Put region defaults before `{...props}`** so context and consumers can override them. This is the opposite of the usual rule. Only put something after the spread if the consumer must never break it.
- **Export the context and the props type** along with the region, because a consumer may need to provide the context.
- **Place regions with named grid areas, not source order**, so they can be written in any order.
- **Regions own their padding, shells don't.** Padding on a scrolling element collapses at the scroll edge.
- **Keep a shell's layout CSS next to its region contexts.** The CSS defines the areas and the contexts assign them, so separated copies drift apart.

## Presets

A preset is an existing component with some props pre-filled, so a common composition needs no wiring. Examples: a close button that defaults to `slot="close"`, or a heading that slots as a dialog's title.

Spread the caller's props **after** the defaults so everything stays overridable. If a preset can't express a variant, document the raw composition instead of adding props for it.

## Where each prop lands

One component often renders several nested elements: a backdrop, a positioned panel, and a dialog, or a field and its control. Switching between components should never mean guessing which element a prop hits, so the same prop always maps to the same role.

- **One element is the primary surface.** `...rest`, `className`, `style`, and `ref` always go there. For overlays that's the `OverlayDialog`. When there is no dialog, such as `Tooltip`, it's the positioned panel. No per-component exceptions.
- **Layer-specific behavior stays flat.** Props like `placement`, `offset`, `maxSize`, and open state are exposed individually with JSDoc. `Pick` only the props you need from the RAC type instead of extending it wholesale, because exposing an API is hard to undo.
- **Other layers get a props bag named after the layer**, such as `overlayProps` (backdrop) or `containerProps` (positioned panel). Only add the bag if the component actually has that layer. No backdrop means no `overlayProps`.
- **Each props bag omits props already exposed at the top level**, so every prop has exactly one home. Merge `className` and `style` with the layer's defaults using `composeClassName` and `composeStyle`. Never replace them.
- **State props are accepted by both the component and its trigger** where that applies, so either one can be controlled.

A props bag configures a layer. It does not express structure. If a bag starts carrying structure, expose that layer as a lower-level component instead.
