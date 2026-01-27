# Create Prisma adapter package

This task involves creating a new package within the monorepo that serves as a Prisma adapter for the application. This package will implement the repository pattern using Prisma ORM to interact with the database.

## Steps to create the Prisma adapter package

Create a new folder at `packages/backend/apps/[app]/prisma-adapter` where `[app]` is the name of the application.

Follow the [create package](../create-package.md) task instructions to set up the basic structure of the package.

After that, install prisma dependencies and `@hexkit/prisma`:

```json
{
  "dependencies": {
    "@hexkit/prisma": "~0.1.1",
    "@prisma/adapter-pg": "^7.2.0",
    "@prisma/client": "^7.2.0",
    "@prisma/client-runtime-utils": "^7.2.0"
  },
  "devDependencies": {
    "prisma": "7.2.0"
  }
}

```

Of course, install latest versions of the packages and don't remove previously added dependencies.

After that, initialize prisma in the package:

```bash
pnpm exec prisma
pnpm exec prisma init --datasource-provider postgresql --output ../generated
```

Update `.env` file and `prisma.config.ts` file to use env variables prefixed with `BACKEND_[APP]_PRISMA_`.

`prisma.config.ts`:
```ts
import path from 'node:path';

import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('BACKEND_USER_DATABASE_CONNECTION_STRING'),
    shadowDatabaseUrl: env('BACKEND_USER_SHADOW_DATABASE_CONNECTION_STRING'),
  },
  schema: path.join('prisma', 'schema.prisma'),
});

```

Implement base services:

`src/foundation/adapter/prisma/services/BaseCreatePrismaService.ts`:
```ts
import { CreatePrismaService } from '@hexkit/prisma';

import { PrismaClient } from '../../../../../generated';
import * as runtime from '../../../../../generated/runtime/client.js';

export abstract class BaseCreatePrismaService<
  TModel,
  TCreateQuery,
  TPrismaCreateArgs,
  TPrismaModel,
> extends CreatePrismaService<
  TModel,
  TCreateQuery,
  TPrismaCreateArgs,
  TPrismaModel,
  Omit<PrismaClient, runtime.ITXClientDenyList>
> {}

```

`src/foundation/adapter/prisma/services/BaseCreateManyPrismaService.ts`:
```ts
import { CreateManyPrismaService } from '@hexkit/prisma';

import { PrismaClient } from '../../../../../generated';
import * as runtime from '../../../../../generated/runtime/client.js';

export abstract class BaseCreateManyPrismaService<
  TModel,
  TCreateQuery,
  TPrismaCreateManyArgs,
  TPrismaModel,
> extends CreateManyPrismaService<
  TModel,
  TCreateQuery,
  TPrismaCreateManyArgs,
  TPrismaModel,
  Omit<PrismaClient, runtime.ITXClientDenyList>
> {}

```

`src/foundation/adapter/prisma/services/BaseDeleteManyPrismaService.ts`:
```ts
import { DeleteManyPrismaService } from '@hexkit/prisma';

import { PrismaClient } from '../../../../../generated';
import * as runtime from '../../../../../generated/runtime/client.js';

export abstract class BaseDeleteManyPrismaService<
  TModel,
  TDeleteQuery,
  TPrismaDeleteManyArgs,
  TPrismaModel,
> extends DeleteManyPrismaService<
  TModel,
  TDeleteQuery,
  TPrismaDeleteManyArgs,
  TPrismaModel,
  Omit<PrismaClient, runtime.ITXClientDenyList>
> {}

```

`src/foundation/adapter/prisma/services/BaseFindFirstPrismaService.ts`:
```ts
import { FindFirstPrismaService } from '@hexkit/prisma';

import { PrismaClient } from '../../../../../generated';
import * as runtime from '../../../../../generated/runtime/client.js';

export abstract class BaseFindFirstPrismaService<
  TModel,
  TFindQuery,
  TPrismaFindArgs,
  TPrismaModel,
> extends FindFirstPrismaService<
  TModel,
  TFindQuery,
  TPrismaFindArgs,
  TPrismaModel,
  Omit<PrismaClient, runtime.ITXClientDenyList>
> {}

```

`src/foundation/adapter/prisma/services/BaseFindManyPrismaService.ts`:
```ts
import { FindManyPrismaService } from '@hexkit/prisma';

import { PrismaClient } from '../../../../../generated';
import * as runtime from '../../../../../generated/runtime/client.js';

export abstract class BaseFindManyPrismaService<
  TModel,
  TFindQuery,
  TPrismaFindManyArgs,
  TPrismaModel,
> extends FindManyPrismaService<
  TModel,
  TFindQuery,
  TPrismaFindManyArgs,
  TPrismaModel,
  Omit<PrismaClient, runtime.ITXClientDenyList>
> {}

```

`src/foundation/adapter/prisma/services/BaseUpdateManyPrismaService.ts`:
```ts
import { UpdateManyPrismaService } from '@hexkit/prisma';

import { PrismaClient } from '../../../../../generated';
import * as runtime from '../../../../../generated/runtime/client.js';

export abstract class BaseUpdateManyPrismaService<
  TModel,
  TUpdateQuery,
  TPrismaUpdateManyArgs,
  TPrismaModel,
> extends UpdateManyPrismaService<
  TModel,
  TUpdateQuery,
  TPrismaUpdateManyArgs,
  TPrismaModel,
  Omit<PrismaClient, runtime.ITXClientDenyList>
> {}

```
