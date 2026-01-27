import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import ts from 'typescript';

import { createPrismaBaseServices } from './createPrismaBaseServices.js';

const TEST_DIR: string = './tmp/test/createPrismaBaseServices';

const TSCONFIG_CONTENT: string = JSON.stringify(
  {
    $schema: 'http://json.schemastore.org/tsconfig',
    compilerOptions: {
      noEmit: true,
      rootDir: '.',
      skipLibCheck: true,
    },
    extends: '@hexkit/typescript-config/tsconfig.base.esm.json',
    include: ['src', 'generated'],
  },
  null,
  2,
);

// Mock PrismaClient and runtime to satisfy imports in generated files
const MOCK_PRISMA_CLIENT_CONTENT: string = `export interface PrismaClient {}
`;

const MOCK_RUNTIME_CLIENT_CONTENT: string = `export type ITXClientDenyList = '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends';
`;

function runTsc(configPath: string): ts.Diagnostic[] {
  const configFile: {
    config?: Record<string, unknown>;
    error?: ts.Diagnostic;
  } = ts.readConfigFile(configPath, ts.sys.readFile);

  if (configFile.error !== undefined) {
    return [configFile.error];
  }

  const parsedCommandLine: ts.ParsedCommandLine = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    TEST_DIR,
  );

  const program: ts.Program = ts.createProgram({
    options: parsedCommandLine.options,
    rootNames: parsedCommandLine.fileNames,
  });

  const diagnostics: readonly ts.Diagnostic[] =
    ts.getPreEmitDiagnostics(program);

  return [...diagnostics];
}

function formatDiagnostics(diagnostics: ts.Diagnostic[]): string {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName: string) => fileName,
    getCurrentDirectory: () => TEST_DIR,
    getNewLine: () => '\n',
  });
}

describe(createPrismaBaseServices, () => {
  describe('when called with a valid package path', () => {
    let diagnostics: ts.Diagnostic[];

    beforeAll(async () => {
      await mkdir(TEST_DIR, { recursive: true });

      const tsconfigPath: string = join(TEST_DIR, 'tsconfig.json');
      await writeFile(tsconfigPath, TSCONFIG_CONTENT, 'utf-8');

      // Create mock generated directory with PrismaClient and runtime
      const generatedDir: string = join(TEST_DIR, 'generated');
      await mkdir(generatedDir, { recursive: true });
      await writeFile(
        join(generatedDir, 'index.ts'),
        MOCK_PRISMA_CLIENT_CONTENT,
        'utf-8',
      );

      const runtimeDir: string = join(generatedDir, 'runtime');
      await mkdir(runtimeDir, { recursive: true });
      await writeFile(
        join(runtimeDir, 'client.ts'),
        MOCK_RUNTIME_CLIENT_CONTENT,
        'utf-8',
      );

      await createPrismaBaseServices(TEST_DIR);

      diagnostics = runTsc(tsconfigPath);
    });

    afterAll(async () => {
      await rm(TEST_DIR, { force: true, recursive: true });
    });

    it('should create files that compile without TypeScript errors', () => {
      expect(
        diagnostics,
        `TypeScript errors:\n${formatDiagnostics(diagnostics)}`,
      ).toHaveLength(0);
    });
  });
});
