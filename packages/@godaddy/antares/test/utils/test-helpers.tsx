import { page } from 'vitest/browser';
import { set } from '#components/icon';

/**
 * Move the pointer to the top-left corner to clear any hover state before a
 * screenshot. Use from a `beforeEach` hook so each test starts un-hovered.
 *
 * @example
 * ```tsx
 * import { resetHover } from '#test/utils/test-helpers.tsx';
 *
 * beforeEach(resetHover);
 * ```
 */
export function resetHover() {
  return page.getByRole('document').hover({ position: { x: 0, y: 0 } });
}

/**
 * Register the icon glyphs used across the test suite.
 *
 * CDN icons are loaded asynchronously over the network and are not available in
 * the test browser, so tests that render an `Icon` must preload the glyphs they
 * use. Rather than duplicate the SVG markup in every test file, register the
 * shared set here and call `preloadTestIcons()` from a `beforeAll` hook.
 *
 * All glyphs use `fill="currentColor"` so they inherit the `Icon` color prop,
 * matching how the real CDN icons behave.
 *
 * @example
 * ```tsx
 * import { preloadTestIcons } from '#test/utils/test-helpers.tsx';
 *
 * beforeAll(preloadTestIcons);
 * ```
 */
export function preloadTestIcons() {
  set({
    alert: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          <path d="M12 13.75a.75.75 0 0 0 .75-.75V9a.75.75 0 1 0-1.5 0v4a.75.75 0 0 0 .75.75z" />
          <path d="M21.371 16.48 14.478 4.417a2.854 2.854 0 0 0-4.956 0L2.629 16.48a2.853 2.853 0 0 0 2.478 4.27h13.787a2.854 2.854 0 0 0 2.477-4.27zm-1.307 2.095a1.34 1.34 0 0 1-1.17.675H5.107a1.352 1.352 0 0 1-1.175-2.025l6.893-12.063a1.354 1.354 0 0 1 2.35 0l6.893 12.063a1.339 1.339 0 0 1-.004 1.35z" />
          <path d="M12 15.25h-.005a1.128 1.128 0 1 0 .005 0z" />
        </g>
      </svg>
    ),
    calendar: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3.25h-2.25V2a.75.75 0 10-1.5 0v1.25h-6.5V2a.75.75 0 00-1.5 0v1.25H5A2.753 2.753 0 002.25 6v13A2.753 2.753 0 005 21.75h14A2.753 2.753 0 0021.75 19V6A2.753 2.753 0 0019 3.25zM5 4.75h2.25V6a.75.75 0 001.5 0V4.75h6.5V6a.75.75 0 101.5 0V4.75H19A1.251 1.251 0 0120.25 6v2.25H3.75V6A1.251 1.251 0 015 4.75zm14 15.5H5A1.25 1.25 0 013.75 19V9.75h16.5V19A1.25 1.25 0 0119 20.25z" />
        <path d="M12.016 11.979h-.006a1.002 1.002 0 10.006 0zM17.016 11.979h-.006a1.002 1.002 0 10.006 0zM7.014 15.979h-.007a1.003 1.003 0 10.007 0zM12.014 15.979h-.007a1.003 1.003 0 10.007 0zM7.005 11.979h-.006a1.002 1.002 0 10.006 0zM17.016 15.982h-.006a1.001 1.001 0 10.006 0z" />
      </svg>
    ),
    checkmark: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 18.25a.748.748 0 0 1-.53-.22l-5-5a.75.75 0 0 1 1.06-1.06L9 16.44 19.47 5.97a.75.75 0 0 1 1.06 1.06l-11 11a.748.748 0 0 1-.53.22z"
          fill="currentColor"
        />
      </svg>
    ),
    circle: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" fill="none" r="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    'circle-half': (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" fill="none" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" />
      </svg>
    ),
    ok: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          <path d="M12 2.25A9.75 9.75 0 1021.75 12 9.761 9.761 0 0012 2.25zm0 18A8.25 8.25 0 1120.25 12 8.26 8.26 0 0112 20.25z" />
          <path d="M15.47 9.47L11 13.94l-2.47-2.47a.75.75 0 00-1.06 1.06l3 3c.139.14.333.22.53.22s.391-.08.53-.22l5-5a.75.75 0 00-1.06-1.06z" />
        </g>
      </svg>
    ),
    information: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          <path d="M12 2.258a9.75 9.75 0 1 0 9.75 9.75A9.761 9.761 0 0 0 12 2.257zm0 18a8.25 8.25 0 1 1 8.25-8.25 8.26 8.26 0 0 1-8.25 8.25z" />
          <path d="M12 11.258a.75.75 0 0 0-.75.75v5a.75.75 0 1 0 1.5 0v-5a.75.75 0 0 0-.75-.75zm-.003-4.125a1.125 1.125 0 1 0 .003 0z" />
        </g>
      </svg>
    ),
    star: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          clipRule="evenodd"
          d="M11.9 1.95a.75.75 0 0 1 .68.433l2.631 5.639 5.907.937a.75.75 0 0 1 .418 1.266l-4.334 4.427 1.038 6.225a.75.75 0 0 1-1.103.78l-5.237-2.9-5.237 2.9a.75.75 0 0 1-1.104-.77l.944-6.235-4.245-4.433a.75.75 0 0 1 .424-1.26l5.907-.937 2.631-5.64a.75.75 0 0 1 .68-.432zm0 2.524L9.78 9.017a.75.75 0 0 1-.562.424l-4.885.775 3.509 3.665a.75.75 0 0 1 .2.631l-.772 5.094 4.267-2.362a.75.75 0 0 1 .726 0l4.242 2.348-.845-5.069a.75.75 0 0 1 .204-.648l3.584-3.662-4.866-.772a.75.75 0 0 1-.562-.424z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    ),
    diamond: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          clipRule="evenodd"
          d="M5.393 3.559A.75.75 0 0 1 6 3.25h12a.75.75 0 0 1 .607.309l4 5.5a.75.75 0 0 1-.041.933l-10 11.5a.75.75 0 0 1-1.132 0l-10-11.5a.75.75 0 0 1-.04-.933zm.375 2.036L3.473 8.75H6.88zM7.41 10.25H3.646l6.336 7.287zm6.607 7.287 6.336-7.287H16.59zm.98-7.287H9.002L12 18.746zm2.12-1.5h3.41l-2.295-3.155zm-.178-4h-3.454l2.336 3.167zm-2.367 4L12 5.263 9.427 8.75zm-6.395-.834 2.336-3.166H7.06z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    ),
    minus: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12.75H4a.75.75 0 1 1 0-1.5h16a.75.75 0 1 1 0 1.5z" fill="currentColor" />
      </svg>
    ),
    plus: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 11.25h-7.25V4a.75.75 0 1 0-1.5 0v7.25H4a.75.75 0 1 0 0 1.5h7.25V20a.75.75 0 1 0 1.5 0v-7.25H20a.75.75 0 1 0 0-1.5z"
          fill="currentColor"
        />
      </svg>
    ),
    'chevron-left': (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.5 17.75a.748.748 0 0 1-.53-.22l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L10.56 12l4.47 4.47a.75.75 0 0 1-.53 1.28z"
          fill="currentColor"
        />
      </svg>
    ),
    'chevron-right': (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.5 17.75a.75.75 0 0 1-.53-1.28L13.44 12 8.97 7.53a.75.75 0 0 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.748.748 0 0 1-.53.22z"
          fill="currentColor"
        />
      </svg>
    ),
    'chevron-down': (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.53 8.47c-.139-.14-.333-.22-.53-.22s-.391.08-.53.22L12 13.94 6.53 8.47a.75.75 0 0 0-1.06 1.06l6 6c.139.14.333.22.53.22s.391-.08.53-.22l6-6c.14-.139.22-.333.22-.53a.757.757 0 0 0-.22-.53z" />
      </svg>
    ),
    'bulleted-list': (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          <path d="M8.25 6.25a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75zM8.25 12a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75zM9 17.75a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5H9z" />
          <path d="M5.25 6.25a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0zM5.25 12a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0zM4.125 19.125a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25z" />
        </g>
      </svg>
    ),
    grid: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          <path d="M4 4.25a.75.75 0 0 0-.75.75v5c0 .414.336.75.75.75h5a.75.75 0 0 0 .75-.75V5a.75.75 0 0 0-.75-.75H4zm.75 5.25V5.75h3.5v3.75h-3.5zM15 4.25a.75.75 0 0 0-.75.75v5c0 .414.336.75.75.75h5a.75.75 0 0 0 .75-.75V5a.75.75 0 0 0-.75-.75h-5zm.75 5.25V5.75h3.5v3.75h-3.5zM3.25 15a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-.75.75H4a.75.75 0 0 1-.75-.75v-5zm1.5.75v3.5h3.5v-3.5h-3.5zM15 14.25a.75.75 0 0 0-.75.75v5c0 .414.336.75.75.75h5a.75.75 0 0 0 .75-.75v-5a.75.75 0 0 0-.75-.75h-5zm.75 5.25v-3.5h3.5v3.5h-3.5z" />
        </g>
      </svg>
    ),
    comment: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          clipRule="evenodd"
          d="M12 3.75c-5.108 0-9.25 3.41-9.25 7.625 0 2.4 1.343 4.535 3.44 5.927l-.86 2.99a.75.75 0 0 0 1.05.876l3.55-1.71c.667.114 1.357.177 2.07.177 5.108 0 9.25-3.41 9.25-7.625S17.108 3.75 12 3.75zm-7.75 7.625c0-3.226 3.275-6.125 7.75-6.125s7.75 2.9 7.75 6.125-3.275 6.125-7.75 6.125c-.703 0-1.378-.07-2.012-.198a.75.75 0 0 0-.474.06l-2.314 1.115.53-1.844a.75.75 0 0 0-.32-.83c-1.92-1.18-2.89-2.93-2.89-4.503z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    ),
    x: (
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.06 12l6.47-6.47a.75.75 0 0 0-1.06-1.06L12 10.94 5.53 4.47a.75.75 0 0 0-1.06 1.06L10.94 12l-6.47 6.47a.757.757 0 0 0-.222.53c0 .198.08.393.22.532.14.14.334.22.531.22a.757.757 0 0 0 .531-.222L12 13.06l6.47 6.47a.75.75 0 0 0 1.06-1.06z"
          fill="currentColor"
        />
      </svg>
    )
  });
}
