import { forwardRef, type RefObject, type ReactNode } from 'react';
import {
  Tooltip as RACTooltip,
  type TooltipProps as RACTooltipProps,
  TooltipTrigger as RACTooltipTrigger,
  type TooltipTriggerComponentProps as RACTooltipTriggerProps,
  OverlayArrow as RACOverlayArrow
} from 'react-aria-components';
import { Flex } from '#components/layout/flex';
import { composeClassName } from '#utils/render-props.ts';
import styles from './index.module.css';

export interface TooltipTriggerProps extends RACTooltipTriggerProps {
  /** The delay time in milliseconds for the tooltip to show up on hover. @default 500 */
  delay?: number;

  /** The delay time in milliseconds for the tooltip to close. @default 250 */
  closeDelay?: number;
}

export interface TooltipProps extends RACTooltipProps {
  /** The content to display inside the tooltip. */
  children?: ReactNode;

  /** The placement of the tooltip relative to the trigger. */
  placement?: RACTooltipProps['placement'];

  /** Whether to hide the arrow. */
  hideArrow?: boolean;

  /**
   * The ref for the element which the tooltip positions itself with respect to.
   * When used within `TooltipTrigger` component, this is set automatically.
   */
  triggerRef?: RefObject<Element | null>;
}

/**
 * A tooltip component that displays a description on hover or focus.
 *
 * @param props - {@link TooltipProps}
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
  const { className, children, hideArrow, ...rest } = props;

  return (
    <Flex
      as={RACTooltip}
      ref={ref}
      padding={['sm', 'md']}
      rounding="md"
      elevation="overlay"
      data-noarrow={hideArrow}
      {...rest}
      className={composeClassName(className, styles.tooltip)}
    >
      {hideArrow ? null : <RACOverlayArrow aria-hidden="true" className={styles.arrow} />}
      {children}
    </Flex>
  );
});

/**
 * Tooltip trigger component.
 *
 * @param props - {@link TooltipTriggerProps}
 */
export const TooltipTrigger = function TooltipTrigger(props: TooltipTriggerProps) {
  const { delay = 500, closeDelay = 250, ...rest } = props;

  return <RACTooltipTrigger delay={delay} closeDelay={closeDelay} {...rest} />;
};
