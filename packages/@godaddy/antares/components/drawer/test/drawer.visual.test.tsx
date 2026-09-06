import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import assume from 'assume';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { PlacementsExample } from '../examples/placements.tsx';
import { BottomSheetExample } from '../examples/bottom-sheet.tsx';

const PLACEMENTS = ['left', 'right', 'top', 'bottom'] as const;

// Open the drawer, wait past the 0.2s slide transition, then screenshot.
async function settle() {
  await new Promise(function wait(r) {
    setTimeout(r, 400);
  });
}

// Screenshot the full-viewport overlay (backdrop + panel), not the panel alone:
// in isolation the panel looks identical for left/right (and top/bottom), so the
// screenshot must include the viewport to show which edge the drawer slid from.
function getOverlay(): HTMLElement {
  const overlay = document.querySelector('[data-placement]')?.parentElement;
  if (!overlay) throw new Error('Expected drawer overlay to exist');
  return overlay as HTMLElement;
}

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#Drawer', function drawerTests() {
    it.each(PLACEMENTS)('renders %s placement', async function placement(p) {
      const { getByRole } = await render(<PlacementsExample />);

      await getByRole('button', { name: `Open ${p}` }).click();
      await vi.waitFor(async function open() {
        assume(getByRole('dialog').query()).is.not.equal(null);
      });
      await settle();

      await expect(getOverlay()).toMatchScreenshot(`placement-${p}`);
    });

    it('renders bottom sheet with close button', async function bottomSheet() {
      const { getByRole } = await render(<BottomSheetExample />);

      await getByRole('button', { name: 'Open bottom sheet' }).click();
      await vi.waitFor(async function open() {
        assume(getByRole('dialog').query()).is.not.equal(null);
      });
      await settle();

      await expect(getOverlay()).toMatchScreenshot('bottom-sheet');
    });
  });
});
