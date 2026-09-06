import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { generateExamplesPlugin } from '../src/storybook/examples-plugin.ts';

const FIXTURES = path.join(__dirname, 'fixtures');
const README_REGEX = /README\.mdx$/;

/** Invokes the plugin's `load` hook with a stub Rollup plugin context. */
async function load(id: string): Promise<string | null> {
  const plugin = generateExamplesPlugin(README_REGEX);
  const context = { addWatchFile: vi.fn() };
  const hook = plugin.load as (this: unknown, id: string) => Promise<string | null>;
  return hook.call(context, id);
}

describe('examples-plugin', function examplesPluginTests() {
  it('ignores non-README ids', async function ignoresNonReadme() {
    expect(await load(path.join(FIXTURES, 'examples-fixture/widget.stories.tsx'))).toBeNull();
  });

  it('ignores READMEs without the marker', async function ignoresNoMarker() {
    expect(await load(path.join(FIXTURES, 'no-marker/README.mdx'))).toBeNull();
  });

  it('expands <Examples of={Stories.examples} /> into headings, stories, and inlined sources', async function expands() {
    const result = await load(path.join(FIXTURES, 'examples-fixture/README.mdx'));

    expect(result).not.toBeNull();
    expect(result).not.toContain('<Examples');
    expect(result).toContain('### Basic Usage');
    expect(result).toContain('<Story of={Stories.Default} inline />');
    expect(result).toContain('<Source code=');
    expect(result).toContain('language="tsx"');
    // The inlined source keeps the example code but drops its metadata JSDoc.
    expect(result).toContain('DefaultExample');
    expect(result).not.toContain('@order');
    expect(result).not.toContain('?raw');
    expect(result).toContain("import { Examples } from '@bento/storybook-addon-helpers/runtime';");
    // The expansion imports the doc blocks it emits, so the README author needn't.
    expect(result).toContain("import { Source, Story } from '@storybook/addon-docs/blocks';");
  });

  it('does not re-import doc blocks the README already imports', async function dedupesBlocksImport() {
    const result = await load(path.join(FIXTURES, 'examples-imports/README.mdx'));
    expect(result?.match(/from '@storybook\/addon-docs\/blocks'/g)).toHaveLength(1);
  });

  it('drops the marker when the component has no examples', async function noExamples() {
    const result = await load(path.join(FIXTURES, 'no-examples/README.mdx'));
    expect(result).not.toContain('<Examples');
    expect(result).not.toContain('<Source');
    // Nothing was emitted, so no blocks import is injected.
    expect(result).not.toContain('addon-docs/blocks');
  });
});
