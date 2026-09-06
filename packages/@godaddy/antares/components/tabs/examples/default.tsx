import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@godaddy/antares';

/**
 * Switch between peer sections of content on the same page.
 * @order 1
 */
export function DefaultExample() {
  return (
    <Tabs>
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
  );
}
