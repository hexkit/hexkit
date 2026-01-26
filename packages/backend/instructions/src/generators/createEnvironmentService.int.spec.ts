import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import ts from 'typescript';

import { createEnvironmentService } from './createEnvironmentService.js';

const TEST_DIR: string = './tmp/test/createEnvironmentService';

const TSCONFIG_CONTENT: string = JSON.stringify(
  {
    $schema: 'http://json.schemastore.org/tsconfig',
    compilerOptions: {
      noEmit: true,
      rootDir: './src',
      skipLibCheck: true,
    },
    extends: '@hexkit/typescript-config/tsconfig.base.esm.json',
    include: ['src'],
  },
  null,
  2,
);

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

describe(createEnvironmentService, () => {
  describe('when called with a valid package name', () => {
    let diagnostics: ts.Diagnostic[];

    beforeAll(async () => {
      await mkdir(TEST_DIR, { recursive: true });

      const tsconfigPath: string = join(TEST_DIR, 'tsconfig.json');
      await writeFile(tsconfigPath, TSCONFIG_CONTENT, 'utf-8');

      await createEnvironmentService(TEST_DIR);

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
