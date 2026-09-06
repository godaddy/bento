# @godaddy/antares

The GoDaddy design component library. Each file in `exports/` becomes one public subpath, and `dist/` is build output.

Design proposals for the library live in `docs/pdrs/antares/`.

## Component work

Invoke the `antares-components` skill. It is the source of truth for file layout, imports, props, styling, spacing tokens, composition, tests, examples, stories, and README conventions.

## Build/Test

Run tasks through Nx, scoped to `@godaddy/antares` (prefix with the package manager, e.g. `npm exec nx`; don't run these on other workspaces):

```sh
npm exec nx run @godaddy/antares:typecheck
npm exec nx run @godaddy/antares:lint
npm exec nx run @godaddy/antares:build
npm exec nx run @godaddy/antares:test
npm exec nx run @godaddy/antares:test:node
```
