import { beforeAll, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default';
import { FieldGroupIconAccessoriesExample } from '../examples/icon-accessories';
import { FieldGroupLeadingControlExample } from '../examples/leading-control';
import { FieldGroupTrailingControlExample } from '../examples/trailing-control';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);

  describe('#FieldGroup', function fieldGroupTests() {
    it('basic example', async function basicRender() {
      const { container } = await render(<DefaultExample label="Label" description="Helper text" />);
      await expect(container).toMatchScreenshot('basic');
    });

    it('required example', async function requiredRender() {
      const { container } = await render(<DefaultExample label="Label" description="Helper text" isRequired />);
      await expect(container).toMatchScreenshot('required');
    });

    it('disabled example', async function disabledRender() {
      const { container } = await render(<DefaultExample label="Label" description="Helper text" isDisabled />);
      await expect(container).toMatchScreenshot('disabled');
    });

    it('leading control example', async function leadingControlRender() {
      const { container } = await render(<FieldGroupLeadingControlExample />);
      await expect(container).toMatchScreenshot('leading-control');
    });

    it('trailing control example', async function trailingControlRender() {
      const { container } = await render(<FieldGroupTrailingControlExample />);
      await expect(container).toMatchScreenshot('trailing-control');
    });

    it('icon accessories example', async function iconAccessoriesRender() {
      const { container } = await render(<FieldGroupIconAccessoriesExample />);
      await expect(container).toMatchScreenshot('icon-accessories');
    });

    it('invalid example', async function invalidRender() {
      const { container } = await render(<FieldGroupTrailingControlExample isInvalid />);
      await expect(container).toMatchScreenshot('invalid');
    });

    it('small size example', async function sizeSmRender() {
      const { container } = await render(<FieldGroupIconAccessoriesExample size="sm" />);
      await expect(container).toMatchScreenshot('size-sm');
    });
  });
});
