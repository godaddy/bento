# Testing

The package has three Vitest projects: `*.node.test.tsx`, `*.browser.test.tsx`, and `*.visual.test.tsx`. Node and browser tests belong on every component. A visual test is added when the look is worth locking, so plenty of components have none. Aim for 100% coverage.

## Rules for all three

- **Render examples, never `src/` directly.** If coverage is missing, add or update an example instead of importing the source.
- **Shared test helpers live in `test/utils/`**, not `utils/` (`utils/` is shipped source).
- **Describe blocks nest** `'@godaddy/antares'` > `'#ComponentName'`, and every `describe`/`it` callback is a **named function**, not an arrow.

## Node tests: snapshots only

Render an example and call `toMatchSnapshot`. Don't hand-assert markup with `toContain`, regexes, or attribute checks. The snapshot _is_ the assertion, and it already captures structure, ARIA, and data-attributes. To cover another state or branch, add an example and snapshot that.

```typescript
import { expect, describe, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { DefaultExample } from '../examples/default.tsx';

describe('@godaddy/antares', function packageTests() {
  describe('#Button', function buttonTests() {
    it('renders default', function render() {
      const html = renderToString(<DefaultExample />);
      expect(html).toMatchSnapshot();
    });
  });
});
```

When a snapshot changes for a good reason, refresh it with the `test:node:update` target.

## Browser tests: behavior, not structure

Cover what a user does: focus and Tab order, keyboard input (Enter, Space, arrow keys), press events, state changes, selection, disabled behavior, form submission, and so on.

```typescript
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { DefaultExample } from '../examples/default.tsx';

describe('@godaddy/antares', function packageTests() {
  describe('#Button', function buttonTests() {
    it('handles click', async function click() {
      const { getByRole } = await render(<DefaultExample />);
      await userEvent.click(getByRole('button'));
      await expect.element(getByRole('button')).toBeVisible();
    });
  });
});
```

## Visual tests: one screenshot per example

Render the example and call `toMatchScreenshot('name')`. To cover a variant, orientation, or state, add an example. Don't hand-build markup.

Two helpers from `#test/utils/test-helpers.tsx` keep screenshots stable:

- `beforeAll(preloadTestIcons)` if the example renders an `Icon`
- `beforeEach(resetHover)` to clear hover state

```typescript
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';

describe('@godaddy/antares', function packageTests() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#Button', function buttonTests() {
    it('default example', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });
  });
});
```

Baselines are **Linux** PNGs created by the `/update-screenshots` CI bot once the PR is open, so you do not commit them yourself. These tests run on CI by default. Run the `test:visual` target locally only when you want to look at the result.
