import type {
  Accessors,
  AccessorRequirement,
  DataPoint,
  LegendPosition,
  XLabelsOrientation,
  BarSeriesConfig,
  Optional,
  InternalSeriesConfig
} from '../../types.ts';
import {
  getXLabelVerticalProps,
  resolveLegendPosition,
  xAccessor as defaultXAccessor,
  yAccessor as defaultYAccessor,
  isValidColorIndex
} from '../../utils.ts';
import { type ReactNode, useCallback, useMemo } from 'react';
import { useNormalizedSeries } from '#components/chart/_internal/use-normalized-series';
import { useScrollableXYChart } from '#components/chart/_internal/use-scrollable-xy-chart';
import { chartColorForIndex, ChartColorProvider, useChartColor } from '#components/chart/_internal/use-chart-color';
import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis';
import { AxisTitle } from '#components/chart/_internal/axis-title';
import { GridColumns, GridRows } from '@visx/grid';
import { Legend } from '#components/chart/_internal/legend';
import { Tooltip, TooltipContainer } from '#components/chart/_internal/tooltip';
import { Flex } from '#components/layout/flex';
import { Box } from '#components/layout/box';
import { createPortal } from 'react-dom';
import styles from './index.module.css';
import { Group } from '@visx/group';
import type { TooltipData } from '@visx/xychart';
import { Bar } from '@visx/shape';
import { cx } from 'cva';
import { useLocale } from 'react-aria-components';
import { useBarChart } from './use-bar-chart.ts';

/**
 * Helper type to determine if accessors are required based on data type.
 * @template T - The data point type
 */
export type BarChartProps<
  T extends object = DataPoint,
  S extends Optional<BarSeriesConfig<T>, 'id'> = Optional<BarSeriesConfig<T>, 'id'>
> = BarChartPropsBase<T, S> & AccessorRequirement<T>;

/**
 * Data passed to a custom {@link BarChartPropsBase.renderTooltip} function.
 *
 * @public
 */
export interface BarChartTooltipRenderProps<
  T extends object = DataPoint,
  S extends Optional<BarSeriesConfig<T>, 'id'> = Optional<BarSeriesConfig<T>, 'id'>
> {
  /** Category value of the hovered bar group (x when vertical, y when horizontal). */
  hoveredCategory?: number | string | Date | null;
  /** Datum for each series at the hovered bar group, keyed by series id. */
  datumByKey: Partial<Record<string, T>>;
  /** Resolved series in render order. */
  series: (InternalSeriesConfig<T, S['tooltipMetadata']> & { id: string })[];
}

/**
 * Base props for the BarChart component (without accessors).
 *
 * Exported so the public `BarChartProps` alias can reference it by name in
 * emitted declaration files (TS4023). Not intended for direct consumer use —
 * import `BarChartProps` instead.
 *
 * @template T - The data point type. Defaults to DataPoint.
 * @public
 */
export interface BarChartPropsBase<
  T extends object = DataPoint,
  S extends Optional<BarSeriesConfig<T>, 'id'> = Optional<BarSeriesConfig<T>, 'id'>
> {
  /**
   * Configuration for data series.
   * For a single series, provide an array with one element. For multiple series, provide multiple elements.
   */
  series: S[];

  /**
   * Orientation of the bars.
   * - 'vertical': Bars extend upward from the X-axis
   * - 'horizontal': Bars extend rightward from the Y-axis
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';

  /** Title displayed on the X-axis */
  xAxisTitle?: string;
  /** Whether to show X-axis labels. @default true */
  xLabels?: boolean;
  /**
   * X-axis label orientation. 'auto' rotates labels to vertical when the container is too narrow;
   * 'horizontal' keeps labels horizontal (chart may scroll); 'vertical' keeps labels vertical.
   *
   * @default 'auto'
   */
  xLabelsOrientation?: XLabelsOrientation;
  /** Whether to show X-axis tick marks. */
  xTickMarks?: boolean;
  /** Whether to show the X-axis baseline (axis line). */
  xBaseline?: boolean;
  /** Whether to show vertical gridlines for the X-axis. */
  xGridlines?: boolean;
  /**
   * Custom formatting function for X-axis tick labels.
   * Receives the tick value and returns a formatted string.
   * The value type depends on orientation:
   * - Vertical: categories (string | Date) from xAccessor
   * - Horizontal: numeric values (number) from xAccessor
   * @param value - The tick value (number | string | Date)
   * @returns Formatted string to display as the tick label
   */
  xTickFormat?: (value: number | string | Date) => string;
  /**
   * Domain values for the X-axis.
   * Type: string[] | [number, number]
   * - Vertical orientation: Use string[] or Date[] to explicitly set categories
   * - Horizontal orientation: Use [number, number] to set value range [min, max]
   * If not provided, domain is derived from the data.
   */
  xDomain?: string[] | [number, number];
  /**
   * Approximate number of ticks to display on the X-axis.
   * Note: This is approximate - the actual number may vary based on scale calculations.
   */
  xNumTicks?: number;

  /** Title displayed on the Y-axis */
  yAxisTitle?: string;
  /** Whether to show Y-axis labels. @default true */
  yLabels?: boolean;
  /** Whether to show Y-axis tick marks. */
  yTickMarks?: boolean;
  /** Whether to show the Y-axis baseline (axis line). */
  yBaseline?: boolean;
  /** Whether to show horizontal gridlines for the Y-axis. @default true */
  yGridlines?: boolean;
  /**
   * Custom formatting function for Y-axis tick labels.
   * Receives the tick value and returns a formatted string.
   * The value type depends on orientation:
   * - Vertical: numeric values (number) from yAccessor
   * - Horizontal: categories (string | Date) from yAccessor
   * @param value - The tick value (number | string | Date)
   * @returns Formatted string to display as the tick label
   */
  yTickFormat?: (value: number | string | Date) => string;
  /**
   * Domain values for the Y-axis.
   * Type: [number, number] | string[]
   * - Vertical orientation: Use [number, number] to set value range [min, max]
   * - Horizontal orientation: Use string[] or Date[] to explicitly set categories
   * If not provided, domain is derived from the data.
   */
  yDomain?: [number, number] | string[];
  /**
   * Approximate number of ticks to display on the Y-axis.
   * Note: This is approximate - the actual number may vary based on scale calculations.
   */
  yNumTicks?: number;

  /**
   * Legend position. Omit for default: shown at bottom when there is more than one series, hidden for a single series.
   * Set to `null` to hide the legend.
   *
   * @default 'bottom' when more than one series; hidden otherwise
   */
  legendPosition?: LegendPosition | null;

  /** Whether to show the tooltip popover on hover. When false, the tooltip is hidden. @default true */
  tooltip?: boolean;

  /**
   * Format tooltip values.
   *
   * @default the value on the category's opposite axis as a string
   */
  tooltipValueFormatter?: (datum: T) => string;

  /**
   * Render a custom tooltip. Receives every series' datum at the hovered bar group, the
   * hovered category value, and the resolved series list (with per-series and per-category
   * colors) — see {@link BarChartTooltipRenderProps}. Return null, undefined, or
   * a boolean to render no popover.
   */
  renderTooltip?: (props: BarChartTooltipRenderProps<T, S>) => ReactNode;

  /** Outer container width (omitted = 100%) */
  width?: number;
  /** Outer container height (omitted = 100%) */
  height?: number;

  /**
   * Accessibility label for the chart.
   * Should describe what the chart represents.
   */
  'aria-label'?: string;

  /**
   * Detailed description of the chart for screen readers.
   * Provides additional context beyond the aria-label.
   * This is rendered as a <desc> element inside the SVG for screen reader support.
   */
  desc?: string;

  /** Additional CSS class name */
  className?: string;

  /** Accessor function to extract X values from data points */
  xAccessor?: Accessors<T>['xAccessor'];
  /** Accessor function to extract Y values from data points */
  yAccessor?: Accessors<T>['yAccessor'];
}

/** Props for BarSeries. Internal — not exported. */
interface BarSeriesProps<
  T extends object,
  S extends Optional<BarSeriesConfig<T>, 'id'> = Optional<BarSeriesConfig<T>, 'id'>
> {
  /** The series config to render bars for. */
  seriesValue: S;
  /** Zero-based index of this series among all series. */
  seriesIndex: number;
  /** Total number of series in the chart. */
  numSeries: number;
  /** Ordered list of unique category values (from xAccessor in vertical, yAccessor in horizontal). */
  categoryValues: any[];
  /** Whether the chart is in vertical orientation. */
  isVertical: boolean;
  /** Whether the chart is in right-to-left mode. */
  rtl: boolean;
  /** Scale function mapping category or numeric values to x pixel positions. */
  xScale: (v: any) => number | undefined;
  /** Scale function mapping category or numeric values to y pixel positions. */
  yScale: (v: any) => number | undefined;
  /** Pixel height of the chart inner area (excluding margins). */
  innerHeight: number;
  /** Pixel width of the chart inner area (excluding margins). */
  innerWidth: number;
  /** Pixel width of a single bar. */
  barWidth: number;
  /** Pixel gap between bars within a grouped category. */
  barPadding: number;
  /** Total pixel width occupied by all bars in one category group. */
  totalBarWidth: number;
  /** Band scale for categories, used to compute offsets within a group. */
  categoryScale: { bandwidth: () => number; step: () => number };
  /** Accessor to extract the x value from a datum. */
  xAccessor: (d: T) => any;
  /** Accessor to extract the y value from a datum. */
  yAccessor: (d: T) => any;
}

/**
 * Renders all bars for a single series across every category.
 * Defined as a component (rather than a render function) so that
 * `useChartColor` can be called once per series, assigning a stable
 * color index for the lifetime of the series in the chart.
 */
function BarSeries<T extends object>(props: BarSeriesProps<T>) {
  const {
    seriesValue,
    seriesIndex,
    numSeries,
    categoryValues,
    isVertical,
    rtl,
    xScale,
    yScale,
    innerHeight,
    innerWidth,
    barWidth,
    barPadding,
    totalBarWidth,
    categoryScale,
    xAccessor,
    yAccessor
  } = props;
  const fill = useChartColor();
  const seriesColor = isValidColorIndex(seriesValue.colorIndex) ? chartColorForIndex(seriesValue.colorIndex) : fill;
  const effectiveSeriesIndex = rtl ? numSeries - 1 - seriesIndex : seriesIndex;
  const groupOffset = (categoryScale.bandwidth() - totalBarWidth) / 2;
  const orderedCategories = rtl ? [...categoryValues].reverse() : categoryValues;

  return (
    <>
      {orderedCategories.map(function renderBar(catValue, groupIndex) {
        const dataIndex = rtl ? categoryValues.length - 1 - groupIndex : groupIndex;
        const datum = seriesValue.data[dataIndex];
        // categoryColors is keyed by string; coerce so Date/number categories look up consistently.
        const categoryColorIndex = seriesValue.categoryColors?.[String(catValue)];
        const barColor = isValidColorIndex(categoryColorIndex) ? chartColorForIndex(categoryColorIndex) : seriesColor;

        if (isVertical) {
          const yValue = yAccessor(datum);
          if (yValue === null) return null;
          const xPos = xScale(catValue) || 0;
          const groupLeft = rtl ? innerWidth - xPos - categoryScale.bandwidth() : xPos;
          const barX = groupLeft + groupOffset + effectiveSeriesIndex * (barWidth + barPadding);
          const barY = yScale(yValue as number) as number;
          const barHeight = innerHeight - barY;
          return (
            <Bar
              key={`bar-${seriesValue.id}-${catValue}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={barColor}
              opacity={seriesValue.opacity ?? 1}
              rx={8}
            />
          );
        }

        const xValue = xAccessor(datum);
        if (xValue === null) return null;
        const yPos = yScale(catValue) || 0;
        const barScalePos = xScale(xValue as number) as number;
        const barX = rtl ? barScalePos : 0;
        const barLength = rtl ? innerWidth - barScalePos : barScalePos;
        const barY = yPos + groupOffset + effectiveSeriesIndex * (barWidth + barPadding);
        return (
          <Bar
            key={`bar-${seriesValue.id}-${catValue}`}
            x={barX}
            y={barY}
            width={barLength}
            height={barWidth}
            fill={barColor}
            opacity={seriesValue.opacity ?? 1}
            rx={8}
          />
        );
      })}
    </>
  );
}

/**
 * Bar chart for categorical data with optional responsive horizontal/vertical scroll.
 *
 * Renders a bar chart using visx with single or grouped series, optional legend (top/bottom),
 * configurable X/Y axes (titles, labels, tick marks, baselines, gridlines, domains, formatting),
 * and optional tooltip on hover. Size is driven by the container; when the computed minimum
 * width/height exceeds the container the chart area scrolls and the value axis stays visually
 * fixed via scroll sync.
 *
 * @template T - The data point type. Defaults to DataPoint.
 * @param props - {@link BarChartProps}
 * @returns JSX element rendering the bar chart
 */
export function BarChart<
  T extends object = DataPoint,
  S extends Optional<BarSeriesConfig<T>, 'id'> = Optional<BarSeriesConfig<T>, 'id'>
>(props: BarChartProps<T, S>) {
  const {
    orientation = 'vertical',
    height,
    width,
    xTickMarks,
    yTickMarks,
    xLabelsOrientation = 'auto',
    xAccessor = defaultXAccessor,
    yAccessor = defaultYAccessor,
    series: seriesProp,
    xGridlines,
    yGridlines = true,
    xBaseline,
    yBaseline,
    xLabels = true,
    yLabels = true,
    yAxisTitle = '',
    xAxisTitle = '',
    desc,
    legendPosition,
    xTickFormat,
    yTickFormat,
    tooltip = true,
    tooltipValueFormatter,
    renderTooltip: renderTooltipContent,
    xNumTicks,
    yNumTicks,
    xDomain,
    yDomain,
    'aria-label': ariaLabel,
    className
  } = props;

  const { direction } = useLocale();
  const rtl = direction === 'rtl';

  const tickLength = 8;

  const { parentRef, chartWidth, chartHeight, margin, scrollLeft, scrollTop, xAxisRef, yAxisRef, xLabelsVertical } =
    useScrollableXYChart({ xLabelsOrientation });

  const series = useNormalizedSeries(seriesProp);

  const {
    svgRef,
    isVertical,
    barWidth,
    barPadding,
    categoryValues,
    numSeries,
    totalBarWidth,
    dimensions,
    categoryScale,
    xScale,
    yScale,
    formatXTick,
    formatYTick,
    handleBarHover,
    handleBarLeave,
    tooltip: { tooltipData, tooltipLeft, tooltipTop, tooltipOpen }
  } = useBarChart({
    series,
    orientation,
    rtl,
    xAccessor: xAccessor as any,
    yAccessor: yAccessor as any,
    xDomain,
    yDomain,
    xTickFormat,
    yTickFormat,
    chartWidth,
    chartHeight,
    margin
  });

  const { innerWidth, innerHeight, svgWidth, svgHeight } = dimensions;

  // Cast away the DataPoint-typed accessor defaults
  // so they accept the generic datum type.
  const categoryAccessor = (isVertical ? xAccessor : yAccessor) as (datum: T) => number | string | Date | null;
  const valueAccessor = (isVertical ? yAccessor : xAccessor) as (datum: T) => number | string | Date | null;

  const seriesWithColor = useMemo(
    function getSeriesWithColor() {
      return series.map(function attachColor(oneSeries) {
        const { colorIndex, categoryColors } = oneSeries;
        const seriesColor = isValidColorIndex(colorIndex) ? chartColorForIndex(colorIndex) : undefined;
        const resolveDatumColor = categoryColors
          ? function datumColor(datum: T) {
              const category = categoryAccessor(datum);
              const categoryIndex = categoryColors[category as string];
              return isValidColorIndex(categoryIndex) ? chartColorForIndex(categoryIndex) : seriesColor;
            }
          : undefined;
        return {
          ...oneSeries,
          _resolvedColor: seriesColor,
          _resolveDatumColor: resolveDatumColor
        };
      });
    },
    [series, categoryAccessor]
  );

  const renderTooltip = useCallback(
    function renderTooltip(data: NonNullable<typeof tooltipData>): ReactNode {
      if (renderTooltipContent) {
        const datumByKey: Partial<Record<string, T>> = Object.fromEntries(
          Object.entries(data.datumByKey).map(function toDatum([key, entry]) {
            return [key, entry.datum];
          })
        );
        const firstDatum = Object.values(datumByKey)[0];
        const tooltipSeries = seriesWithColor.map(function withTooltipColor(oneSeries, index) {
          const defaultColor = chartColorForIndex(index);
          const resolveDatumColor = oneSeries._resolveDatumColor
            ? function resolveDatumColorWithDefault(datum: T) {
                return oneSeries._resolveDatumColor?.(datum) ?? defaultColor;
              }
            : undefined;
          return {
            ...oneSeries,
            _resolvedColor: oneSeries._resolvedColor ?? defaultColor,
            _resolveDatumColor: resolveDatumColor
          };
        });
        const content = renderTooltipContent({
          hoveredCategory: firstDatum != null ? categoryAccessor(firstDatum) : undefined,
          datumByKey,
          series: tooltipSeries as (InternalSeriesConfig<T, S['tooltipMetadata']> & {
            id: string;
          })[]
        });
        if (content === null || content === undefined || typeof content === 'boolean') {
          return null;
        }
        return <TooltipContainer>{content}</TooltipContainer>;
      }

      return (
        <Tooltip
          // Narrow to DataPoint overload; Tooltip overloads can't resolve generic T. The bar
          // tooltip payload is a structural subset of visx's TooltipData, hence the double cast.
          tooltipData={data as unknown as TooltipData<DataPoint>}
          showArrow={true}
          formatValue={
            (tooltipValueFormatter ??
              function format(value: T) {
                return String(valueAccessor(value) ?? '');
              }) as (datum: DataPoint) => string
          }
          series={seriesWithColor as InternalSeriesConfig[]}
        />
      );
    },
    [renderTooltipContent, seriesWithColor, categoryAccessor, valueAccessor, tooltipValueFormatter]
  );

  const effectiveLegendPosition = resolveLegendPosition(legendPosition, series.length);

  const tooltipNode =
    tooltip && tooltipOpen && tooltipData && typeof tooltipTop === 'number' && typeof tooltipLeft === 'number'
      ? renderTooltip(tooltipData)
      : null;

  function renderBarHitbox(catValue: any, groupIndex: number) {
    const dataIndex = rtl ? categoryValues.length - 1 - groupIndex : groupIndex;

    const xPos = isVertical ? xScale(catValue) || 0 : undefined;
    const hitboxWidth = isVertical ? categoryScale.step() : Math.max(innerWidth, 20);
    const paddingWidth = isVertical ? hitboxWidth - categoryScale.bandwidth() : 0;
    let hitboxLeft = 0;
    if (isVertical && rtl) {
      hitboxLeft = innerWidth - (xPos as number) - categoryScale.bandwidth() - paddingWidth / 2;
    } else if (isVertical) {
      hitboxLeft = (xPos as number) - paddingWidth / 2;
    }
    const hitboxHeight = isVertical ? Math.max(innerHeight, 20) : categoryScale.step();

    const yPos = !isVertical ? yScale(catValue) || 0 : undefined;
    const paddingHeight = !isVertical ? categoryScale.step() - categoryScale.bandwidth() : 0;
    const hitboxTop = !isVertical ? (yPos as number) - paddingHeight / 2 : undefined;

    return (
      <Group
        className={cx(styles.barGroup)}
        key={`group-${catValue}`}
        left={isVertical ? hitboxLeft : undefined}
        top={!isVertical ? hitboxTop : undefined}
        tabIndex={0}
        role="group"
      >
        <rect
          x={0}
          y={0}
          width={Math.max(hitboxWidth, 36)}
          height={hitboxHeight}
          fill="transparent"
          onPointerEnter={() => handleBarHover(dataIndex)}
          onPointerLeave={handleBarLeave}
        />
      </Group>
    );
  }

  return (
    <ChartColorProvider>
      <Flex
        direction="row"
        dir={direction}
        className={cx(styles.chart, className)}
        data-legend-position={effectiveLegendPosition ? effectiveLegendPosition : undefined}
        data-x-labels={xLabels ? 'true' : undefined}
        data-y-labels={yLabels ? 'true' : undefined}
        data-x-labels-vertical={xLabelsVertical ? 'true' : undefined}
        data-x-baseline={xBaseline ? 'true' : undefined}
        data-y-baseline={yBaseline ? 'true' : undefined}
        data-x-tick-marks={xTickMarks ? 'true' : undefined}
        data-y-tick-marks={yTickMarks ? 'true' : undefined}
        data-x-gridlines={xGridlines ? 'true' : undefined}
        data-y-gridlines={yGridlines ? 'true' : undefined}
        style={{
          ['--chart-width' as string]: width !== undefined ? `${width}px` : undefined,
          ['--chart-height' as string]: height !== undefined ? `${height}px` : undefined
        }}
      >
        {yAxisTitle && <AxisTitle axis="y" title={yAxisTitle} />}
        <Flex direction="column" flex={1} className={styles.wrapper}>
          {effectiveLegendPosition === 'top' && (
            <Legend series={seriesWithColor} className={styles.legend} alignSelf="center" />
          )}
          <Box ref={parentRef} dir={direction} className={styles.area}>
            {series && chartWidth > 0 && chartHeight > 0 && (
              <svg
                ref={svgRef}
                width={svgWidth}
                height={svgHeight}
                aria-label={ariaLabel}
                role="img"
                {...(desc ? { 'aria-describedby': 'barchart-desc' } : {})}
              >
                {desc && <desc id="barchart-desc">{desc}</desc>}

                <Group top={margin.top} left={margin.left}>
                  {yGridlines && <GridRows scale={yScale} width={innerWidth} className={styles.rows} />}
                  {xGridlines && <GridColumns scale={xScale} height={innerHeight} className={styles.columns} />}

                  {isVertical && (xBaseline || xTickMarks || xLabels) && (
                    <AxisBottom
                      axisClassName={styles.axisX}
                      axisLineClassName={styles.baseline}
                      tickClassName={styles.tickMark}
                      innerRef={xAxisRef}
                      top={innerHeight}
                      scale={xScale}
                      numTicks={xNumTicks}
                      tickLength={tickLength}
                      hideAxisLine={!xBaseline}
                      tickFormat={formatXTick}
                      tickLabelProps={xLabelsVertical ? getXLabelVerticalProps(rtl) : undefined}
                    />
                  )}

                  {!isVertical && (yBaseline || yTickMarks || yLabels) && !rtl && (
                    <AxisLeft
                      axisClassName={styles.axisY}
                      axisLineClassName={styles.baseline}
                      tickClassName={styles.tickMark}
                      innerRef={yAxisRef}
                      scale={yScale}
                      tickLength={tickLength}
                      numTicks={yNumTicks}
                      hideAxisLine={!yBaseline}
                      tickFormat={formatYTick}
                    />
                  )}

                  {!isVertical && (yBaseline || yTickMarks || yLabels) && rtl && (
                    <AxisRight
                      axisClassName={styles.axisY}
                      axisLineClassName={styles.baseline}
                      tickClassName={styles.tickMark}
                      innerRef={yAxisRef}
                      left={innerWidth}
                      scale={yScale}
                      tickLength={tickLength}
                      numTicks={yNumTicks}
                      hideAxisLine={!yBaseline}
                      tickFormat={formatYTick}
                    />
                  )}

                  {series.map((seriesValue, seriesIndex) => (
                    <BarSeries
                      key={seriesValue.id}
                      seriesValue={seriesValue}
                      seriesIndex={seriesIndex}
                      numSeries={numSeries}
                      categoryValues={categoryValues}
                      isVertical={isVertical}
                      rtl={rtl}
                      xScale={xScale}
                      yScale={yScale}
                      innerHeight={innerHeight}
                      innerWidth={innerWidth}
                      barWidth={barWidth}
                      barPadding={barPadding}
                      totalBarWidth={totalBarWidth}
                      categoryScale={categoryScale}
                      xAccessor={xAccessor as any}
                      yAccessor={yAccessor as any}
                    />
                  ))}
                  {(rtl ? [...categoryValues].reverse() : categoryValues).map(renderBarHitbox)}
                </Group>

                {isVertical && (yBaseline || yTickMarks || yLabels) && !rtl && (
                  <>
                    <rect
                      x={scrollLeft}
                      y={0}
                      width={margin.left}
                      height={svgHeight}
                      className={styles.axisBackground}
                    />
                    <g transform={`translate(${margin.left + scrollLeft}, ${margin.top})`}>
                      <AxisLeft
                        axisClassName={styles.axisY}
                        axisLineClassName={styles.baseline}
                        tickClassName={styles.tickMark}
                        innerRef={yAxisRef}
                        scale={yScale}
                        tickLength={tickLength}
                        numTicks={yNumTicks}
                        hideAxisLine={!yBaseline}
                        tickFormat={formatYTick}
                      />
                    </g>
                  </>
                )}

                {isVertical && (yBaseline || yTickMarks || yLabels) && rtl && (
                  <>
                    <rect
                      x={svgWidth - margin.right + scrollLeft}
                      y={0}
                      width={margin.right}
                      height={svgHeight}
                      className={styles.axisBackground}
                    />
                    <g transform={`translate(${svgWidth - margin.right + scrollLeft}, ${margin.top})`}>
                      <AxisRight
                        axisClassName={styles.axisY}
                        axisLineClassName={styles.baseline}
                        tickClassName={styles.tickMark}
                        innerRef={yAxisRef}
                        scale={yScale}
                        tickLength={tickLength}
                        numTicks={yNumTicks}
                        tickFormat={formatYTick}
                        tickLabelProps={function getProps() {
                          return {
                            textAnchor: 'end' as const,
                            dy: '.32em'
                          };
                        }}
                      />
                    </g>
                  </>
                )}

                {!isVertical && (xBaseline || xTickMarks || xLabels) && (
                  <>
                    <rect
                      x={0}
                      y={scrollTop + chartHeight - margin.bottom}
                      width={svgWidth}
                      height={margin.bottom}
                      className={styles.axisBackground}
                    />
                    <g transform={`translate(${margin.left}, ${scrollTop + chartHeight - margin.bottom})`}>
                      <AxisBottom
                        axisClassName={styles.axisX}
                        axisLineClassName={styles.baseline}
                        tickClassName={styles.tickMark}
                        innerRef={xAxisRef}
                        scale={xScale}
                        numTicks={xNumTicks}
                        tickLength={tickLength}
                        tickFormat={formatXTick}
                        tickLabelProps={xLabelsVertical ? getXLabelVerticalProps(rtl) : undefined}
                      />
                    </g>
                  </>
                )}
              </svg>
            )}
          </Box>
          {xAxisTitle && <AxisTitle axis="x" title={xAxisTitle} />}
          {effectiveLegendPosition === 'bottom' && (
            <Legend series={seriesWithColor} className={styles.legend} alignSelf="center" />
          )}
        </Flex>

        {tooltipNode != null &&
          createPortal(
            <div className={styles.tooltipContainer} style={{ top: tooltipTop, left: tooltipLeft }}>
              {tooltipNode}
            </div>,
            document.body
          )}
      </Flex>
    </ChartColorProvider>
  );
}
