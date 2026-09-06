import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@godaddy/antares';
import { useState } from 'react';

/**
 * Control the selected panel from application state.
 * @order 2
 */
export function ControlledExample() {
  const [selectedKey, setSelectedKey] = useState('billing');

  return (
    <>
      <Tabs selectedKey={selectedKey} onSelectionChange={(key) => setSelectedKey(String(key))}>
        <TabList aria-label="Account settings">
          <Tab id="account">Account</Tab>
          <Tab id="billing">Billing</Tab>
          <Tab id="security">Security</Tab>
        </TabList>
        <TabPanels>
          <TabPanel id="account">Account settings</TabPanel>
          <TabPanel id="billing">Billing settings</TabPanel>
          <TabPanel id="security">Security settings</TabPanel>
        </TabPanels>
      </Tabs>
      <p>Current selection: {selectedKey}</p>
    </>
  );
}
