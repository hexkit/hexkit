# Monorepo initialization

1. Initialize git

```bash
git init
```

2. Create a new package.json with `changesets`, `commitlint`, `husky`, `knip`, `lint-staged` and `turbo`:

```json
{
  "name": "root",
  "devDependencies": {
    "@changesets/cli": "2.29.8",
    "@commitlint/cli": "20.3.0",
    "@commitlint/config-conventional": "20.3.0",
    "@commitlint/prompt-cli": "20.3.0",
    "husky": "9.1.7",
    "knip": "5.79.0",
    "lint-staged": "16.2.7",
    "turbo": "2.7.2"
  },
  "scripts": {
    "build": "turbo run build",
    "commit": "commit",
    "format": "turbo run format",
    "lint": "turbo run lint",
    "prepare": "husky && turbo telemetry disable",
    "prerelease": "pnpm run build",
    "release": "changeset publish",
    "test:integration": "turbo test:integration",
    "test": "turbo run test",
    "test:coverage": "turbo run test:coverage",
    "test:uncommitted": "turbo run test:uncommitted --filter [HEAD]",
    "test:unit": "turbo run test:unit",
    "unused": "knip"
  },
  "license": "MIT",
  "packageManager": "pnpm@10.26.1",
  "private": true
}
```

**Note** fetch latest versions from the npm registry

3. Add a `pnpm-workspace.yaml` file:

```yaml
packages:
  - 'packages/backend/apps/*/*'
  - 'packages/backend/libraries/*'
  - 'packages/backend/tools/*'
```

4. A a root `.gitignore` file:

```sh
### Turbo ###
/.turbo

### Visual Studio Code ###
/.vscode/*
!/.vscode/settings.json
!/.vscode/tasks.json
!/.vscode/launch.json
!/.vscode/extensions.json
!/.vscode/*.code-snippets

# node modules
/node_modules/

### npm lock files (consider https://github.com/yarnpkg/yarn/issues/838#issuecomment-253362537 as reference)
/package-lock.json
/pnpm-lock.yaml
/yarn.lock
```

5. Add a `.npmrc` file:

```
enable-pre-post-scripts=true
strict-peer-dependencies=false

```

6. Add a root `.lintstagedrc.json` to match no files. This is a convenient workaround to force lint-staged work on a monorepo setup even if the monorepo only has a single package:

```json
{
  "*.this-will-never-match": "echo"
}

```

7. Add a `knip.ts` config file:

```ts
import { type KnipConfig, type WorkspaceProjectConfig } from "knip";

const defaultWorkspaceProjectConfig: WorkspaceProjectConfig & {
  entry: string[];
  ignoreDependencies: string[];
  project: string[];
} = {
  entry: [
    "{index,cli,main}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
    "src/{index,cli,main}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
    "**/?(*.)+(spec|spec-d).[jt]s?(x)",
  ],
  ignoreDependencies: ["tslib"],
  project: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!", "!**/__mocks__"],
};

export default {
  commitlint: {
    config: "config/commitlint/commitlint.config.js",
  },
  workspaces: {
    ".": {
      entry: [],
      ignoreDependencies: [],
      project: [],
    },
    "packages/backend/apps/*/*": defaultWorkspaceProjectConfig,
    "packages/backend/libraries/*": defaultWorkspaceProjectConfig,
    "packages/backend/tools/*": defaultWorkspaceProjectConfig,
  },
} satisfies KnipConfig;

```

8. Add commitlint config at `config/commitlint/commitlint.config.js`:

```js
module.exports = { extends: ['@commitlint/config-conventional'] };

```

9. Add husky hooks:

**.husky/commit-msg** (has executable permissions!)

```bash
#!/bin/bash

SCRIPT_DIR=$( pwd )

pnpm exec commitlint --config "$SCRIPT_DIR/config/commitlint/commitlint.config.js" --edit ""

```

**.husky/pre-commit**

```bash
#!/bin/bash

pnpm run test:uncommitted
pnpm exec lint-staged

```

10. Add turborepo config:

**turbo.json**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{cts,mts,ts,tsx}"],
      "outputs": ["dist/**", "lib/**"]
    },
    "format": {
      "inputs": ["src/**/*.{cts,mts,ts,tsx}"],
      "outputs": ["src/**/*.{cts,mts,ts,tsx}"]
    },
    "lint": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{cts,mts,ts,tsx}"]
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{cts,mts,ts,tsx}"],
      "outputs": []
    },
    "test:integration": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{cts,mts,ts,tsx}"],
      "outputs": []
    },
    "test:coverage": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{cts,mts,ts,tsx}"],
      "outputs": ["coverage/**"]
    },
    "test:mutation": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{cts,mts,ts}"],
      "outputs": ["reports/**"]
    },
    "test:uncommitted": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{cts,mts,ts,tsx}"],
      "outputs": []
    },
    "test:unit": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.{cts,mts,ts,tsx}"],
      "outputs": []
    }
  },
  "ui": "tui"
}
```

11. Install dependencies:

```bash
pnpm i
```
