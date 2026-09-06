import { beforeAll, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { DisabledExample } from '../examples/disabled.tsx';
import { IconExample } from '../examples/icon.tsx';
import { IconOnlyExample } from '../examples/icon-only.tsx';
import { OverflowExample } from '../examples/overflow.tsx';
import { RTLExample } from '../examples/rtl.tsx';
import { SizesExample } from '../examples/sizes.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  describe('#SegmentedController', function segmentedControllerTests() {
    it('basic example', async function basicRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('basic');
    });

    it('sizes example', async function sizesRender() {
      const { container } = await render(<SizesExample />);
      await expect(container).toMatchScreenshot('sizes');
    });

    it('icon example', async function iconRender() {
      const { container } = await render(<IconExample />);
      await expect(container).toMatchScreenshot('icon');
    });

    it('icon only example', async function iconOnlyRender() {
      const { container } = await render(<IconOnlyExample />);
      await expect(container).toMatchScreenshot('icon-only');
    });

    it('disabled example', async function disabledRender() {
      const { container } = await render(<DisabledExample />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('overflow example', async function overflowRender() {
      const { container } = await render(<OverflowExample />);
      await expect(container).toMatchScreenshot('overflow');
    });

    it('rtl example', async function rtlRender() {
      const { container } = await render(<RTLExample />);
      await expect(container).toMatchScreenshot('rtl');
    });
  });
});
