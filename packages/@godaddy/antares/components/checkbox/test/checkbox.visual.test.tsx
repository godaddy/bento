import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { CheckboxIndeterminateExample } from '../examples/indeterminate.tsx';
import { CheckboxGroupBasicExample } from '../examples/group.tsx';
import { CheckboxGroupControlledExample } from '../examples/controlled.tsx';
import { CheckboxGroupRequiredExample } from '../examples/required.tsx';
import { CheckboxGroupDisabledExample } from '../examples/disabled.tsx';
import { CheckboxGroupInvalidExample } from '../examples/invalid.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  beforeEach(resetHover);

  describe('#Checkbox', function checkboxTests() {
    it('basic example', async function basicRender() {
      const { container } = await render(<DefaultExample />);
      await page.getByRole('document').hover({ position: { x: 100, y: 100 } });
      await expect(container).toMatchScreenshot('basic');
    });

    it('indeterminate example', async function indeterminateRender() {
      const { container } = await render(<CheckboxIndeterminateExample />);
      await expect(container).toMatchScreenshot('indeterminate');
    });

    it('group example', async function groupRender() {
      const { container } = await render(<CheckboxGroupBasicExample />);
      await expect(container).toMatchScreenshot('group');
    });

    it('controlled example', async function controlledRender() {
      const { container } = await render(<CheckboxGroupControlledExample />);
      await expect(container).toMatchScreenshot('controlled');
    });

    it('required example', async function requiredRender() {
      const { container } = await render(<CheckboxGroupRequiredExample />);
      await expect(container).toMatchScreenshot('required');
    });

    it('disabled example', async function disabledRender() {
      const { container } = await render(<CheckboxGroupDisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('invalid example', async function invalidRender() {
      const { container } = await render(<CheckboxGroupInvalidExample />);
      await expect(container).toMatchScreenshot('invalid');
    });

    it('error example with selected option', async function errorRenderWithSelectedOption() {
      const { container } = await render(<CheckboxGroupInvalidExample />);

      await page.getByRole('checkbox', { name: 'Blue' }).click({ force: true });
      await expect(container).toMatchScreenshot('error-selected');
    });
  });
});
