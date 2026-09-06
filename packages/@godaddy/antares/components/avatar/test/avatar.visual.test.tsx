import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { resetHover } from '#test/utils/test-helpers.tsx';
import { AccountMenuExample } from '../examples/account-menu.tsx';
import { AvatarButtonExample } from '../examples/avatar-button.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { EmphasisExample } from '../examples/emphasis.tsx';
import { ImageFallbackExample } from '../examples/image-fallback.tsx';
import { ImageExample } from '../examples/image.tsx';
import { ShapesExample } from '../examples/shapes.tsx';

describe('@godaddy/antares', function antares() {
  beforeEach(resetHover);

  describe('#Avatar', function avatarVisualTests() {
    it('default', async function defaultRender() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('default');
    });

    it('image', async function imageRender() {
      const { container } = await render(<ImageExample />);
      await expect(container).toMatchScreenshot('image');
    });

    it('image fallback', async function imageFallbackRender() {
      const { container } = await render(<ImageFallbackExample />);
      await expect(container).toMatchScreenshot('image-fallback');
    });

    it('shape and size matrix', async function shapesRender() {
      const { container } = await render(<ShapesExample />);
      await expect(container).toMatchScreenshot('shapes');
    });

    it('all emphasis values', async function emphasisRender() {
      const { container } = await render(<EmphasisExample />);
      await expect(container).toMatchScreenshot('emphasis');
    });

    it('avatar button', async function avatarButtonRender() {
      const { container } = await render(<AvatarButtonExample />);
      await expect(container).toMatchScreenshot('avatar-button');
    });

    it('account menu', async function accountMenuRender() {
      const { container } = await render(<AccountMenuExample />);
      await expect(container).toMatchScreenshot('account-menu');
    });

    it('account menu expanded', async function accountMenuExpandedRender() {
      const { container } = await render(<AccountMenuExample />);
      await userEvent.click(page.getByRole('button', { name: 'Account menu' }));
      await expect(container).toMatchScreenshot('account-menu-expanded');
    });
  });
});
