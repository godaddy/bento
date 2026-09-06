import { BarChart } from '@godaddy/antares';
import { cityTemperature } from '@visx/mock-data';
import { RTLProvider } from '#utils/rtl-locale-provider.tsx';

/**
 * The chart follows the current layout direction, which is normally detected from the browser or system settings. In right-to-left it mirrors the axes, bars, and labels; this example forces RTL so you can see it in a left-to-right page. RTL support is still being refined - axis rendering and tick spacing in particular.
 * @title RTL multi-series
 * @order 7
 */
export function RTLMultiSeriesExample(props: any) {
  const cities = ['New York', 'San Francisco', 'Austin'] as const;

  const series = cities.map(function mapCity(city) {
    return {
      id: `city-${city.toLowerCase().replace(/\s+/g, '-')}`,
      name: city,
      data: cityTemperature.slice(0, 10).map(function mapData(d) {
        return {
          x: d.date,
          y: parseFloat(d[city as keyof typeof d])
        };
      })
    };
  });

  return (
    <RTLProvider>
      <BarChart
        series={series}
        xAccessor={(d: any) => d.x}
        yAccessor={(d: any) => d.y}
        xAxisTitle="Date"
        yAxisTitle="Temperature (°F)"
        xBaseline={true}
        yBaseline={true}
        xTickMarks={true}
        yTickMarks={true}
        yGridlines={true}
        {...props}
      />
    </RTLProvider>
  );
}
