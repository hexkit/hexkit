import { ArgumentsCamelCase, Argv, type CommandModule } from 'yargs';

import { createEnvironmentService } from '../generators/createEnvironmentService.js';

enum PatternEnum {
  envService = 'env:service',
}

const AVAILABLE_PATTERNS: PatternEnum[] = Object.values(PatternEnum);

interface CreateCommandArgs {
  pattern: PatternEnum;
  package: string;
}

export const createCommand: CommandModule<unknown, CreateCommandArgs> = {
  builder: (yargs: Argv): Argv<CreateCommandArgs> => {
    return yargs
      .positional('pattern', {
        choices: AVAILABLE_PATTERNS,
        demandOption: true,
        describe: 'The pattern to create',
        type: 'string',
      } as const)
      .option('package', {
        alias: 'p',
        demandOption: true,
        describe: 'The package name where files will be generated',
        type: 'string',
      });
  },
  command: 'create <pattern>',
  describe: 'Create a new component from a pattern',
  handler: async (argv: ArgumentsCamelCase<CreateCommandArgs>) => {
    const { pattern, package: packagePath }: CreateCommandArgs = argv;

    try {
      switch (pattern) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        case PatternEnum.envService:
          await createEnvironmentService(packagePath);
          console.log(
            `✓ Created ${PatternEnum.envService} modules in package "${packagePath}"`,
          );
          break;
      }
    } catch (error: unknown) {
      throw new Error(`Error creating ${pattern}`, {
        cause: error,
      });
    }
  },
};
