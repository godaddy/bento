import type { Ref } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, type TabsOverflowLabels } from '@godaddy/antares';

interface OverflowExampleProps {
  maxWidth?: string;
  overflowLabels?: TabsOverflowLabels;
  tabListRef?: Ref<HTMLDivElement>;
}

/**
 * When the tab strip is narrower than its content, the group adds controls that move one tab at a time.
 * @order 5
 */
export function OverflowExample({ maxWidth = '320px', overflowLabels, tabListRef }: OverflowExampleProps) {
  return (
    <Tabs overflowLabels={overflowLabels} style={{ width: maxWidth, maxWidth }}>
      <TabList ref={tabListRef} aria-label="Product settings">
        <Tab id="overview">Overview</Tab>
        <Tab id="availability">Availability</Tab>
        <Tab id="shipping">Shipping</Tab>
        <Tab id="returns">Returns</Tab>
        <Tab id="notifications">Notifications</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="overview">Overview</TabPanel>
        <TabPanel id="availability">Availability</TabPanel>
        <TabPanel id="shipping">Shipping</TabPanel>
        <TabPanel id="returns">Returns</TabPanel>
        <TabPanel id="notifications">Notifications</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
