import { render } from 'vitest-browser-react';
import { beforeAll, describe, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import assume from 'assume';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { InteractiveExample } from '../examples/interactive.tsx';
import { DisabledExample } from '../examples/disabled.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  describe('#ProgressSteps', function progressStepsTests() {
    it('moves focus between interactive steps with Tab', async function tabNavigation() {
      const user = userEvent.setup();
      await render(<InteractiveExample />);

      const cart = page.getByRole('button', { name: '1. Cart' });
      const shipping = page.getByRole('button', { name: '2. Shipping' });

      await user.tab();
      assume(document.activeElement).equals(cart.element());

      await user.tab();
      assume(document.activeElement).equals(shipping.element());
    });

    it('activates a step with click, firing onPress (currentStep moves)', async function clickActivates() {
      const user = userEvent.setup();
      await render(<InteractiveExample />);

      assume(document.querySelector('[aria-current="step"]')?.textContent).includes('2. Shipping');

      await user.click(page.getByRole('button', { name: '1. Cart' }));
      assume(document.querySelector('[aria-current="step"]')?.textContent).includes('1. Cart');
    });

    it('activates a focused step with the Enter key', async function enterActivates() {
      const user = userEvent.setup();
      await render(<InteractiveExample />);

      const review = page.getByRole('button', { name: '4. Review' });
      await review.element().focus();
      await user.keyboard('{Enter}');
      assume(document.querySelector('[aria-current="step"]')?.textContent).includes('4. Review');
    });

    it('activates a focused step with the Space key', async function spaceActivates() {
      const user = userEvent.setup();
      await render(<InteractiveExample />);

      const payment = page.getByRole('button', { name: '3. Payment' });
      await payment.element().focus();
      await user.keyboard(' ');
      assume(document.querySelector('[aria-current="step"]')?.textContent).includes('3. Payment');
    });

    it('marks disabled steps as disabled and skips them when tabbing', async function disabledSteps() {
      const user = userEvent.setup();
      await render(<DisabledExample />);

      const payment = page.getByRole('button', { name: '3. Payment' });
      const review = page.getByRole('button', { name: '4. Review' });
      assume(payment.element().hasAttribute('disabled')).equals(true);
      assume(review.element().hasAttribute('disabled')).equals(true);

      const cart = page.getByRole('button', { name: '1. Cart' });
      const shipping = page.getByRole('button', { name: '2. Shipping' });
      const nav = page.getByRole('navigation');

      await user.tab();
      assume(document.activeElement).equals(cart.element());
      await user.tab();
      assume(document.activeElement).equals(shipping.element());
      // Tabbing past the last enabled step skips both disabled steps and exits the nav entirely.
      await user.tab();
      assume(nav.element().contains(document.activeElement)).equals(false);
    });
  });
});
