import { Wrapper } from '@hexkit/patterns';

import { PrismaTransactionWrapper } from '../models/PrismaTransactionWrapper';

export abstract class BasePrismaService<TDelegate, TTransactionClient> {
  protected readonly _delegate: TDelegate;

  constructor(delegate: TDelegate) {
    this._delegate = delegate;
  }

  protected async _getDelegateFromWrapper(
    transaction?: Wrapper<unknown>,
  ): Promise<TDelegate> {
    if (transaction === undefined) {
      return this._delegate;
    }

    return this._getDelegate(await this.#getTransactionClient(transaction));
  }

  async #getTransactionClient(
    transaction: Wrapper<unknown>,
  ): Promise<TTransactionClient> {
    if (!PrismaTransactionWrapper.is<TTransactionClient>(transaction)) {
      throw new Error(
        'Invalid transaction wrapper provided. Expected a PrismaTransactionWrapper.',
      );
    }

    return transaction.unwrap();
  }

  protected abstract _getDelegate(
    transactionClient: TTransactionClient,
  ): TDelegate;
}
