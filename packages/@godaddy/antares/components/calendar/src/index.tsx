import type { CalendarDate } from '@internationalized/date';
import { Flex, type FlexOwnProps, type FlexProps } from '#components/layout/flex';
import { Box } from '#components/layout/box';
import {
  CalendarCell as RACCalendarCell,
  CalendarGrid as RACCalendarGrid,
  Calendar as RACCalendar,
  type CalendarProps as RACCalendarProps,
  RangeCalendar as RACRangeCalendar,
  type RangeCalendarProps as RACRangeCalendarProps,
  type CalendarGridProps as RACCalendarGridProps
} from 'react-aria-components';
import { composeClassName } from '#utils/render-props.ts';
import { MonthHeading, NavButton } from './calendar-header.tsx';
import styles from './index.module.css';
import { cx } from 'cva';

export interface CalendarProps extends FlexOwnProps, RACCalendarProps<CalendarDate> {
  /** Number of month grids to display. @default 1 */
  pageCount?: number;
}

/**
 * Standalone single-date calendar grid built on React Aria's Calendar. Date-only (`CalendarDate`).
 * Renders one month by default; pass `pageCount={n}` to show more.
 * Used on its own or inside `DatePicker`'s popover.
 *
 * @param props - {@link CalendarProps} The props for the calendar.
 *
 * @example
 * ```tsx
 * <Calendar aria-label="Event date" defaultValue={parseDate('2024-03-15')} />
 * ```
 */
export function Calendar(props: CalendarProps) {
  const { className, pageCount = 1, ...rest } = props;

  return (
    <Flex
      direction="column"
      gap="md"
      {...rest}
      visibleDuration={{ months: pageCount }}
      as={RACCalendar<CalendarDate>}
      className={composeClassName(className, styles.calendar)}
    >
      <CalendarBody type="single" pageCount={pageCount} />
    </Flex>
  );
}

export interface RangeCalendarProps extends FlexOwnProps, RACRangeCalendarProps<CalendarDate> {
  /** Number of month grids to display. @default 2 */
  pageCount?: number;
}

/**
 * Standalone range calendar grid built on React Aria's RangeCalendar. Date-only (`CalendarDate`).
 * Shows two months by default; pass `pageCount={n}` to override.
 * Used on its own or inside `DateRangePicker`'s popover.
 *
 * @param props - {@link RangeCalendarProps} The props for the range calendar.
 *
 * @example
 * ```tsx
 * <RangeCalendar aria-label="Trip dates" />
 * ```
 */
export function RangeCalendar(props: RangeCalendarProps) {
  const { className, pageCount = 2, ...rest } = props;

  return (
    <Flex
      direction="column"
      gap="md"
      {...rest}
      visibleDuration={{ months: pageCount }}
      as={RACRangeCalendar<CalendarDate>}
      className={composeClassName(className, styles.calendar)}
    >
      <CalendarBody type="range" pageCount={pageCount} />
    </Flex>
  );
}

interface CalendarGridProps extends RACCalendarGridProps {
  /** The type of the calendar grid. */
  type: 'single' | 'range';
}

/**
 * The grid of a single visible month.
 *
 * @param props - {@link CalendarGridProps} The props for the calendar grid.
 */
function CalendarGrid(props: CalendarGridProps) {
  const { className, type, ...rest } = props;

  return (
    <Box as={RACCalendarGrid} weekdayStyle="short" {...rest} className={cx(styles.grid, className)}>
      {(date) => (
        <Flex
          as={RACCalendarCell}
          date={date}
          alignItems="center"
          justifyContent="center"
          data-type={type}
          rounding={type === 'single' ? 'full' : 'lg'}
          className={styles.cell}
        />
      )}
    </Box>
  );
}

interface CalendarBodyProps extends Pick<CalendarGridProps, 'type'>, Pick<CalendarProps, 'pageCount'>, FlexProps {}

/**
 * Renders the calendar body. with previous/next arrows and the amount of months to render.
 */
function CalendarBody(props: CalendarBodyProps) {
  const { type, pageCount = 1, ...rest } = props;

  return (
    <Flex direction="row" gap="md" alignItems="stretch" wrap="wrap" {...rest}>
      {Array.from({ length: pageCount }).flatMap(function renderMonth(_, offset) {
        const showPrevious = offset === 0;
        const showNext = offset === pageCount - 1;
        const monthCard = (
          <Flex key={`month-${offset}`} direction="column" gap="md">
            <Flex as="header" direction="row" justifyContent="space-between" alignItems="center" gap="sm">
              <NavButton direction="previous" hidden={!showPrevious} />
              <MonthHeading offset={offset} />
              <NavButton direction="next" hidden={!showNext} />
            </Flex>
            <CalendarGrid type={type} offset={{ months: offset }} />
          </Flex>
        );

        return offset === 0
          ? [monthCard]
          : [
              <Box key={`divider-${offset}`} aria-hidden="true" className={styles.monthDivider} flexShrink={0} />,
              monthCard
            ];
      })}
    </Flex>
  );
}
