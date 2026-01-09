import { Builder, BuilderAsync, Wrapper } from '@hexkit/patterns';

import { PrismaFindDelegate } from '../models/PrismaFindDelegate';
import { BasePrismaService } from './BasePrismaService';

export abstract class FindManyPrismaService<
  TModel,
  TFindQuery,
  TPrismaFindManyArgs,
  TPrismaModel,
  TTransactionClient,
> extends BasePrismaService<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaFindDelegate<any, TPrismaFindManyArgs, TPrismaModel>,
  TTransactionClient
> {
  readonly #modelFromPrismaModelBuilder:
    | Builder<TModel, [TPrismaModel]>
    | BuilderAsync<TModel, [TPrismaModel]>;
  readonly #prismaFindManyArgsFromFindQueryBuilder:
    | Builder<TPrismaFindManyArgs, [TFindQuery]>
    | BuilderAsync<TPrismaFindManyArgs, [TFindQuery]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaFindDelegate<any, TPrismaFindManyArgs, TPrismaModel>,
    modelFromPrismaModelBuilder:
      | Builder<TModel, [TPrismaModel]>
      | BuilderAsync<TModel, [TPrismaModel]>,
    prismaFindManyArgsFromFindQueryBuilder:
      | Builder<TPrismaFindManyArgs, [TFindQuery]>
      | BuilderAsync<TPrismaFindManyArgs, [TFindQuery]>,
  ) {
    super(delegate);

    this.#modelFromPrismaModelBuilder = modelFromPrismaModelBuilder;
    this.#prismaFindManyArgsFromFindQueryBuilder =
      prismaFindManyArgsFromFindQueryBuilder;
  }

  public async findMany(
    query: TFindQuery,
    transaction?: Wrapper<unknown>,
  ): Promise<TModel[]> {
    const delegate: PrismaFindDelegate<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      TPrismaFindManyArgs,
      TPrismaModel
    > = await this._getDelegateFromWrapper(transaction);

    const prismaFindManyArgs: TPrismaFindManyArgs =
      await this.#prismaFindManyArgsFromFindQueryBuilder.build(query);

    const prismaModels: TPrismaModel[] =
      await delegate.findMany(prismaFindManyArgs);

    return Promise.all(
      prismaModels.map(async (prismaModel: TPrismaModel) =>
        this.#modelFromPrismaModelBuilder.build(prismaModel),
      ),
    );
  }
}
