import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { preloadTestIcons, resetHover } from '#test/utils/test-helpers.tsx';
import { DefaultExample } from '../examples/default.tsx';
import { CalendarWithValueExample } from '../examples/with-value.tsx';
import { RangeCalendarExample } from '../examples/range.tsx';
import { CalendarMinMaxExample } from '../examples/min-max.tsx';
import { CalendarUnavailableExample } from '../examples/unavailable.tsx';
import { CalendarDisabledExample } from '../examples/disabled.tsx';

describe('@godaddy/antares', function antares() {
  beforeAll(preloadTestIcons);
  beforeEach(resetHover);

  describe('#Calendar', function calendar() {
    it('default', async function defaultExample() {
      const { container } = await render(<DefaultExample />);
      await expect(container).toMatchScreenshot('calendar-default');
    });

    it('with value', async function withValue() {
      const { container } = await render(<CalendarWithValueExample />);
      await expect(container).toMatchScreenshot('calendar-with-value');
    });

    it('range', async function range() {
      const { container } = await render(<RangeCalendarExample />);
      await expect(container).toMatchScreenshot('calendar-range');
    });

    it('min-max', async function minMax() {
      const { container } = await render(<CalendarMinMaxExample />);
      await expect(container).toMatchScreenshot('calendar-min-max');
    });

    it('unavailable', async function unavailable() {
      const { container } = await render(<CalendarUnavailableExample />);
      await expect(container).toMatchScreenshot('calendar-unavailable');
    });

    it('disabled', async function disabled() {
      const { container } = await render(<CalendarDisabledExample />);
      await expect(container).toMatchScreenshot('calendar-disabled');
    });
  });
});
