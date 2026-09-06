import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { DisabledExample } from '../examples/disabled.tsx';
import { ManillaExample } from '../examples/manilla.tsx';
import { OverflowExample } from '../examples/overflow.tsx';
import { RTLExample } from '../examples/rtl.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#Tabs', function tabsTests() {
    it('renders the Underline design', async function underline() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('underline');
    });

    it('renders the Manilla design', async function manilla() {
      const { container } = await render(<ManillaExample />);
      await expect(container).toMatchScreenshot('manilla');
    });

    it('renders disabled tabs', async function disabled() {
      const { container } = await render(<DisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('renders overflow controls', async function overflow() {
      const { container } = await render(<OverflowExample />);
      await expect(container).toMatchScreenshot('overflow');
    });

    it('renders RTL tabs', async function rtl() {
      const { container } = await render(<RTLExample />);
      await expect(container).toMatchScreenshot('rtl');
    });
  });
});
