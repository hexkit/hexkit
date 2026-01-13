import { Builder, BuilderAsync, Wrapper } from '@hexkit/patterns';

import { PrismaFindDelegate } from '../models/PrismaFindDelegate.js';
import { BasePrismaService } from './BasePrismaService.js';

export abstract class FindFirstPrismaService<
  TModel,
  TFindQuery,
  TPrismaFindArgs,
  TPrismaModel,
  TTransactionClient,
> extends BasePrismaService<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaFindDelegate<TPrismaFindArgs, any, TPrismaModel>,
  TTransactionClient
> {
  readonly #modelFromPrismaModelBuilder:
    | Builder<TModel, [TPrismaModel]>
    | BuilderAsync<TModel, [TPrismaModel]>;
  readonly #prismaFindArgsFromFindQueryBuilder:
    | Builder<TPrismaFindArgs, [TFindQuery]>
    | BuilderAsync<TPrismaFindArgs, [TFindQuery]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaFindDelegate<TPrismaFindArgs, any, TPrismaModel>,
    modelFromPrismaModelBuilder:
      | Builder<TModel, [TPrismaModel]>
      | BuilderAsync<TModel, [TPrismaModel]>,
    prismaFindArgsFromFindQueryBuilder:
      | Builder<TPrismaFindArgs, [TFindQuery]>
      | BuilderAsync<TPrismaFindArgs, [TFindQuery]>,
  ) {
    super(delegate);

    this.#modelFromPrismaModelBuilder = modelFromPrismaModelBuilder;
    this.#prismaFindArgsFromFindQueryBuilder =
      prismaFindArgsFromFindQueryBuilder;
  }

  public async findFirst(
    query: TFindQuery,
    transaction?: Wrapper<unknown>,
  ): Promise<TModel | null> {
    const delegate: PrismaFindDelegate<
      TPrismaFindArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      TPrismaModel
    > = await this._getDelegateFromWrapper(transaction);

    const prismaFindArgs: TPrismaFindArgs =
      await this.#prismaFindArgsFromFindQueryBuilder.build(query);

    const prismaModel: TPrismaModel | null =
      await delegate.findFirst(prismaFindArgs);

    if (prismaModel === null) {
      return null;
    }

    return this.#modelFromPrismaModelBuilder.build(prismaModel);
  }
}
