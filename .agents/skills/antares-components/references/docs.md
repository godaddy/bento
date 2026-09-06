# Examples, stories, and README

## Examples

One example per file, kebab-case, under `examples/`. Each file exports **exactly one function**, and that function is the example. Import everything from `@godaddy/antares`.

The function name becomes the story title and the heading (`PrimaryExample` becomes `Primary`). JSDoc on the function controls the generated docs:

| JSDoc            | Effect                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------- |
| free text        | description shown under the example heading                                              |
| `@title <text>`  | replaces the heading (default is the humanized function name)                             |
| `@order <n>`     | sort order, ascending. Examples without `@order` go last, sorted alphabetically           |
| `@ignore`        | leaves the example out completely, no story and no README block. Use it for test-only examples |

Always include a `DefaultExample` in `default.tsx` with `@order 1` so it renders first.

```tsx
import { Button } from '@godaddy/antares';

/**
 * The default button.
 * @order 1
 */
export function DefaultExample() {
  return <Button>Delete</Button>;
}
```

`<name>-playground.tsx` is special. It is left out of the generated examples and only powers the `Playground` story.

## Stories

Start the file with `'use client'`, then import the helpers from `@bento/storybook-addon-helpers`. A stories file has four parts:

- **Meta**: `export default getMeta({ title: 'components/ComponentName' })`. A grouped component takes the group first, in PascalCase: `components/Chart/BarChart`, `components/Layout/Box`. Internal components and hooks sit in the same namespace, keeping their own casing: `components/Chart/useChartColor`.
- **Props**: `getComponentDocs(Component)` exported as `Props`, which generates the props table. Add a `<Name>Props` export for each extra public component.
- **Examples**: `export const Examples = getExamples('./examples')`. This finds every example file and creates one sidebar story per example, ordered and titled from the JSDoc. The README uses this same export.
- **Playground**: `getStory(PlaygroundExample, { args, argTypes })`. The build injects the `render` function, and `args` and `argTypes` are type-checked against the example's props. Give every `argType` a `description` and a fitting control: `'boolean'`, `'text'`, `'number'`, `'object'`, `'radio'` (2 to 4 options), `'select'` (5 or more options), or whatever suits it best.

```tsx
'use client';
import { getComponentDocs, getExamples, getMeta, getStory } from '@bento/storybook-addon-helpers';
import { Button } from './src/index.tsx';
import { PlaygroundExample } from './examples/button-playground.tsx';

export default getMeta({ title: 'components/Button' });

export const Props = getComponentDocs(Button);

export const Examples = getExamples('./examples');

export const Playground = getStory(PlaygroundExample, {
  args: {
    variant: 'primary',
    size: 'md'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'critical', 'inline', 'minimal'],
      description: 'Visual variant of the button'
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Size of the button'
    }
  }
});
```

## README.mdx

- Add frontmatter with a `title` and a short `description`.
- Import only the blocks you write yourself (`Meta`, `ArgTypes`) from `@storybook/addon-docs/blocks`, plus `* as Stories` from the stories file.
- Use `<Meta of={Stories} name="Overview" />` for the overview and `<ArgTypes of={Stories.Props} />` for the props table.
- Import `Examples` from `@bento/storybook-addon-helpers/runtime` and use `<Examples of={Stories.Examples} />` to render **all** examples. At build time each example expands into a `###` heading, its JSDoc description, a live `<Story>`, and a `<Source>` snippet.
- Use these `##` sections, in this order, when they apply: Features, Installation, Examples, Customization, Accessibility, Best Practices, Troubleshooting, Props. Add other sections if they fit the component better.

If the component has a composed interior or a trigger, open **Props** with an anatomy block: a `tsx` snippet of the element tree with tags only, no props or children beyond what the structure needs (`slot="title"`, `placement="right"`), ending in `{/* ... */}` for the regions a consumer may add. It shows what nests inside what before the tables explain each prop.

```tsx
<PopoverTrigger>
  <Button />
  <Popover>
    <Heading slot="title" />
    <CloseButton />
    <Content />
    {/* ... */}
  </Popover>
</PopoverTrigger>
```

```mdx
---
title: Button
description: The Button component is a clickable control for actions, with variants and sizes.
---

import { ArgTypes, Meta } from '@storybook/addon-docs/blocks';
import { Examples } from '@bento/storybook-addon-helpers/runtime';
import * as Stories from './button.stories.tsx';

<Meta of={Stories} name="Overview" />

## Features

- Accessible button component
- Multiple variants and sizes

## Installation

\`\`\`bash
npm install @godaddy/antares
\`\`\`

## Examples

<Examples of={Stories.Examples} />

## Props

<ArgTypes of={Stories.Props} />
```
