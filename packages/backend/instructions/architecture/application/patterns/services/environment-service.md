# Environment Service

The Environment Service pattern provides a centralized and type-safe way to access application configuration and environment variables throughout the application.

## Structure

The pattern typically consists of four main components:

1. **Environment Model**: An interface or type that defines the shape of the configuration
2. **Environment Raw Model**: An interface or type that defines the raw environment variables as validated by envalid
3. **Environment Loader**: A service responsible for loading, parsing, and validating environment variables
4. **Environment Service**: A simple service that provides access to the loaded environment configuration

You SHOULD create these components using the `hexkit` cli generator (available in @hexkit/instructions):

```bash
pnpm exec hexkit create env:service -p ./packages/backend/apps/[app]/env
```

This command will generate the necessary files in the specified package path passed to the `-p` option.

You can update generated models later to fit your application's specific configuration needs.

## Example

### Environment Model

`src/foundation/application/models/Environment.ts`
```typescript
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
```

### Environment Raw Model

`src/foundation/application/models/EnvironmentRaw.ts`
```typescript
export interface EnvironmentRaw {
  BACKEND_USER_CORS_ORIGINS: string[];
  BACKEND_USER_DATABASE_URL: string;
  BACKEND_USER_EXTERNAL_SERVICE_API_KEY: string;
  BACKEND_USER_HOST: string;
  BACKEND_USER_JWT_SECRET: string;
  BACKEND_USER_JWT_EXPIRATION_MS: number;
  BACKEND_USER_PORT: number;
}
```

### Environment Loader

`src/foundation/adapter/dotenv/services/EnvironmentLoader.ts`
```typescript
import { DotEnvLoader } from '@hexkit/dotenv';
import { injectable } from 'inversify';
import { cleanEnv, str, num, url, json } from 'envalid';

import { Environment } from '../../../application/models/Environment';
import { EnvironmentRaw } from '../../../application/models/EnvironmentRaw';

const DEFAULT_DOT_ENV_PATH: string = '.env';
const DOT_ENV_PATH_ENV_VAR: string = 'ONE_JS_USER_SERVICE_DOT_ENV_PATH';
const DOT_ENV_ENABLED_ENV_VAR: string = 'ONE_JS_USER_SERVICE_DOT_ENV_ENABLED';

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
```

### Environment Service

`src/foundation/application/services/EnvironmentService.ts`
```typescript
import { inject, injectable } from 'inversify';

import { EnvironmentLoader } from '../../adapter/dotenv/services/EnvironmentLoader';
import { Environment } from '../models/Environment';

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
```

## Usage

The Environment Service is typically injected into other services, builders, or controllers that need access to configuration.
