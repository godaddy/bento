import { DefaultExample } from '../examples/default.tsx';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { describe, it, vi } from 'vitest';
import { resetHover } from '#test/utils/test-helpers.tsx';
import assume from 'assume';

describe('@godaddy/antares', function antares() {
  describe('#Tooltip', function tooltipTests() {
    it('shows tooltip on focus', async function focusShow() {
      const { getByRole } = await render(<DefaultExample />);

      await userEvent.keyboard('{Tab}');

      await vi.waitFor(async function open() {
        const tooltip = getByRole('tooltip').query();
        assume(tooltip).is.not.equal(null);
        assume(tooltip?.textContent).includes('This is the tooltip content!');
      });
    });

    it('hides tooltip on Escape', async function escapeHide() {
      const { getByRole } = await render(<DefaultExample />);

      await userEvent.keyboard('{Tab}');

      await vi.waitFor(async function open() {
        assume(getByRole('tooltip').query()).is.not.equal(null);
      });

      await userEvent.keyboard('{Escape}');

      await vi.waitFor(async function close() {
        assume(getByRole('tooltip').query()).equals(null);
      });
    });

    it('shows tooltip on hover', async function hoverShow() {
      const { getByRole } = await render(<DefaultExample tooltipTriggerProps={{ delay: 0, closeDelay: 0 }} />);

      await resetHover();
      await page.getByRole('button').hover();

      await vi.waitFor(async function open() {
        const tooltip = getByRole('tooltip').query();
        assume(tooltip).is.not.equal(null);
        assume(tooltip?.textContent).includes('This is the tooltip content!');
      });
    });

    it('hides tooltip on unhover', async function hoverHide() {
      const { getByRole } = await render(<DefaultExample tooltipTriggerProps={{ delay: 0, closeDelay: 0 }} />);

      await resetHover();
      await page.getByRole('button').hover();

      await vi.waitFor(async function open() {
        assume(getByRole('tooltip').query()).is.not.equal(null);
      });

      await resetHover();

      await vi.waitFor(async function close() {
        assume(getByRole('tooltip').query()).equals(null);
      });
    });
  });
});
