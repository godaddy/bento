import { beforeAll, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { EmphasesExample } from '../examples/emphases.tsx';
import { SizesExample } from '../examples/sizes.tsx';
import { HighContrastExample } from '../examples/high-contrast.tsx';
import { IconsExample } from '../examples/icons.tsx';
import { IndicatorExample } from '../examples/indicator.tsx';
import { InlineExample } from '../examples/inline.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  describe('#Tag', function tagTests() {
    it('default example', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('emphases example', async function emphasesRender() {
      const { container } = await render(<EmphasesExample />);
      await expect(container).toMatchScreenshot('emphases');
    });

    it('sizes example', async function sizesRender() {
      const { container } = await render(<SizesExample />);
      await expect(container).toMatchScreenshot('sizes');
    });

    it('high contrast example', async function highContrastRender() {
      const { container } = await render(<HighContrastExample />);
      await expect(container).toMatchScreenshot('high-contrast');
    });

    it('icons example', async function iconsRender() {
      const { container } = await render(<IconsExample />);
      await expect(container).toMatchScreenshot('icons');
    });

    it('indicator example', async function indicatorRender() {
      const { container } = await render(<IndicatorExample />);
      await expect(container).toMatchScreenshot('indicator');
    });

    it('inline example', async function inlineRender() {
      const { container } = await render(<InlineExample />);
      await expect(container).toMatchScreenshot('inline');
    });
  });
});
