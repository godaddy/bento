import { beforeAll, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { HideControlsExample } from '../examples/hide-controls.tsx';
import { RTLDirectionExample } from '../examples/rtl-direction.tsx';
import { VariableWidthsExample } from '../examples/variable-widths.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  describe('#Carousel', function carouselTests() {
    it('default example', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('hide controls example', async function hideControlsRender() {
      const { container } = await render(<HideControlsExample />);
      await expect(container).toMatchScreenshot('hide-controls');
    });

    it('variable widths example', async function variableWidthsRender() {
      const { container } = await render(<VariableWidthsExample />);
      await expect(container).toMatchScreenshot('variable-widths');
    });

    it('rtl direction example', async function rtlRender() {
      const { container } = await render(<RTLDirectionExample />);
      await expect(container).toMatchScreenshot('rtl-direction');
    });
  });
});
