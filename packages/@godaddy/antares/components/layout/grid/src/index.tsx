import { type CSSProperties, type ElementType, forwardRef } from 'react';
import type { PolymorphicComponent, PolymorphicProps, PolymorphicRef } from '#types/polymorphic-react.ts';
import { composeClassName, composeStyle } from '#utils/render-props.ts';
import { Box, type BoxOwnProps } from '#components/layout/box';
import { toSpacingVar } from '../../tokens.ts';
import type { SharedFlexGridProps } from '../../types.ts';
import styles from './index.module.css';

export interface GridOwnProps extends BoxOwnProps, SharedFlexGridProps {
  /** The display property for the grid container. @default 'grid' */
  display?: 'grid' | 'inline-grid';

  /** Defines named grid areas. Eg. ['header header', 'sidebar main'] */
  areas?: string[];

  /** Defines the columns of the grid. Eg. '1fr 2fr' or 'repeat(3, 1fr)' */
  columns?: string;

  /** Defines the rows of the grid. Eg. 'auto 1fr auto' */
  rows?: string;

  /** The size of implicitly-created columns. */
  autoColumns?: string;

  /** The size of implicitly-created rows. */
  autoRows?: string;

  /** Controls how auto-placed items are flowed into the grid. */
  autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense' | (string & {});
}

export type GridProps<C extends ElementType = 'div'> = PolymorphicProps<C, GridOwnProps>;

/**
 * Two-dimensional CSS Grid layout component for complex grid-based layouts.
 * Extends Box with grid-specific capabilities like areas, columns, rows, and gap.
 *
 * @param props - {@link GridProps}
 */
export const Grid = forwardRef(function Grid(props: GridProps<ElementType>, ref: PolymorphicRef<ElementType>) {
  const {
    style,
    className,
    as,
    display = 'grid',
    areas,
    columns,
    rows,
    autoColumns,
    autoRows,
    autoFlow,
    justifyContent,
    justifyItems,
    alignContent,
    alignItems,
    gap,
    columnGap,
    rowGap,
    ...rest
  } = props;

  const displayClass = display === 'inline-grid' ? styles.inlineGrid : styles.grid;

  const computedStyle = {
    gridTemplateAreas: gridTemplateAreasValue(areas),
    gridTemplateColumns: columns,
    gridTemplateRows: rows,
    gridAutoColumns: autoColumns,
    gridAutoRows: autoRows,
    gridAutoFlow: autoFlow,
    justifyContent,
    justifyItems,
    alignContent,
    alignItems,
    gap: toSpacingVar(gap),
    columnGap: toSpacingVar(columnGap),
    rowGap: toSpacingVar(rowGap)
  } satisfies CSSProperties;
  return (
    <Box
      {...rest}
      as={as}
      ref={ref}
      className={composeClassName(className, displayClass)}
      style={composeStyle(style, computedStyle)}
    />
  );
}) as PolymorphicComponent<GridOwnProps>;

/**
 * Converts a string or array of strings to a grid-template-areas value.
 * @param value - The string or array of strings to convert.
 * @returns The grid-template-areas value.
 */
function gridTemplateAreasValue(value?: string | string[]) {
  if (Array.isArray(value)) return value.map((v) => `"${v}"`).join('\n');
  return value;
}
