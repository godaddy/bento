import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import ts from 'typescript';
import { normalizeComment } from './engine/jsdoc.ts';
import { GET_EXAMPLES } from './getter-names.ts';

/** Suffix stripped from an example's export name to derive its story name. */
const EXAMPLE_SUFFIX = 'Example';
/** Default sibling folder scanned for example files, relative to the component dir. */
const DEFAULT_EXAMPLES_DIR = './examples';
/** Example files matching this suffix drive the args-based Playground story, not README examples. */
const PLAYGROUND_SUFFIX = '-playground.tsx';

/** A single discovered example, shared by the CSF transform, the indexer, and the remark plugin. */
export interface ExampleDescriptor {
  /** Absolute path to the example file. */
  filePath: string;
  /** Import path relative to the component dir, e.g. `./examples/primary.tsx`. */
  importPath: string;
  /** Exported component identifier, e.g. `PrimaryExample`. */
  componentExportName: string;
  /** Generated story export name, e.g. `Primary`. */
  storyName: string;
  /** Heading title (`@title` override, else derived from the story name). */
  title: string;
  /** JSDoc free-text description (markdown), or `undefined`. */
  description?: string;
  /** `@order N` value, if present. */
  order?: number;
  /** File source with the example's metadata JSDoc removed, for display in `<Source>`. */
  source: string;
}

export interface DiscoverExamplesInput {
  /** Component directory that contains the `examples/` folder. */
  dir: string;
  /** Examples folder override, relative to `dir` (default `./examples`). */
  examplesDir?: string;
}

/**
 * Discovers renderable examples for a component. Scans the sibling `examples/`
 * folder (excluding `*-playground.tsx` and `@ignore`d files), extracts each
 * example's JSDoc, and returns descriptors ordered by `@order` (ascending, then
 * untagged examples alphabetically). The single source of truth shared by the
 * Storybook CSF transform/indexer and the `remarkExamples` plugin.
 */
export async function discoverExamples(input: DiscoverExamplesInput): Promise<ExampleDescriptor[]> {
  const relDir = (input.examplesDir ?? DEFAULT_EXAMPLES_DIR).replace(/\/+$/, '');
  const examplesDirAbs = join(input.dir, relDir);

  let entries: string[];
  try {
    entries = await readdir(examplesDirAbs);
  } catch {
    return [];
  }

  const files = entries.filter((f) => f.endsWith('.tsx') && !f.endsWith(PLAYGROUND_SUFFIX)).sort();

  const descriptors: ExampleDescriptor[] = [];

  for (const file of files) {
    const filePath = join(examplesDirAbs, file);
    const parsed = parseExample(await readFile(filePath, 'utf8'), filePath);
    if (!parsed || parsed.ignore) continue;

    const storyName = toStoryName(parsed.componentExportName);

    descriptors.push({
      filePath,
      importPath: `${relDir}/${file}`,
      componentExportName: parsed.componentExportName,
      storyName,
      title: parsed.title ?? humanize(storyName),
      description: parsed.description,
      order: parsed.order,
      source: parsed.source
    });
  }

  return sortDescriptors(descriptors);
}

interface ParsedExample {
  componentExportName: string;
  title?: string;
  description?: string;
  order?: number;
  ignore: boolean;
  source: string;
}

/**
 * Parses a single example file. An example exports exactly one function - that
 * function is the example. Files that export no function (e.g. only a type or a
 * const) are skipped, so nothing renders for them.
 */
function parseExample(code: string, filePath: string): ParsedExample | undefined {
  const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  let exported: { name: string; node: ts.FunctionDeclaration } | undefined;
  sourceFile.forEachChild(function collect(node) {
    if (exported) return;
    if (ts.isFunctionDeclaration(node) && node.name && hasExportModifier(node)) {
      exported = { name: node.name.text, node };
    }
  });

  if (!exported) return undefined;

  return {
    componentExportName: exported.name,
    source: stripExampleJSDoc(code, exported.node, sourceFile),
    ...readExampleJSDoc(exported.node)
  };
}

/**
 * Returns the file source with the example export's leading JSDoc block removed,
 * so the metadata comment (`@title`/`@order`/description) doesn't leak into the
 * rendered `<Source>` snippet.
 */
function stripExampleJSDoc(code: string, node: ts.Node, sourceFile: ts.SourceFile): string {
  const jsDoc = ts.getJSDocCommentsAndTags(node).find(ts.isJSDoc);
  if (!jsDoc) return code.trim();

  const before = code.slice(0, jsDoc.getStart(sourceFile));
  const after = code.slice(node.getStart(sourceFile));
  return `${before}${after}`.trim();
}

/** Reads the `description`, `@title`, `@order`, and `@ignore` JSDoc of an example export. */
function readExampleJSDoc(node: ts.Node): Omit<ParsedExample, 'componentExportName' | 'source'> {
  const jsDoc = ts.getJSDocCommentsAndTags(node).find(ts.isJSDoc);
  const description = normalizeComment(jsDoc?.comment);

  let title: string | undefined;
  let order: number | undefined;
  let ignore = false;

  for (const tag of jsDoc?.tags ?? []) {
    const name = tag.tagName.text;
    if (name === 'ignore') {
      ignore = true;
    } else if (name === 'title') {
      title = normalizeComment(tag.comment);
    } else if (name === 'order') {
      const value = Number(normalizeComment(tag.comment));
      if (!Number.isNaN(value)) order = value;
    }
  }

  return { title, description, order, ignore };
}

function hasExportModifier(node: ts.FunctionDeclaration | ts.VariableStatement): boolean {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

/** `PrimaryExample` -> `Primary`; leaves names without the suffix untouched. */
function toStoryName(componentExportName: string): string {
  return componentExportName.replace(new RegExp(`${EXAMPLE_SUFFIX}$`), '');
}

/** `IconOnly` -> `Icon Only`; single words are returned unchanged. */
function humanize(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .trim();
}

/** `@order`-tagged examples first (ascending), then untagged examples alphabetically. */
function sortDescriptors(list: ExampleDescriptor[]): ExampleDescriptor[] {
  const byName = (a: ExampleDescriptor, b: ExampleDescriptor) => a.storyName.localeCompare(b.storyName);

  const ordered = list.filter((d) => d.order !== undefined).sort((a, b) => (a.order as number) - (b.order as number));
  const unordered = list.filter((d) => d.order === undefined).sort(byName);

  return [...ordered, ...unordered];
}

/** A `getExamples()` getter found in a stories file. */
export interface ExamplesGetter {
  /** The exported binding, e.g. `examples` in `export const examples = getExamples(...)`. */
  exportName: string;
  /** The folder argument passed to `getExamples`, relative to the stories file, if any. */
  examplesDir?: string;
}

/**
 * Finds an `export const <name> = getExamples(<dir?>)` in a stories file and
 * returns its export name and folder argument. When `exportName` is given, only
 * that binding matches (used to resolve `<Examples of={Stories.<name>} />`);
 * otherwise the first `getExamples` export wins.
 */
export function findExamplesGetter(code: string, filePath: string, exportName?: string): ExamplesGetter | undefined {
  const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let found: ExamplesGetter | undefined;

  sourceFile.forEachChild(function scan(node) {
    if (found || !ts.isVariableStatement(node) || !hasExportModifier(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      if (exportName && decl.name.text !== exportName) continue;
      const init = decl.initializer;
      if (!init || !ts.isCallExpression(init) || !ts.isIdentifier(init.expression)) continue;
      if (init.expression.text !== GET_EXAMPLES) continue;
      const arg = init.arguments[0];
      found = {
        exportName: decl.name.text,
        examplesDir: arg && ts.isStringLiteral(arg) ? arg.text : undefined
      };
      return;
    }
  });

  return found;
}

export interface ReadmeExamplesInput {
  /** Absolute path to the component `README.mdx`. */
  readmePath: string;
  /** Stories export named in `<Examples of={Stories.<exportName>} />`, if any. */
  exportName?: string;
}

export interface ReadmeExamplesResult {
  descriptors: ExampleDescriptor[];
  /** Stories file the folder was resolved from, or `''` if none matched (for dependency tracking). */
  storiesPath: string;
}

/**
 * Resolves the examples for a component `README.mdx` by following its
 * imported `<Examples of={Stories.<name>} />` reference to the colocated stories file,
 * reading that export's `getExamples(<dir>)` folder argument, and discovering the
 * examples in it. The stories file is located by scanning the README's directory
 * for the `*.stories.tsx` that declares the referenced `getExamples` export (when
 * `exportName` is omitted, the first `getExamples` export wins). Shared by the
 * Fumadocs remark plugin and the Storybook Vite expander so both stay in sync.
 */
export async function discoverExamplesForReadme(input: ReadmeExamplesInput): Promise<ReadmeExamplesResult> {
  const componentDir = dirname(input.readmePath);

  let entries: string[];
  try {
    entries = await readdir(componentDir);
  } catch {
    return { descriptors: [], storiesPath: '' };
  }

  for (const file of entries.filter((f) => f.endsWith('.stories.tsx')).sort()) {
    const storiesPath = join(componentDir, file);
    const getter = findExamplesGetter(await readFile(storiesPath, 'utf8'), storiesPath, input.exportName);
    if (!getter) continue;

    const descriptors = await discoverExamples({ dir: componentDir, examplesDir: getter.examplesDir });
    return { descriptors, storiesPath };
  }

  return { descriptors: [], storiesPath: '' };
}
