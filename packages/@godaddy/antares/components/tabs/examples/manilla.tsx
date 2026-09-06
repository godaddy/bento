import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@godaddy/antares';

/**
 * Use the folder-style Manilla treatment for document-oriented sections.
 * @order 4
 */
export function ManillaExample() {
  return (
    <Tabs design="manilla">
      <TabList aria-label="Documents">
        <Tab id="recent">Recent</Tab>
        <Tab id="shared">Shared</Tab>
        <Tab id="archived">Archived</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="recent">Recent documents</TabPanel>
        <TabPanel id="shared">Shared documents</TabPanel>
        <TabPanel id="archived">Archived documents</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
