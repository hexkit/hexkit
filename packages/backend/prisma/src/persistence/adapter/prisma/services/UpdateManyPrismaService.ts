import { Builder, BuilderAsync, Wrapper } from '@hexkit/patterns';

import { PrismaUpdateDelegate } from '../models/PrismaUpdateDelegate.js';
import { BasePrismaService } from './BasePrismaService.js';

export abstract class UpdateManyPrismaService<
  TModel,
  TUpdateQuery,
  TPrismaUpdateManyArgs,
  TPrismaModel,
  TTransactionClient,
> extends BasePrismaService<
  PrismaUpdateDelegate<TPrismaUpdateManyArgs, TPrismaModel>,
  TTransactionClient
> {
  readonly #modelFromPrismaModelBuilder:
    | Builder<TModel, [TPrismaModel]>
    | BuilderAsync<TModel, [TPrismaModel]>;
  readonly #prismaUpdateManyArgsFromUpdateQueryBuilder:
    | Builder<TPrismaUpdateManyArgs, [TUpdateQuery]>
    | BuilderAsync<TPrismaUpdateManyArgs, [TUpdateQuery]>;

  constructor(
    delegate: PrismaUpdateDelegate<TPrismaUpdateManyArgs, TPrismaModel>,
    modelFromPrismaModelBuilder:
      | Builder<TModel, [TPrismaModel]>
      | BuilderAsync<TModel, [TPrismaModel]>,
    prismaUpdateManyArgsFromUpdateQueryBuilder:
      | Builder<TPrismaUpdateManyArgs, [TUpdateQuery]>
      | BuilderAsync<TPrismaUpdateManyArgs, [TUpdateQuery]>,
  ) {
    super(delegate);

    this.#modelFromPrismaModelBuilder = modelFromPrismaModelBuilder;
    this.#prismaUpdateManyArgsFromUpdateQueryBuilder =
      prismaUpdateManyArgsFromUpdateQueryBuilder;
  }

  public async updateMany(
    query: TUpdateQuery,
    transaction?: Wrapper<unknown>,
  ): Promise<TModel[]> {
    const delegate: PrismaUpdateDelegate<TPrismaUpdateManyArgs, TPrismaModel> =
      await this._getDelegateFromWrapper(transaction);

    const prismaUpdateManyArgs: TPrismaUpdateManyArgs =
      await this.#prismaUpdateManyArgsFromUpdateQueryBuilder.build(query);

    const prismaModels: TPrismaModel[] =
      await delegate.updateManyAndReturn(prismaUpdateManyArgs);

    return Promise.all(
      prismaModels.map(async (prismaModel: TPrismaModel) =>
        this.#modelFromPrismaModelBuilder.build(prismaModel),
      ),
    );
  }
}
