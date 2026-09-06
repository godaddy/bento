import { createRef } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@godaddy/antares';

interface ExampleItem {
  id: string;
  label: string;
}

/**
 * Verifies generic collection props and forwarded refs for Tabs.
 * @ignore
 */
export function TypesExample() {
  const tabListRef = createRef<HTMLDivElement>();
  const tabPanelsRef = createRef<HTMLDivElement>();
  const items: ExampleItem[] = [
    { id: 'account', label: 'Account' },
    { id: 'billing', label: 'Billing' }
  ];

  return (
    <Tabs>
      <TabList<ExampleItem> ref={tabListRef} items={items} aria-label="Account settings">
        {(item) => <Tab id={item.id}>{item.label}</Tab>}
      </TabList>
      <TabPanels<ExampleItem> ref={tabPanelsRef} items={items}>
        {(item) => <TabPanel id={item.id}>{item.label} settings</TabPanel>}
      </TabPanels>
    </Tabs>
  );
}
