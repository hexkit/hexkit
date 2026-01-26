import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ENVIRONMENT_MODEL_TEMPLATE: string = `// TODO: Update environment properties
export interface Environment {
  apiKeys: {
    externalService: string;
  };
  corsOrigins: string[];
  databaseUrl: string;
  host: string;
  port: number;
  jwtSecret: string;
  jwtExpirationMs: number;
}
`;

const ENVIRONMENT_RAW_MODEL_TEMPLATE: string = `// TODO: Update raw environment variables
export interface EnvironmentRaw {
  BACKEND_USER_CORS_ORIGINS: string[];
  BACKEND_USER_DATABASE_URL: string;
  BACKEND_USER_EXTERNAL_SERVICE_API_KEY: string;
  BACKEND_USER_HOST: string;
  BACKEND_USER_JWT_SECRET: string;
  BACKEND_USER_JWT_EXPIRATION_MS: number;
  BACKEND_USER_PORT: number;
}
`;

// TODO: Update these constants to match your application
const ENVIRONMENT_LOADER_TEMPLATE: string = `import { DotEnvLoader } from '@hexkit/dotenv';
import { cleanEnv, json, num, str, url } from 'envalid';
import { injectable } from 'inversify';

import { Environment } from '../../../application/models/Environment.js';
import { EnvironmentRaw } from '../../../application/models/EnvironmentRaw.js';

const DEFAULT_DOT_ENV_PATH: string = '.env';
const DOT_ENV_PATH_ENV_VAR: string = 'APP_DOT_ENV_PATH';
const DOT_ENV_ENABLED_ENV_VAR: string = 'APP_DOT_ENV_ENABLED';

@injectable()
export class EnvironmentLoader extends DotEnvLoader<Environment> {
  public static build(): EnvironmentLoader {
    const dotEnvPath: string =
      process.env[DOT_ENV_PATH_ENV_VAR] ?? DEFAULT_DOT_ENV_PATH;

    const environmentLoader: EnvironmentLoader = new EnvironmentLoader(
      dotEnvPath,
    );

    return environmentLoader;
  }

  protected _parseEnv(env: Record<string, string>): Environment {
    const rawEnv: EnvironmentRaw = cleanEnv(env, {
      BACKEND_USER_CORS_ORIGINS: json(),
      BACKEND_USER_DATABASE_URL: url(),
      BACKEND_USER_EXTERNAL_SERVICE_API_KEY: str(),
      BACKEND_USER_HOST: str(),
      BACKEND_USER_JWT_SECRET: str(),
      BACKEND_USER_JWT_EXPIRATION_MS: num(),
      BACKEND_USER_PORT: num(),
    });

    return {
      apiKeys: {
        externalService: rawEnv.BACKEND_USER_EXTERNAL_SERVICE_API_KEY,
      },
      corsOrigins: rawEnv.BACKEND_USER_CORS_ORIGINS,
      databaseUrl: rawEnv.BACKEND_USER_DATABASE_URL,
      host: rawEnv.BACKEND_USER_HOST,
      jwtSecret: rawEnv.BACKEND_USER_JWT_SECRET,
      jwtExpirationMs: rawEnv.BACKEND_USER_JWT_EXPIRATION_MS,
      port: rawEnv.BACKEND_USER_PORT,
    };
  }

  protected override _shouldParseEnvFile(): boolean {
    return process.env[DOT_ENV_ENABLED_ENV_VAR] !== 'false';
  }
}
`;

const ENVIRONMENT_SERVICE_TEMPLATE: string = `import { inject, injectable } from 'inversify';

import { EnvironmentLoader } from '../../adapter/dotenv/services/EnvironmentLoader.js';
import { Environment } from '../models/Environment.js';

@injectable()
export class EnvironmentService {
  readonly #environmentLoader: EnvironmentLoader;

  constructor(
    @inject(EnvironmentLoader)
    environmentLoader: EnvironmentLoader,
  ) {
    this.#environmentLoader = environmentLoader;
  }

  public getEnvironment(): Environment {
    return this.#environmentLoader.env;
  }
}
`;

// TODO: Update the environment fixture to match your application
const ENVIRONMENT_SERVICE_SPEC_TEMPLATE: string = `import type { Mocked } from 'vitest';
import { beforeAll, describe, expect, it } from 'vitest';

import { Environment } from '../models/Environment.js';
import { EnvironmentLoader } from '../../adapter/dotenv/services/EnvironmentLoader.js';
import { EnvironmentService } from './EnvironmentService.js';

describe(EnvironmentService, () => {
  let environmentLoaderMock: Mocked<EnvironmentLoader>;
  let environmentService: EnvironmentService;

  beforeAll(() => {
    const environmentFixture: Environment = {
      apiKeys: {
        externalService: 'test-api-key',
      },
      corsOrigins: ['http://localhost:3000'],
      databaseUrl: 'postgresql://user:pass@localhost:5432/db',
      host: '127.0.0.1',
      port: 3001,
      jwtSecret: 'test-jwt-secret',
      jwtExpirationMs: 3600000,
    };

    environmentLoaderMock = {
      env: environmentFixture,
    } as Mocked<EnvironmentLoader>;

    environmentService = new EnvironmentService(environmentLoaderMock);
  });

  describe('.getEnvironment', () => {
    describe('when called', () => {
      let result: Environment;

      beforeAll(() => {
        result = environmentService.getEnvironment();
      });

      it('should return the environment from the loader', () => {
        expect(result).toBe(environmentLoaderMock.env);
      });
    });
  });
});
`;

interface GeneratedFile {
  path: string;
  content: string;
}

function getFilesToGenerate(packagePath: string): GeneratedFile[] {
  return [
    {
      content: ENVIRONMENT_MODEL_TEMPLATE,
      path: join(
        packagePath,
        'src/foundation/application/models/Environment.ts',
      ),
    },
    {
      content: ENVIRONMENT_RAW_MODEL_TEMPLATE,
      path: join(
        packagePath,
        'src/foundation/application/models/EnvironmentRaw.ts',
      ),
    },
    {
      content: ENVIRONMENT_LOADER_TEMPLATE,
      path: join(
        packagePath,
        'src/foundation/adapter/dotenv/services/EnvironmentLoader.ts',
      ),
    },
    {
      content: ENVIRONMENT_SERVICE_TEMPLATE,
      path: join(
        packagePath,
        'src/foundation/application/services/EnvironmentService.ts',
      ),
    },
    {
      content: ENVIRONMENT_SERVICE_SPEC_TEMPLATE,
      path: join(
        packagePath,
        'src/foundation/application/services/EnvironmentService.spec.ts',
      ),
    },
  ];
}

export async function createEnvironmentService(
  packagePath: string,
): Promise<void> {
  const files: GeneratedFile[] = getFilesToGenerate(packagePath);

  try {
    for (const file of files) {
      // Ensure the directory exists
      const dir: string = join(file.path, '..');
      await mkdir(dir, { recursive: true });

      // Write the file
      await writeFile(file.path, file.content, 'utf-8');
      console.log(`  Created: ${file.path}`);
    }
  } catch (error: unknown) {
    throw new Error('Failed to create environment service files', {
      cause: error,
    });
  }
}
