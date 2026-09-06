import React, { forwardRef, type HTMLAttributes, type ReactElement } from 'react';
import { Pressable as RACPressable } from 'react-aria-components';
import { mergeProps, useFocusRing, useHover } from 'react-aria';
import type { PressableProps as RACPressableProps } from 'react-aria/Pressable';
import { composeClassName, type ClassNameProp } from '#utils/render-props.ts';
import styles from './index.module.css';

/** Props for {@link Pressable}. */
export interface PressableProps extends RACPressableProps {}

interface PressableChildProps extends Omit<HTMLAttributes<HTMLElement>, 'className'> {
  className?: ClassNameProp<unknown>;
  'data-focused'?: boolean;
  'data-focus-visible'?: boolean;
  'data-hovered'?: boolean;
  'data-pressed'?: boolean;
  'data-disabled'?: boolean;
}

/**
 * Makes one child interactive with pointer, touch, and keyboard support.
 * Adds Antares styles for hover, pressed, focus, and disabled behavior without a DOM wrapper.
 * The child must forward its ref and DOM props.
 *
 * @param props - The properties {@link PressableProps} passed to the component.
 *
 * @example
 * ```tsx
 * <Pressable aria-label="Account menu" onPress={openAccountMenu}>
 *   <Avatar role="button">
 *     <Text>UT</Text>
 *   </Avatar>
 * </Pressable>
 * ```
 */
export const Pressable = forwardRef<HTMLElement, PressableProps>(function Pressable(props, ref) {
  const { children, isDisabled, isPressed: controlledIsPressed, onPressChange, ...rest } = props;
  const [isPressed, setIsPressed] = React.useState(false);
  const pressed = controlledIsPressed ?? isPressed;
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const handlePressChange = React.useCallback(
    function handlePressChange(nextIsPressed: boolean) {
      setIsPressed(nextIsPressed);
      onPressChange?.(nextIsPressed);
    },
    [onPressChange]
  );
  const child = React.Children.only(children) as ReactElement<PressableChildProps>;
  const mergedChildProps = mergeProps(child.props, hoverProps, focusProps);
  const styledChild = React.cloneElement(child, {
    ...mergedChildProps,
    'data-focused': isFocused || undefined,
    'data-focus-visible': isFocusVisible || undefined,
    'data-hovered': isHovered || undefined,
    'data-pressed': pressed || undefined,
    'data-disabled': isDisabled || undefined,
    className: composeClassName(child.props.className, styles.pressable)
  });

  return (
    <RACPressable
      {...rest}
      isDisabled={isDisabled}
      isPressed={controlledIsPressed}
      onPressChange={handlePressChange}
      ref={ref}
    >
      {styledChild as RACPressableProps['children']}
    </RACPressable>
  );
});
