import { describe, it, expect, beforeAll } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { ControlledExample } from '../examples/controlled.tsx';
import { ScrollableExample } from '../examples/scrollable.tsx';
import { PlaygroundExample } from '../examples/modal-playground.tsx';
import { TriggerlessExample } from '../examples/triggerless.tsx';
import { LayerPropsExample } from '../examples/layer-props.tsx';

/**
 * Simulate an interaction outside the dialog by dispatching a pointerdown + click on the
 * underlay (`dialog -> modal container -> overlay`). RAC's `useInteractOutside` matches on the
 * event target being outside the dialog ref, so the underlay - an ancestor, not a descendant -
 * is a valid "outside" target regardless of where a synthetic pointer would land.
 */
function interactOutside(dialog: Element) {
  const overlay = dialog.parentElement?.parentElement;
  if (!overlay) throw new Error('Expected overlay element to exist');
  overlay.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
  overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 }));
}

describe('@godaddy/antares', function packageTests() {
  describe('#Modal', function modalTests() {
    beforeAll(preloadTestIcons);

    it('opens the modal on trigger click', async function openModal() {
      await render(<DefaultExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));

      await expect.element(page.getByRole('dialog')).toBeVisible();
    });

    it('labels the dialog via a Heading slot="title"', async function labelledDialog() {
      await render(<DefaultExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));

      // The accessible name comes from <Heading slot="title">, proving the RAC
      // HeadingContext wiring flows through our Heading preset.
      await expect.element(page.getByRole('dialog', { name: 'Delete file?' })).toBeVisible();
    });

    it('closes the modal via the CloseButton', async function closeViaButton() {
      await render(<DefaultExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      await userEvent.click(page.getByRole('button', { name: 'Close' }));
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes the modal via a footer action button', async function closeViaAction() {
      await render(<DefaultExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      await userEvent.click(page.getByRole('button', { name: 'Delete' }));
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes the modal via the Escape key', async function closeViaEscape() {
      await render(<DefaultExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      await userEvent.keyboard('{Escape}');
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    });

    it('controls the open state externally', async function controlled() {
      await render(<ControlledExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open from outside' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      await userEvent.keyboard('{Escape}');
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    });

    it('makes the content region scroll while the rest stays pinned', async function scrollableContent() {
      await render(<ScrollableExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog', { name: 'Terms of service' })).toBeVisible();

      const dialog = await page.getByRole('dialog').element();
      const content = dialog.querySelector('section') as HTMLElement;

      expect(getComputedStyle(content).overflowY).toBe('auto');
    });

    it('dismisses on outside interaction by default', async function outsideDismiss() {
      await render(<DefaultExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      interactOutside(await page.getByRole('dialog').element());
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not dismiss on outside interaction when isDismissable is false', async function notDismissable() {
      await render(<PlaygroundExample isDismissable={false} />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      interactOutside(await page.getByRole('dialog').element());
      await expect.element(page.getByRole('dialog')).toBeVisible();
    });

    it('still closes on Escape when isDismissable is false', async function escapeAlwaysCloses() {
      await render(<PlaygroundExample isDismissable={false} />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      await userEvent.keyboard('{Escape}');
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    });

    it('blocks Escape via the flat isKeyboardDismissDisabled prop', async function flatKeyboardDismiss() {
      await render(<PlaygroundExample isKeyboardDismissDisabled />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      await userEvent.keyboard('{Escape}');
      await expect.element(page.getByRole('dialog')).toBeVisible();
    });

    it('controls open state with flat isOpen and onOpenChange, no trigger', async function flatOpenState() {
      await render(<TriggerlessExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog', { name: 'Triggerless modal' })).toBeVisible();

      await userEvent.keyboard('{Escape}');
      await expect.element(page.getByRole('dialog', { name: 'Triggerless modal' })).not.toBeInTheDocument();
    });

    it('routes className and each layer bag to its own element', async function layerProps() {
      await render(<LayerPropsExample />);

      await userEvent.click(page.getByRole('button', { name: 'Open modal' }));
      await expect.element(page.getByRole('dialog')).toBeVisible();

      const dialog = document.querySelector('.custom-dialog');
      const container = document.querySelector('.custom-container');
      const overlay = document.querySelector('.custom-overlay');

      // Three distinct nested elements: overlay > container > dialog.
      expect(dialog?.getAttribute('role')).toBe('dialog');
      expect(container?.contains(dialog as Node)).toBe(true);
      expect(overlay?.contains(container as Node)).toBe(true);

      // Each bag's class is merged with the component's own, never replacing it.
      expect(overlay?.className.split(' ').length).toBeGreaterThan(1);
      expect(container?.className.split(' ').length).toBeGreaterThan(1);
    });
  });
});
