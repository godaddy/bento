import {
  Header as RACHeader,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  MenuSection as RACMenuSection,
  MenuTrigger as RACMenuTrigger,
  Separator as RACSeparator,
  SubmenuTrigger as RACSubmenuTrigger,
  type MenuItemProps as RACMenuItemProps,
  type MenuItemRenderProps as RACMenuItemRenderProps,
  type MenuProps as RACMenuProps,
  type MenuSectionProps as RACMenuSectionProps,
  type MenuTriggerProps as RACMenuTriggerProps,
  type SeparatorProps as RACSeparatorProps,
  type SubmenuTriggerProps as RACSubmenuTriggerProps,
  type Selection as RACSelection
} from 'react-aria-components';
import type { ReactElement, ReactNode } from 'react';
import { cx } from 'cva';
import styles from './index.module.css';
import { composeClassName, composeStyle } from '#utils/render-props.ts';
import { Popover, type PopoverProps } from '#components/popover';
import { Text } from '#components/text';
import { Icon } from '#components/icon';
import { CheckboxIndicator } from '#components/checkbox';
import { Flex, type FlexOwnProps } from '#components/layout/flex';

export interface MenuTriggerProps extends Omit<RACMenuTriggerProps, 'children'> {
  /** Additional props forwarded to the underlying `Popover`. */
  popoverProps?: Omit<PopoverProps, 'children'>;

  /** Exactly two children: the trigger element and the `Menu`. */
  children: [trigger: ReactElement, menu: ReactElement];
}

/**
 * Wraps a trigger element and a `Menu`, rendering the menu inside our `Popover`.
 *
 * @param props - {@link MenuTriggerProps}
 */
export function MenuTrigger({ popoverProps, children, ...props }: MenuTriggerProps) {
  const [trigger, menu] = children;
  return (
    <RACMenuTrigger {...props}>
      {trigger}
      <MenuPopover {...popoverProps}>{menu}</MenuPopover>
    </RACMenuTrigger>
  );
}

export interface MenuProps<T> extends FlexOwnProps, RACMenuProps<T> {
  /** Size variant for the menu and its items. @default 'md' */
  size?: 'sm' | 'md';
}

/**
 * The menu container. Provides keyboard navigation and selection via RAC.
 * Usable inside a `MenuTrigger` or standalone (e.g. inside a `Drawer`).
 *
 * @param props - {@link MenuProps}
 */
export function Menu<T extends object>({ className, size = 'md', children, ...props }: MenuProps<T>) {
  return (
    <Flex
      {...props}
      as={RACMenu<T>}
      direction="column"
      data-size={size}
      className={composeClassName(className, styles.menu)}
    >
      {children}
    </Flex>
  );
}

export interface MenuGroupProps<T extends object> extends FlexOwnProps, Omit<RACMenuSectionProps<T>, 'children'> {
  /** Optional group title, rendered as the section header. Accepts any node. */
  label?: ReactNode;

  /** The items within the group. */
  children?: ReactNode;
}

/**
 * Groups related menu items under an optional title. Selection is scoped to the
 * group: set `selectionMode="multiple"` (plus `selectedKeys` /
 * `onSelectionChange`) to turn its items into checkboxes while other groups stay
 * plain action items.
 *
 * @param props - {@link MenuGroupProps}
 */
export function MenuGroup<T extends object>({ label, className, children, ...props }: MenuGroupProps<T>) {
  return (
    <Flex {...props} as={RACMenuSection<T>} className={cx(styles.group, className)}>
      {label == null ? null : <RACHeader className={styles.groupLabel}>{label}</RACHeader>}
      {children}
    </Flex>
  );
}

export interface MenuItemProps extends FlexOwnProps, Omit<RACMenuItemProps, 'children'> {
  /** Leading icon rendered before the label. */
  icon?: ReactNode;

  /** The item label (a string is wrapped for typeahead) or custom content. */
  children?: ReactNode;
}

/**
 * A menu item. Renders a leading `icon` (optional), a label, an automatic
 * multi-select checkbox indicator when its group has `selectionMode="multiple"`,
 * and a submenu chevron when nested in a `SubmenuTrigger`.
 *
 * @param props - {@link MenuItemProps}
 */
export function MenuItem({ icon, children, className, ...props }: MenuItemProps) {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined);

  return (
    <Flex
      alignItems="center"
      {...props}
      as={RACMenuItem}
      textValue={textValue}
      className={composeClassName(className, styles.item)}
    >
      {({ hasSubmenu, isSelected, selectionMode }: RACMenuItemRenderProps) => (
        <>
          {selectionMode === 'multiple' ? (
            <CheckboxIndicator isSelected={isSelected} className={styles.indicator} />
          ) : null}
          {icon == null ? null : icon}
          {typeof children === 'string' ? <Text className={styles.label}>{children}</Text> : children}
          {hasSubmenu ? <Icon icon="chevron-right" /> : null}
        </>
      )}
    </Flex>
  );
}

export interface SubmenuTriggerProps extends RACSubmenuTriggerProps {
  /** Additional props forwarded to the underlying `Popover`. */
  popoverProps?: Omit<PopoverProps, 'children'>;

  /** Exactly two children: the parent `MenuItem` and the submenu `Menu`. */
  children: [trigger: ReactElement, menu: ReactElement];
}

/**
 * Creates a nested submenu that opens from a `MenuItem`. Takes exactly two
 * children: the parent `MenuItem` and the submenu `Menu` (wrapped in a
 * `Popover` automatically).
 *
 * @param props - {@link SubmenuTriggerProps}
 */
export function SubmenuTrigger({ popoverProps, children, ...props }: SubmenuTriggerProps) {
  const [trigger, menu] = children;

  return (
    <RACSubmenuTrigger {...props}>
      {trigger}
      <MenuPopover {...popoverProps}>{menu}</MenuPopover>
    </RACSubmenuTrigger>
  );
}

export interface MenuSeparatorProps extends RACSeparatorProps {}

/**
 * A visual divider between menu items or groups.
 *
 * @param props - {@link MenuSeparatorProps}
 */
export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <RACSeparator {...props} className={cx(styles.separator, className)} />;
}

/**
 * A popover for a menu.
 *
 * @param props - {@link PopoverProps}
 */
function MenuPopover({ containerProps, className, ...props }: PopoverProps) {
  return (
    <Popover
      hideArrow
      aria-label="Menu"
      {...props}
      className={composeClassName(className, styles.menuPopover)}
      containerProps={{
        ...containerProps,
        style: composeStyle(containerProps?.style, { borderWidth: 0 })
      }}
    />
  );
}

/** Selection type for a menu. */
export type { RACSelection as Selection };
