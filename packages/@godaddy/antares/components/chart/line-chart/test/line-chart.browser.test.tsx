import assume from 'assume';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { waitForSelector } from '#test/utils/wait-for-selector.ts';
import { BitcoinPriceExample } from '../examples/bitcoin-price';
import { CityTemperatureExample } from '../examples/city-temperature';
import { LegendExample } from '../examples/legend';
import { MultipleSeriesExample } from '../examples/multiple-series';
import { DefaultExample } from '../examples/default';
import { TitlesExample } from '../examples/titles';
import { FormattingExample } from '../examples/formatting.tsx';
import { CustomTooltipExample } from '../examples/custom-tooltip.tsx';
import { CustomTooltipFormattingExample } from '../examples/custom-tooltip-formatting.tsx';
import { CustomTooltipPairChangeExample } from '../examples/custom-tooltip-pair-change.tsx';
import { CustomTooltipPeriodComparisonExample } from '../examples/custom-tooltip-period-comparison.tsx';
import { CustomAccessorsExample } from '../examples/custom-accessors.tsx';
import { BrowserUsageExample } from '../examples/browser-usage.tsx';
import { RTLExample } from '../examples/rtl.tsx';

/**
 * Renders a node in a sized container and waits for chart SVG
 *
 * @param node - React node to render (e.g. <Example />)
 * @param width - Container width in px (default: 800)
 * @param height - Container height in px (default: 400)
 * @returns Render result after SVG is present
 */
async function renderExampleAndWait(node: ReactNode, width = 800, height = 400) {
  await page.viewport(width, height);
  const result = await render(<div style={{ width: `${width}px`, height: `${height}px` }}>{node}</div>);
  await waitForSelector(result.container, 'svg');

  return result;
}

describe('@godaddy/antares', function antares() {
  describe('#LineChart', function lineChartTests() {
    describe('#default', function defaultExample() {
      it('renders chart with one series and shows series label', async function renders() {
        const { container, locator } = await renderExampleAndWait(<DefaultExample />);

        assume(container.querySelector('svg')).exists();
        assume(locator.getByText('Series 1')).exists();
      });
    });

    describe('#multiple-series', function multipleSeries() {
      it('renders chart with multiple series and shows all series labels', async function renders() {
        const { container, locator } = await renderExampleAndWait(<MultipleSeriesExample />);

        assume(container.querySelector('svg')).exists();
        assume(locator.getByText('Product A')).exists();
        assume(locator.getByText('Product B')).exists();
      });

      it('render chart with multiple series and legend listing all series', async function renders() {
        const { container, locator, baseElement } = await renderExampleAndWait(<BrowserUsageExample />);
        await waitForSelector(baseElement, 'path', { timeout: 1000 });

        const svg = container.querySelector('svg') as SVGGraphicsElement;
        const paths = svg.querySelectorAll('path');

        assume(paths.length).equals(6);
        assume(locator.getByText('Google Chrome')).exists();
        assume(locator.getByText('Internet Explorer')).exists();
        assume(locator.getByText('Firefox')).exists();
        assume(locator.getByText('Safari')).exists();
        assume(locator.getByText('Microsoft Edge')).exists();
        assume(locator.getByText('Opera')).exists();

        await locator.hover({ position: { x: 120, y: 50 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

        assume(locator.getByText('Google Chrome50.53%')).exists();
        assume(locator.getByText('Internet Explorer22.64%')).exists();
        assume(locator.getByText('Firefox18.04%')).exists();
        assume(locator.getByText('Safari17.33%')).exists();
        assume(locator.getByText('Microsoft Edge0.07%')).exists();
        assume(locator.getByText('Opera1.27%')).exists();
      });
    });

    describe('#axis-titles', function axisTitles() {
      it('renders chart with x and y axis titles', async function renders() {
        const { container, locator } = await renderExampleAndWait(<TitlesExample />);

        assume(container.querySelector('svg')).exists();
        assume(locator.getByText('Date')).exists();
        assume(locator.getByText('Value')).exists();
      });
    });

    describe('#legend', function legend() {
      it('renders chart with legend listing all series', async function renders() {
        const { container, locator } = await renderExampleAndWait(<LegendExample />);

        assume(container.querySelector('svg')).exists();
        assume(locator.getByText('Series 1')).exists();
        assume(locator.getByText('Series 2')).exists();
        assume(locator.getByText('Series 3')).exists();
      });

      it('shows legend at bottom by default when multiple series and legendPosition omitted', async function defaultLegendBottom() {
        const { container, locator } = await renderExampleAndWait(<MultipleSeriesExample legendPosition={undefined} />);

        assume(container.querySelector('[data-legend-position="bottom"]')).exists();

        assume(locator.getByText('Product A')).exists();
        assume(locator.getByText('Product B')).exists();
        assume(locator.getByText('Product C')).exists();
        assume(locator.getByText('Product D')).exists();
      });
    });

    describe('#horizontal-scroll', function horizontalScroll() {
      it('chart area is scrollable when content overflows width', async function scrollable() {
        const { container } = await renderExampleAndWait(
          <BitcoinPriceExample xLabelsOrientation="horizontal" />,
          400,
          600
        );
        const svg = container.querySelector('svg') as SVGGraphicsElement;
        assume(svg).exists();
        const area = svg.parentNode as HTMLElement;
        assume(area).exists();

        await vi.waitUntil(
          function scrollable() {
            return area.scrollWidth > area.clientWidth;
          },
          { timeout: 10000 }
        );
        assume(area.scrollWidth).greaterThan(area.clientWidth);

        area.scrollLeft = 100;
        assume(area.scrollLeft).equals(100);
      });

      it('hides tooltip when pointer moves to viewport y-axis after scroll', async function hidesTooltipOnYAxisHover() {
        const { container, locator, baseElement } = await renderExampleAndWait(
          <BitcoinPriceExample xLabelsOrientation="horizontal" />,
          400,
          600
        );
        const area = (container.querySelector('svg') as SVGElement).parentElement as HTMLElement;
        await vi.waitUntil(
          function wideEnough() {
            return area.scrollWidth > area.clientWidth;
          },
          { timeout: 10000 }
        );
        function syncScroll() {
          area.scrollLeft = 120;
          area.dispatchEvent(new Event('scroll'));
        }
        syncScroll();
        assume(area.scrollLeft).equals(120);

        await vi.waitUntil(
          function layerReady() {
            return area.querySelector('[data-tooltip-dismiss-strip]') != null;
          },
          { timeout: 5000 }
        );

        await locator.hover({ position: { x: 250, y: 120 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 2000 });
        assume(locator.getByText('Bitcoin Price')).exists();

        syncScroll();
        await vi.waitUntil(
          function layerReadyAgain() {
            return area.querySelector('[data-tooltip-dismiss-strip]') != null;
          },
          { timeout: 2000 }
        );
        const layerEl = area.querySelector('[data-tooltip-dismiss-strip]') as HTMLElement;
        await new Promise(function nextTick(r) {
          setTimeout(r, 0);
        });
        layerEl.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, cancelable: true }));

        await vi.waitUntil(
          function tooltipClosed() {
            return document.querySelector('.visx-tooltip') == null;
          },
          { timeout: 2000 }
        );
      });

      it('tooltip updates on scroll and disappears when pointer leaves', async function tooltipScrollAndLeave() {
        const { container, locator, baseElement } = await renderExampleAndWait(
          <BitcoinPriceExample xLabelsOrientation="horizontal" />,
          400,
          600
        );
        const area = (container.querySelector('svg') as SVGElement).parentElement as HTMLElement;
        await vi.waitUntil(
          function wideEnough() {
            return area.scrollWidth > area.clientWidth;
          },
          { timeout: 10000 }
        );

        // hover to open tooltip and register the pointer target for re-dispatch on scroll
        await locator.hover({ position: { x: 250, y: 120 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 2000 });
        assume(locator.getByText('Bitcoin Price$660.73')).exists();

        // scroll — pointer still inside, handler re-dispatches pointermove so tooltip updates
        area.scrollLeft = 80;
        area.dispatchEvent(new Event('scroll'));

        await new Promise(function nextTick(r) {
          setTimeout(r, 50);
        });

        assume(locator.getByText('Bitcoin Price$742.72')).exists();

        // pointer leaves the chart area: clear lastTarget and let visx close its tooltip
        area
          .querySelector('svg')
          ?.lastElementChild?.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, cancelable: true }));

        await vi.waitUntil(
          function tooltipGone() {
            return document.querySelector('.visx-tooltip') == null;
          },
          { timeout: 2000 }
        );
      });
    });

    describe('#tooltips', function tooltips() {
      it('hover shows tooltips for all series at cursor position', async function hoverShowsTooltips() {
        const { container, locator, baseElement } = await renderExampleAndWait(<CityTemperatureExample />);

        assume(container.querySelector('svg')).exists();
        assume(locator.getByText('Austin')).exists();

        await locator.hover({ position: { x: 199, y: 100 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

        const tooltipElements = document.querySelectorAll('.visx-tooltip');
        const lastTooltip = tooltipElements[tooltipElements.length - 1];

        assume(tooltipElements.length).equals(5);
        assume(lastTooltip.children.length).greaterThan(0);
      });

      it('displays glyphs but no tooltips for all series on hover when tooltips are disabled', async function displaysGlyphsWithoutTooltipsWhenDisabled() {
        const { container, locator, baseElement } = await renderExampleAndWait(
          <CityTemperatureExample tooltip={false} />
        );

        assume(container.querySelector('svg')).exists();
        assume(locator.getByText('Austin')).exists();

        await locator.hover({ position: { x: 199, y: 100 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

        const tooltipElements = document.querySelectorAll('.visx-tooltip');
        const lastTooltip = tooltipElements[tooltipElements.length - 1];

        assume(tooltipElements.length).equals(5);
        assume(lastTooltip.children).empty();
      });
    });

    describe('#formatting', function formatting() {
      it('renders chart with formatted axis and tooltip values', async function renders() {
        const { container, locator, baseElement } = await renderExampleAndWait(<FormattingExample />);

        assume(container.querySelector('svg')).exists();
        assume(locator.getByText('$70.00')).exists();

        await locator.hover({ position: { x: 120, y: 50 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

        const tooltipElements = document.querySelectorAll('.visx-tooltip');
        const lastTooltip = tooltipElements[tooltipElements.length - 1];

        assume(lastTooltip.children.length).greaterThan(0);
        assume(lastTooltip.children[0].textContent).equals('Series 1$58.00');
      });

      it('render formatted tooltip with bitcoin price example', async function renders() {
        const { locator, baseElement } = await renderExampleAndWait(<BitcoinPriceExample />);

        await locator.hover({ position: { x: 120, y: 50 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

        assume(locator.getByText('Bitcoin Price$660.73')).exists();
      });
    });

    it('render chart with formatted tooltip value', async function renders() {
      const { locator, baseElement } = await renderExampleAndWait(<CustomTooltipFormattingExample />);

      await locator.hover({ position: { x: 400, y: 200 } });
      await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

      const tooltipElements = document.querySelectorAll('.visx-tooltip');
      const lastTooltip = tooltipElements[tooltipElements.length - 1];

      assume(lastTooltip.children.length).greaterThan(0);
      expect(lastTooltip.children[0].textContent).toMatch(/^Series 1Value: \d+\.\d{2} units$/);
    });

    describe('#custom-tooltip', function customTooltip() {
      it('renders a custom tooltip specific to the hovered curve', async function hoveredCurveOnly() {
        const { container, locator, baseElement } = await renderExampleAndWait(<CustomTooltipExample />);

        assume(container.querySelector('svg')).exists();

        await locator.hover({ position: { x: 400, y: 200 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

        const tooltipElements = document.querySelectorAll('.visx-tooltip');
        const lastTooltip = tooltipElements[tooltipElements.length - 1];
        const text = lastTooltip.textContent ?? '';

        // The custom tooltip shows only the hovered curve, not every series at the X position:
        // exactly one city is present (XOR), proving the nearestDatum wiring.
        assume(text).matches(/°F/);
        const showsNewYork = text.includes('New York');
        const showsSanFrancisco = text.includes('San Francisco');
        assume(showsNewYork !== showsSanFrancisco).is.true();
      });
    });

    describe('#custom-tooltip-pair-change', function customTooltipPairChange() {
      function lastTooltipText() {
        const tooltipElements = document.querySelectorAll('.visx-tooltip');
        return tooltipElements[tooltipElements.length - 1]?.textContent ?? '';
      }

      it('combines both lines of the hovered pair and their percent change', async function pairChange() {
        const { container, locator, baseElement } = await renderExampleAndWait(<CustomTooltipPairChangeExample />);

        assume(container.querySelector('svg')).exists();

        await locator.hover({ position: { x: 400, y: 200 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

        const text = lastTooltipText();

        // Unlike the single-curve custom tooltip, this one combines the pair: both the actual
        // and forecast rows plus their computed percent change appear together.
        assume(text).matches(/Actual: -?\d/);
        assume(text).matches(/Forecast: -?\d/);
        assume(text).matches(/Forecast vs actual: [+-]?\d+\.\d%/);
      });

      it('resolves a different pair depending on which curve is nearest', async function perCurve() {
        // Feed the same renderTooltip two vertically separated pairs (high "North", low "South"),
        // each a solid actual + dashed forecast sharing a colorIndex. Hovering near the top of the
        // plot must resolve the North pair and near the bottom the South pair — proving the tooltip
        // content follows the hovered curve (hoveredSeriesId → colorIndex → pair), not a fixed pair.
        const dates = ['2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01', '2020-05-01'].map(
          (iso) => new Date(iso)
        );
        const flatLine = (value: number) => dates.map((x) => ({ x, y: value }));
        const series = [
          { id: 'north', name: 'North', colorIndex: 0, data: flatLine(90) },
          {
            id: 'north-forecast',
            name: 'North (forecast)',
            colorIndex: 0,
            variant: 'dashed' as const,
            data: flatLine(96)
          },
          { id: 'south', name: 'South', colorIndex: 1, data: flatLine(10) },
          {
            id: 'south-forecast',
            name: 'South (forecast)',
            colorIndex: 1,
            variant: 'dashed' as const,
            data: flatLine(12)
          }
        ];

        const { container, locator, baseElement } = await renderExampleAndWait(
          <CustomTooltipPairChangeExample series={series} />
        );
        assume(container.querySelector('svg')).exists();

        // Near the top of the plot → the high (North) pair.
        await locator.hover({ position: { x: 400, y: 70 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });
        const topText = lastTooltipText();
        assume(topText.includes('North')).is.true();
        assume(topText.includes('South')).is.false();
        assume(topText).matches(/Forecast vs actual: [+-]?\d+\.\d%/);

        // Near the bottom → the low (South) pair: same tooltip, different resolved content.
        await locator.hover({ position: { x: 400, y: 330 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });
        await vi.waitUntil(
          function southResolved() {
            return lastTooltipText().includes('South');
          },
          { timeout: 1000 }
        );
        const bottomText = lastTooltipText();
        assume(bottomText.includes('South')).is.true();
        assume(bottomText.includes('North')).is.false();
        assume(bottomText).matches(/Forecast vs actual: [+-]?\d+\.\d%/);
      });

      it('renders no popover when the custom tooltip returns null', async function nullContent() {
        // A single, unpaired series makes renderPairChangeTooltip hit its `return null` path
        // (no dashed forecast partner). renderTooltip returning null suppresses the tooltip
        // entirely — no empty styled popover floats at the cursor. (400,200) is the same spot
        // the paired example's test uses to *show* a tooltip, so the position is interactive.
        const dates = ['2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01', '2020-05-01'].map(
          (iso) => new Date(iso)
        );
        const values = [10, 40, 25, 60, 35];
        const series = [
          {
            id: 'solo',
            name: 'Solo',
            colorIndex: 0,
            data: dates.map((x, i) => ({ x, y: values[i] }))
          }
        ];

        const { container, locator } = await renderExampleAndWait(<CustomTooltipPairChangeExample series={series} />);
        assume(container.querySelector('svg')).exists();

        await locator.hover({ position: { x: 400, y: 200 } });
        // Let any tooltip render (it should not); other tests find the popover well within this window.
        await new Promise(function settle(resolve) {
          setTimeout(resolve, 500);
        });

        assume(document.querySelector('.visx-tooltip')).equals(null);
      });

      it('renders no popover when the custom tooltip returns a boolean', async function booleanContent() {
        // React renders every boolean as no content, so a renderer whose expression yields
        // `true` (e.g. `someFlag || <Content/>`) must suppress the popover just like `false`
        // or `null` — otherwise an empty styled container floats at the cursor. Overriding
        // renderTooltip via props (spread last in the example) forces the `true` return.
        const { container, locator } = await renderExampleAndWait(
          <CustomTooltipPairChangeExample renderTooltip={() => true} />
        );
        assume(container.querySelector('svg')).exists();

        await locator.hover({ position: { x: 400, y: 200 } });
        // Let any tooltip render (it should not); other tests find the popover well within this window.
        await new Promise(function settle(resolve) {
          setTimeout(resolve, 500);
        });

        assume(document.querySelector('.visx-tooltip')).equals(null);
      });
    });

    describe('#custom-tooltip-period-comparison', function customTooltipPeriodComparison() {
      function lastTooltipText() {
        const tooltipElements = document.querySelectorAll('.visx-tooltip');
        return tooltipElements[tooltipElements.length - 1]?.textContent ?? '';
      }

      it('shows the period-over-period comparison card for the hovered channel', async function periodComparison() {
        const { container, locator, baseElement } = await renderExampleAndWait(
          <CustomTooltipPeriodComparisonExample />
        );

        assume(container.querySelector('svg')).exists();

        await locator.hover({ position: { x: 400, y: 200 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });

        const text = lastTooltipText();

        // Comparison card: two dated currency values plus a percent change vs the previous period.
        assume(text).matches(/compared to previous period/);
        assume(text).matches(/\$\d+\.\d{2}/);
        assume(text).matches(/\d+\.\d{2}%/);
      });

      it('resolves a different channel depending on which curve is nearest', async function perChannel() {
        // Same renderTooltip, two vertically separated channels, each a solid current-period line +
        // dashed previous-period partner sharing a colorIndex. Hovering near the top resolves the
        // high channel and near the bottom the low channel — proving the card follows the hovered
        // curve (hoveredSeriesId → colorIndex → channel), not a fixed channel.
        const dates = ['2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01', '2020-05-01'].map(
          (iso) => new Date(iso)
        );
        const flatLine = (value: number) => dates.map((x) => ({ x, y: value }));
        const series = [
          {
            id: 'north',
            name: 'North',
            colorIndex: 0,
            tooltipMetadata: { period: 'current' as const },
            data: flatLine(900)
          },
          {
            id: 'north-prev',
            name: 'North (previous)',
            colorIndex: 0,
            tooltipMetadata: { period: 'previous' as const },
            variant: 'dashed' as const,
            data: flatLine(950)
          },
          {
            id: 'south',
            name: 'South',
            colorIndex: 1,
            tooltipMetadata: { period: 'current' as const },
            data: flatLine(100)
          },
          {
            id: 'south-prev',
            name: 'South (previous)',
            colorIndex: 1,
            tooltipMetadata: { period: 'previous' as const },
            variant: 'dashed' as const,
            data: flatLine(120)
          }
        ];

        const { container, locator, baseElement } = await renderExampleAndWait(
          <CustomTooltipPeriodComparisonExample series={series} />
        );
        assume(container.querySelector('svg')).exists();

        // Near the top of the plot → the high (North) channel.
        await locator.hover({ position: { x: 400, y: 70 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });
        const topText = lastTooltipText();
        assume(topText.includes('North')).is.true();
        assume(topText.includes('South')).is.false();
        assume(topText).matches(/compared to previous period/);

        // Near the bottom → the low (South) channel: same card, different resolved content.
        await locator.hover({ position: { x: 400, y: 330 } });
        await waitForSelector(baseElement, '.visx-tooltip', { timeout: 1000 });
        await vi.waitUntil(
          function southResolved() {
            return lastTooltipText().includes('South');
          },
          { timeout: 1000 }
        );
        const bottomText = lastTooltipText();
        assume(bottomText.includes('South')).is.true();
        assume(bottomText.includes('North')).is.false();
        assume(bottomText).matches(/compared to previous period/);
      });
    });

    describe('#accessors', function accessors() {
      it('renders chart with custom accessor function', async function renders() {
        const { container } = await renderExampleAndWait(<CustomAccessorsExample />);

        assume(container.querySelector('svg')).exists();
      });
    });

    describe('#rtl', function rtl() {
      function getXYAxisGroups(svg: SVGGraphicsElement): {
        xAxis: SVGGraphicsElement;
        yAxis: SVGGraphicsElement;
      } {
        const axes = Array.from(svg.querySelectorAll<SVGGraphicsElement>('g.visx-axis'));
        let xAxis: SVGGraphicsElement | null = null;
        let yAxis: SVGGraphicsElement | null = null;
        for (const axis of axes) {
          const tickLine = axis.querySelector('line');
          if (!tickLine) continue;
          const x1 = parseFloat(tickLine.getAttribute('x1') ?? '0');
          const x2 = parseFloat(tickLine.getAttribute('x2') ?? '0');
          const y1 = parseFloat(tickLine.getAttribute('y1') ?? '0');
          const y2 = parseFloat(tickLine.getAttribute('y2') ?? '0');

          if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
            yAxis = axis;
          } else {
            xAxis = axis;
          }
        }

        return {
          xAxis: xAxis as SVGGraphicsElement,
          yAxis: yAxis as SVGGraphicsElement
        };
      }

      it('renders the chart wrapper with dir="rtl" when locale is RTL', async function rtlWrapperDir() {
        const { container } = await renderExampleAndWait(<RTLExample />);
        const wrapper = container.querySelector('[data-x-labels-vertical], [data-y-labels]');

        assume(wrapper).exists();
        assume(wrapper?.getAttribute('dir')).equals('rtl');
      });

      it('positions Y-axis on the visual right when locale is RTL', async function rtlYAxisRight() {
        const { container } = await renderExampleAndWait(<RTLExample />);

        const svg = container.querySelector('svg') as SVGGraphicsElement;
        assume(svg).exists();

        await vi.waitUntil(
          function yAxisTicksRendered() {
            return svg.querySelectorAll('.visx-axis-tick').length >= 4;
          },
          { timeout: 5000 }
        );

        const { yAxis } = getXYAxisGroups(svg);
        assume(yAxis).exists();

        const svgRect = svg.getBoundingClientRect();
        const yAxisRect = yAxis.getBoundingClientRect();
        assume(yAxisRect.left).is.above(svgRect.left + svgRect.width / 2);
      });

      it('positions Y-axis on the visual left in default LTR locale', async function ltrYAxisLeft() {
        const { container } = await renderExampleAndWait(<CityTemperatureExample />);

        const svg = container.querySelector('svg') as SVGGraphicsElement;
        assume(svg).exists();

        await vi.waitUntil(
          function yAxisTicksRendered() {
            return svg.querySelectorAll('.visx-axis-tick').length >= 4;
          },
          { timeout: 5000 }
        );

        const { yAxis } = getXYAxisGroups(svg);
        assume(yAxis).exists();

        const svgRect = svg.getBoundingClientRect();
        const yAxisRect = yAxis.getBoundingClientRect();
        assume(yAxisRect.right).is.below(svgRect.left + svgRect.width / 2);
      });

      it('flips X-axis tick order in RTL so first DOM tick renders to the right of the last', async function rtlXAxisTickOrder() {
        const { container } = await renderExampleAndWait(<RTLExample />);

        const svg = container.querySelector('svg') as SVGGraphicsElement;

        // Wait for series data to register so ticks span real pixel positions (visx renders a
        // default [0,1] scale until then).
        await vi.waitUntil(
          function xScaleReady() {
            const { xAxis } = getXYAxisGroups(svg);
            if (!xAxis) {
              return false;
            }

            const tickLines = Array.from(xAxis.querySelectorAll<SVGLineElement>('.visx-axis-tick line'));
            if (tickLines.length < 2) {
              return false;
            }

            const tickPositions = tickLines.map((line) => parseFloat(line.getAttribute('x1') ?? '0'));
            return Math.max(...tickPositions) - Math.min(...tickPositions) > 50;
          },
          { timeout: 5000 }
        );

        const { xAxis } = getXYAxisGroups(svg);
        const xTickLines = Array.from(xAxis.querySelectorAll<SVGLineElement>('.visx-axis-tick line'));
        const firstTickX = parseFloat(xTickLines[0].getAttribute('x1') ?? '0');
        const lastTickX = parseFloat(xTickLines[xTickLines.length - 1].getAttribute('x1') ?? '0');

        assume(firstTickX).is.above(lastTickX);
      });
    });

    describe('#unique-id', function uniqueId() {
      it('renders chart with unique id', async function renders() {
        const noIdSeries = [
          {
            name: 'Series 1',
            data: [
              { x: 'Q1', y: '100' },
              { x: 'Q2', y: '200' }
            ]
          }
        ];
        const { container } = await renderExampleAndWait(<DefaultExample series={noIdSeries} />);
        await waitForSelector(container, 'path', { timeout: 1000 });

        assume(container.querySelector('svg')).exists();
        assume(container.querySelector('path')!.getAttribute('id')).includes('line-series-');
      });
    });
  });
});
