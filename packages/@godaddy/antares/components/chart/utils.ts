import type { DataPoint, LegendPosition } from './types.ts';

/** Target arc seam gap in CSS pixels (gauge segmented arc, donut pad angle). */
const CHART_ARC_GAP_PX = 3;

/**
 * Resolves effective legend position from prop and series count.
 * When the prop is omitted, shows legend at bottom when there is more than one series; otherwise hidden.
 * When the prop is null, always hides the legend.
 *
 * @param legendPosition - Explicit position ('top' | 'bottom'), null to hide, or undefined for default
 * @param seriesCount - Number of data series (e.g. lines or bars)
 * @returns Resolved position to show legend, or undefined to hide
 */
export function resolveLegendPosition(
  legendPosition: LegendPosition | null | undefined,
  seriesCount: number
): LegendPosition | undefined {
  if (legendPosition === null) {
    return undefined;
  }

  return legendPosition ?? (seriesCount > 1 ? 'bottom' : undefined);
}

/**
 * Returns the Y value from a chart data point.
 *
 * Used as the default accessor for vertical (range) values when mapping
 * data to chart coordinates. Returns null for missing or undefined data points.
 *
 * @param d - Chart data point with x and y properties
 * @returns The y value (number, string, Date, or null for missing data)
 */
export function yAccessor(d: DataPoint): number | string | Date | null {
  return d.y;
}

/**
 * Returns the X value from a chart data point.
 *
 * Used as the default accessor for horizontal (domain) values when mapping
 * data to chart coordinates. Accepts numeric, string, or Date X values.
 *
 * @param d - Chart data point with x and y properties
 * @returns The x value (number, string, or Date)
 */
export function xAccessor(d: DataPoint): number | string | Date {
  return d.x;
}

/**
 * Angular gap in degrees between segmented gauge slices at the given outer radius.
 * Matches `atan2(CHART_ARC_GAP_PX, radius)` in CSS variable form for the gauge chart.
 */
export function chartArcGapAngleDeg(outerRadiusPx: number): number {
  const r = Math.max(outerRadiusPx, 1);
  return (Math.atan2(CHART_ARC_GAP_PX, r) * 180) / Math.PI;
}

/**
 * Angular padding between donut pie slices (radians), from a fixed seam gap in CSS pixels at the outer radius.
 */
export function chartSegmentGapPadAngle(outerRadiusPx: number): number {
  const r = Math.max(outerRadiusPx, 1);
  return CHART_ARC_GAP_PX / r;
}

/**
 * Returns `tickLabelProps` for vertical X-axis labels, rotated 90° counterclockwise in LTR and
 * clockwise in RTL so the rotation mirrors the layout direction.
 *
 * @param rtl - Whether the chart is in right-to-left mode
 */
export function getXLabelVerticalProps(rtl: boolean) {
  return {
    angle: rtl ? 90 : -90,
    textAnchor: 'end',
    dominantBaseline: 'central'
  } as const;
}

/**
 * Checks if the given index is a valid color index (non-negative integer).
 */
export function isValidColorIndex(index: any): index is number {
  return typeof index === 'number' && Number.isInteger(index) && index >= 0;
}
