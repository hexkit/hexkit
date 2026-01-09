import { Builder, BuilderAsync, Wrapper } from '@hexkit/patterns';

import { PrismaCreationDelegate } from '../models/PrismaCreationDelegate';
import { BasePrismaService } from './BasePrismaService';

export abstract class CreateManyPrismaService<
  TModel,
  TCreateQuery,
  TPrismaCreateManyArgs,
  TPrismaModel,
  TTransactionClient,
> extends BasePrismaService<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaCreationDelegate<any, TPrismaCreateManyArgs, TPrismaModel>,
  TTransactionClient
> {
  readonly #modelFromPrismaModelBuilder:
    | Builder<TModel, [TPrismaModel]>
    | BuilderAsync<TModel, [TPrismaModel]>;
  readonly #prismaCreateManyArgsFromCreateQueryBuilder:
    | Builder<TPrismaCreateManyArgs, [TCreateQuery]>
    | BuilderAsync<TPrismaCreateManyArgs, [TCreateQuery]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaCreationDelegate<any, TPrismaCreateManyArgs, TPrismaModel>,
    modelFromPrismaModelBuilder:
      | Builder<TModel, [TPrismaModel]>
      | BuilderAsync<TModel, [TPrismaModel]>,
    prismaCreateManyArgsFromCreateQueryBuilder:
      | Builder<TPrismaCreateManyArgs, [TCreateQuery]>
      | BuilderAsync<TPrismaCreateManyArgs, [TCreateQuery]>,
  ) {
    super(delegate);

    this.#modelFromPrismaModelBuilder = modelFromPrismaModelBuilder;
    this.#prismaCreateManyArgsFromCreateQueryBuilder =
      prismaCreateManyArgsFromCreateQueryBuilder;
  }

  public async createMany(
    query: TCreateQuery,
    transaction?: Wrapper<unknown>,
  ): Promise<TModel[]> {
    const delegate: PrismaCreationDelegate<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      TPrismaCreateManyArgs,
      TPrismaModel
    > = await this._getDelegateFromWrapper(transaction);

    const prismaCreateManyArgs: TPrismaCreateManyArgs =
      await this.#prismaCreateManyArgsFromCreateQueryBuilder.build(query);

    const prismaModels: TPrismaModel[] =
      await delegate.createManyAndReturn(prismaCreateManyArgs);

    return Promise.all(
      prismaModels.map(async (prismaModel: TPrismaModel) =>
        this.#modelFromPrismaModelBuilder.build(prismaModel),
      ),
    );
  }
}
