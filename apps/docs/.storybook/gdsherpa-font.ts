import { generateCdnUrl } from '@godaddy/generate-cdn-url';

const CDN = 'https://img6.wsimg.com/ux-assets';
const FONT_PACKAGE = '@ux/fonts';
const FONT_VERSION = '4.4.0';

type Face = { weight: string; woff2: string; woff?: string; variation?: boolean };

/**
 * Mirrors the faces uxcore2 generates for its Storybook head
 */
const FACES: Face[] = [
  { weight: '700', woff2: 'GDSherpa-bold.woff2', woff: 'GDSherpa-bold.woff' },
  { weight: '400', woff2: 'GDSherpa-regular.woff2', woff: 'GDSherpa-regular.woff' },
  { weight: '1 999', woff2: 'GDSherpa-vf.woff2', variation: true },
  { weight: '1 900', woff2: 'GDSherpa-vf2.woff2', variation: true },
  { weight: '1 900', woff2: 'GDSherpa-vf3.woff2', variation: true },
  { weight: '1 900', woff2: 'GDSherpa-vf4.woff2', variation: true }
];

function asset(file: string): string {
  return generateCdnUrl({ cdn: CDN, packageName: FONT_PACKAGE, version: FONT_VERSION, assetPath: file });
}

function src(face: Face): string {
  const woff2 = asset(face.woff2);
  const sources = [`url('${woff2}') format('woff2')`];

  if (face.variation) sources.push(`url('${woff2}') format('woff2-variations')`);
  if (face.woff) sources.push(`url('${asset(face.woff)}') format('woff')`);

  return sources.join(', ');
}

/** Only the faces that render; `vf2` through `vf4` never win a weight match. */
export const GDSHERPA_PRELOAD_HREFS = ['GDSherpa-regular.woff2', 'GDSherpa-bold.woff2', 'GDSherpa-vf.woff2'].map(asset);

export const GDSHERPA_FONT_FACE_CSS = FACES.map(
  (face) => `@font-face {
  font-family: 'gdsherpa';
  font-weight: ${face.weight};
  src: ${src(face)};
  unicode-range: U+0-10FFFF;
  font-display: swap;
}`
).join('\n');
