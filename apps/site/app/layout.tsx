import { RootProvider } from 'fumadocs-ui/provider/next';
// Must precede global.css so its `body` rule loses the cascade to Fumadocs'.
import '../../docs/.storybook/legacy-tokens.css';
import './global.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { GDSHERPA_FONT_FACE_CSS, GDSHERPA_PRELOAD_HREFS } from '../../docs/.storybook/gdsherpa-font';

const inter = Inter({
  subsets: ['latin']
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const searchOptions = {
  api: `${basePath}/api/search`,
  type: basePath ? ('static' as const) : undefined
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        {GDSHERPA_PRELOAD_HREFS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <style>{GDSHERPA_FONT_FACE_CSS}</style>
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ options: searchOptions }}>{children}</RootProvider>
      </body>
    </html>
  );
}
