import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { PrismaClient } from './PrismaClient';

type Properties<TTransactionClient> = [
  Promise<void>,
  TTransactionClient,
  () => void,
  (reason: unknown) => void,
];

const isPrismaTransactionWrapperSymbol: unique symbol = Symbol.for(
  '@hexkit/prisma/PrismaTransactionWrapper',
);

export class PrismaTransactionWrapper<
  TClient extends PrismaClient,
  TTransactionClient,
> implements TransactionWrapper<Promise<TTransactionClient>> {
  public readonly [isPrismaTransactionWrapperSymbol]: true;
  #isCommitted: boolean;
  readonly #propertiesPromise: Promise<Properties<TTransactionClient>>;

  constructor(client: TClient) {
    this[isPrismaTransactionWrapperSymbol] = true;
    this.#isCommitted = false;
    this.#propertiesPromise = this.#getProperties(client);
  }

  public static is<TTransactionClient>(
    value: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): value is PrismaTransactionWrapper<any, TTransactionClient> {
    return (
      typeof value === 'object' &&
      value !== null &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value as Partial<PrismaTransactionWrapper<any, TTransactionClient>>)[
        isPrismaTransactionWrapperSymbol
      ] === true
    );
  }

  public async tryCommit(): Promise<void> {
    const [transactionPromise, , resolve]: Properties<TTransactionClient> =
      await this.#propertiesPromise;

    resolve();
    this.#isCommitted = true;

    await transactionPromise;
  }

  public async rollback(): Promise<void> {
    const [transactionPromise, , , reject]: Properties<TTransactionClient> =
      await this.#propertiesPromise;

    reject(new Error('Transaction rolled back by user'));

    await transactionPromise;
  }

  public async unwrap(): Promise<TTransactionClient> {
    const [, txClient]: Properties<TTransactionClient> =
      await this.#propertiesPromise;

    return txClient;
  }

  public async [Symbol.asyncDispose](): Promise<void> {
    if (!this.#isCommitted) {
      await this.rollback();
    }
  }

  async #getProperties(
    client: TClient,
  ): Promise<
    [Promise<void>, TTransactionClient, () => void, (reason: unknown) => void]
  > {
    return new Promise(
      (
        resolve: (
          value: [
            Promise<void>,
            TTransactionClient,
            () => void,
            (reason: unknown) => void,
          ],
        ) => void,
      ) => {
        const transactionPromise: Promise<void> = client.$transaction(
          async (transaction: TTransactionClient): Promise<void> => {
            const innerPromise: Promise<void> = new Promise(
              (
                innerResolve: () => void,
                innerReject: (reason: unknown) => void,
              ) => {
                resolve([
                  transactionPromise,
                  transaction,
                  innerResolve,
                  innerReject,
                ]);
              },
            );

            return innerPromise;
          },
        );
      },
    );
  }
}
