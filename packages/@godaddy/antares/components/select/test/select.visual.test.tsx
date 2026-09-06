import { beforeAll, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { SelectDisabledExample } from '../examples/disabled.tsx';
import { SelectInvalidExample } from '../examples/invalid.tsx';
import { SelectSizesExample } from '../examples/sizes.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  describe('#Select', function selectTests() {
    it('basic example', async function basicRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('basic');
    });

    it('disabled example', async function disabledRender() {
      const { container } = await render(<SelectDisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('invalid example', async function invalidRender() {
      const { container } = await render(<SelectInvalidExample />);
      await expect(container).toMatchScreenshot('invalid');
    });

    it('sizes example', async function sizesRender() {
      const { container } = await render(<SelectSizesExample />);
      await expect(container).toMatchScreenshot('sizes');
    });
  });
});
