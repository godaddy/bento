import { RTLProvider } from '#utils/rtl-locale-provider.tsx';
import { DefaultExample } from './default.tsx';

/**
 * The group follows the document's layout direction, detected automatically from the browser locale.
 * @title RTL Direction
 * @order 9
 */
export function RTLExample() {
  return (
    <RTLProvider>
      <DefaultExample />
    </RTLProvider>
  );
}
