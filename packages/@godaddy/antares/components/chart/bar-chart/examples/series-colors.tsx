import { BarChart } from '@godaddy/antares';
import { cityTemperature } from '@visx/mock-data';

const ROWS = cityTemperature.slice(0, 10);

/**
 * Set `colorIndex` on a series to pin every bar in it to a specific color from the
 * shared nine-color palette. Give two series the same `colorIndex` and separate them
 * with `opacity` instead of hue — a common way to show a comparison period against the
 * current one while keeping a single color identity.
 *
 * Series can also have sparse data: a `null` value simply omits that bar. Each series
 * here drops out of a different date, and one date drops two of them at once, so the bars
 * present per group keep changing — yet every series stays the color its `colorIndex`
 * pins it to. Colors follow the series, never the bar's position, so the shifting gaps
 * never move a color onto the wrong series.
 * @title Series colors
 * @order 9
 */
export function SeriesColorsExample(props: any) {
  const series = [
    {
      id: 'this-period',
      name: 'This period',
      colorIndex: 1,
      // Missing its own date (index 2).
      data: ROWS.map((d, i) => ({ x: d.date, y: i === 2 ? null : parseFloat(d['New York']) }))
    },
    {
      id: 'previous-period',
      name: 'Previous period',
      colorIndex: 1,
      opacity: 0.4,
      // Missing two dates (index 4 shared with Forecast, and index 9).
      data: ROWS.map((d, i) => ({ x: d.date, y: i === 4 || i === 9 ? null : parseFloat(d['New York']) * 0.88 }))
    },
    {
      id: 'forecast',
      name: 'Forecast',
      colorIndex: 4,
      // Missing two dates (index 4 shared with Previous period, and index 7).
      data: ROWS.map((d, i) => ({ x: d.date, y: i === 4 || i === 7 ? null : parseFloat(d['San Francisco']) }))
    }
  ];

  return (
    <BarChart
      series={series}
      xAccessor={(d: { x: string; y: number | null }) => d.x}
      yAccessor={(d: { x: string; y: number | null }) => d.y}
      xAxisTitle="Date"
      yAxisTitle="Temperature (°F)"
      yDomain={[0, 100]}
      xBaseline={true}
      yBaseline={true}
      xTickMarks={true}
      yTickMarks={true}
      aria-label="Series colors example bar chart"
      desc="Grouped bar chart where two series share one palette color via colorIndex and are separated by reduced opacity, plus a third series in its own color; each series omits a different date and one date omits two, and every series keeps its color wherever its bars appear"
      {...props}
    />
  );
}
