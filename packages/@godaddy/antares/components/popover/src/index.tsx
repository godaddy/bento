import { forwardRef, type ReactNode } from 'react';
import {
  Popover as RACPopover,
  type PopoverProps as RACPopoverProps,
  type DialogProps as RACDialogProps,
  DialogTrigger as RACDialogTrigger,
  type DialogTriggerProps as RACDialogTriggerProps,
  OverlayArrow as RACOverlayArrow
} from 'react-aria-components';
import { Flex } from '#components/layout/flex';
import { OverlayDialog } from '#components/_internal/overlay-dialog';
import { composeClassName } from '#utils/render-props.ts';
import styles from './index.module.css';

export interface PopoverTriggerProps extends RACDialogTriggerProps {}

type PopoverPositioningKeys =
  | 'placement'
  | 'offset'
  | 'crossOffset'
  | 'containerPadding'
  | 'shouldFlip'
  | 'triggerRef'
  | 'isOpen'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'isKeyboardDismissDisabled'
  | 'shouldCloseOnInteractOutside';

export interface PopoverProps extends Omit<RACDialogProps, 'children'>, Pick<RACPopoverProps, PopoverPositioningKeys> {
  /** The content of the popover. */
  children?: ReactNode;

  /** Whether to hide the arrow. */
  hideArrow?: boolean;

  /**
   * The ARIA role of the popover's dialog. Use `alertdialog` for an urgent message
   * that interrupts the user.
   * @default 'dialog'
   */
  role?: RACDialogProps['role'];

  /** Props for the positioned panel that holds the popover's dialog. */
  containerProps?: Omit<RACPopoverProps, 'children' | PopoverPositioningKeys>;
}

/**
 * An overlay positioned relative to a trigger.
 *
 * @param props - {@link PopoverProps}
 */
export const Popover = forwardRef<HTMLElement, PopoverProps>(function Popover(props, ref) {
  const {
    children,
    hideArrow,
    containerProps,
    className,
    style,
    placement,
    offset,
    crossOffset,
    containerPadding,
    shouldFlip,
    triggerRef,
    isOpen,
    defaultOpen,
    onOpenChange,
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    ...dialogProps
  } = props;

  return (
    <Flex
      elevation="overlay"
      data-noarrow={hideArrow}
      rounding="md"
      {...containerProps}
      as={RACPopover}
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      containerPadding={containerPadding}
      shouldFlip={shouldFlip}
      triggerRef={triggerRef}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
      className={composeClassName(containerProps?.className, styles.popover)}
    >
      {hideArrow ? null : <RACOverlayArrow aria-hidden="true" className={styles.arrow} />}
      <OverlayDialog {...dialogProps} ref={ref} className={className} style={style}>
        {children}
      </OverlayDialog>
    </Flex>
  );
});

/**
 * Popover trigger component.
 *
 * @param props - {@link PopoverTriggerProps}
 */
export const PopoverTrigger = function PopoverTrigger(props: PopoverTriggerProps) {
  return <RACDialogTrigger {...props} />;
};
