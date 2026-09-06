import { forwardRef, type CSSProperties, type ElementType } from 'react';
import type { PolymorphicComponent, PolymorphicProps, PolymorphicRef } from '#types/polymorphic-react.ts';
import { composeClassName, composeStyle } from '#utils/render-props.ts';
import { toRoundingVar, toSpacingVar, type Elevation, type Rounding, type Spacing } from '../../tokens.ts';
import styles from './index.module.css';

export interface BoxOwnProps {
  /** Polymorphic element type. @default 'div' */
  as?: ElementType;

  /** Padding on all sides. Accepts single value or array. */
  padding?: Spacing | Spacing[];

  /** Padding on inline (horizontal) direction. */
  inlinePadding?: Spacing | Spacing[];

  /** Padding on inline start (left in LTR). */
  inlinePaddingStart?: Spacing;

  /** Padding on inline end (right in LTR). */
  inlinePaddingEnd?: Spacing;

  /** Padding on block (vertical) direction. */
  blockPadding?: Spacing | Spacing[];

  /** Padding on block start (top). */
  blockPaddingStart?: Spacing;

  /** Padding on block end (bottom). */
  blockPaddingEnd?: Spacing;

  /** Elevation levels for visual depth. */
  elevation?: Elevation;

  /** Rounding values for border radius. */
  rounding?: Rounding;

  /** In Flex/Grid layout. Cross-axis alignment within flex/grid container. */
  alignSelf?:
    | 'auto'
    | 'normal'
    | 'start'
    | 'end'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'self-start'
    | 'self-end'
    | 'stretch'
    | (string & {});

  /** In Flex/Grid layout. Main-axis alignment within flex/grid container. */
  justifySelf?:
    | 'auto'
    | 'normal'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'self-start'
    | 'self-end'
    | 'center'
    | 'left'
    | 'right'
    | 'stretch'
    | (string & {});

  /** In Flex/Grid layout. Layout order within flex/grid container. */
  order?: number | string;

  /** In Flex/Grid layout. Flex shorthand for grow, shrink, and basis. */
  flex?: number | string;

  /** In Flex/Grid layout. How much the item will grow relative to siblings. */
  flexGrow?: number | string;

  /** In Flex/Grid layout. How much the item will shrink relative to siblings. */
  flexShrink?: number | string;

  /** In Flex/Grid layout. Initial main size before growing/shrinking. */
  flexBasis?: string;

  /** In Flex/Grid layout. Named grid area for placement. */
  gridArea?: string;

  /** In Flex/Grid layout. Grid column start line. */
  gridColumnStart?: string;

  /** In Flex/Grid layout. Grid column end line. */
  gridColumnEnd?: string;

  /** In Flex/Grid layout. Grid row start line. */
  gridRowStart?: string;

  /** In Flex/Grid layout. Grid row end line. */
  gridRowEnd?: string;
}

/** Polymorphic Box props - combines Box props with the target element's props. */
export type BoxProps<C extends ElementType = 'div'> = PolymorphicProps<C, BoxOwnProps>;

/**
 * Primitive container for spacing, elevation, rounding, and self-alignment.
 * Prefer `<Flex />` or `<Grid />` which extend Box with layout capabilities.
 *
 * @param props - {@link BoxProps}
 */
export const Box = forwardRef(function Box(props: BoxProps<ElementType>, ref: PolymorphicRef<ElementType>) {
  const {
    className,
    style,
    as: Component = 'div',
    padding,
    inlinePadding,
    inlinePaddingStart,
    inlinePaddingEnd,
    blockPadding,
    blockPaddingStart,
    blockPaddingEnd,
    elevation,
    rounding,
    alignSelf,
    justifySelf,
    order,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    gridArea,
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd,
    ...rest
  } = props;

  const computedStyle = {
    padding: toSpacingVar(padding),
    paddingBlock: toSpacingVar(blockPadding),
    paddingBlockStart: toSpacingVar(blockPaddingStart),
    paddingBlockEnd: toSpacingVar(blockPaddingEnd),
    paddingInline: toSpacingVar(inlinePadding),
    paddingInlineStart: toSpacingVar(inlinePaddingStart),
    paddingInlineEnd: toSpacingVar(inlinePaddingEnd),
    alignSelf,
    justifySelf,
    order,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    gridArea,
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd,
    borderRadius: toRoundingVar(rounding)
  } satisfies CSSProperties;
  return (
    <Component
      {...rest}
      ref={ref}
      className={composeClassName(className, styles.box)}
      style={composeStyle(style, computedStyle)}
      data-elevation={elevation}
    />
  );
}) as PolymorphicComponent<BoxOwnProps>;
