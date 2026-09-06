/**
 * Marker used by component READMEs to declare where generated examples belong.
 * The Storybook and docs-site build plugins replace it before rendering.
 */
export interface ExamplesProps {
  /** The examples story export referenced by the README. */
  of?: unknown;
}

export function Examples(_props: ExamplesProps): null {
  return null;
}
