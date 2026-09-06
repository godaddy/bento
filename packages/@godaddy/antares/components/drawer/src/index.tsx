import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import {
  type DialogProps as RACDialogProps,
  DialogTrigger as RACDialogTrigger,
  type DialogTriggerProps as RACDialogTriggerProps,
  Modal as RACModal,
  ModalOverlay as RACModalOverlay,
  type ModalOverlayProps as RACModalOverlayProps,
  composeRenderProps
} from 'react-aria-components';
import { toCssSize } from '#utils/css.ts';
import { composeClassName } from '#utils/render-props.ts';
import { Flex } from '#components/layout/flex';
import { OverlayDialog } from '#components/_internal/overlay-dialog';
import styles from './index.module.css';

/**
 * Physical edge the drawer slides in from. Positioning is physical (like Base UI
 * and MUI drawers), so placement does not flip for RTL.
 */
export type DrawerPlacement = 'top' | 'bottom' | 'left' | 'right';

type DrawerFlatKeys =
  | 'isOpen'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'isDismissable'
  | 'isKeyboardDismissDisabled'
  | 'shouldCloseOnInteractOutside';

type DrawerLayerProps = Omit<RACModalOverlayProps, 'children' | DrawerFlatKeys>;

export interface DrawerProps extends Omit<RACDialogProps, 'children'>, Pick<RACModalOverlayProps, DrawerFlatKeys> {
  /** Physical edge the drawer slides in from. */
  placement: DrawerPlacement;

  /**
   * Max size of the drawer along its constrained axis. Accepts CSS values.
   * @default 'min(80vw, 25rem)' for left/right, 'calc(100dvh - 5rem)' for top/bottom
   */
  maxSize?: number | string;

  /** Min size of the drawer along its constrained axis. Accepts CSS values. Wins over `maxSize` if the two conflict. */
  minSize?: number | string;

  /** Animate the open/close slide. @default true */
  animate?: boolean;

  /** Props for the drawer's backdrop. */
  overlayProps?: DrawerLayerProps;

  /** Props for the drawer's positioned container. */
  containerProps?: DrawerLayerProps;

  /** Content to render inside the drawer. */
  children?: ReactNode;
}

/**
 * An overlay panel that slides in from a screen edge.
 *
 * @param props - {@link DrawerProps}
 */
export const Drawer = forwardRef<HTMLElement, DrawerProps>(function Drawer(props, ref) {
  const {
    placement,
    maxSize,
    minSize,
    animate,
    isOpen,
    defaultOpen,
    onOpenChange,
    isDismissable,
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    overlayProps,
    containerProps,
    className,
    style,
    children,
    ...dialogProps
  } = props;

  return (
    <RACModalOverlay
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
      data-animate={animate === false ? 'false' : undefined}
      {...overlayProps}
      className={composeClassName(overlayProps?.className, styles.overlay)}
    >
      <Flex
        as={RACModal}
        elevation="overlay"
        direction="column"
        data-placement={placement}
        {...containerProps}
        className={composeClassName(containerProps?.className, styles.drawer)}
        style={composeRenderProps(containerProps?.style, function composeDrawerStyle(value) {
          return {
            ...value,
            '--_slide': getSlideTransform(placement),
            ...(maxSize !== undefined && { '--_max-size': toCssSize(maxSize) }),
            ...(minSize !== undefined && { '--_min-size': toCssSize(minSize) })
          } as CSSProperties;
        })}
      >
        <OverlayDialog {...dialogProps} ref={ref} className={composeClassName(className, styles.dialog)} style={style}>
          {children}
        </OverlayDialog>
      </Flex>
    </RACModalOverlay>
  );
});

export interface DrawerTriggerProps extends RACDialogTriggerProps {}

/**
 * Drawer trigger component. Wraps RAC DialogTrigger.
 *
 * @param props - {@link DrawerTriggerProps}
 */
export const DrawerTrigger = function DrawerTrigger(props: DrawerTriggerProps) {
  return <RACDialogTrigger {...props} />;
};

/**
 * Off-screen transform for the entering/exiting state. `placement` is a physical
 * edge and the panel is pinned with physical `left`/`right`, so the slide is purely
 * physical too. Placement never flips in RTL.
 */
function getSlideTransform(placement: DrawerPlacement): string {
  switch (placement) {
    case 'right':
      return 'translateX(100%)';
    case 'left':
      return 'translateX(-100%)';
    case 'bottom':
      return 'translateY(100%)';
    case 'top':
      return 'translateY(-100%)';
  }
}
