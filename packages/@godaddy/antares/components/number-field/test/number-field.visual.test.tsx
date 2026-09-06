import { beforeAll, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { NumberFieldControlledExample } from '../examples/controlled.tsx';
import { NumberFieldInvalidExample } from '../examples/invalid.tsx';
import { NumberFieldDisabledExample } from '../examples/disabled.tsx';
import { NumberFieldHideStepperExample } from '../examples/hide-stepper.tsx';
import { NumberFieldValueScaleExample } from '../examples/value-scale.tsx';
import { NumberFieldFormatOptionsExample } from '../examples/format-options.tsx';
import { NumberFieldSizesExample } from '../examples/sizes.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  describe('#NumberField', function numberFieldTests() {
    it('basic example', async function basicRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('basic');
    });

    it('controlled example', async function controlledRender() {
      const { container } = await render(<NumberFieldControlledExample />);
      await expect(container).toMatchScreenshot('controlled');
    });

    it('invalid example', async function invalidRender() {
      const { container } = await render(<NumberFieldInvalidExample />);
      await expect(container).toMatchScreenshot('invalid');
    });

    it('disabled example', async function disabledRender() {
      const { container } = await render(<NumberFieldDisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('hideStepper example', async function hideStepperRender() {
      const { container } = await render(<NumberFieldHideStepperExample />);
      await expect(container).toMatchScreenshot('hide-stepper');
    });

    it('valueScale example', async function valueScaleRender() {
      const { container } = await render(<NumberFieldValueScaleExample />);
      await expect(container).toMatchScreenshot('value-scale');
    });

    it('formatOptions example', async function formatOptionsRender() {
      const { container } = await render(<NumberFieldFormatOptionsExample />);
      await expect(container).toMatchScreenshot('format-options');
    });

    it('sizes example', async function sizesRender() {
      const { container } = await render(<NumberFieldSizesExample />);
      await expect(container).toMatchScreenshot('sizes');
    });
  });
});
