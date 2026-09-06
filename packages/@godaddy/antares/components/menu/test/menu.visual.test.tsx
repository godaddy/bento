import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import assume from 'assume';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { GroupsExample } from '../examples/groups.tsx';
import { SingleSelectionExample } from '../examples/single-selection.tsx';
import { MultipleSelectionExample } from '../examples/multiple-selection.tsx';
import { SizesExample } from '../examples/sizes.tsx';
import { SubmenuExample } from '../examples/submenu.tsx';
import { RichContentExample } from '../examples/rich-content.tsx';

// Let the popover open/position transitions settle before capturing.
async function settle(ms = 300) {
  await new Promise(function wait(r) {
    setTimeout(r, ms);
  });
}

// The menu renders in a Popover portal (hideArrow -> [data-noarrow]); grab the
// last one so submenu screenshots capture the nested popover.
function getMenuOverlay(): HTMLElement {
  const overlays = document.querySelectorAll('[data-noarrow]');
  const overlay = overlays[overlays.length - 1];
  if (!overlay) throw new Error('Expected menu popover to exist');
  return overlay as HTMLElement;
}

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#Menu', function menuTests() {
    it('basic (open)', async function basicOpen() {
      const { getByRole } = await render(<DefaultExample />);
      await getByRole('button', { name: 'Actions' }).click();
      await vi.waitFor(function open() {
        assume(getByRole('menu').query()).is.not.equal(null);
      });
      await settle();
      await expect(getMenuOverlay()).toMatchScreenshot('basic');
    });

    it('groups (open)', async function groupsOpen() {
      const { getByRole } = await render(<GroupsExample />);
      await getByRole('button', { name: 'View' }).click();
      await vi.waitFor(function open() {
        assume(getByRole('menu').query()).is.not.equal(null);
      });
      await settle();
      await expect(getMenuOverlay()).toMatchScreenshot('groups');
    });

    it('single selection (open)', async function singleSelectionOpen() {
      const { getByRole } = await render(<SingleSelectionExample />);
      await getByRole('button', { name: 'Sort by' }).click();
      await vi.waitFor(function open() {
        assume(getByRole('menu').query()).is.not.equal(null);
      });
      await settle();
      await expect(getMenuOverlay()).toMatchScreenshot('single-selection');
    });

    it('multiple selection (open)', async function multipleSelectionOpen() {
      const { getByRole } = await render(<MultipleSelectionExample />);
      await getByRole('button', { name: 'Columns' }).click();
      await vi.waitFor(function open() {
        assume(getByRole('menu').query()).is.not.equal(null);
      });
      await settle();
      await expect(getMenuOverlay()).toMatchScreenshot('multiple-selection');
    });

    it('submenu (open)', async function submenuOpen() {
      const user = userEvent.setup();
      const { getByRole } = await render(<SubmenuExample />);
      await getByRole('button', { name: 'Share' }).click();
      await vi.waitFor(function open() {
        assume(getByRole('menuitem', { name: 'Resources' }).query()).is.not.equal(null);
      });
      await user.hover(page.getByRole('menuitem', { name: 'Resources' }));
      await settle();
      // Both popovers are open; capture the whole viewport to show the nesting.
      await expect(document.body).toMatchScreenshot('submenu');
    });

    it('rich content (calendar popover)', async function richContentOpen() {
      const user = userEvent.setup();
      const { getByRole } = await render(<RichContentExample />);
      await getByRole('button', { name: 'Schedule' }).click();
      await vi.waitFor(function open() {
        assume(getByRole('menuitem', { name: 'Pick a date' }).query()).is.not.equal(null);
      });
      await user.click(page.getByRole('menuitem', { name: 'Pick a date' }));
      await vi.waitFor(function calendarOpen() {
        assume(getByRole('button', { name: /March 20, 2024/ }).query()).is.not.equal(null);
      });
      await settle();
      await expect(document.body).toMatchScreenshot('rich-content');
    });

    it('sizes', async function sizes() {
      const { container } = await render(<SizesExample />);
      await settle();
      await expect(container).toMatchScreenshot('sizes');
    });
  });
});
