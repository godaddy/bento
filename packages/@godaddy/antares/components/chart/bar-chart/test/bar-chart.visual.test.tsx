import assume from 'assume';
import type React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { CategoryColorsExample } from '../examples/category-colors';
import { waitForSelector } from '#test/utils/wait-for-selector.ts';
import { CustomDomainExample } from '../examples/custom-domain';
import { CustomTooltipPeriodComparisonExample } from '../examples/custom-tooltip-period-comparison';
import { FormattedTickMarksExample } from '../examples/formatted-tick-marks';
import { HorizontalMultiSeriesExample } from '../examples/horizontal-multi-series';
import { HorizontalSingleSeriesExample } from '../examples/horizontal-single-series';
import { MultiSeriesExample } from '../examples/multi-series';
import { RTLHorizontalMultiSeriesExample } from '../examples/rtl-horizontal-multi-series';
import { RTLMultiSeriesExample } from '../examples/rtl-multi-series';
import { SeriesColorsExample } from '../examples/series-colors';
import { DefaultExample } from '../examples/default';

/**
 * Renders an example in a sized container and waits for chart SVG
 *
 * @param Example - Example component to render
 * @returns Render result after SVG is present
 */
async function renderExampleAndWait(Example: React.ComponentType, width = 900, height = 800) {
  await page.viewport(width, height);
  const result = await render(
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Example />
    </div>
  );
  await waitForSelector(result.container, 'svg');

  return result;
}

describe('@godaddy/antares', function antares() {
  describe('#BarChart', function barChartTests() {
    describe('#basic', function basic() {
      it('default screenshot', async function defaultExample() {
        const { container } = await renderExampleAndWait(DefaultExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('default');
      });

      it('multi-series screenshot', async function multiSeries() {
        const { container } = await renderExampleAndWait(MultiSeriesExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('multi-series');
      });
    });

    describe('#feature', function feature() {
      it('horizontal-single-series screenshot', async function horizontalSingleSeries() {
        const { container } = await renderExampleAndWait(HorizontalSingleSeriesExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('horizontal-single-series');
      });

      it('horizontal-multi-series screenshot', async function horizontalMultiSeries() {
        const { container } = await renderExampleAndWait(HorizontalMultiSeriesExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('horizontal-multi-series');
      });

      it('rtl-multi-series screenshot', async function rtlMultiSeries() {
        const { container } = await renderExampleAndWait(RTLMultiSeriesExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('rtl-multi-series');
      });

      it('rtl-horizontal-multi-series screenshot', async function rtlHorizontalMultiSeries() {
        const { container } = await renderExampleAndWait(RTLHorizontalMultiSeriesExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('rtl-horizontal-multi-series');
      });

      it('formatted-tick-marks screenshot', async function formattedTickMarks() {
        const { container } = await renderExampleAndWait(FormattedTickMarksExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('formatted-tick-marks');
      });

      it('series-colors screenshot', async function seriesColors() {
        const { container } = await renderExampleAndWait(SeriesColorsExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('series-colors');
      });

      it('category-colors screenshot', async function categoryColors() {
        const { container } = await renderExampleAndWait(CategoryColorsExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('category-colors');
      });

      it('custom-tooltip-period-comparison screenshot', async function customTooltipPeriodComparison() {
        const { container } = await renderExampleAndWait(CustomTooltipPeriodComparisonExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('custom-tooltip-period-comparison');
      });
    });

    describe('#configuration', function configuration() {
      it('custom-domain screenshot', async function customDomain() {
        const { container } = await renderExampleAndWait(CustomDomainExample);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('custom-domain');
      });
    });
  });
});
