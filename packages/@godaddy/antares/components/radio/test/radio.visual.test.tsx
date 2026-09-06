import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { RadioDescriptionExample } from '../examples/radio-description.tsx';
import { RadioDisabledExample } from '../examples/radio-disabled.tsx';
import { RadioErrorExample } from '../examples/radio-error.tsx';
import { RadioHorizontalExample } from '../examples/radio-horizontal.tsx';
import { RadioRequiredExample } from '../examples/radio-required.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  beforeEach(resetHover);

  describe('#RadioGroup', function radioGroupTests() {
    it('basic example', async function basicRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('basic');
    });

    it('horizontal example', async function horizontalRender() {
      const { container } = await render(<RadioHorizontalExample />);
      await expect(container).toMatchScreenshot('horizontal');
    });

    it('disabled example', async function disabledRender() {
      const { container } = await render(<RadioDisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('description example', async function descriptionRender() {
      const { container } = await render(<RadioDescriptionExample />);
      await expect(container).toMatchScreenshot('description');
    });

    it('error example', async function errorRender() {
      const { container } = await render(<RadioErrorExample />);
      await expect(container).toMatchScreenshot('error');
    });

    it('error example with selected option', async function errorRenderWithSelectedOption() {
      const { container } = await render(<RadioErrorExample />);

      await page.getByRole('radio', { name: 'Standard Shipping' }).click({ force: true });
      await expect(container).toMatchScreenshot('error-selected');
    });

    it('required example', async function requiredRender() {
      const { container } = await render(<RadioRequiredExample />);
      await expect(container).toMatchScreenshot('required');
    });
  });
});
