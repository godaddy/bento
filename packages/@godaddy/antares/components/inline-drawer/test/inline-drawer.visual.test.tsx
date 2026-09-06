import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { SidebarNavExample } from '../examples/sidebar-nav.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#InlineDrawer', function inlineDrawerTests() {
    it('default example', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('sidebar nav (peek) example', async function sidebarRender() {
      const { container } = await render(<SidebarNavExample />);
      await expect(container).toMatchScreenshot('sidebar-nav');
    });
  });
});
