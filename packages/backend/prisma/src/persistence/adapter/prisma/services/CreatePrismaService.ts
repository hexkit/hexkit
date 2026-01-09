import { Builder, BuilderAsync, Wrapper } from '@hexkit/patterns';

import { PrismaCreationDelegate } from '../models/PrismaCreationDelegate';
import { BasePrismaService } from './BasePrismaService';

export abstract class CreatePrismaService<
  TModel,
  TCreateQuery,
  TPrismaCreateArgs,
  TPrismaModel,
  TTransactionClient,
> extends BasePrismaService<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaCreationDelegate<TPrismaCreateArgs, any, TPrismaModel>,
  TTransactionClient
> {
  readonly #modelFromPrismaModelBuilder:
    | Builder<TModel, [TPrismaModel]>
    | BuilderAsync<TModel, [TPrismaModel]>;
  readonly #prismaCreateArgsFromCreateQueryBuilder:
    | Builder<TPrismaCreateArgs, [TCreateQuery]>
    | BuilderAsync<TPrismaCreateArgs, [TCreateQuery]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaCreationDelegate<TPrismaCreateArgs, any, TPrismaModel>,
    modelFromPrismaModelBuilder:
      | Builder<TModel, [TPrismaModel]>
      | BuilderAsync<TModel, [TPrismaModel]>,
    prismaCreateArgsFromCreateQueryBuilder:
      | Builder<TPrismaCreateArgs, [TCreateQuery]>
      | BuilderAsync<TPrismaCreateArgs, [TCreateQuery]>,
  ) {
    super(delegate);

    this.#modelFromPrismaModelBuilder = modelFromPrismaModelBuilder;
    this.#prismaCreateArgsFromCreateQueryBuilder =
      prismaCreateArgsFromCreateQueryBuilder;
  }

  public async create(
    query: TCreateQuery,
    transaction?: Wrapper<unknown>,
  ): Promise<TModel> {
    const delegate: PrismaCreationDelegate<
      TPrismaCreateArgs,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      TPrismaModel
    > = await this._getDelegateFromWrapper(transaction);

    const prismaCreateArgs: TPrismaCreateArgs =
      await this.#prismaCreateArgsFromCreateQueryBuilder.build(query);

    const prismaModel: TPrismaModel = await delegate.create(prismaCreateArgs);

    return this.#modelFromPrismaModelBuilder.build(prismaModel);
  }
}
