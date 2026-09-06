import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { NotStartedExample } from '../examples/not-started.tsx';
import { VerticalExample } from '../examples/vertical.tsx';
import { InteractiveExample } from '../examples/interactive.tsx';
import { DisabledExample } from '../examples/disabled.tsx';
import { HideStepNumbersExample } from '../examples/hide-step-numbers.tsx';
import { RTLExample } from '../examples/rtl.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#ProgressSteps', function progressStepsTests() {
    it('default example', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('not started example', async function notStartedRender() {
      const { container } = await render(<NotStartedExample />);
      await expect(container).toMatchScreenshot('not-started');
    });

    it('vertical example', async function verticalRender() {
      const { container } = await render(<VerticalExample />);
      await expect(container).toMatchScreenshot('vertical');
    });

    it('interactive example', async function interactiveRender() {
      const { container } = await render(<InteractiveExample />);
      await expect(container).toMatchScreenshot('interactive');
    });

    it('disabled example', async function disabledRender() {
      const { container } = await render(<DisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('hide step numbers example', async function hideStepNumbersRender() {
      const { container } = await render(<HideStepNumbersExample />);
      await expect(container).toMatchScreenshot('hide-step-numbers');
    });

    it('rtl example', async function rtlRender() {
      const { container } = await render(<RTLExample />);
      await expect(container).toMatchScreenshot('rtl');
    });
  });
});
