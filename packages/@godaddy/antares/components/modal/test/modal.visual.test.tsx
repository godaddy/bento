import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { ScrollableExample } from '../examples/scrollable.tsx';
import { PlaygroundExample } from '../examples/modal-playground.tsx';

// Wait past the 0.2s fade/slide transition so the screenshot is not caught mid-animation.
async function settle() {
  await new Promise(function wait(resolve) {
    setTimeout(resolve, 400);
  });
}

// Screenshot the full-viewport overlay (backdrop + panel) so the panel's size relative to the
// viewport is captured, which is what the max-block-size and scrolling behavior depend on.
async function openOverlay() {
  await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
  const dialog = await page.getByRole('dialog').element();
  await settle();

  const overlay = dialog.parentElement?.parentElement;
  if (!overlay) throw new Error('Expected modal overlay to exist');
  return overlay as HTMLElement;
}

describe('@godaddy/antares', function packageTests() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#Modal', function modalTests() {
    it('default example', async function defaultRender() {
      await render(<DefaultExample />);
      await expect(await openOverlay()).toMatchScreenshot('default');
    });

    it('scrollable example', async function scrollableRender() {
      await render(<ScrollableExample />);
      await expect(await openOverlay()).toMatchScreenshot('scrollable');
    });

    it('title wrapping around the close button', async function longTitleRender() {
      await render(<PlaygroundExample longTitle />);
      await expect(await openOverlay()).toMatchScreenshot('long-title');
    });

    it('close button without a title', async function noTitleRender() {
      await render(<PlaygroundExample showTitle={false} />);
      await expect(await openOverlay()).toMatchScreenshot('no-title');
    });
  });
});
