import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { resetHover } from '#test/utils/test-helpers.tsx';
import { SwitchControlledExample } from '../examples/controlled.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { SwitchDisabledExample } from '../examples/disabled.tsx';
import { SwitchLabelPositionExample } from '../examples/label-position.tsx';
import { SwitchNoLabelExample } from '../examples/no-label.tsx';
import { SwitchSelectedExample } from '../examples/selected.tsx';
import { SwitchSizesExample } from '../examples/sizes.tsx';

describe('@godaddy/antares', function antares() {
  beforeEach(resetHover);

  describe('#Switch', function switchTests() {
    it('default example', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('selected example', async function selectedRender() {
      const { container } = await render(<SwitchSelectedExample />);
      await expect(container).toMatchScreenshot('selected');
    });

    it('sizes example', async function sizesRender() {
      const { container } = await render(<SwitchSizesExample />);
      await expect(container).toMatchScreenshot('sizes');
    });

    it('label position example', async function labelPositionRender() {
      const { container } = await render(<SwitchLabelPositionExample />);
      await expect(container).toMatchScreenshot('label-position');
    });

    it('no label example', async function noLabelRender() {
      const { container } = await render(<SwitchNoLabelExample />);
      await expect(container).toMatchScreenshot('no-label');
    });

    it('disabled example', async function disabledRender() {
      const { container } = await render(<SwitchDisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('controlled example', async function controlledRender() {
      const { container } = await render(<SwitchControlledExample />);
      await expect(container).toMatchScreenshot('controlled');
    });

    it('keyboard focus state', async function focusRender() {
      const { container } = await render(<DefaultExample />);
      await userEvent.keyboard('{Tab}');
      await expect(container).toMatchScreenshot('focus');
    });
  });
});
