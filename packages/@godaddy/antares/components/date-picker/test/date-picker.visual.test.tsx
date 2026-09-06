import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DatePickerControlledExample } from '../examples/controlled.tsx';
import { DateRangePickerExample } from '../examples/range.tsx';
import { DatePickerWithErrorExample } from '../examples/with-error.tsx';
import { DatePickerDisabledExample } from '../examples/disabled.tsx';
import { DatePickerMinMaxExample } from '../examples/min-max.tsx';
import { DatePickerFormatOptionsExample } from '../examples/format-options.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#DatePicker', function datePicker() {
    it('with value', async function withValue() {
      const { container } = await render(<DatePickerControlledExample />);
      await expect(container).toMatchScreenshot('date-picker-value');
    });

    it('range', async function range() {
      const { container } = await render(<DateRangePickerExample />);
      await expect(container).toMatchScreenshot('date-range-picker');
    });

    it('error', async function error() {
      const { container } = await render(<DatePickerWithErrorExample />);
      await expect(container).toMatchScreenshot('date-picker-error');
    });

    it('disabled', async function disabled() {
      const { container } = await render(<DatePickerDisabledExample />);
      await expect(container).toMatchScreenshot('date-picker-disabled');
    });

    it('min-max', async function minMax() {
      const { container } = await render(<DatePickerMinMaxExample />);
      await expect(container).toMatchScreenshot('date-picker-min-max');
    });

    it('format-options', async function formatOptions() {
      const { container } = await render(<DatePickerFormatOptionsExample />);
      await expect(container).toMatchScreenshot('date-picker-format-options');
    });
  });
});
