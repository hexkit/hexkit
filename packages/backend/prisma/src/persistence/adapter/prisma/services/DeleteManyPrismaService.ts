import { Builder, BuilderAsync, Wrapper } from '@hexkit/patterns';

import { PrismaBatchPayload } from '../models/PrismaBatchPayload.js';
import { PrismaDeletionDelegate } from '../models/PrismaDeletionDelegate.js';
import { BasePrismaService } from './BasePrismaService.js';

export abstract class DeleteManyPrismaService<
  TDeleteQuery,
  TPrismaDeleteManyArgs,
  TTransactionClient,
> extends BasePrismaService<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaDeletionDelegate<any, TPrismaDeleteManyArgs, any>,
  TTransactionClient
> {
  readonly #prismaDeleteManyArgsFromDeleteQueryBuilder:
    | Builder<TPrismaDeleteManyArgs, [TDeleteQuery]>
    | BuilderAsync<TPrismaDeleteManyArgs, [TDeleteQuery]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaDeletionDelegate<any, TPrismaDeleteManyArgs, any>,
    prismaDeleteManyArgsFromDeleteQueryBuilder:
      | Builder<TPrismaDeleteManyArgs, [TDeleteQuery]>
      | BuilderAsync<TPrismaDeleteManyArgs, [TDeleteQuery]>,
  ) {
    super(delegate);

    this.#prismaDeleteManyArgsFromDeleteQueryBuilder =
      prismaDeleteManyArgsFromDeleteQueryBuilder;
  }

  public async deleteMany(
    query: TDeleteQuery,
    transaction?: Wrapper<unknown>,
  ): Promise<number> {
    const delegate: PrismaDeletionDelegate<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      TPrismaDeleteManyArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    > = await this._getDelegateFromWrapper(transaction);

    const prismaDeleteManyArgs: TPrismaDeleteManyArgs =
      await this.#prismaDeleteManyArgsFromDeleteQueryBuilder.build(query);

    const batchPayload: PrismaBatchPayload =
      await delegate.deleteMany(prismaDeleteManyArgs);

    return batchPayload.count;
  }
}
