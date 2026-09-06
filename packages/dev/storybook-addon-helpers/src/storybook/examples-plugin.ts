import type { Plugin } from 'vite';
import { readFile } from 'node:fs/promises';
import { discoverExamplesForReadme, type ExampleDescriptor } from '../examples.ts';

/** Matches the imported `<Examples of={Stories.<name>} />` marker authored in a component README. */
const EXAMPLES_MARKER = /<Examples\b[^>]*\/>/;
/** Extracts the export name from an `of={Stories.<name>}` attribute on the marker. */
const OF_ATTR = /\bof=\{\s*[\w$]+\.([\w$]+)\s*\}/;
/** Doc blocks the expansion emits; imported for the author so `<Examples>` stays self-contained. */
const BLOCKS_MODULE = '@storybook/addon-docs/blocks';
const REQUIRED_BLOCKS = ['Source', 'Story'];

/**
 * Vite plugin that expands the imported `<Examples of={Stories.<name>} />` marker in a
 * component README into one documented block per example (heading, JSDoc
 * description, `<Story>` preview, and raw `<Source>`). The examples are resolved
 * by following the `of` reference to the colocated stories file and its
 * `getExamples(<dir>)` folder, via the shared {@link discoverExamplesForReadme}
 * core.
 *
 * Storybook's `addon-docs` MDX pipeline does not expose the README's file path to
 * remark plugins, and it compiles the MDX to JS during Vite's `load` phase. The
 * expansion is therefore done here in a `load` hook (registered ahead of the MDX
 * loader) that reads the raw README, expands the marker, and hands the result
 * back for normal MDX compilation. The generated blocks reference the CSF stories
 * produced from the same examples (`Stories.<Name>`), so Storybook's sidebar and
 * docs stay in sync.
 *
 * @param readmeRegex - Matches the README files to expand.
 */
export function generateExamplesPlugin(readmeRegex: RegExp): Plugin {
  return {
    name: 'bento-storybook-addon-helpers-examples',
    enforce: 'pre',
    async load(id) {
      if (!readmeRegex.test(id)) return null;

      const code = await readFile(id, 'utf8');
      const marker = code.match(EXAMPLES_MARKER);
      if (!marker) return null;

      this.addWatchFile(id);

      const exportName = marker[0].match(OF_ATTR)?.[1];
      const { descriptors, storiesPath } = await discoverExamplesForReadme({ readmePath: id, exportName });
      if (storiesPath) this.addWatchFile(storiesPath);

      const blocks = descriptors.map((descriptor) => {
        this.addWatchFile(descriptor.filePath);
        return renderBlock(descriptor);
      });

      const expanded = code.replace(EXAMPLES_MARKER, blocks.join('\n\n'));
      return blocks.length > 0 ? ensureBlocksImport(expanded) : expanded;
    }
  };
}

/**
 * Injects the `<Source>`/`<Story>` import the expansion relies on, adding only the
 * names not already imported. This keeps `<Examples>` self-contained so authors
 * import just the blocks they write themselves (`Meta`, `ArgTypes`, ...).
 */
function ensureBlocksImport(code: string): string {
  const missing = REQUIRED_BLOCKS.filter((name) => !importsBinding(code, name));
  if (missing.length === 0) return code;

  const importLine = `import { ${missing.join(', ')} } from '${BLOCKS_MODULE}';\n`;
  // Insert after frontmatter when present (index 0 otherwise), since it must stay first.
  const end = code.match(/^---\n[\s\S]*?\n---\n/)?.[0].length ?? 0;
  return `${code.slice(0, end)}${importLine}${code.slice(end)}`;
}

/** Whether `name` is already bound by an existing `import ... from '...'` statement. */
function importsBinding(code: string, name: string): boolean {
  const word = new RegExp(`\\b${name}\\b`);
  return (code.match(/import\b[\s\S]*?from\s*['"][^'"]+['"]/g) ?? []).some((statement) => word.test(statement));
}

/** Renders one example as MDX: heading, description, `<Story>`, and inlined `<Source>`. */
function renderBlock(descriptor: ExampleDescriptor): string {
  const parts = [`### ${descriptor.title}`];
  if (descriptor.description) parts.push(descriptor.description);
  parts.push(`<Story of={Stories.${descriptor.storyName}} inline />`);
  parts.push(`<Source code={${JSON.stringify(descriptor.source)}} language="tsx" />`);
  return parts.join('\n\n');
}
