import { useCallback, useMemo, useRef } from 'react';
import { scaleBand, scaleLinear } from '@visx/scale';
import { useTooltip } from '@visx/tooltip';
import type { Accessors, SeriesConfig } from '../../types.ts';
import {
  getCategoryValues,
  computeChartDimensions,
  computeBarGroupSpacing,
  createTickFormatter,
  computeTooltipPosition,
  type BarTooltipData,
  type Margin
} from './utils.ts';

const BAR_WIDTH = 12;
const BAR_PADDING = 4;
const MIN_GAP_BETWEEN_GROUPS = 24;
const TOOLTIP_ARROW_HEIGHT = 8;

interface UseBarChartOptions<T extends object> {
  series: SeriesConfig<T>[];
  orientation: 'vertical' | 'horizontal';
  rtl: boolean;
  xAccessor: Accessors<T>['xAccessor'];
  yAccessor: Accessors<T>['yAccessor'];
  xDomain?: string[] | [number, number];
  yDomain?: [number, number] | string[];
  xTickFormat?: (value: number | string | Date) => string;
  yTickFormat?: (value: number | string | Date) => string;
  chartWidth: number;
  chartHeight: number;
  margin: Margin;
}

export function useBarChart<T extends object>({
  series,
  orientation,
  rtl,
  xAccessor,
  yAccessor,
  xDomain,
  yDomain,
  xTickFormat,
  yTickFormat,
  chartWidth,
  chartHeight,
  margin
}: UseBarChartOptions<T>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<BarTooltipData<T>>();

  const isVertical = orientation === 'vertical';
  const numSeries = series?.length || 0;
  const totalBarWidth = numSeries * BAR_WIDTH + (numSeries - 1) * BAR_PADDING;

  const categoryValues = useMemo(
    function getCategories() {
      return getCategoryValues(series, isVertical, xAccessor, yAccessor as any);
    },
    [series, xAccessor, yAccessor, isVertical]
  );

  const categoryDomain = isVertical ? (xDomain ?? categoryValues) : categoryValues;
  const numGroups = categoryDomain.length;

  const dimensions = useMemo(
    function getDimensions() {
      return computeChartDimensions({
        chartWidth,
        chartHeight,
        margin,
        numGroups,
        totalBarWidth,
        minGapBetweenGroups: MIN_GAP_BETWEEN_GROUPS,
        isVertical
      });
    },
    [chartWidth, chartHeight, margin, numGroups, totalBarWidth, isVertical]
  );

  const { innerWidth, innerHeight } = dimensions;

  const { paddingInner, paddingOuter } = useMemo(
    function getSpacing() {
      return computeBarGroupSpacing({
        innerWidth,
        innerHeight,
        numGroups,
        totalBarWidth,
        minGapBetweenGroups: MIN_GAP_BETWEEN_GROUPS,
        isVertical
      });
    },
    [innerWidth, innerHeight, numGroups, totalBarWidth, isVertical]
  );

  const categoryScale = useMemo(
    function getCategoryScale() {
      return scaleBand({
        domain: categoryDomain,
        range: isVertical ? [0, innerWidth] : [0, innerHeight],
        paddingInner: isVertical ? paddingInner : 0,
        paddingOuter: isVertical ? paddingOuter : 0
      });
    },
    [categoryDomain, innerWidth, innerHeight, paddingInner, paddingOuter, isVertical]
  );

  const valueScale = useMemo(
    function getValueScale() {
      let domain: [number, number];
      if (isVertical && yDomain && typeof yDomain[0] === 'number') {
        domain = yDomain as [number, number];
      } else if (!isVertical && xDomain) {
        domain = xDomain as [number, number];
      } else {
        const allValues =
          series?.flatMap((s: any) => s.data.map((d: any) => (isVertical ? yAccessor(d) : xAccessor(d)))) || [];
        domain = [0, Math.max(...allValues, 0)];
      }
      let range: [number, number];
      if (isVertical) {
        range = [innerHeight, 0];
      } else if (rtl) {
        range = [innerWidth, 0];
      } else {
        range = [0, innerWidth];
      }
      return scaleLinear({ domain, range, nice: true });
    },
    [series, xAccessor, yAccessor, innerHeight, innerWidth, xDomain, yDomain, isVertical, rtl]
  );

  const xScale = isVertical ? categoryScale : valueScale;
  const yScale = isVertical ? valueScale : categoryScale;

  const formatXTick = useMemo(
    function getXFormatter() {
      return createTickFormatter(xTickFormat);
    },
    [xTickFormat]
  );

  const formatYTick = useMemo(
    function getYFormatter() {
      return createTickFormatter(yTickFormat);
    },
    [yTickFormat]
  );

  const handleBarHover = useCallback(
    function hover(groupIndex: number) {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      const {
        tooltipLeft: left,
        tooltipTop: top,
        tooltipData: data
      } = computeTooltipPosition({
        isVertical,
        rtl,
        groupIndex,
        series: series as SeriesConfig<any>[],
        categoryValues,
        xScale: xScale as any,
        yScale: yScale as any,
        categoryScale,
        valueScale,
        innerHeight,
        innerWidth: dimensions.innerWidth,
        totalBarWidth,
        margin,
        svgWidth: dimensions.svgWidth,
        svgRect,
        tooltipArrowHeight: TOOLTIP_ARROW_HEIGHT,
        xAccessor: xAccessor as any,
        yAccessor: yAccessor as any
      });
      showTooltip({ tooltipLeft: left, tooltipTop: top, tooltipData: data });
    },
    [
      series,
      xScale,
      yScale,
      categoryScale,
      categoryValues,
      innerHeight,
      showTooltip,
      xAccessor,
      yAccessor,
      isVertical,
      totalBarWidth,
      valueScale,
      margin,
      rtl,
      dimensions
    ]
  );

  const handleBarLeave = useCallback(
    function leave() {
      hideTooltip();
    },
    [hideTooltip]
  );

  return {
    svgRef,
    isVertical,
    barWidth: BAR_WIDTH,
    barPadding: BAR_PADDING,
    margin,
    categoryValues,
    categoryDomain,
    numSeries,
    totalBarWidth,
    dimensions,
    categoryScale,
    valueScale,
    xScale,
    yScale,
    formatXTick,
    formatYTick,
    handleBarHover,
    handleBarLeave,
    tooltip: { tooltipData, tooltipLeft, tooltipTop, tooltipOpen }
  };
}
