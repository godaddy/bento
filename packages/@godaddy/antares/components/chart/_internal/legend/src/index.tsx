import type { InternalSeriesConfig, LineSeriesVariant, SeriesConfig } from '#components/chart/types.ts';
import { cx } from 'cva';
import { ChartColorProvider, useChartColor } from '#components/chart/_internal/use-chart-color';
import { Flex, type FlexProps } from '#components/layout/flex';
import { Box } from '#components/layout/box';
import { Text } from '#components/text';
import styles from './index.module.css';

/**
 * Legend display settings derived from the Series. */
interface LegendSeriesItem
  extends Pick<InternalSeriesConfig, 'id' | 'name' | '_resolvedColor' | 'variant' | 'opacity'> {}

/**
 * Props for the Legend component.
 *
 * Accepts the same series shape used by chart components (subset of {@link SeriesConfig}:
 * id, name). Use with the same series config as the chart so labels stay in sync.
 * Colors are handled by the theme.
 */
export interface LegendProps
  extends Omit<FlexProps<'div'>, 'children' | 'direction' | 'display' | 'alignItems' | 'gap'> {
  /** Series to display in the legend (id, name, optional line variant) */
  series: LegendSeriesItem[];
  /** Optional visible and accessible label for the legend. */
  label?: string;
  /** Size of the legend labels and swatches. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Layout orientation for legend items. Defaults to horizontal. */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Legend component for displaying series information.
 *
 * Renders a legend with theme-colored indicators and series names.
 * Each legend item is a circular swatch (color handled by the theme) plus the series name.
 * Use alongside chart components that share the same series config so the legend matches the chart.
 *
 * @param props - {@link LegendProps}
 * @returns JSX element rendering the legend
 *
 * @example
 * ```tsx
 * <Legend
 *   series={[
 *     { id: '1', name: 'Product A' },
 *     { id: '2', name: 'Product B' },
 *   ]}
 * />
 * ```
 */
/** stroke-dasharray for the line swatch, mirroring the chart's line variants (scaled for the small swatch). */
export const SWATCH_DASH_ARRAY: Record<Exclude<LineSeriesVariant, 'solid'>, string> = {
  dashed: '5 3',
  dotted: '1 3'
};

interface LegendSwatchProps {
  variant?: LineSeriesVariant;
  /** Explicit swatch color; falls back to the palette color for this item's position. */
  color?: string;
  /** Series opacity, applied to the swatch to match the chart (e.g. bar chart comparison period). */
  opacity?: number;
}

function LegendSwatch(props: LegendSwatchProps) {
  const { variant = 'solid', color: colorOverride, opacity } = props;
  const allocatedColor = useChartColor();
  const color = colorOverride ?? allocatedColor;

  if (variant === 'solid') {
    return <Box rounding="full" className={styles.swatch} style={{ backgroundColor: color, opacity }} />;
  }

  return (
    <svg className={styles.lineSwatch} viewBox="0 0 16 16" aria-hidden="true" focusable="false" style={{ opacity }}>
      <line
        x1="0"
        y1="8"
        x2="16"
        y2="8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={SWATCH_DASH_ARRAY[variant]}
      />
    </svg>
  );
}

interface LegendItemProps {
  seriesItem: LegendSeriesItem;
}

function LegendItem(props: LegendItemProps) {
  const { seriesItem } = props;
  return (
    <Flex role="listitem" direction="row" alignItems="center" gap="sm" className={styles.item}>
      <LegendSwatch variant={seriesItem.variant} color={seriesItem._resolvedColor} opacity={seriesItem.opacity} />
      <Text>{seriesItem.name}</Text>
    </Flex>
  );
}

export function Legend(props: LegendProps) {
  const { series, label, size = 'md', orientation = 'horizontal', className, ...rootFlexProps } = props;
  const isHorizontal = orientation === 'horizontal';

  return (
    <ChartColorProvider>
      <Flex
        {...rootFlexProps}
        direction="column"
        alignItems="flex-start"
        display="inline-flex"
        gap="sm"
        className={cx(styles.root, className)}
        data-size={size}
      >
        {label ? <Text className={styles.label}>{label}</Text> : null}
        <Flex
          role="list"
          aria-label={label ?? 'Chart legend'}
          alignItems="flex-start"
          direction={isHorizontal ? 'row' : 'column'}
          gap={isHorizontal ? 'lg' : 'sm'}
          flexShrink={0}
          wrap="wrap"
          justifyContent="center"
        >
          {series.map(function renderLegendItem(seriesItem) {
            return <LegendItem key={seriesItem.id} seriesItem={seriesItem} />;
          })}
        </Flex>
      </Flex>
    </ChartColorProvider>
  );
}
