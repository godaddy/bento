import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultActiveExample } from '../examples/default-active.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { WithLimitExample } from '../examples/with-limit.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  beforeEach(resetHover);

  describe('#Pagination', function paginationTests() {
    it('default example', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('default active example', async function defaultActiveRender() {
      const { container } = await render(<DefaultActiveExample />);
      await expect(container).toMatchScreenshot('default-active');
    });

    it('with limit example', async function withLimitRender() {
      const { container } = await render(<WithLimitExample />);
      await expect(container).toMatchScreenshot('with-limit');
    });
  });
});
