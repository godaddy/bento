import { RTLProvider } from '#utils/rtl-locale-provider.tsx';
import { OverflowExample } from './overflow.tsx';

/**
 * The segmented controller follows the current layout direction (LTR or RTL), detected automatically from the browser or system settings.
 * @title RTL Direction
 * @order 7
 */
export function RTLExample() {
  return (
    <RTLProvider>
      <OverflowExample />
    </RTLProvider>
  );
}
