import { RTLProvider } from '#utils/rtl-locale-provider.tsx';
import { OverflowExample } from './overflow.tsx';

/**
 * Overflow controls follow the logical reading direction.
 * @order 6
 */
export function RTLExample() {
  return (
    <RTLProvider>
      <OverflowExample />
    </RTLProvider>
  );
}
