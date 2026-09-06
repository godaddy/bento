import {
  ListBox as RACListBox,
  type ListBoxProps as RACListBoxProps,
  ListBoxItem as RACListBoxItem,
  type ListBoxItemProps as RACListBoxItemProps,
  type Key as RACKey
} from 'react-aria-components';
import { Flex, type FlexOwnProps } from '#components/layout/flex';
import { composeClassName } from '#utils/render-props.ts';
import styles from './index.module.css';

export interface ListBoxProps<T> extends RACListBoxProps<T>, FlexOwnProps {}

/**
 * Antares ListBox. A selectable collection of items built on React Aria's ListBox,
 * laid out as a vertical Flex column. Use directly for inline pickers, palettes, or
 * non-popover lists; Select composes this internally.
 *
 * @typeParam T - Item type rendered inside the listbox.
 *
 * @example
 * ```tsx
 * <ListBox aria-label="Coffee" selectionMode="single">
 *   <ListBoxItem id="espresso">Espresso</ListBoxItem>
 *   <ListBoxItem id="latte">Latte</ListBoxItem>
 * </ListBox>
 * ```
 */
export function ListBox<T>(props: ListBoxProps<T>) {
  const { children, ...rest } = props;
  return (
    <Flex direction="column" gap="xs" {...rest} as={RACListBox<T>}>
      {children}
    </Flex>
  );
}

export interface ListBoxItemProps extends RACListBoxItemProps, FlexOwnProps {}

/**
 * One option inside a ListBox. Auto-derives `textValue` from string children when not
 * provided so typeahead works without extra props.
 */
export function ListBoxItem(props: ListBoxItemProps) {
  const { textValue, children, className, ...rest } = props;
  return (
    <Flex
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      padding="md"
      {...rest}
      as={RACListBoxItem}
      className={composeClassName(className, styles.item)}
    >
      {children}
    </Flex>
  );
}

export type ListBoxKey = RACKey;
