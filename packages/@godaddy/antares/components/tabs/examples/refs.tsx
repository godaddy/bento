import type { CSSProperties, Ref } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@godaddy/antares';

interface RefsExampleProps {
  tabsRef?: Ref<HTMLDivElement>;
  tabListRef?: Ref<HTMLDivElement>;
  tabRef?: Ref<HTMLDivElement>;
  tabPanelsRef?: Ref<HTMLDivElement>;
  tabPanelRef?: Ref<HTMLDivElement>;
  tabListClassName?: string;
  tabListStyle?: CSSProperties;
  tabListContainerProps?: { className?: string; style?: CSSProperties; dir?: 'ltr' | 'rtl'; alignItems?: 'flex-start' };
}

/**
 * Provides refs for each public Tabs component to verify their forwarded targets.
 * @ignore
 */
export function RefsExample({
  tabsRef,
  tabListRef,
  tabRef,
  tabPanelsRef,
  tabPanelRef,
  tabListClassName,
  tabListStyle,
  tabListContainerProps
}: RefsExampleProps) {
  return (
    <Tabs ref={tabsRef}>
      <TabList
        ref={tabListRef}
        aria-label="Account settings"
        className={tabListClassName}
        style={tabListStyle}
        containerProps={tabListContainerProps}
      >
        <Tab ref={tabRef} id="account">
          Account
        </Tab>
        <Tab id="billing">Billing</Tab>
      </TabList>
      <TabPanels ref={tabPanelsRef}>
        <TabPanel ref={tabPanelRef} id="account">
          Account settings
        </TabPanel>
        <TabPanel id="billing">Billing settings</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
