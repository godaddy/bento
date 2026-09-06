import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ForwardedRef,
  type ReactElement,
  type RefAttributes
} from 'react';
import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  TabPanels as RACTabPanels,
  Tabs as RACTabs,
  SelectionIndicator as RACSelectionIndicator,
  composeRenderProps,
  useLocale,
  type TabListProps as RACTabListProps,
  type TabPanelProps as RACTabPanelProps,
  type TabPanelsProps as RACTabPanelsProps,
  type TabProps as RACTabProps,
  type TabsProps as RACTabsProps
} from 'react-aria-components';
import { mergeRefs } from '@react-aria/utils';
import { Button } from '#components/button';
import { Box } from '#components/layout/box';
import { Icon } from '#components/icon';
import { Flex, type FlexProps } from '#components/layout/flex';
import { composeClassName } from '#utils/render-props.ts';
import styles from './index.module.css';
import { useTabsOverflow } from './use-tabs-overflow.ts';

/** Visual designs supported by the Tabs component. */
export type TabsDesign = 'underline' | 'manilla';

/** Accessible labels used by the tab overflow controls. */
export interface TabsOverflowLabels {
  /** Accessible label for the control that reveals previous tabs. */
  previous: string;
  /** Accessible label for the control that reveals next tabs. */
  next: string;
}

const defaultOverflowLabels: TabsOverflowLabels = {
  previous: 'Previous tabs',
  next: 'Next tabs'
};

/** Internal context shared by the Tabs compound components. */
interface TabsContextValue {
  /** Visual treatment applied to the tab group and its tabs. */
  readonly design: TabsDesign;

  /** Accessible labels used by the horizontal overflow controls. */
  readonly overflowLabels: TabsOverflowLabels;
}

const TabsContext = createContext<TabsContextValue>({
  design: 'underline',
  overflowLabels: defaultOverflowLabels
});

export interface TabsProps extends Omit<RACTabsProps, 'orientation'> {
  /** The visual treatment for the tab group. */
  design?: TabsDesign;

  /** Accessible labels for the previous and next overflow controls. Defaults to English labels. */
  overflowLabels?: TabsOverflowLabels;
}

/** Props for the tab list and its overflow controls. */
type TabListContainerProps = Omit<
  FlexProps<'div'>,
  'as' | 'children' | 'dir' | 'alignItems' | 'direction' | 'display' | 'wrap'
>;

export interface TabListProps<T> extends Omit<RACTabListProps<T>, 'orientation'> {
  /** Props for the outer tab list shell. */
  containerProps?: TabListContainerProps;
}

/** Props for an individual tab. */
export interface TabProps extends RACTabProps {}

/** Props for the group of tab panels. */
export type TabPanelsProps<T> = RACTabPanelsProps<T>;

/** Props for an individual tab panel. */
export interface TabPanelProps extends RACTabPanelProps {}

/**
 * Groups selectable tabs and adds automatic horizontal overflow controls.
 *
 * @param props - The properties {@link TabListProps} passed to the component.
 */
export const TabList = forwardRef(function TabList<T>(props: TabListProps<T>, ref: ForwardedRef<HTMLDivElement>) {
  const { className, containerProps, ...rest } = props;
  const { overflowLabels } = useContext(TabsContext);
  const { direction } = useLocale();
  const { shellRef, contentRef, viewportRef, state, scrollPrevious, scrollNext } = useTabsOverflow({
    isRTL: direction === 'rtl'
  });
  const mergedContentRef = useMemo(() => mergeRefs(contentRef, ref), [contentRef, ref]);

  return (
    <Flex
      {...containerProps}
      ref={shellRef}
      className={composeClassName(containerProps?.className, styles.listShell)}
      dir={direction}
      alignItems="flex-end"
    >
      <Box ref={viewportRef} className={styles.viewport}>
        <Flex
          {...rest}
          ref={mergedContentRef}
          as={RACTabList<T>}
          className={composeClassName(className, styles.list)}
        />
      </Box>
      {state.hasOverflow ? (
        <Flex className={styles.controls} flex="0 0 auto" alignItems="center" alignSelf="stretch">
          <Button
            className={styles.control}
            aria-label={overflowLabels.previous}
            isDisabled={!state.canScrollPrev}
            onPress={scrollPrevious}
            variant="minimal"
            size="md"
          >
            <Icon icon="chevron-left" width={16} height={16} />
          </Button>
          <Button
            className={styles.control}
            aria-label={overflowLabels.next}
            isDisabled={!state.canScrollNext}
            onPress={scrollNext}
            variant="minimal"
            size="md"
          >
            <Icon icon="chevron-right" width={16} height={16} />
          </Button>
        </Flex>
      ) : null}
    </Flex>
  );
}) as <T>(props: TabListProps<T> & RefAttributes<HTMLDivElement>) => ReactElement;

/**
 * Groups related tabs and their associated panels.
 *
 * Use Tabs for peer sections of content on the same page. For route navigation,
 * use the application's navigation component instead.
 *
 * @param props - The properties {@link TabsProps} passed to the component.
 * @example
 * ```tsx
 * <Tabs overflowLabels={{ previous: 'Previous tabs', next: 'Next tabs' }}>
 *   <TabList aria-label="Account settings">
 *     <Tab id="account">Account</Tab>
 *     <Tab id="billing">Billing</Tab>
 *   </TabList>
 *   <TabPanels>
 *     <TabPanel id="account">Account settings</TabPanel>
 *     <TabPanel id="billing">Billing settings</TabPanel>
 *   </TabPanels>
 * </Tabs>
 * ```
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  const { overflowLabels = defaultOverflowLabels, design = 'underline', className, ...rest } = props;
  return (
    <TabsContext.Provider value={{ design, overflowLabels }}>
      <Flex
        {...rest}
        ref={ref}
        as={RACTabs}
        direction="column"
        orientation="horizontal"
        className={composeClassName(className, styles.tabs)}
        data-design={design}
      />
    </TabsContext.Provider>
  );
});

/**
 * A selectable tab within a {@link TabList}.
 *
 * @param props - The properties {@link TabProps} passed to the component.
 */
export const Tab = forwardRef<HTMLDivElement, TabProps>(function Tab(props, ref) {
  const { className, ...rest } = props;
  const { design } = useContext(TabsContext);
  return (
    <RACTab {...rest} ref={ref} className={composeClassName(className, styles.tab)} data-design={design}>
      {composeRenderProps(props.children, (children) => (
        <>
          <Box as={RACSelectionIndicator} className={styles.indicator} data-design={design} />
          {children}
        </>
      ))}
    </RACTab>
  );
});

/**
 * Groups the panels associated with a {@link TabList}.
 *
 * @param props - The properties {@link TabPanelsProps} passed to the component.
 */
export const TabPanels = forwardRef(function TabPanels<T>(props: TabPanelsProps<T>, ref: ForwardedRef<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <RACTabPanels {...rest} ref={ref} className={composeClassName(className, styles.panels)} />;
}) as <T>(props: TabPanelsProps<T> & RefAttributes<HTMLDivElement>) => ReactElement;

/**
 * Displays the panel associated with the selected {@link Tab}.
 *
 * @param props - The properties {@link TabPanelProps} passed to the component.
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(props, ref) {
  const { className, ...rest } = props;
  return <Box {...rest} ref={ref} as={RACTabPanel} blockPadding="md" className={className} />;
});
