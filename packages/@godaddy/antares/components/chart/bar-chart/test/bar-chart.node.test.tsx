/**
 * BarChart node (SSR) tests. Chart dimensions come from the parent via visx useParentSize
 * (ResizeObserver). On SSR there is no DOM, so width/height stay 0 and the SVG is not rendered —
 * no SVG in the output. The chart renders SVG only after mount when the parent has size.
 */
import type React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { CategoryColorsExample } from '../examples/category-colors';
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

const SSR_EXAMPLES: Array<[string, React.ComponentType]> = [
  ['default', DefaultExample],
  ['category-colors', CategoryColorsExample],
  ['custom-domain', CustomDomainExample],
  ['custom-tooltip-period-comparison', CustomTooltipPeriodComparisonExample],
  ['formatted-tick-marks', FormattedTickMarksExample],
  ['horizontal-multi-series', HorizontalMultiSeriesExample],
  ['horizontal-single-series', HorizontalSingleSeriesExample],
  ['multi-series', MultiSeriesExample],
  ['rtl-horizontal-multi-series', RTLHorizontalMultiSeriesExample],
  ['rtl-multi-series', RTLMultiSeriesExample],
  ['series-colors', SeriesColorsExample]
];

describe('@godaddy/antares', function antares() {
  describe('#BarChart', function barChartTests() {
    it('does not render SVG on SSR (dimensions from parent ResizeObserver)', function noSvgOnSsr() {
      const result = renderToString(<DefaultExample />);
      expect(result).not.toContain('<svg');
    });

    it.each(SSR_EXAMPLES)('renders %s example', function ssrSnapshot(_name, Example) {
      const result = renderToString(<Example />);
      expect(result).toMatchSnapshot();
    });
  });
});
