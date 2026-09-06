import {
  BarChart,
  type BarChartProps,
  type BarChartTooltipRenderProps,
  type BarSeriesConfig,
  Box,
  Flex,
  Text
} from '@godaddy/antares';

/** One day's net payments; `x` is the date label (category), `y` the amount. */
interface DailyDatum {
  x: string;
  y: number;
}

/** Series shape carrying which period it represents via `tooltipMetadata`. */
interface PaymentSeries extends BarSeriesConfig<DailyDatum, { period: 'current' | 'previous'; year: number }> {
  tooltipMetadata: { period: 'current' | 'previous'; year: number };
}

const DATES = ['Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12'];

// Each date is a category with its own palette color, shared by both periods.
const categoryColors = { 'Jan 6': 0, 'Jan 7': 1, 'Jan 8': 2, 'Jan 9': 3, 'Jan 10': 4, 'Jan 11': 5, 'Jan 12': 6 };

const currentAmounts = [432, 665, 800, 692.12, 700, 555, 318];
const previousAmounts = [515, 515, 665, 713.25, 620, 310, 432];

const formatMoney = (v: number) => `$${v.toFixed(2)}`;

/**
 * Period-over-period tooltip built from `renderTooltip`. The two series (this period /
 * previous period) share a `categoryColors` map, so each date's bars carry their own color;
 * the previous period is dropped to reduced opacity. Hovering a date shows both dated values
 * and the percent change, with the swatch colour pulled from the hovered category — via
 * `series._resolveDatumColor(datum)` — rather than a single series color.
 */
function renderPaymentTooltip({
  hoveredCategory,
  datumByKey,
  series
}: BarChartTooltipRenderProps<DailyDatum, PaymentSeries>) {
  const current = series.find((oneSeries) => oneSeries.tooltipMetadata?.period === 'current');
  const previous = series.find((oneSeries) => oneSeries.tooltipMetadata?.period === 'previous');
  if (!current || !previous) {
    return null;
  }

  const currentDatum = datumByKey[current.id];
  const previousDatum = datumByKey[previous.id];
  if (!currentDatum || !previousDatum) {
    return null;
  }

  const currentValue = currentDatum.y;
  const previousValue = previousDatum.y;
  // Per-category color: the colour of the hovered date's bars, not the series color.
  const color = current._resolveDatumColor?.(currentDatum) ?? current._resolvedColor;
  const label = String(hoveredCategory ?? '');

  const change = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue) * 100;
  const isUp = change >= 0;

  return (
    <Flex direction="column" gap="lg" style={{ minWidth: 260 }}>
      <Text style={{ fontSize: 18 }}>Net Payments</Text>

      <Flex direction="column" gap="sm">
        <Flex justifyContent="space-between" alignItems="center" gap="2xl">
          <Flex alignItems="center" gap="md">
            <Box rounding="full" style={{ width: 12, height: 12, backgroundColor: color }} />
            <Text>{`${label}, ${current.tooltipMetadata?.year}`}</Text>
          </Flex>
          <Text>{formatMoney(currentValue)}</Text>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" gap="2xl">
          <Flex alignItems="center" gap="md">
            <Box rounding="full" style={{ width: 12, height: 12, backgroundColor: color, opacity: previous.opacity }} />
            <Text>{`${label}, ${previous.tooltipMetadata?.year}`}</Text>
          </Flex>
          <Text>{formatMoney(previousValue)}</Text>
        </Flex>
      </Flex>

      <Flex alignItems="center" gap="sm">
        <Text style={{ color: isUp ? '#2f9e44' : '#e03131' }}>{isUp ? '↑' : '↓'}</Text>
        <Text style={{ fontWeight: 'bolder' }}>{`${Math.abs(change).toFixed(2)}%`}</Text>
        <Text style={{ color: '#868e96' }}>compared to previous period</Text>
      </Flex>
    </Flex>
  );
}

/**
 * A `renderTooltip` example styled as a period-over-period comparison card, using
 * `categoryColors` so each date owns its color. Hovering a bar group shows both years'
 * values and the percent change; the tooltip swatch is resolved per category from the
 * hovered datum, demonstrating category colors inside a custom tooltip.
 * @title Custom tooltip
 * @order 11
 */
export function CustomTooltipPeriodComparisonExample(props: Partial<BarChartProps<DailyDatum, PaymentSeries>>) {
  const series: PaymentSeries[] = [
    {
      id: 'this-period',
      name: 'This period',
      categoryColors,
      tooltipMetadata: { period: 'current', year: 2026 },
      data: DATES.map((date, i) => ({ x: date, y: currentAmounts[i] }))
    },
    {
      id: 'previous-period',
      name: 'Previous period',
      categoryColors,
      opacity: 0.35,
      tooltipMetadata: { period: 'previous', year: 2025 },
      data: DATES.map((date, i) => ({ x: date, y: previousAmounts[i] }))
    }
  ];

  return (
    <BarChart
      series={series}
      xAccessor={(d: DailyDatum) => d.x}
      yAccessor={(d: DailyDatum) => d.y}
      yTickFormat={(value) => `$${Number(value).toLocaleString()}`}
      yDomain={[0, 1000]}
      yGridlines={true}
      xBaseline={true}
      legendPosition={null}
      height={450}
      renderTooltip={renderPaymentTooltip}
      aria-label="Payment activity by day"
      desc="Vertical bar chart of daily net payments for two periods; each day keeps its own color via categoryColors, the previous period is shown at reduced opacity, and a custom tooltip compares the two periods for the hovered day"
      {...props}
    />
  );
}
