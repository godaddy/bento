import { Box } from '#components/layout/box';
import { Flex } from '#components/layout/flex';
import { Text } from '#components/text';
import type { TooltipData } from '@visx/xychart';
import type { ReactElement, ReactNode } from 'react';
import { useMemo } from 'react';
import type { DataPoint, InternalSeriesConfig } from '../../../types.ts';
import { yAccessor as defaultYAccessor } from '../../../utils.ts';
import { cx } from 'cva';
import styles from './index.module.css';
import { SWATCH_DASH_ARRAY } from '#components/chart/_internal/legend';

/**
 * Styled popover container shared by the built-in tooltip and any custom tooltip
 * content, so both render with identical chrome (elevation, rounding, padding).
 *
 * @param props.children - Tooltip content to render inside the popover.
 * @param props.className - Additional class name merged onto the container.
 */
export function TooltipContainer(props: { children: ReactNode; className?: string }): ReactElement {
  const { children, className } = props;
  return (
    <Box padding="md" rounding="2xl" elevation="raised" className={cx(styles.tooltip, className)}>
      {children}
    </Box>
  );
}

/** Default formatter: Y as string, or '' if null. */
function defaultFormatValue<T extends object = DataPoint>(d: T): string {
  const value = (defaultYAccessor as (datum: T) => number | string | Date | null)(d);
  return value !== null ? String(value) : '';
}

/**
 * Common props for all Tooltip variants.
 *
 * @typeParam T - Data point type for the chart series.
 */
interface TooltipBaseProps<T extends object> {
  /** Hovered data from visx. */
  tooltipData?: TooltipData<T>;
  /** Series config for names and colors. */
  series: InternalSeriesConfig<T>[];
  /** Additional class name. */
  className?: string;
  /** Whether to show the tooltip arrow @default false */
  showArrow?: boolean;
}

/** Props when using the default {@link DataPoint} shape — `formatValue` is optional and defaults to reading `y`. */
export interface TooltipProps extends TooltipBaseProps<DataPoint> {
  /** Formats each value for display. @default Y as string, or '' if null */
  formatValue?: (datum: DataPoint) => string;
}

/**
 * Props when using a custom data shape — `formatValue` is **required** to avoid
 * silently rendering "undefined" for types that lack a `y` property.
 */
interface TooltipPropsCustom<T extends object> extends TooltipBaseProps<T> {
  /** Formats each value for display. Required for custom data shapes. */
  formatValue: (datum: T) => string;
}

/**
 * Tooltip for visx charts. Renders a popover with each series' color indicator, name, and formatted value at the hovered X position.
 *
 * @param props - {@link TooltipProps}
 */
export function Tooltip(props: TooltipProps): ReactElement | null;

/**
 * Tooltip for visx charts with custom data shape. Renders a popover with each series' color indicator, name, and formatted value at the hovered X position.
 *
 * @template T - Custom data point type. Requires `formatValue` to be provided.
 * @param props - {@link TooltipPropsCustom}
 */
export function Tooltip<T extends object>(props: TooltipPropsCustom<T>): ReactElement | null;

export function Tooltip<T extends object = DataPoint>(
  props: TooltipProps | TooltipPropsCustom<T>
): ReactElement | null {
  const { tooltipData, series, className, showArrow = false } = props;
  const formatValue = props.formatValue ?? (defaultFormatValue as (datum: T) => string);

  const seriesData = useMemo(
    function getSeriesData() {
      if (!tooltipData?.datumByKey) {
        return [];
      }

      return (series as InternalSeriesConfig<T>[])
        .filter(function hasDatum(seriesItem) {
          return tooltipData.datumByKey[seriesItem.id] != null;
        })
        .map(function toSeriesItem(seriesItem) {
          const datum = tooltipData.datumByKey[seriesItem.id];
          // Prefer a per-datum color (e.g. bar chart categoryColors); fall back to the series color.
          const swatchColor = seriesItem._resolveDatumColor?.(datum.datum as T) ?? seriesItem._resolvedColor;
          return {
            ...seriesItem,
            _resolvedColor: swatchColor,
            value: (formatValue as (d: unknown) => string)(datum.datum)
          };
        });
    },
    [tooltipData, series, formatValue]
  );

  if (seriesData.length === 0) {
    return null;
  }

  return (
    <TooltipContainer className={className}>
      <Flex role="list" aria-label="Tooltip data" direction="column" gap="sm">
        {seriesData.map(function renderSeriesItem(item) {
          const lineVariant = item.variant ?? 'solid';
          return (
            <Flex
              key={item.id}
              role="listitem"
              justifyContent="space-between"
              gap="2xl"
              className={styles.item}
              display="inline-flex"
            >
              <Flex alignItems="center" gap="sm">
                {lineVariant === 'solid' ? (
                  <Box
                    className={styles.swatch}
                    rounding="full"
                    style={{
                      opacity: item.opacity ?? undefined,
                      backgroundColor: item._resolvedColor || undefined
                    }}
                  />
                ) : (
                  item.variant && (
                    <svg
                      className={styles.lineSwatch}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      focusable="false"
                      width="16"
                      height="16"
                      style={item.opacity != null ? { opacity: item.opacity } : undefined}
                    >
                      <line
                        x1="0"
                        y1="8"
                        x2="16"
                        y2="8"
                        stroke={item._resolvedColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={SWATCH_DASH_ARRAY[lineVariant]}
                      />
                    </svg>
                  )
                )}
                <Text>{item.name}</Text>
              </Flex>
              <Text className={styles.value}>{item.value}</Text>
            </Flex>
          );
        })}
      </Flex>
      {showArrow && <div className={styles.tooltipArrow} />}
    </TooltipContainer>
  );
}
