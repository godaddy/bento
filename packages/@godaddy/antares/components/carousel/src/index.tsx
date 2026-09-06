import { type ReactNode, cloneElement, forwardRef, isValidElement, useState, useImperativeHandle, useRef } from 'react';
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { VisuallyHidden, useLocale } from 'react-aria-components';
import useEmblaCarousel from 'embla-carousel-react';
import EmblaAccessibility, { type AccessibilityOptionsType } from 'embla-carousel-accessibility';
import type { ButtonProps } from '#components/button';
import { Box } from '#components/layout/box';
import { Flex, type FlexProps } from '#components/layout/flex';
import { Pagination } from '#components/pagination';
import { cx } from 'cva';
import { composeClassName } from '#utils/render-props.ts';
import { useNavigationControls, type UseNavigationControlsProps } from './use-navigation-controls.tsx';
import { useAccessibility } from './use-accessibility.tsx';
import styles from './index.module.css';

export interface CarouselProps extends Omit<FlexProps<'div'>, 'onChange'> {
  /** The slides of the carousel. */
  children: ReactNode | ReactNode[];

  /** The index of the active slide. (Controlled mode) */
  activeIndex?: number;

  /** The index of the default active slide. (Uncontrolled mode) */
  defaultActiveIndex?: number;

  /** Whether to hide the mask edges of the viewport. */
  hideMaskEdges?: boolean;

  /** Whether to hide the dots. */
  hideDots?: boolean;

  /** Whether to hide the navigation controls. */
  hideNavigationControls?: boolean;

  /** Props to pass to the previous button. */
  prevButtonProps?: ButtonProps;

  /** Props to pass to the next button. */
  nextButtonProps?: ButtonProps;

  /** All options available for the embla carousel. */
  emblaOptions?: EmblaOptionsType;

  /** All options available for the embla accessibility. */
  emblaAccessibilityOptions?: AccessibilityOptionsType;

  /** The callback function to be called when the previous slide is pressed. */
  onPrev?: UseNavigationControlsProps['onPrev'];

  /** The callback function to be called when the next slide is pressed. */
  onNext?: UseNavigationControlsProps['onNext'];

  /** The callback function to be called when the active slide changes. */
  onChange?: UseNavigationControlsProps['onChange'];
}

export interface CarouselRef {
  container: HTMLDivElement | null;
  emblaApi: EmblaCarouselType | undefined;
}

/**
 * The Carousel component.
 *
 * @param props - {@link CarouselProps}
 * @param ref - The ref for the Carousel component.
 * @returns The Carousel component.
 */
export const Carousel = forwardRef<CarouselRef, CarouselProps>(function Carousel(props, ref) {
  const {
    className,
    activeIndex,
    defaultActiveIndex,
    hideDots,
    hideMaskEdges,
    prevButtonProps,
    nextButtonProps,
    emblaOptions,
    emblaAccessibilityOptions,
    hideNavigationControls,
    onChange,
    onPrev,
    onNext,
    ...rest
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const paginationDotsRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const children = Array.isArray(props.children) ? props.children : [props.children];
  const controlledMode = activeIndex !== undefined;
  const [startSnap] = useState(controlledMode ? activeIndex : (defaultActiveIndex ?? 0));
  const { direction } = useLocale();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: 'center', startSnap, direction, ...emblaOptions },
    [EmblaAccessibility({ announceChanges: true, ...emblaAccessibilityOptions })]
  );

  const { uncontrolledActiveIndex, scrollSnaps, atFirstSlide, atLastSlide, onNextButtonPress, onPrevButtonPress } =
    useNavigationControls({ emblaApi, activeIndex, defaultActiveIndex, onChange, onPrev, onNext });
  const finalActiveIndex = controlledMode ? activeIndex : uncontrolledActiveIndex;

  useAccessibility({
    emblaApi,
    previousButton: prevButtonRef.current,
    nextButton: nextButtonRef.current,
    paginationDots: paginationDotsRef.current,
    liveRegion: liveRegionRef.current
  });

  // expose the container and emblaApi for external control
  useImperativeHandle(
    ref,
    function handleImperativeRef() {
      return {
        container: containerRef.current,
        emblaApi
      };
    },
    [emblaApi]
  );

  return (
    <Flex
      direction="column"
      gap="md"
      {...rest}
      dir={direction}
      ref={containerRef}
      className={cx(styles.container, className)}
    >
      <Box ref={emblaRef} className={styles.viewport}>
        <Flex gap="md">{children.map(CarouselSlide)}</Flex>
      </Box>

      {hideMaskEdges ? null : (
        <Flex
          aria-hidden="true"
          justifyContent="space-between"
          className={cx(styles.edgeMask, atFirstSlide && styles.hideFirst, atLastSlide && styles.hideLast)}
        />
      )}

      <Pagination
        activeIndex={finalActiveIndex}
        total={scrollSnaps.length}
        hideControls={hideNavigationControls}
        variant={hideDots ? null : 'dots'}
        prevButtonProps={{
          ...prevButtonProps,
          onPress: onPrevButtonPress,
          className: composeClassName(prevButtonProps?.className, styles.prev, atFirstSlide && styles.hide)
        }}
        nextButtonProps={{
          ...nextButtonProps,
          onPress: onNextButtonPress,
          className: composeClassName(nextButtonProps?.className, styles.next, atLastSlide && styles.hide)
        }}
        prevButtonRef={prevButtonRef}
        nextButtonRef={nextButtonRef}
      />

      <VisuallyHidden>
        <Box ref={liveRegionRef} aria-live="polite" aria-atomic="true" />
      </VisuallyHidden>
    </Flex>
  );
});

function CarouselSlide(children: ReactNode, key: string | number) {
  if (isValidElement<{ className?: string }>(children)) {
    return cloneElement(children, {
      className: cx(styles.slide, children.props.className),
      key: key
    });
  }

  return children;
}
