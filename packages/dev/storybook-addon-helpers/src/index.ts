import type { StorybookConfig } from '@storybook/react-vite';
import type { Indexer } from 'storybook/internal/types';
import { generateCSFPlugin } from './storybook/plugin.ts';
import { generateExamplesPlugin } from './storybook/examples-plugin.ts';
import { storiesIndexer } from './storybook/stories-indexer.ts';
import type { StorybookHelpersOptions } from './types.ts';
export { toStorybookArgTypes } from './storybook/arg-types.ts';
export type { StorybookDocs } from './storybook/arg-types.ts';
export * from './storybook/getters.ts';
export { Examples } from './storybook/examples-marker.ts';
export type { ExamplesProps } from './storybook/examples-marker.ts';
export { processPropsDoc } from './process.ts';
export type * from './types.ts';

const STORIES_FILE_REGEX = /\.stories\.tsx$/;
const README_FILE_REGEX = /README\.mdx$/;

/**
 * Adds the custom stories indexer to the existing indexers.
 */
export const experimental_indexers: StorybookConfig['experimental_indexers'] = async function experimentalIndexers(
  existingIndexers?: Indexer[]
) {
  const customIndexer: Indexer = {
    test: STORIES_FILE_REGEX,
    createIndex: storiesIndexer
  };

  if (!existingIndexers) {
    return [customIndexer];
  }

  return [customIndexer, ...existingIndexers];
};

/**
 * Adds the plugin to the Storybook config.
 */
export const viteFinal: StorybookConfig['viteFinal'] = async function viteFinal(config, options) {
  const docsDefaults = (options as StorybookHelpersOptions | undefined)?.docsDefaults;
  config.plugins ??= [];
  // Unshifted so its `load` hook runs before addon-docs' MDX loader compiles the README.
  config.plugins.unshift(generateExamplesPlugin(README_FILE_REGEX));
  config.plugins.push(generateCSFPlugin(STORIES_FILE_REGEX, docsDefaults));
  return config;
};
