import { Carousel, Flex } from '@godaddy/antares';
import { RTLProvider } from '#utils/rtl-locale-provider.tsx';

/**
 * The carousel follows the current **layout direction** (LTR or RTL). By default, that direction is detected automatically from the browser or system settings.
 * @order 8
 */
export function RTLDirectionExample() {
  return (
    <RTLProvider>
      <Carousel style={{ maxWidth: 400 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Flex key={index} alignItems="center" justifyContent="center" style={{ height: 300, background: 'lavender' }}>
            Slide {index + 1}
          </Flex>
        ))}
      </Carousel>
    </RTLProvider>
  );
}
