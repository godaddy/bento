import { RTLProvider } from '#utils/rtl-locale-provider.tsx';
import { DefaultExample } from './default.tsx';

/**
 * Test-only right-to-left rendering example.
 * @ignore
 */
export function RTLExample() {
  return (
    <RTLProvider>
      <DefaultExample />
    </RTLProvider>
  );
}
