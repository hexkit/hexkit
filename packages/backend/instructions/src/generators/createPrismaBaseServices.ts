import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE_CREATE_PRISMA_SERVICE_TEMPLATE: string = `import { CreatePrismaService } from '@hexkit/prisma';

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
`;

const BASE_CREATE_MANY_PRISMA_SERVICE_TEMPLATE: string = `import { CreateManyPrismaService } from '@hexkit/prisma';

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
`;

const BASE_DELETE_MANY_PRISMA_SERVICE_TEMPLATE: string = `import { DeleteManyPrismaService } from '@hexkit/prisma';

import { PrismaClient } from '../../../../../generated';
import * as runtime from '../../../../../generated/runtime/client.js';

export abstract class BaseDeleteManyPrismaService<
  TDeleteQuery,
  TPrismaDeleteManyArgs,
> extends DeleteManyPrismaService<
  TDeleteQuery,
  TPrismaDeleteManyArgs,
  Omit<PrismaClient, runtime.ITXClientDenyList>
> {}
`;

const BASE_FIND_FIRST_PRISMA_SERVICE_TEMPLATE: string = `import { FindFirstPrismaService } from '@hexkit/prisma';

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
`;

const BASE_FIND_MANY_PRISMA_SERVICE_TEMPLATE: string = `import { FindManyPrismaService } from '@hexkit/prisma';

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
`;

const BASE_UPDATE_MANY_PRISMA_SERVICE_TEMPLATE: string = `import { UpdateManyPrismaService } from '@hexkit/prisma';

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
`;

interface GeneratedFile {
  path: string;
  content: string;
}

function getFilesToGenerate(packagePath: string): GeneratedFile[] {
  const basePath: string = join(
    packagePath,
    'src/foundation/adapter/prisma/services',
  );

  return [
    {
      content: BASE_CREATE_PRISMA_SERVICE_TEMPLATE,
      path: join(basePath, 'BaseCreatePrismaService.ts'),
    },
    {
      content: BASE_CREATE_MANY_PRISMA_SERVICE_TEMPLATE,
      path: join(basePath, 'BaseCreateManyPrismaService.ts'),
    },
    {
      content: BASE_DELETE_MANY_PRISMA_SERVICE_TEMPLATE,
      path: join(basePath, 'BaseDeleteManyPrismaService.ts'),
    },
    {
      content: BASE_FIND_FIRST_PRISMA_SERVICE_TEMPLATE,
      path: join(basePath, 'BaseFindFirstPrismaService.ts'),
    },
    {
      content: BASE_FIND_MANY_PRISMA_SERVICE_TEMPLATE,
      path: join(basePath, 'BaseFindManyPrismaService.ts'),
    },
    {
      content: BASE_UPDATE_MANY_PRISMA_SERVICE_TEMPLATE,
      path: join(basePath, 'BaseUpdateManyPrismaService.ts'),
    },
  ];
}

export async function createPrismaBaseServices(
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
    throw new Error('Failed to create Prisma base service files', {
      cause: error,
    });
  }
}
