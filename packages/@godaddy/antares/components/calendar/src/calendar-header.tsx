import { Icon } from '#components/icon';
import { Flex } from '#components/layout/flex';
import { NumberField } from '#components/number-field';
import { Select, SelectItem } from '#components/select';
import { Button } from '#components/button';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { useCallback, useContext, useMemo } from 'react';
import {
  CalendarStateContext as RACCalendarStateContext,
  RangeCalendarStateContext as RACRangeCalendarStateContext,
  useLocale,
  type Key as RACKey
} from 'react-aria-components';
import styles from './index.module.css';

/**
 * Previous/next navigation arrow (RAC `slot`). `hidden` renders an inert, space-retaining
 * placeholder so inward-facing arrows in a multi-month layout keep the controls centered.
 */
export function NavButton(props: { direction: 'previous' | 'next'; hidden?: boolean }) {
  const { direction, hidden = false } = props;
  // Slot is always set (RAC requires it); navHidden's visibility:hidden makes the placeholder inert.
  return (
    <Button
      slot={direction}
      aria-label={direction === 'previous' ? 'Previous' : 'Next'}
      className={hidden ? styles.navHidden : undefined}
    >
      <Icon icon={direction === 'previous' ? 'chevron-left' : 'chevron-right'} />
    </Button>
  );
}

/**
 * Editable month/year controls for the month `offset` months into the visible range. Subtracting
 * `offset` on change keeps the edit anchored to the first visible month.
 */
export function MonthHeading(props: { offset: number }) {
  const { offset } = props;
  const calendarState = useContext(RACCalendarStateContext);
  const rangeState = useContext(RACRangeCalendarStateContext);
  const state = calendarState ?? rangeState;
  const { locale } = useLocale();
  const displayDate = state?.visibleRange.start.add({ months: offset }) ?? null;

  // Localized month names for the dropdown; recompute only when locale or the shown year changes.
  const monthNames = useMemo(
    function computeMonthNames() {
      const formatter = new DateFormatter(locale, { month: 'long' });
      const year = displayDate?.year ?? 2024;
      return Array.from({ length: 12 }, (_, index) =>
        formatter.format(new CalendarDate(year, index + 1, 1).toDate(getLocalTimeZone()))
      );
    },
    [locale, displayDate?.year]
  );

  const handleMonthChange = useCallback(
    function handleMonthChange(key: RACKey | null) {
      if (!state || !displayDate || key === null) {
        return;
      }

      state.setFocusedDate(displayDate.set({ month: Number(key) }).subtract({ months: offset }));
    },
    [state, displayDate, offset]
  );

  const handleYearChange = useCallback(
    function handleYearChange(year: number) {
      if (!state || !displayDate || Number.isNaN(year)) {
        return;
      }

      state.setFocusedDate(displayDate.set({ year }).subtract({ months: offset }));
    },
    [state, displayDate, offset]
  );

  if (!state || !displayDate) {
    return null;
  }

  return (
    <Flex direction="row" gap="sm" alignItems="center">
      <Select aria-label="Month" value={String(displayDate.month)} onChange={handleMonthChange}>
        {monthNames.map(function mapMonthNames(name, index) {
          return (
            <SelectItem key={index + 1} id={String(index + 1)}>
              {name}
            </SelectItem>
          );
        })}
      </Select>
      <NumberField
        aria-label="Year"
        hideStepper
        formatOptions={{ useGrouping: false }}
        value={displayDate.year}
        onChange={handleYearChange}
        className={styles.yearField}
      />
    </Flex>
  );
}
