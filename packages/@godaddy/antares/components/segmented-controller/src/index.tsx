import { useCallback, type ReactNode } from 'react';
import {
  ToggleButtonGroup as RACToggleButtonGroup,
  ToggleButton as RACToggleButton,
  type ToggleButtonProps as RACToggleButtonProps,
  SelectionIndicator as RACSelectionIndicator,
  type ToggleButtonGroupProps as RACToggleButtonGroupProps,
  type Key as RACKey,
  useLocale
} from 'react-aria-components';
import { Flex, type FlexOwnProps } from '#components/layout/flex';
import { Button } from '#components/button';
import { Icon } from '#components/icon';
import { composeClassName } from '#utils/render-props.ts';
import { useHorizontalScroll } from './use-horizontal-scroll.ts';
import styles from './index.module.css';

export interface SegmentedControllerProps
  extends Omit<RACToggleButtonGroupProps, 'onSelectionChange'>,
    Omit<FlexOwnProps, 'as'> {
  /** The size of the segmented controller. */
  size?: 'sm' | 'md' | 'lg';

  /** The initial selected value. (uncontrolled) */
  defaultValue?: string;

  /** The selected value. (controlled) */
  value?: string;

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (value: string) => void;

  /** Whether the segmented controller is disabled. */
  isDisabled?: boolean;

  /** The segmented controller items. */
  children?: ReactNode;
}

/**
 * A segmented controller lets users switch between 2+ related views or categories
 * within the same context. Single-selection only.
 *
 * @param props - The properties {@link SegmentedControllerProps} passed to the component.
 */
export function SegmentedController(props: SegmentedControllerProps) {
  const { size = 'md', className, children, defaultValue, value, onSelectionChange, isDisabled, ...rest } = props;
  const { direction } = useLocale();
  const { containerRef, scrollButtonsRef, hasOverflow, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useHorizontalScroll({ isRTL: direction === 'rtl' });

  const handleSelectionChange = useCallback(
    function handleSelectionChange(values: Set<RACKey>) {
      const selected = String(Array.from(values).at(0));
      onSelectionChange?.(selected);
    },
    [onSelectionChange, containerRef, hasOverflow]
  );

  return (
    <Flex
      {...rest}
      display="inline-flex"
      as={RACToggleButtonGroup}
      defaultSelectedKeys={defaultValue ? [defaultValue] : undefined}
      onSelectionChange={handleSelectionChange}
      disallowEmptySelection
      selectionMode="single"
      isDisabled={isDisabled}
      selectedKeys={value ? [value] : undefined}
      data-size={size}
      dir={direction}
      className={composeClassName(className, styles.container)}
    >
      <Flex ref={containerRef} gap="xs" padding="xs" className={styles.content}>
        {children}
      </Flex>

      {hasOverflow ? (
        <Flex className={styles.scrollButtons} ref={scrollButtonsRef}>
          <Button
            size="md"
            aria-label="Scroll previous"
            onPress={scrollPrev}
            className={styles.scrollBtn}
            isDisabled={!canScrollPrev}
          >
            <Icon icon="chevron-left" />
          </Button>
          <Button
            size="md"
            aria-label="Scroll next"
            onPress={scrollNext}
            className={styles.scrollBtn}
            isDisabled={!canScrollNext}
          >
            <Icon icon="chevron-right" />
          </Button>
        </Flex>
      ) : null}
    </Flex>
  );
}

export interface SegmentedControllerItemProps extends Omit<RACToggleButtonProps, 'id'>, Omit<FlexOwnProps, 'as'> {
  /** The value of the segment. */
  value: string;

  /** The content of the segment. Can be text, icon+text, or icon-only (with aria-label). */
  children?: ReactNode;
}

/**
 * An individual segment within a SegmentedController.
 *
 * @param props - The properties {@link SegmentedControllerItemProps} passed to the component.
 */
export function SegmentedControllerItem(props: SegmentedControllerItemProps) {
  const { className, children, value, ...rest } = props;

  const handleFocus = useCallback(
    function handleFocus(e: Parameters<NonNullable<RACToggleButtonProps['onFocus']>>[0]) {
      e.target.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
      rest.onFocus?.(e);
    },
    [rest.onFocus]
  );

  return (
    <Flex
      as={RACToggleButton}
      {...rest}
      id={value}
      alignItems="center"
      gap="xs"
      onFocus={handleFocus}
      className={composeClassName(className, styles.item)}
    >
      <Flex as={RACSelectionIndicator} className={styles.indicator} />
      {children}
    </Flex>
  );
}
