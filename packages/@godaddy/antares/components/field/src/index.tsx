import { cx } from 'cva';
import { type ElementType, forwardRef, type ReactNode, useContext } from 'react';
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
  FieldError as RACFieldError,
  FieldErrorContext as RACFieldErrorContext,
  type FieldErrorProps as RACFieldErrorProps,
  SelectValue as RACSelectValue,
  Group as RACGroup,
  Input as RACInput,
  type InputProps as RACInputProps,
  Label as RACLabel,
  type LabelProps as RACLabelProps,
  type GroupProps as RACGroupProps,
  TextArea as RACTextArea,
  type TextAreaProps as RACTextAreaProps
} from 'react-aria-components';
import type { PolymorphicComponent, PolymorphicProps, PolymorphicRef } from '#types/polymorphic-react.ts';
import { composeClassName } from '#utils/render-props.ts';
import { Box, type BoxOwnProps } from '#components/layout/box';
import { Flex, type FlexOwnProps } from '#components/layout/flex';
import { Icon } from '#components/icon';
import { Text, type TextProps } from '#components/text';
import styles from './index.module.css';

export interface FieldOwnProps extends FlexOwnProps {
  /** Label text shown above the field. */
  label?: ReactNode;

  /** Helper text shown below the field. */
  description?: ReactNode;

  /** Error message shown when the field is invalid. Forwarded to {@link FieldError}. */
  errorMessage?: RACFieldErrorProps['children'];
}

export type FieldProps<C extends ElementType = 'div'> = PolymorphicProps<C, FieldOwnProps>;

/**
 * Presentational vertical stack for a single field. Pass `as={RACTextField}` (or another RAC field
 * wrapper) to merge the field's RAC provider and context plumbing.
 *
 * @param props - {@link FieldProps}
 *
 * @example
 * <Field as={RACTextField} {...fieldProps}>
 *   <FieldLabel>Email</FieldLabel>
 *   <FieldGroup>
 *     <FieldInput />
 *     <FieldButton>Verify</FieldButton>
 *   </FieldGroup>
 *   <FieldDescription>We won't share it.</FieldDescription>
 *   <FieldError />
 * </Field>
 */
export const Field = forwardRef(function Field(props: FieldProps<ElementType>, ref: PolymorphicRef<ElementType>) {
  const { as, gap = 'sm', className, ...rest } = props;

  return (
    <Flex
      direction="column"
      gap={gap}
      {...rest}
      as={as}
      ref={ref}
      className={composeClassName(className, styles.field)}
    />
  );
}) as PolymorphicComponent<FieldOwnProps>;

export interface FieldLabelProps extends RACLabelProps {
  /** When true, renders a required indicator (`*`) after the label text. */
  isRequired?: boolean;
}

/**
 * Field label with an optional required indicator.
 *
 * @param props - {@link FieldLabelProps}
 */
export function FieldLabel(props: FieldLabelProps) {
  const { isRequired, children, className, ...rest } = props;

  if (!children) {
    return null;
  }

  return (
    <RACLabel {...rest} className={cx(styles.fieldLabel, className)}>
      {children}
      {isRequired && <span className={styles.fieldLabelRequired}> *</span>}
    </RACLabel>
  );
}

export interface FieldDescriptionProps extends Omit<TextProps, 'as' | 'slot'> {}

/**
 * Field description text, associated with the field via `slot="description"`.
 *
 * @param props - {@link FieldDescriptionProps}
 */
export function FieldDescription(props: FieldDescriptionProps) {
  const { children, className, ...rest } = props;

  if (!children) {
    return null;
  }

  return (
    <Text {...rest} slot="description" className={cx(styles.fieldDescription, className)}>
      {children}
    </Text>
  );
}

export interface FieldErrorProps extends RACFieldErrorProps {}

/**
 * Field error message; renders only when the field is invalid.
 *
 * @param props - {@link FieldErrorProps}
 */
export function FieldError(props: FieldErrorProps) {
  const { className, ...rest } = props;
  return <RACFieldError {...rest} className={composeClassName(className, styles.fieldError)} />;
}

export type FieldSize = 'sm' | 'md';

export interface FieldGroupProps extends RACGroupProps, FlexOwnProps {
  /** Size for the control fields inside the group. @default 'md' */
  size?: FieldSize;
}

/**
 * Presentational bordered, elevated control box for boxed fields (TextField, NumberField, Select,
 * DateField, and composite fields).
 *
 * @param props - {@link FieldGroupProps}
 * @param ref - Ref for the root Group DOM node.
 */
export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(function FieldGroup(props, ref) {
  const { className, gap, isInvalid, size, ...rest } = props;

  // RAC fields publish their runtime validation state (e.g. native validation on form
  // submit) through FieldErrorContext, not as a prop. Fall back to it so the box turns
  // invalid alongside the FieldError, while an explicit isInvalid prop still wins.
  const validation = useContext(RACFieldErrorContext);
  const isInvalidResolved = isInvalid ?? validation?.isInvalid;

  return (
    <Flex
      direction="row"
      wrap="nowrap"
      alignSelf="stretch"
      alignItems="stretch"
      elevation="card"
      gap={gap}
      isInvalid={isInvalidResolved}
      data-size={size === 'sm' ? 'sm' : undefined}
      {...rest}
      as={RACGroup}
      ref={ref}
      className={composeClassName(className, styles.fieldGroup)}
    />
  );
});

export interface FieldButtonProps extends RACButtonProps, FlexOwnProps {}

/**
 * Control button inside a `FieldGroup` (NumberField steppers,
 * Select trigger, search submit, etc.).
 *
 * @param props - {@link FieldButtonProps}
 */
export const FieldButton = forwardRef<HTMLButtonElement, FieldButtonProps>(function FieldButton(props, ref) {
  const { className, ...rest } = props;

  return (
    <Flex
      alignItems="center"
      {...rest}
      as={RACButton}
      ref={ref}
      className={composeClassName(className, styles.fieldButton)}
    />
  );
});

export interface FieldTriggerProps extends RACButtonProps, FlexOwnProps {
  /**
   * Visual flavor. `select` is transparent and input-like (standalone Select, DatePicker);
   * `control` is filled, for a control segment inside a shared group.
   * @default 'control'
   */
  variant?: 'control' | 'select';
}

/**
 * Value-display trigger button inside a `FieldGroup`: arbitrary children (a value area plus a
 * trailing icon) laid out full-width. Participates in `FieldGroup` sizing and corner rounding.
 * Used by `FieldSelectFragment` (Select) and by DatePicker.
 *
 * @param props - {@link FieldTriggerProps}
 */
export const FieldTrigger = forwardRef<HTMLButtonElement, FieldTriggerProps>(function FieldTrigger(props, ref) {
  const { className, variant = 'control', ...rest } = props;

  return (
    <Flex
      alignItems="center"
      gap="sm"
      flex={1}
      {...rest}
      as={RACButton}
      data-variant={variant}
      ref={ref}
      className={composeClassName(className, styles.fieldTrigger)}
    />
  );
});

export interface FieldSelectFragmentProps extends FieldTriggerProps {}

/**
 * Trigger button for a `Select`: shows the current value plus a chevron. Renders only the
 * button — it brings no Select provider or popover, so a composer supplies those around it.
 *
 * **Must render inside a `RACSelect` (React Aria `Select`) ancestor.** The current value is read
 * from Select context via React Aria's `SelectValue`; with no Select ancestor it renders empty.
 *
 * @param props - {@link FieldSelectFragmentProps}
 */
export function FieldSelectFragment(props: FieldSelectFragmentProps) {
  const { className, ...rest } = props;

  return (
    <FieldTrigger {...rest} className={composeClassName(className, styles.fieldSelectFragment)}>
      <Box as={RACSelectValue} className={styles.fieldSelectFragmentValue} flex={1} />
      <Icon icon="chevron-down" />
    </FieldTrigger>
  );
}

export interface FieldInputProps extends RACInputProps, BoxOwnProps {}

/**
 * Fill input inside a `FieldGroup`.
 *
 * @param props - {@link FieldInputProps}
 */
export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(function FieldInput(props, ref) {
  const { className, ...rest } = props;

  return <Box flex={1} {...rest} as={RACInput} ref={ref} className={composeClassName(className, styles.fieldInput)} />;
});

export interface FieldTextAreaProps extends RACTextAreaProps, BoxOwnProps {}

/**
 * Multiline fill control inside a `FieldGroup`.
 *
 * @param props - {@link FieldTextAreaProps}
 */
export const FieldTextArea = forwardRef<HTMLTextAreaElement, FieldTextAreaProps>(function FieldTextArea(props, ref) {
  const { className, ...rest } = props;

  return (
    <Box flex={1} {...rest} as={RACTextArea} ref={ref} className={composeClassName(className, styles.fieldTextarea)} />
  );
});
