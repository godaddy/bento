import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/** Options for measuring and navigating the Tabs conveyor. */
interface TabsOverflowOptions {
  /** Whether the document direction is right-to-left. */
  readonly isRTL?: boolean;
}

/** Current measurement state for the Tabs conveyor. */
interface TabsOverflowState {
  /** Whether the tab conveyor extends beyond its available width. */
  readonly hasOverflow: boolean;

  /** Whether the previous control can reveal an earlier tab. */
  readonly canScrollPrev: boolean;

  /** Whether the next control can reveal a later tab. */
  readonly canScrollNext: boolean;
}

export interface TabsOverflowResult {
  /** Ref for the outer conveyor shell. */
  readonly shellRef: RefObject<HTMLDivElement | null>;

  /** Ref for the tab list content. */
  readonly contentRef: RefObject<HTMLDivElement | null>;

  /** Ref for the scrollable viewport. */
  readonly viewportRef: RefObject<HTMLDivElement | null>;

  /** Current overflow and scroll boundary state. */
  readonly state: TabsOverflowState;

  /** Scrolls toward the previous visible tab. */
  readonly scrollPrevious: () => void;

  /** Scrolls toward the next visible tab. */
  readonly scrollNext: () => void;
}

/**
 * Reads the conveyor dimensions and determines the available scroll directions.
 *
 * @param shell - Outer conveyor shell used to determine available width.
 * @param content - Tab list content whose width is measured for overflow.
 * @param viewport - Scrollable viewport used to determine the current position.
 * @returns The current overflow and scroll boundary state.
 */
function readOverflowState(
  shell: HTMLDivElement | null,
  content: HTMLDivElement | null,
  viewport: HTMLDivElement | null
): TabsOverflowState {
  if (!shell || !content || !viewport) return { hasOverflow: false, canScrollPrev: false, canScrollNext: false };
  const maxScroll = viewport.scrollWidth - viewport.clientWidth;
  const position = Math.abs(viewport.scrollLeft);
  return {
    hasOverflow: content.scrollWidth > shell.clientWidth + 1,
    canScrollPrev: position > 1,
    canScrollNext: position < maxScroll - 2
  };
}

/**
 * Measures a horizontal tab-list conveyor and moves one tab at a time.
 *
 * @param options - Directional options used when calculating logical scroll targets.
 * @returns Conveyor refs, boundary state, and scroll handlers.
 */
export function useTabsOverflow(options: TabsOverflowOptions = {}): TabsOverflowResult {
  const { isRTL = false } = options;
  const shellRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TabsOverflowState>({
    hasOverflow: false,
    canScrollPrev: false,
    canScrollNext: false
  });

  const update = useCallback(function update() {
    setState(readOverflowState(shellRef.current, contentRef.current, viewportRef.current));
  }, []);

  useEffect(
    function observeOverflow() {
      const viewport = viewportRef.current;
      const content = contentRef.current;
      const shell = shellRef.current;
      if (!shell || !viewport || !content) return;
      const observer = new ResizeObserver(update);
      observer.observe(shell);
      observer.observe(viewport);
      observer.observe(content);
      viewport.addEventListener('scroll', update, { passive: true });
      update();
      return function cleanup() {
        observer.disconnect();
        viewport.removeEventListener('scroll', update);
      };
    },
    [update]
  );

  const scrollToTab = useCallback(
    function scrollToTab(action: 'next' | 'previous') {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const tabs = contentRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      if (!tabs?.length) return;

      const viewportRect = viewport.getBoundingClientRect();
      const target =
        action === 'next'
          ? Array.from(tabs).find(function findNextTab(tab) {
              const tabRect = tab.getBoundingClientRect();
              return isRTL ? tabRect.right < viewportRect.right - 1 : tabRect.left > viewportRect.left + 1;
            })
          : Array.from(tabs).findLast(function findPreviousTab(tab) {
              const tabRect = tab.getBoundingClientRect();
              return isRTL ? tabRect.right > viewportRect.right + 1 : tabRect.left < viewportRect.left - 1;
            });
      if (!target) {
        viewport.scrollBy({
          left:
            action === 'next'
              ? isRTL
                ? -viewport.clientWidth
                : viewport.clientWidth
              : isRTL
                ? viewport.clientWidth
                : -viewport.clientWidth,
          behavior: 'smooth'
        });
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const delta = isRTL ? targetRect.right - viewportRect.right : targetRect.left - viewportRect.left;
      viewport.scrollBy({ left: delta, behavior: 'smooth' });
    },
    [isRTL]
  );

  const scrollPrevious = useCallback(
    function scrollPrevious() {
      scrollToTab('previous');
    },
    [scrollToTab]
  );

  const scrollNext = useCallback(
    function scrollNext() {
      scrollToTab('next');
    },
    [scrollToTab]
  );

  return { shellRef, contentRef, viewportRef, state, scrollPrevious, scrollNext };
}
