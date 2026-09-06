/**
 * Waits for an element matching the selector to appear inside the container.
 *
 * Uses MutationObserver to resolve as soon as the element exists. Useful when
 * content is rendered asynchronously (e.g. charts that depend on useParentSize/debounce).
 *
 * @param container - DOM container to observe
 * @param selector - CSS selector to wait for (e.g. 'svg', '[data-loaded]')
 * @param options - Optional config
 * @param options.timeout - Max wait in ms (default: 5000)
 * @returns Promise that resolves when the element is found
 * @throws {Error} If the element is not found before the timeout
 */
export async function waitForSelector(
  container: HTMLElement,
  selector: string,
  options?: { timeout?: number }
): Promise<void> {
  if (container.querySelector(selector)) return;

  const timeoutMs = options?.timeout ?? 5000;

  return new Promise<void>(function resolveWhenFound(resolve, reject) {
    const timeout = setTimeout(function onTimeout() {
      observer.disconnect();
      reject(new Error(`${selector} timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    const observer = new MutationObserver(function onMutation() {
      if (container.querySelector(selector)) {
        clearTimeout(timeout);
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
  });
}
