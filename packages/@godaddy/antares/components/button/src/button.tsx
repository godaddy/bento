import type React from 'react';
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'cva';
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
  Link as RACLink,
  type LinkProps as RACLinkProps,
  Text as RACText
} from 'react-aria-components';
import { Icon } from '#components/icon';
import { composeClassName } from '#utils/render-props.ts';
import styles from './index.module.css';

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      tertiary: styles.tertiary,
      critical: styles.critical,
      inline: styles.inline,
      minimal: styles.minimal
    },
    size: {
      sm: styles.sm,
      md: styles.md
    }
  },
  defaultVariants: {
    variant: 'tertiary',
    size: 'md'
  }
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

interface BaseButtonProps {
  /** The variant of the button. */
  variant?: ButtonVariantProps['variant'];

  /** The size of the button. */
  size?: ButtonVariantProps['size'];

  /** The content of the button. */
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseButtonProps, Omit<RACButtonProps, 'children' | 'isPending'> {}

/**
 * The Button component allows users to trigger an action.
 *
 * @param props - The properties {@link ButtonProps} passed to the component.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const { variant, size, className, children, ...rest } = props;

  return (
    <RACButton {...rest} ref={ref} className={composeClassName(className, buttonVariants({ variant, size }))}>
      {typeof children === 'string' ? <RACText>{children}</RACText> : children}
    </RACButton>
  );
});

export interface LinkButtonProps extends BaseButtonProps, Omit<RACLinkProps, 'children'> {
  /** Whether the link is external. It will show an external icon if true. */
  isExternal?: boolean;
}

/**
 * A LinkButton is a link that looks like a button.
 *
 * @param props - The properties {@link LinkButtonProps} passed to the component.
 */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(props, ref) {
  const { variant, size, className, children, isExternal, ...rest } = props;

  return (
    <RACLink
      {...rest}
      ref={ref}
      className={composeClassName(className, buttonVariants({ variant, size }))}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {typeof children === 'string' ? <RACText>{children}</RACText> : children}
      {isExternal ? <Icon icon="window-new" /> : null}
    </RACLink>
  );
});
