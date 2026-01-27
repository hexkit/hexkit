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
  project: [
    "**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!",
    "!vitest.config.stryker.mjs",
    "!**/__mocks__",
  ],
};

export default {
  commitlint: {
    config: "config/commitlint/commitlint.config.js",
  },
  workspaces: {
    ".": {
      entry: [],
      ignoreDependencies: ["@hexkit/foundation-scripts"],
      project: [],
    },
    "packages/backend/*": defaultWorkspaceProjectConfig,
    "packages/backend/instructions": {
      ...defaultWorkspaceProjectConfig,
      ignoreDependencies: [
        ...defaultWorkspaceProjectConfig.ignoreDependencies,
        "@hexkit/dotenv",
        "@hexkit/prisma",
        "envalid",
        "inversify",
      ],
    },
    "packages/backend/tools/*": defaultWorkspaceProjectConfig,
    "packages/backend/tools/prettier-config": {
      entry: ["{cjs,esm}/index.{js,d.ts}"],
      ignoreDependencies: defaultWorkspaceProjectConfig.ignoreDependencies,
      project: defaultWorkspaceProjectConfig.project,
    },
    "packages/backend/tools/vitest-config": {
      ...defaultWorkspaceProjectConfig,
      entry: [...defaultWorkspaceProjectConfig.entry, "lib/index.d.ts"],
    },
  },
} satisfies KnipConfig;
