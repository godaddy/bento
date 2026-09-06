import { AxisTitle } from '../src/index.tsx';
import { RTLProvider } from '#utils/rtl-locale-provider.tsx';

/**
 * The axis title follows the current **layout direction** (LTR or RTL). By default, that direction is detected automatically from the browser or system settings, so the title stays aligned with the page.
 * @order 3
 */
export function RTLDirectionExample() {
  return (
    <RTLProvider>
      <AxisTitle title="Temperature (°F)" axis="y" />
    </RTLProvider>
  );
}
