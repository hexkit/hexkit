# Create package

This task involves creating a new package within the monorepo for backend development. The package will follow the established source code structure and conventions.

## Steps to create the package

### Adding the package to the monorepo

- Create a new folder at the desired location.
- If the folder is not in the pnpm workspace, add the pattern to the `pnpm-workspace.yaml` file.

### Setting up config files and dev dependencies
- Add dev dependencies to the package's `package.json` file as needed. In order to install formatting, linting, build and testing tools we commonly install the following dev dependencies:

```json
{
  "author": "Author",
  "bugs": {
    "url": "https://github.com/your-org/repo/issues"
  },
  "description": "Package description",
  "devDependencies": {
    "@hexkit/eslint-config": "0.1.1",
    "@hexkit/prettier-config": "0.1.1",
    "@hexkit/typescript-config": "0.1.1",
    "eslint": "9.39.2",
    "prettier": "3.7.4",
    "rimraf": "6.1.2",
    "tslib": "2.8.1",
    "typescript": "5.9.3"
  },
  "devEngines": {
    "node": "^24.10.0",
    "pnpm": "^10.13.1"
  },
  "keywords": [
    "node",
    "typescript"
  ],
  "license": "MIT",
  "module": "lib/index.js",
  "exports": {
    ".": "./lib/index.js"
  },
  "name": "@your-org/package-name",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/repo.git"
  },
  "scripts": {
    "build": "tsc",
    "build:clean": "rimraf lib",
    "format": "prettier --write ./src",
    "lint": "eslint ./src",
    "prebuild": "pnpm run build:clean"
  },
  "type": "module",
  "version": "0.1.0"
}
```

Of course, install the latest versions of these packages.

This way we can define several config files for eslint, prettier and typescript that will be shared across all backend packages:

`eslint.config.mjs`:
```js
import { buildDefaultConfig } from '@hexkit/eslint-config';

export default [...buildDefaultConfig()];

```

`prettier.config.mjs`:
```js
import config from '@hexkit/prettier-config';

export default config;

```

`tsconfig.json`:
```json
{
  "$schema": "http://json.schemastore.org/tsconfig",
  "extends": "@hexkit/typescript-config/tsconfig.base.esm.json",
  "compilerOptions": {
    "outDir": "./lib",
    "rootDir": "./src"
  },
  "include": ["src"]
}

```

`.npmignore`:

```
/.turbo

**/*.ts
lib/**/*.d.ts.map
!lib/index.d.ts
!lib/index.d.ts.map

.lintstagedrc.json
eslint.config.mjs
prettier.config.mjs
tsconfig.json

```

`.gitignore`:

```
# Typescript compiled files
/lib/**

/tsconfig.tsbuildinfo

# Test coverage report
/coverage

# Test mutation report
/reports

# node modules
/node_modules/

# Turborepo files
.turbo/

```

`.lintstagedrc.json`:

```json
{
  "*.js": [
    "prettier --write"
  ],
  "*.ts": [
    "prettier --write",
    "eslint"
  ]
}

```

`vitest.config.mts`:

```ts
import config from '@hexkit/vitest-config';

export default config;

```

You might not need all of these files depending on the package type.

### Creating the source code structure

Add an empty `src/index.ts` file to the package.
