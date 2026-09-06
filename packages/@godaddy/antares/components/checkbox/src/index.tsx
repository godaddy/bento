import type { ReactNode } from 'react';
import {
  CheckboxButton as RACCheckboxButton,
  CheckboxField as RACCheckboxField,
  type CheckboxFieldProps as RACCheckboxFieldProps,
  CheckboxGroup as RACCheckboxGroup,
  type CheckboxGroupProps as RACCheckboxGroupProps
} from 'react-aria-components';
import { Field, FieldDescription, FieldError, FieldLabel, type FieldOwnProps } from '#components/field';
import { Flex, type FlexOwnProps } from '#components/layout/flex';
import { Icon } from '#components/icon';
import { cx } from 'cva';
import { composeClassName } from '#utils/render-props.ts';
import styles from './index.module.css';

export interface CheckboxIndicatorProps {
  /** Whether the control is selected. */
  isSelected?: boolean;
  /** Whether the control is in an indeterminate state. */
  isIndeterminate?: boolean;
  /** Additional CSS class for the indicator. */
  className?: string;
}

/**
 * Presentational checkbox indicator: the box plus its check/minus glyph.
 *
 * Decorative by default (`aria-hidden`) - the surrounding control owns
 * interaction and accessibility. It carries its own `data-selected` /
 * `data-indeterminate` so it renders correctly outside an interactive
 * `Checkbox` (e.g. as a selection indicator inside a menu item).
 *
 * @param props - {@link CheckboxIndicatorProps}
 */
export function CheckboxIndicator({ isSelected, isIndeterminate, className }: CheckboxIndicatorProps) {
  return (
    <Flex
      aria-hidden="true"
      alignItems="center"
      justifyContent="center"
      data-selected={isSelected || undefined}
      data-indeterminate={isIndeterminate || undefined}
      className={cx(styles.indicator, className)}
    >
      {isIndeterminate ? (
        <Icon icon="minus" className={styles.indeterminateIcon} aria-hidden="true" />
      ) : (
        isSelected && <Icon icon="checkmark" className={styles.selectedIcon} aria-hidden="true" />
      )}
    </Flex>
  );
}

export interface CheckboxProps extends Omit<RACCheckboxFieldProps, 'children'>, FlexOwnProps {
  /** The content of the checkbox label. */
  children?: ReactNode;
}

/**
 * Antares Checkbox component. Renders a checkbox input with an associated label.
 *
 * @param props - {@link CheckboxProps}
 */
export function Checkbox(props: CheckboxProps) {
  const { children, ...rest } = props;
  return (
    <Flex {...rest} as={RACCheckboxField}>
      <Flex as={RACCheckboxButton} className={styles.checkbox}>
        {function renderCheckbox({ isSelected, isIndeterminate }) {
          return (
            <Flex alignItems="center" gap="sm">
              <CheckboxIndicator isSelected={isSelected} isIndeterminate={isIndeterminate} />
              {children}
            </Flex>
          );
        }}
      </Flex>
    </Flex>
  );
}

export interface CheckboxGroupProps extends RACCheckboxGroupProps, FieldOwnProps {
  /** The checkboxes within the group. */
  children?: ReactNode;

  /** Layout orientation of the checkboxes. @default 'vertical' */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Antares CheckboxGroup component. Renders a group meant to hold checkboxes with shared state.
 *
 * @param props - {@link CheckboxGroupProps}
 */
export function CheckboxGroup({
  children,
  className,
  errorMessage,
  label,
  orientation = 'vertical',
  description,
  ...rest
}: CheckboxGroupProps) {
  return (
    <Field as={RACCheckboxGroup} {...rest} className={composeClassName(className, styles.checkboxGroup)}>
      <FieldLabel isRequired={rest.isRequired}>{label}</FieldLabel>
      <Flex
        direction={orientation === 'horizontal' ? 'row' : 'column'}
        gap={orientation === 'horizontal' ? 'lg' : 'md'}
      >
        {children}
      </Flex>
      <FieldDescription>{description}</FieldDescription>
      <FieldError>{errorMessage}</FieldError>
    </Field>
  );
}
