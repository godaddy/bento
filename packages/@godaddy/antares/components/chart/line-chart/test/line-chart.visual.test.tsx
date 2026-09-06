import assume from 'assume';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { waitForSelector } from '#test/utils/wait-for-selector.ts';
import { BandPaddingExample } from '../examples/band-padding';
import { BaselinesExample } from '../examples/baselines';
import { BitcoinPriceExample } from '../examples/bitcoin-price';
import { BrowserUsageExample } from '../examples/browser-usage';
import { CityTemperatureExample } from '../examples/city-temperature';
import { CrosshairOnlyExample } from '../examples/crosshair-only';
import { CustomAccessorsExample } from '../examples/custom-accessors';
import { CustomTicksExample } from '../examples/custom-ticks';
import { CustomTooltipExample } from '../examples/custom-tooltip';
import { CustomTooltipFormattingExample } from '../examples/custom-tooltip-formatting';
import { CustomTooltipPairChangeExample } from '../examples/custom-tooltip-pair-change';
import { CustomTooltipPeriodComparisonExample } from '../examples/custom-tooltip-period-comparison';
import { FixedDomainExample } from '../examples/fixed-domain';
import { FixedSizeExample } from '../examples/fixed-size';
import { FormattingExample } from '../examples/formatting';
import { GridlinesExample } from '../examples/gridlines';
import { LabelsExample } from '../examples/labels';
import { LegendExample } from '../examples/legend';
import { ColorIndexExample } from '../examples/color-index';
import { LineStylesExample } from '../examples/line-styles';
import { MissingValuesExample } from '../examples/missing-values';
import { MultipleSeriesExample } from '../examples/multiple-series';
import { NiceValuesExample } from '../examples/nice-values';
import { RTLExample } from '../examples/rtl';
import { DefaultExample } from '../examples/default';
import { TicksExample } from '../examples/ticks';
import { TitlesExample } from '../examples/titles';
import { TooltipDisabledExample } from '../examples/tooltip-disabled';
import { ZeroIncludedExample } from '../examples/zero-included';

/**
 * Renders an example in a sized container and waits for chart SVG
 *
 * @param children - Example element(s) to render (e.g. <MyExample />)
 * @param width - Viewport and container width in px (default: 800)
 * @param height - Viewport and container height in px (default: 400)
 * @returns Render result after SVG is present
 */
async function renderExampleAndWait(children: ReactNode, width = 800, height = 400) {
  await page.viewport(width, height);
  const result = await render(<div style={{ width: `${width}px`, height: `${height}px` }}>{children}</div>);
  await waitForSelector(result.container, 'svg');

  return result;
}

describe('@godaddy/antares', function antares() {
  describe('#LineChart', function lineChartTests() {
    describe('#basic', function basic() {
      it('default screenshot', async function defaultExample() {
        const { container } = await renderExampleAndWait(<DefaultExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('default');
      });

      it('multiple-series screenshot', async function multipleSeries() {
        const { container } = await renderExampleAndWait(<MultipleSeriesExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('multiple-series');
      });

      it('custom-accessors screenshot', async function customAccessors() {
        const { container } = await renderExampleAndWait(<CustomAccessorsExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('custom-accessors');
      });
    });

    describe('#feature', function feature() {
      it('gridlines screenshot', async function gridlines() {
        const { container } = await renderExampleAndWait(<GridlinesExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('gridlines');
      });

      it('labels screenshot', async function labels() {
        const { container } = await renderExampleAndWait(<LabelsExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('labels');
      });

      it('ticks screenshot', async function ticks() {
        const { container } = await renderExampleAndWait(<TicksExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('ticks');
      });

      it('baselines screenshot', async function baselines() {
        const { container } = await renderExampleAndWait(<BaselinesExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('baselines');
      });

      it('titles screenshot', async function titles() {
        const { container } = await renderExampleAndWait(<TitlesExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('titles');
      });

      it('legend screenshot', async function legend() {
        const { container } = await renderExampleAndWait(<LegendExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('legend');
      });

      it('line-styles screenshot', async function lineStyles() {
        const { container } = await renderExampleAndWait(<LineStylesExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('line-styles');
      });

      it('color-index screenshot', async function colorIndex() {
        const { container } = await renderExampleAndWait(<ColorIndexExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('color-index');
      });

      it('formatting screenshot', async function formatting() {
        const { container, locator } = await renderExampleAndWait(<FormattingExample />);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 120, y: 50 } });
        await expect(container).toMatchScreenshot('formatting');
      });
    });

    describe('#configuration', function configuration() {
      it('fixed-domain screenshot', async function fixedDomain() {
        const { container } = await renderExampleAndWait(<FixedDomainExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('fixed-domain');
      });

      it('nice-values screenshot', async function niceValues() {
        const { container } = await renderExampleAndWait(<NiceValuesExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('nice-values');
      });

      it('zero-included screenshot', async function zeroIncluded() {
        const { container } = await renderExampleAndWait(<ZeroIncludedExample />, 800, 500);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('zero-included');
      });

      it('custom-ticks screenshot', async function customTicks() {
        const { container } = await renderExampleAndWait(<CustomTicksExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('custom-ticks');
      });

      it('band-padding screenshot', async function bandPadding() {
        const { container } = await renderExampleAndWait(<BandPaddingExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('band-padding');
      });
    });

    describe('#interactive', function interactive() {
      it('tooltip-disabled screenshot', async function tooltipDisabled() {
        const { container } = await renderExampleAndWait(<TooltipDisabledExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('tooltip-disabled');
      });

      it('crosshair-only screenshot', async function crosshairOnly() {
        const { container, locator } = await renderExampleAndWait(<CrosshairOnlyExample />);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 150, y: 50 } });
        await expect(container).toMatchScreenshot('crosshair-only');
      });

      it('custom-tooltip-formatting screenshot', async function customTooltipFormatting() {
        const { container, locator } = await renderExampleAndWait(<CustomTooltipFormattingExample />);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 400, y: 200 } });
        await expect(container).toMatchScreenshot('custom-tooltip-formatting');
      });

      it('custom-tooltip screenshot', async function customTooltip() {
        const { container, locator } = await renderExampleAndWait(<CustomTooltipExample />);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 400, y: 200 } });
        await expect(container).toMatchScreenshot('custom-tooltip');
      });

      it('custom-tooltip-pair-change screenshot', async function customTooltipPairChange() {
        const { container, locator } = await renderExampleAndWait(<CustomTooltipPairChangeExample />);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 400, y: 200 } });
        await expect(container).toMatchScreenshot('custom-tooltip-pair-change');
      });

      it('custom-tooltip-period-comparison screenshot', async function customTooltipPeriodComparison() {
        const { container, locator } = await renderExampleAndWait(<CustomTooltipPeriodComparisonExample />);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 400, y: 200 } });
        await expect(container).toMatchScreenshot('custom-tooltip-period-comparison');
      });
    });

    describe('#layout', function layout() {
      it('fixed-size screenshot', async function fixedSize() {
        const { container } = await renderExampleAndWait(<FixedSizeExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('fixed-size');
      });

      it('missing-values screenshot', async function missingValues() {
        const { container } = await renderExampleAndWait(<MissingValuesExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('missing-values');
      });
    });

    describe('#real-world', function realWorld() {
      it('bitcoin-price screenshot', async function bitcoinPrice() {
        const { container, locator } = await renderExampleAndWait(<BitcoinPriceExample />, 800, 600);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 120, y: 50 } });
        await expect(container).toMatchScreenshot('bitcoin-price');
      });

      it('bitcoin-price-scroll screenshot', async function bitcoinPriceScroll() {
        const { container } = await renderExampleAndWait(
          <BitcoinPriceExample xLabelsOrientation="horizontal" />,
          400,
          600
        );

        const svg = container.querySelector('svg') as SVGGraphicsElement;
        const area = svg.parentNode as HTMLElement;
        area.scrollLeft = 400;

        await expect(container).toMatchScreenshot('bitcoin-price-scroll');
      });

      it('city-temperature screenshot', async function cityTemperature() {
        const { container, locator } = await renderExampleAndWait(<CityTemperatureExample />);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 199, y: 100 } });
        await expect(container).toMatchScreenshot('city-temperature');
      });

      it('browser-usage screenshot', async function browserUsage() {
        const { container, locator } = await renderExampleAndWait(<BrowserUsageExample />, 800, 600);

        assume(container.querySelector('svg')).exists();
        await locator.hover({ position: { x: 120, y: 50 } });
        await expect(container).toMatchScreenshot('browser-usage');
      });
    });

    describe('#rtl', function rtl() {
      it('rtl screenshot', async function rtlScreenshot() {
        const { container } = await renderExampleAndWait(<RTLExample />);

        assume(container.querySelector('svg')).exists();
        await expect(container).toMatchScreenshot('rtl');
      });
    });
  });
});
