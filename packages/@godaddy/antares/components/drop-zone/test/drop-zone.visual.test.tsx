import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import assume from 'assume';
import { resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { DisabledExample } from '../examples/disabled.tsx';

describe('@godaddy/antares', function antares() {
  beforeEach(resetHover);

  describe('#DropZone', function dropZoneVisualTests() {
    it('resting state', async function restingRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('resting');
    });

    it('disabled state', async function disabledRender() {
      const { container } = await render(<DisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('keyboard focus state', async function focusRender() {
      const { container } = await render(<DefaultExample />);
      await userEvent.keyboard('{Tab}');
      await expect(container).toMatchScreenshot('focus');
    });

    it('drop target state', async function dropTargetRender() {
      const { container } = await render(<DefaultExample />);
      const dropZone = container.querySelector('[data-rac]') as HTMLElement;
      assume(dropZone).is.not.equal(null);
      dropZone.setAttribute('data-drop-target', 'true');
      await expect(container).toMatchScreenshot('drop-target');
    });
  });
});
