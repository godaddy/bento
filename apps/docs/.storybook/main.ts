import packageJson from '@godaddy/antares/package.json' with { type: 'json' };
import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig, type UserConfig } from 'vite';
import { docsDefaults } from '../../../configs/docs-defaults.mts';
import { remarkFrontmatterHeading } from '../lib/remark-frontmatter-heading.ts';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import replace from '@rollup/plugin-replace';
import { generateCdnUrl } from '@godaddy/generate-cdn-url';
import { CDN, ICON_PACKAGE, DESIGN_ASSETS_VERSION } from '../../../packages/@godaddy/antares/utils/icon-cdn.ts';
import { GDSHERPA_FONT_FACE_CSS, GDSHERPA_PRELOAD_HREFS } from './gdsherpa-font.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    // Package stories and documentation
    '../../../packages/@bento/*/*.mdx',
    '../../../packages/@bento/*/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/@godaddy/antares/README.mdx',
    '../../../packages/@godaddy/antares/components/**/*.mdx',
    '../../../packages/@godaddy/antares/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',

    // Documentation (PDRs, Architecture, etc.) - excluding templates
    '../../../docs/**/!(*TEMPLATE)*.mdx'
  ],

  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkFrontmatter, remarkFrontmatterHeading, remarkGfm]
          }
        }
      }
    },
    // join(__dirname, './addons/why-did-you-render/index.ts'),
    '@storybook/addon-a11y',
    '@storybook/addon-onboarding',
    '@storybook/addon-themes',
    {
      name: '@bento/storybook-addon-helpers',
      options: { docsDefaults }
    },
    join(__dirname, './addons/internal-stories/preset.ts')
  ],

  tags: {
    internal: {
      defaultFilterSelection: 'exclude'
    }
  },

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  core: {
    disableTelemetry: true,
    enableCrashReports: false
  },

  typescript: {
    reactDocgen: false
  },

  previewHead: (head) =>
    `${head ?? ''}
    ${GDSHERPA_PRELOAD_HREFS.map(
      (href) => `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin="anonymous">`
    ).join('\n    ')}
    <style>${GDSHERPA_FONT_FACE_CSS}</style>`,

  async viteFinal(config: UserConfig) {
    const versionMatch = packageJson.version.match(/^(\d+)\.(\d+)\.(\d+)/)?.slice(1) ?? ['0', '0', '0'];

    // @bento/internal-props is aliased to source here, and its source relies on
    // build-time globals `major`/`minor`/`patch` (see its own tsdown.config.ts).
    // These must be supplied via Vite's top-level `define`, which is applied in
    // BOTH dev and the rolldown production build. The `esbuild` option's define
    // only takes effect in dev (per-module esbuild transform) and is silently
    // dropped during the production build, leaving a bare, undefined `major`
    // identifier in the bundle ("major is not defined").
    //
    // Values are injected as raw source, so they must be stringified to become
    // string literals. Without this, "0" would be inlined as the numeric literal
    // 0, which is falsy and gets dropped by `.filter(Boolean)` in
    // @bento/internal-props — changing the namespace for 0.x versions.
    const define = {
      major: JSON.stringify(versionMatch[0]),
      minor: JSON.stringify(versionMatch[1]),
      patch: JSON.stringify(versionMatch[2])
    };

    // Packages that are in dev/ folder but still use @bento namespace
    const devPackages = ['storybook-addon-helpers', 'environment'];

    return mergeConfig(config, {
      // Set base path for GitHub Pages subpath deployment
      ...(process.env.STORYBOOK_BASE_PATH ? { base: process.env.STORYBOOK_BASE_PATH } : {}),

      // Set envDir to workspace root for proper monorepo support
      envDir: resolve(__dirname, '../../../'),

      define,

      plugins: [
        replace({
          preventAssignment: true,
          __ICON_CDN_URL__: generateCdnUrl({
            cdn: CDN,
            packageName: ICON_PACKAGE,
            version: DESIGN_ASSETS_VERSION
          })
        })
      ],

      // Exclude @bento and packages from optimization so they can be watched and hot-reloaded
      optimizeDeps: {
        exclude: ['@bento/*', '@godaddy/*']
      },

      // Resolve @bento packages to their source files instead of built dist
      resolve: {
        alias: [
          // Dev packages with @bento namespace
          ...devPackages.map((pkg) => ({
            find: new RegExp(`^@bento/${pkg}$`),
            replacement: resolve(__dirname, `../../../packages/dev/${pkg}/src`)
          })),
          {
            find: /^@bento\/storybook-addon-helpers\/runtime$/,
            replacement: resolve(__dirname, '../../../packages/dev/storybook-addon-helpers/src/runtime.ts')
          },
          // Regular @bento packages
          {
            find: /^@bento\/(.*)$/,
            replacement: resolve(__dirname, '../../../packages/@bento/$1/src')
          },
          // "@godaddy/antares/<subpath>" resolves to "packages/@godaddy/antares/exports/<subpath>.ts"
          {
            find: /^@godaddy\/([^/]+)\/(.+)$/,
            replacement: resolve(__dirname, '../../../packages/@godaddy/$1/exports/$2.ts')
          },
          // "@godaddy/antares" resolves to "packages/@godaddy/antares/index.ts"
          {
            find: /^@godaddy\/([^/]+)$/,
            replacement: resolve(__dirname, '../../../packages/@godaddy/$1/index.ts')
          }
        ]
      }
    });
  }
};

export default config;
