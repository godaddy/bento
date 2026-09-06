# @bento/storybook-addon-helpers

A Storybook preset that turns type-safe authoring helpers (`getMeta`, `getStory`, `getVariants`, `getComponentDocs`, `getTypeDocs`, `getExamples`) into standard CSF at build time, via a custom stories indexer and a Vite plugin. Prop documentation is extracted straight from TypeScript types, so `argTypes` stay in sync with the code with no manual upkeep, and a component's `examples/` folder is published as stories and rendered in its README from a single source.

## Requirements

- Storybook `^10.5.7` with the React + Vite framework (`@storybook/react-vite`), matching the declared peer range.
- A React + TypeScript project - prop docs are extracted from TypeScript types.
- Stories authored as `*.stories.tsx` (the file pattern the indexer matches).

## Setup

Add the package to the `addons` array in `.storybook/main.ts`:

```ts
export default {
  addons: ['@bento/storybook-addon-helpers']
};
```

The preset registers an indexer for `*.stories.tsx` files and a Vite plugin that performs the CSF transform. No per-story configuration is needed.

### Global docs defaults

Pass `docsDefaults` to avoid repeating the same `getComponentDocs`/`getTypeDocs` options in every story. They are merged UNDER each call's own options: a key you set on the call replaces that key from the defaults, absent keys inherit the defaults, and `include`/`exclude` move together (setting either on a call drops both from the defaults).

```ts
// .storybook/main.ts
export default {
  addons: [
    {
      name: '@bento/storybook-addon-helpers',
      options: {
        docsDefaults: {
          categories: { Events: [/^on/], Aria: [/^aria-/] }
        }
      }
    }
  ]
};
```

Defaults apply to both `getComponentDocs` and `getTypeDocs`. Because matchers can be arbitrary strings, global defaults are component-agnostic (a category like `Events: [/^on/]` applies wherever an `on*` prop exists). Other consumers of the neutral model (see [How it works](#how-it-works)) apply the same defaults by passing them to `resolvePropsDoc`.

## Authoring API

```tsx
import { getMeta, getStory, getVariants, getComponentDocs, getTypeDocs, getExamples } from '@bento/storybook-addon-helpers';
import { Button, type ButtonProps } from './button.tsx';

// Story metadata (title, component, shared args).
export default getMeta({ title: 'Button' });

// A single story. Rewritten to a CSF story object with a render function.
export const Default = getStory(Button, { args: { children: 'Click me' } });

// Multiple stories from one call. Each key becomes its own named export.
export const Variants = getVariants(Button, {
  primary: { args: { variant: 'primary' } },
  secondary: { args: { variant: 'secondary' } }
});

// A props table generated from the component's type.
export const Docs = getComponentDocs(Button, { include: ['children', /^on/] });

// A props table generated from any interface or type alias.
export const TypeDocs = getTypeDocs<ButtonProps>({ exclude: [/^aria-/] });

// Publish the `./examples` folder: one story per file, mirrored in the README.
export const examples = getExamples('./examples');
```

## Docs options

`getComponentDocs` and `getTypeDocs` accept an options object that filters, orders, and categorizes the documented props. Keys are autocompleted against the target type, and arbitrary strings are also accepted (so you can reference props the extractor can't see, such as an added override).

- **`include` / `exclude`** - allowlist or blocklist props. Mutually exclusive.
- **`ignoreSourceFiles`** - drop props by the file that declared them. Accepts a single matcher or an array; a `string` matches when the prop's `sourceFile` path _contains_ it (so `'@types/react'` works), a `RegExp` is tested against the path. It is a hard exclusion applied on top of `include`/`exclude` (a prop from an ignored file is dropped even if `include`d), and props with no known `sourceFile` are never ignored. Handy for hiding inherited third-party props, e.g. `ignoreSourceFiles: '@types/react'`.
- **`overrides`** - change a prop's `description`, `defaultValue`, `type`, or `required`. An exact name that no prop matches adds a new prop (handy for documenting props the extractor can't see) - a regular expression only patches props that already exist. Applied before the options below, so an added prop is filtered, categorized, and ordered like any other.
- **`primary`** - props shown first, at the top of the table and outside any category (even one that would otherwise match them), in the order you list them.
- **`categories`** - map a category label to its props. Each category renders as its own section in the props table, in the order the categories are declared.

Within `primary` or a single category, props appear in the order their entries are listed. When several props match the same entry, required props come first, then the rest alphabetically.

```ts
getComponentDocs(Button, {
  primary: ['onPress'],           // shown first, at the root
  categories: {
    Events: [/^onChange/, /^on/], // onChange first, then the rest of on*
    Styling: ['className', 'style']
  }
});
```

```ts
getComponentDocs(Button, {
  overrides: [
    { name: 'onPress', description: 'Fired when the button is pressed.' }, // patch existing
    { name: 'customId', type: 'string', description: 'Custom DOM id.' }                 // add a missing prop
  ]
});
```

Every option accepts either an exact prop name (autocompleted) or any string, or a regular expression that matches prop names (for example, `/^on/` matches every `on*` prop). When more than one category matches a prop, the **first declared** category wins.

## Examples

`getExamples` publishes a component's `examples/` folder as stories, and its README renders the same set - so each example is authored once and appears both in Storybook's sidebar and in the docs site.

Author one file per example under `examples/`, each exporting exactly one function - that function is the example (an `XExample` export becomes the `X` story). A file that exports no function is skipped. Declare the folder in the stories file:

```tsx
// button.stories.tsx
export const examples = getExamples('./examples');
```

Reference that export from the component README to render the examples inline. Import the `Examples` marker from the browser-safe runtime entry. It mirrors the `of={Stories.X}` convention used by `Story`/`ArgTypes`: the build plugins replace it before rendering, so the marker and the `examples` value never have to do anything at runtime.

```mdx
<!-- button/README.mdx -->
import { Examples } from '@bento/storybook-addon-helpers/runtime';
import * as Stories from './button.stories.tsx';

<Examples of={Stories.examples} />
```

At build time, each example expands into an `### Title` heading, an optional description, a live `<Story>` preview, and a `<Source>` snippet. The generated content also injects any required `Story` and `Source` imports, deduplicating them against existing imports. As a result, the README only needs to import the blocks it declares itself, such as `Meta` and `ArgTypes`.

The README's `<Examples of={Stories.<name>} />` block is resolved to the colocated stories file. The `getExamples(<dir>)` call in that file determines the examples directory, so the path is defined in exactly one place.

### Example metadata (JSDoc)

Annotate the exported example with JSDoc to control how it renders:

```tsx
import { Button } from '@godaddy/antares';

/**
 * The primary action. Free text becomes the example's description.
 * @title Primary action
 * @order 2
 */
export function PrimaryExample() {
  return <Button variant="primary">Save</Button>;
}
```

- **description** - the JSDoc free text renders as a paragraph under the heading.
- **`@title`** - overrides the heading (default: the humanized export name, e.g. `IconOnly` -> `Icon Only`).
- **`@order N`** - sort position; `@order`-tagged examples come first (ascending), then untagged examples alphabetically.
- **`@ignore`** - skip the file entirely (no story, no README block).
- Files ending in `-playground.tsx` are reserved for the args-based Playground story and are never published as examples.

The metadata JSDoc is stripped from the displayed `<Source>` snippet.

### Client boundary (no `'use client'` needed)

Examples render components whose implementation reaches client-only React APIs, and the docs site imports them into React Server Components - a combination that normally requires a `'use client'` directive. Do **not** add one to example files: the docs site injects the client boundary at build time (via a loader on `components/*/examples/*.tsx`), keeping the source clean and out of the displayed `<Source>` snippet. Storybook needs no boundary at all - it runs entirely on the client.

## How it works

The build-time pipeline is `extract → neutral model → adapter`: the engine reads TypeScript types into a target-agnostic `PropsDoc` model, and an adapter converts that model to a documentation target. The neutral model is decoupled from Storybook so the same engine feeds multiple targets.

- The Storybook adapter (`toStorybookArgTypes`) is used by the CSF transform on the `.` entry.
- The neutral model is exposed on a separate, Storybook-free `./docs` entry. Any other documentation target resolves a stories-file export to the `PropsDoc` model and adapts it to whatever it renders:

```ts
import { resolvePropsDoc } from '@bento/storybook-addon-helpers/docs';

// Resolve a stories-file export to the neutral model, then adapt it yourself.
const doc = await resolvePropsDoc({ filePath: 'button/button.stories.tsx', exportName: 'Props' });
// doc: { name, props: [{ name, type, required, defaultValue, description, category, ... }] }
```

The addon stays framework-agnostic: it knows nothing about how a consumer renders the model. `resolvePropsDoc` and the internal `docFromCall` are shared by the CSF transform, so extraction and processing are identical across targets - only the adapter differs.
