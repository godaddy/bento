'use client';
import { getComponentDocs, getExamples, getMeta, getStory } from '@bento/storybook-addon-helpers';
import { PlaygroundExample } from './examples/tabs-playground.tsx';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from './src/index.tsx';

export default getMeta({ title: 'components/Tabs' });

export const Props = getComponentDocs(Tabs);
export const TabListProps = getComponentDocs(TabList);
export const TabProps = getComponentDocs(Tab);
export const TabPanelsProps = getComponentDocs(TabPanels);
export const TabPanelProps = getComponentDocs(TabPanel);

export const Examples = getExamples('./examples');

export const Playground = getStory(PlaygroundExample, {
  args: {
    design: 'underline',
    keyboardActivation: 'automatic'
  },
  argTypes: {
    design: {
      control: 'radio',
      options: ['underline', 'manilla'],
      description: 'Visual treatment for the tab group'
    },
    keyboardActivation: {
      control: 'radio',
      options: ['automatic', 'manual'],
      description: 'Whether keyboard focus activates a tab immediately'
    }
  }
});
