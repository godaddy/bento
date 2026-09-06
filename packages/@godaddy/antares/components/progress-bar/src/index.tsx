import type { CSSProperties, ReactNode } from 'react';
import { forwardRef, useId } from 'react';
import {
  ProgressBar as RACProgressBar,
  type ProgressBarProps as RACProgressBarProps,
  Label as RACLabel
} from 'react-aria-components';
import styles from './index.module.css';
import { Text } from '#components/text';
import { Flex } from '#components/layout/flex';
import { composeClassName } from '#utils/render-props.ts';

export interface ProgressBarProps extends Omit<RACProgressBarProps, 'children' | 'isIndeterminate'> {
  /** Visible label text rendered above the track. */
  label?: string;

  /** Helper or notice text rendered below the track. */
  helperText?: ReactNode;

  /** Visual size of the track. @default 'md' */
  size?: 'xs' | 'sm' | 'md';

  /** Color intent of the fill. @default 'default' */
  status?: 'default' | 'success' | 'warning' | 'critical';
}

/**
 * A progress bar shows determinate progress of an operation over time.
 *
 * @param props - The properties {@link ProgressBarProps} passed to the component.
 *
 * @example
 * ```tsx
 * <ProgressBar label="Uploading…" value={60} status="default" helperText="3 of 5 files uploaded" />
 * ```
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(props, ref) {
  const {
    size = 'md',
    status = 'default',
    className,
    label,
    helperText,
    'aria-describedby': describedByProp,
    ...rest
  } = props;
  const helperTextId = useId();
  const describedBy = helperText ? [describedByProp, helperTextId].filter(Boolean).join(' ') : describedByProp;

  return (
    <Flex
      {...rest}
      direction="column"
      gap="xs"
      ref={ref}
      className={composeClassName(className, styles.progressBar)}
      data-size={size}
      data-status={status}
      aria-describedby={describedBy}
      as={RACProgressBar}
    >
      {({ percentage, valueText }) => (
        <>
          {label ? (
            <Flex justifyContent="space-between" alignItems="baseline">
              <RACLabel className={styles.label}>{label}</RACLabel>
              {valueText ? <Text className={styles.valueLabel}>{valueText}</Text> : null}
            </Flex>
          ) : null}
          <div className={styles.track} style={{ '--progress-bar-progress': `${percentage ?? 0}%` } as CSSProperties} />
          {helperText ? (
            <Text id={helperTextId} className={styles.helperText}>
              {helperText}
            </Text>
          ) : null}
        </>
      )}
    </Flex>
  );
});
