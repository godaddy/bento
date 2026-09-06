import { RTLProvider } from '#utils/rtl-locale-provider.tsx';
import { CityTemperatureExample } from './city-temperature.tsx';
import type { LineChartProps } from '@godaddy/antares';

/**
 * The chart follows the current layout direction, normally detected from the browser or system settings. In right-to-left it mirrors the axes and labels; this example forces RTL so you can see it in a left-to-right page.
 * @title RTL
 * @order 24
 */
export function RTLExample(props: Partial<LineChartProps>) {
  return (
    <RTLProvider>
      <CityTemperatureExample {...props} />
    </RTLProvider>
  );
}
