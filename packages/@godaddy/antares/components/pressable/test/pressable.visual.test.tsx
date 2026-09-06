import { Box } from '@godaddy/antares';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { PlaygroundExample } from '../examples/pressable-playground.tsx';

function renderPlayground(children: ReactNode) {
  return render(<Box padding="md">{children}</Box>);
}

describe('@godaddy/antares', function packageTests() {
  beforeEach(resetHover);

  describe('#Pressable', function pressableTests() {
    it('default', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('focused playground', async function focusedRender() {
      const { container } = await renderPlayground(<PlaygroundExample />);
      await userEvent.keyboard('{Tab}');
      await expect(container).toMatchScreenshot('focused');
    });

    it('disabled playground', async function disabledRender() {
      const { container } = await renderPlayground(<PlaygroundExample isDisabled />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('pressed playground', async function pressedRender() {
      const { container } = await renderPlayground(<PlaygroundExample isPressed />);
      await expect(container).toMatchScreenshot('pressed');
    });
  });
});
