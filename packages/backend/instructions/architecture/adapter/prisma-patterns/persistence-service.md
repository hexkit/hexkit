# Persistence Service Pattern with Prisma

This pattern consist of creating an adapter (and therefore, implementing a port) that uses the Prisma ORM to interact with the database.

## Example

A `FindManyUsersPrismaAdapter` that implements the `FindManyUsersOutputPort` using Prisma ORM might be implemented as follows:

`src/user/adapter/prisma/adapters/FindManyUsersPrismaAdapter.ts`
```ts
import { FindManyUsersOutputPort } from '@myorg/backend-auth-application';
import { User, UserFindQuery } from '@myorg/backend-auth-domain';
import { inject, injectable } from 'inversify';

import {
  Prisma,
  PrismaClient,
  User as PrismaUser,
} from '../../../../../generated';
import * as runtime from '../../../../../generated/runtime/client.js';
import { BaseFindManyPrismaService } from '../../../../foundation/adapter/prisma/services/BaseFindManyPrismaService.js';
import { UserFromUserPrismaBuilder } from '../builders/UserFromUserPrismaBuilder.js';
import { UserPrismaFindManyArgsFromUserFindQueryBuilder } from '../builders/UserPrismaFindManyArgsFromUserFindQueryBuilder.js';

@injectable()
export class FindManyUsersPrismaAdapter
  extends BaseFindManyPrismaService<
    User,
    UserFindQuery,
    Prisma.UserFindManyArgs,
    PrismaUser
  >
  implements FindManyUsersOutputPort
{
  constructor(
    @inject(PrismaClient)
    client: PrismaClient,
    @inject(UserFromUserPrismaBuilder)
    userFromUserPrismaBuilder: UserFromUserPrismaBuilder,
    @inject(UserPrismaFindManyArgsFromUserFindQueryBuilder)
    userPrismaFindManyArgsFromUserFindQueryBuilder: UserPrismaFindManyArgsFromUserFindQueryBuilder,
  ) {
    super(
      client.user,
      userFromUserPrismaBuilder,
      userPrismaFindManyArgsFromUserFindQueryBuilder,
    );
  }

  protected _getDelegate(
    transactionClient: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Prisma.UserDelegate<runtime.DefaultArgs, Prisma.PrismaClientOptions> {
    return transactionClient.user;
  }
}

```

The repo extends a base persistence service that handles the common logic for interacting with Prisma. It implements the `FindManyUsersOutputPort` interface, ensuring it adheres to the expected contract for finding multiple users.

Builders are used to convert between domain models and Prisma models/queries, promoting separation of concerns and maintainability.
