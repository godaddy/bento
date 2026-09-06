import { BarChart, type BarChartProps, type DataPoint } from '@godaddy/antares';
import { cityTemperature } from '@visx/mock-data';
import { RTLProvider } from '#utils/rtl-locale-provider.tsx';

export interface PlaygroundExampleProps
  extends Omit<BarChartProps, 'series' | 'xAccessor' | 'yAccessor' | 'xTickFormat' | 'yTickFormat'> {
  /** Number of series to render (1 hides the legend by default). */
  numSeries?: 1 | 2 | 3;
  /** Render in right-to-left layout by wrapping the chart in {@link RTLProvider}. */
  rtl?: boolean;
}

const CITIES = ['New York', 'San Francisco', 'Austin'] as const;

export function PlaygroundExample({
  orientation = 'vertical',
  numSeries = 2,
  xAxisTitle = 'Date',
  yAxisTitle = 'Temperature (°F)',
  height = 500,
  rtl = false,
  ...rest
}: PlaygroundExampleProps) {
  const rows = cityTemperature.slice(0, 10);
  const series: Array<{ id: string; name: string; data: DataPoint[] }> = CITIES.slice(0, numSeries).map(
    function mapCity(city) {
      return {
        id: `city-${city.toLowerCase().replace(/\s+/g, '-')}`,
        name: city,
        data: rows.map(function mapRow(row) {
          const value = parseFloat(row[city as keyof typeof row] as string);
          return orientation === 'horizontal' ? { x: value, y: row.date } : { x: row.date, y: value };
        })
      };
    }
  );

  const chart = (
    <BarChart
      series={series}
      orientation={orientation}
      xAxisTitle={xAxisTitle}
      yAxisTitle={yAxisTitle}
      height={height}
      aria-label="Playground bar chart"
      {...rest}
    />
  );

  return rtl ? <RTLProvider>{chart}</RTLProvider> : chart;
}
