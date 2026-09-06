import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { PlaygroundExample } from '../examples/pressable-playground.tsx';
import { resetHover } from '#test/utils/test-helpers.tsx';

describe('@godaddy/antares', function packageTests() {
  describe('#Pressable', function pressableTests() {
    it('applies the hovered data attribute', async function hoveredState() {
      const { getByRole } = await render(<PlaygroundExample />);
      const button = getByRole('button', { name: 'View account summary' });

      await userEvent.hover(button);
      expect(button).toHaveAttribute('data-hovered', 'true');
      await resetHover();
    });

    it('applies the focused data attributes', async function focusedState() {
      const { getByRole } = await render(<PlaygroundExample />);
      const button = getByRole('button', { name: 'View account summary' });

      await userEvent.tab();
      expect(button).toHaveAttribute('data-focused', 'true');
      expect(button).toHaveAttribute('data-focus-visible', 'true');
    });

    it('applies the pressed data attribute', async function pressedState() {
      const { getByRole } = await render(<PlaygroundExample />);
      const button = getByRole('button', { name: 'View account summary' });

      await userEvent.tab();
      await userEvent.keyboard('{Space>}');
      expect(button).toHaveAttribute('data-pressed', 'true');
      await userEvent.keyboard('{/Space}');
    });

    it('applies the disabled data attribute', async function disabledState() {
      const { getByRole } = await render(<PlaygroundExample isDisabled />);
      const button = getByRole('button', { name: 'View account summary' });

      expect(button).toHaveAttribute('data-disabled', 'true');
    });

    it('handles click', async function click() {
      const onPress = vi.fn();
      const { getByRole } = await render(<PlaygroundExample onPress={onPress} />);
      const btn = getByRole('button', { name: 'View account summary' });
      await expect.element(btn).toBeVisible();
      await userEvent.click(btn);
      expect(onPress).toHaveBeenCalledOnce();
    });

    it('handles keyboard activation', async function keyboard() {
      const onPress = vi.fn();
      const { getByRole } = await render(<PlaygroundExample onPress={onPress} />);
      const card = getByRole('button', { name: 'View account summary' });
      card.element().focus();
      await userEvent.keyboard('{Enter}');
      expect(onPress).toHaveBeenCalledOnce();
      await userEvent.keyboard('{Space}');
      expect(onPress).toHaveBeenCalledTimes(2);
    });

    it('handles disabled', async function disabled() {
      const onPress = vi.fn();
      const { getByRole } = await render(<PlaygroundExample isDisabled onPress={onPress} />);
      const btn = getByRole('button', { name: 'View account summary' });
      await expect.element(btn).toBeVisible();
      await userEvent.click(btn);

      btn.element().focus();
      await userEvent.keyboard('{Enter}{Space}');
      expect(onPress).not.toHaveBeenCalled();
    });

    it('composes child focus and hover handlers', async function composesInteractionHandlers() {
      const onChildPointerEnter = vi.fn();
      const onChildPointerLeave = vi.fn();
      const onChildFocus = vi.fn();
      const onChildBlur = vi.fn();
      const { getByRole } = await render(
        <PlaygroundExample
          onChildPointerEnter={onChildPointerEnter}
          onChildPointerLeave={onChildPointerLeave}
          onChildFocus={onChildFocus}
          onChildBlur={onChildBlur}
        />
      );
      const button = getByRole('button', { name: 'View account summary' });

      await userEvent.hover(button);
      expect(onChildPointerEnter).toHaveBeenCalledOnce();
      button.element().dispatchEvent(new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body }));
      expect(onChildPointerLeave).toHaveBeenCalledOnce();

      await userEvent.tab();
      expect(onChildFocus).toHaveBeenCalledOnce();
      button.element().blur();
      expect(onChildBlur).toHaveBeenCalledOnce();
    });

    it('preserves child props and forwards refs', async function preservesChildProps() {
      const pressableRef = createRef<HTMLElement>();
      const childRef = createRef<HTMLDivElement>();

      const { getByRole } = await render(
        <PlaygroundExample
          childRef={childRef}
          pressableRef={pressableRef}
          childClassName="consumer-child"
          childAriaDescribedBy="desc-id"
        />
      );

      const button = getByRole('button', { name: 'View account summary' });

      expect(button).toHaveClass('consumer-child');
      expect(pressableRef.current).toBe(childRef.current);
      expect(pressableRef.current).toBe(button.element());
      await expect.element(button).toHaveAttribute('aria-describedby', 'desc-id');
    });
  });
});
