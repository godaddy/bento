import { discoverExamplesForReadme, type ExampleDescriptor } from './examples.ts';

/**
 * How the expansion references each example's preview. `stories` references
 * generated CSF `Stories` exports already imported by the README (as a
 * Storybook-driven README would); `components` imports each example
 * component directly, for pipelines - like the fumadocs docs site - whose
 * build never runs the CSF transform.
 */
export type RemarkExamplesTarget = 'stories' | 'components';

export interface RemarkExamplesOptions {
  /** Which documentation pipeline is expanding `<Examples />`. */
  target: RemarkExamplesTarget;
  /**
   * Registers an example file as a build dependency so edits trigger a rebuild.
   * Apps pass their own implementation (e.g. `addMdxDependency`).
   */
  onDependency?: (file: RemarkFile, path: string) => void;
  /** Parses a description into mdast blocks. Without it, descriptions stay literal text. */
  parseMarkdown?: (markdown: string) => { type: string }[];
}

/** Minimal mdast node shape - avoids pulling mdast/unified type deps into this package. */
interface MdNode {
  type: string;
  [key: string]: unknown;
}

interface MdRoot {
  type: 'root';
  children: MdNode[];
}

interface RemarkFile {
  path?: string;
  data: Record<string, unknown>;
}

type Estree = Record<string, unknown>;

const EXAMPLES_ELEMENT = 'Examples';
/** Doc blocks the expansion emits; imported for the author so `<Examples>` stays self-contained. */
const BLOCKS_MODULE = '@storybook/addon-docs/blocks';
const REQUIRED_BLOCKS = ['Source', 'Story'];

/**
 * Remark plugin that expands an imported `<Examples of={Stories.<name>} />` node into a
 * live-rendered, documented example per file discovered by following that
 * reference to the colocated stories file and its `getExamples(<dir>)` folder
 * (via the shared {@link discoverExamplesForReadme} core). For each example it
 * emits an `### Title` heading, an optional description paragraph, a `<Story>`
 * preview, and a `<Source>` code block.
 *
 * The two targets differ only in how the preview is referenced:
 * - `stories`: `<Story of={Stories.X} inline />` (uses the README's existing
 *   `import * as Stories`).
 * - `components`: `<Story of={XExample} />` plus a prepended direct import,
 *   for pipelines that cannot consume the CSF-generated `Stories` exports.
 *
 * READMEs without an `<Examples />` node are left untouched.
 */
export function remarkExamples(options: RemarkExamplesOptions) {
  return async function transform(tree: MdRoot, file: RemarkFile): Promise<void> {
    if (!file.path) return;

    const index = tree.children.findIndex(isExamplesNode);
    if (index === -1) return;

    const exportName = examplesOfName(tree.children[index]);
    const { descriptors, storiesPath } = await discoverExamplesForReadme({ readmePath: file.path, exportName });
    if (storiesPath) options.onDependency?.(file, storiesPath);

    const blocks: MdNode[] = [];
    const imports: MdNode[] = [];

    for (const descriptor of descriptors) {
      options.onDependency?.(file, descriptor.filePath);

      blocks.push(headingNode(descriptor.title));
      if (descriptor.description) blocks.push(...descriptionNodes(descriptor.description, options.parseMarkdown));
      blocks.push(storyNode(descriptor, options.target));
      blocks.push(sourceNode(descriptor.source));

      if (options.target === 'components') {
        imports.push(esmImportNode([descriptor.componentExportName], descriptor.importPath));
      }
    }

    // The `components` target renders the examples directly, so it also needs the doc
    // blocks the expansion emits. `stories` resolves those via the README's own imports.
    if (options.target === 'components' && descriptors.length > 0) {
      const missing = REQUIRED_BLOCKS.filter((name) => !treeImportsBinding(tree, name));
      if (missing.length > 0) imports.push(esmImportNode(missing, BLOCKS_MODULE));
    }

    tree.children.splice(index, 1, ...blocks);
    if (imports.length > 0) tree.children.unshift(...imports);
  };
}

/** Whether an existing top-level import in the tree already binds `name`. */
function treeImportsBinding(tree: MdRoot, name: string): boolean {
  const word = new RegExp(`\\b${name}\\b`);
  return tree.children.some((node) => node.type === 'mdxjsEsm' && word.test(String(node.value)));
}

function isExamplesNode(node: MdNode): boolean {
  return node.type === 'mdxJsxFlowElement' && node.name === EXAMPLES_ELEMENT;
}

/** Extracts the export name from `<Examples of={Stories.<name>} />`, if present. */
function examplesOfName(node: MdNode): string | undefined {
  const attributes = node.attributes as Array<{ type: string; name?: string; value?: unknown }> | undefined;
  const ofAttr = attributes?.find((attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'of');
  const expression = ofAttr?.value;
  if (
    expression &&
    typeof expression === 'object' &&
    (expression as { type?: string }).type === 'mdxJsxAttributeValueExpression'
  ) {
    return String((expression as { value: string }).value)
      .split('.')
      .at(-1);
  }
  return undefined;
}

function headingNode(title: string): MdNode {
  return { type: 'heading', depth: 3, children: [{ type: 'text', value: title }] };
}

function paragraphNode(text: string): MdNode {
  return { type: 'paragraph', children: [{ type: 'text', value: text }] };
}

function descriptionNodes(description: string, parseMarkdown?: RemarkExamplesOptions['parseMarkdown']): MdNode[] {
  const parsed = parseMarkdown?.(description) as MdNode[] | undefined;
  return parsed?.length ? parsed : [paragraphNode(description)];
}

function storyNode(descriptor: ExampleDescriptor, target: RemarkExamplesTarget): MdNode {
  const ofExpression =
    target === 'stories'
      ? memberExpression('Stories', descriptor.storyName)
      : identifier(descriptor.componentExportName);
  const ofSource = target === 'stories' ? `Stories.${descriptor.storyName}` : descriptor.componentExportName;

  const attributes: MdNode[] = [expressionAttribute('of', ofExpression, ofSource)];
  if (target === 'stories') attributes.push({ type: 'mdxJsxAttribute', name: 'inline', value: null });

  return { type: 'mdxJsxFlowElement', name: 'Story', attributes, children: [] };
}

function sourceNode(code: string): MdNode {
  return {
    type: 'mdxJsxFlowElement',
    name: 'Source',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'language', value: 'tsx' },
      expressionAttribute('code', literal(code), JSON.stringify(code))
    ],
    children: []
  };
}

function expressionAttribute(name: string, expression: Estree, value: string): MdNode {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [{ type: 'ExpressionStatement', expression }]
        }
      }
    }
  };
}

function esmImportNode(names: string[], source: string): MdNode {
  return {
    type: 'mdxjsEsm',
    value: `import { ${names.join(', ')} } from ${JSON.stringify(source)};`,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: names.map((name) => ({
              type: 'ImportSpecifier',
              imported: identifier(name),
              local: identifier(name)
            })),
            source: literal(source),
            attributes: []
          }
        ]
      }
    }
  };
}

function identifier(name: string): Estree {
  return { type: 'Identifier', name };
}

function memberExpression(object: string, property: string): Estree {
  return {
    type: 'MemberExpression',
    object: identifier(object),
    property: identifier(property),
    computed: false,
    optional: false
  };
}

function literal(value: string): Estree {
  return { type: 'Literal', value, raw: JSON.stringify(value) };
}
