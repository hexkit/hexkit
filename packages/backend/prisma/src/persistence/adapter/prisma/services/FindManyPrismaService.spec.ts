import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mock,
  Mocked,
  vitest,
} from 'vitest';

vitest.mock(import('../models/PrismaTransactionWrapper.js'));

import { Builder, BuilderAsync, Wrapper } from '@hexkit/patterns';

import { PrismaFindDelegate } from '../models/PrismaFindDelegate';
import { PrismaTransactionWrapper } from '../models/PrismaTransactionWrapper';
import { FindManyPrismaService } from './FindManyPrismaService';

class FindManyPrismaServiceMock extends FindManyPrismaService<
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
> {
  readonly #getDelegateMock: Mock<
    (
      transactionClient: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => PrismaFindDelegate<any, unknown, unknown>
  >;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaFindDelegate<any, unknown, unknown>,
    modelFromPrismaModelBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    prismaFindManyArgsFromFindQueryBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    getDelegateMock: Mock<
      (
        transactionClient: unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => PrismaFindDelegate<any, unknown, unknown>
    >,
  ) {
    super(
      delegate,
      modelFromPrismaModelBuilder,
      prismaFindManyArgsFromFindQueryBuilder,
    );

    this.#getDelegateMock = getDelegateMock;
  }

  protected _getDelegate(
    transactionClient: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): PrismaFindDelegate<any, unknown, unknown> {
    return this.#getDelegateMock(transactionClient);
  }
}

describe(FindManyPrismaService, () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let delegateMock: Mocked<PrismaFindDelegate<any, unknown, unknown>>;
  let modelFromPrismaModelBuilder: Mocked<BuilderAsync<unknown, [unknown]>>;
  let prismaFindManyArgsFromFindQueryBuilder: Mocked<
    BuilderAsync<unknown, [unknown]>
  >;
  let getDelegateMock: Mock<
    (
      transactionClient: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => PrismaFindDelegate<any, unknown, unknown>
  >;

  let findManyPrismaService: FindManyPrismaServiceMock;

  beforeAll(() => {
    delegateMock = {
      findFirst: vitest.fn(),
      findMany: vitest.fn(),
    };
    modelFromPrismaModelBuilder = {
      build: vitest.fn(),
    } as Partial<Mocked<BuilderAsync<unknown, [unknown]>>> as Mocked<
      BuilderAsync<unknown, [unknown]>
    >;
    prismaFindManyArgsFromFindQueryBuilder = {
      build: vitest.fn(),
    } as Partial<Mocked<BuilderAsync<unknown, [unknown]>>> as Mocked<
      BuilderAsync<unknown, [unknown]>
    >;
    getDelegateMock = vitest.fn();
    findManyPrismaService = new FindManyPrismaServiceMock(
      delegateMock,
      modelFromPrismaModelBuilder,
      prismaFindManyArgsFromFindQueryBuilder,
      getDelegateMock,
    );
  });

  describe('.findMany', () => {
    describe('having no transaction', () => {
      let queryFixture: unknown;

      beforeAll(() => {
        queryFixture = Symbol();
      });

      describe('when called', () => {
        let prismaFindManyArgsFixture: unknown;
        let prismaModelsFixture: unknown[];
        let modelFixture1: unknown;
        let modelFixture2: unknown;

        let result: unknown[];

        beforeAll(async () => {
          prismaFindManyArgsFixture = Symbol();
          const prismaModelFixture1: unknown = Symbol();
          const prismaModelFixture2: unknown = Symbol();
          prismaModelsFixture = [prismaModelFixture1, prismaModelFixture2];
          modelFixture1 = Symbol();
          modelFixture2 = Symbol();

          prismaFindManyArgsFromFindQueryBuilder.build.mockResolvedValueOnce(
            prismaFindManyArgsFixture,
          );
          delegateMock.findMany.mockResolvedValueOnce(prismaModelsFixture);
          modelFromPrismaModelBuilder.build
            .mockResolvedValueOnce(modelFixture1)
            .mockResolvedValueOnce(modelFixture2);

          result = await findManyPrismaService.findMany(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaFindManyArgsFromFindQueryBuilder.build()', () => {
          expect(
            prismaFindManyArgsFromFindQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.findMany()', () => {
          expect(delegateMock.findMany).toHaveBeenCalledExactlyOnceWith(
            prismaFindManyArgsFixture,
          );
        });

        it('should call modelFromPrismaModelBuilder.build()', () => {
          expect(modelFromPrismaModelBuilder.build).toHaveBeenCalledTimes(2);
          expect(modelFromPrismaModelBuilder.build).toHaveBeenCalledWith(
            prismaModelsFixture[0],
          );
          expect(modelFromPrismaModelBuilder.build).toHaveBeenCalledWith(
            prismaModelsFixture[1],
          );
        });

        it('should return the expected result', () => {
          expect(result).toStrictEqual([modelFixture1, modelFixture2]);
        });
      });

      describe('when called with empty result', () => {
        let prismaFindManyArgsFixture: unknown;
        let prismaModelsFixture: unknown[];

        let result: unknown[];

        beforeAll(async () => {
          prismaFindManyArgsFixture = Symbol();
          prismaModelsFixture = [];

          prismaFindManyArgsFromFindQueryBuilder.build.mockResolvedValueOnce(
            prismaFindManyArgsFixture,
          );
          delegateMock.findMany.mockResolvedValueOnce(prismaModelsFixture);

          result = await findManyPrismaService.findMany(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaFindManyArgsFromFindQueryBuilder.build()', () => {
          expect(
            prismaFindManyArgsFromFindQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.findMany()', () => {
          expect(delegateMock.findMany).toHaveBeenCalledExactlyOnceWith(
            prismaFindManyArgsFixture,
          );
        });

        it('should not call modelFromPrismaModelBuilder.build()', () => {
          expect(modelFromPrismaModelBuilder.build).not.toHaveBeenCalled();
        });

        it('should return empty array', () => {
          expect(result).toStrictEqual([]);
        });
      });
    });

    describe('having a transaction', () => {
      let queryFixture: unknown;
      let transaction: Wrapper<unknown>;
      let transactionClientFixture: unknown;

      beforeAll(() => {
        queryFixture = Symbol();
        transactionClientFixture = Symbol();
        transaction = {
          unwrap: vitest.fn().mockResolvedValue(transactionClientFixture),
        };

        vitest.mocked(PrismaTransactionWrapper.is).mockReturnValueOnce(true);
      });

      afterAll(() => {
        vitest.restoreAllMocks();
      });

      describe('when called', () => {
        let transactionDelegateMock: Mocked<
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          PrismaFindDelegate<any, unknown, unknown>
        >;
        let prismaFindManyArgsFixture: unknown;
        let modelFixture1: unknown;
        let modelFixture2: unknown;
        let prismaModelFixture1: unknown;
        let prismaModelFixture2: unknown;

        let result: unknown[];

        beforeAll(async () => {
          transactionDelegateMock = {
            findFirst: vitest.fn(),
            findMany: vitest.fn(),
          };

          prismaFindManyArgsFixture = Symbol();
          prismaModelFixture1 = Symbol();
          prismaModelFixture2 = Symbol();

          modelFixture1 = Symbol();
          modelFixture2 = Symbol();

          getDelegateMock.mockReturnValueOnce(transactionDelegateMock);

          prismaFindManyArgsFromFindQueryBuilder.build.mockResolvedValueOnce(
            prismaFindManyArgsFixture,
          );
          transactionDelegateMock.findMany.mockResolvedValueOnce([
            prismaModelFixture1,
            prismaModelFixture2,
          ]);

          modelFromPrismaModelBuilder.build
            .mockResolvedValueOnce(modelFixture1)
            .mockResolvedValueOnce(modelFixture2);

          result = await findManyPrismaService.findMany(
            queryFixture,
            transaction,
          );
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call getDelegate()', () => {
          expect(getDelegateMock).toHaveBeenCalledExactlyOnceWith(
            transactionClientFixture,
          );
        });

        it('should call prismaFindManyArgsFromFindQueryBuilder.build()', () => {
          expect(
            prismaFindManyArgsFromFindQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call transactionDelegate.findMany()', () => {
          expect(
            transactionDelegateMock.findMany,
          ).toHaveBeenCalledExactlyOnceWith(prismaFindManyArgsFixture);
        });

        it('should not call delegate.findMany()', () => {
          expect(delegateMock.findMany).not.toHaveBeenCalled();
        });

        it('should call modelFromPrismaModelBuilder.build() for each prisma model', () => {
          expect(modelFromPrismaModelBuilder.build).toHaveBeenCalledTimes(2);
          expect(modelFromPrismaModelBuilder.build).toHaveBeenCalledWith(
            prismaModelFixture1,
          );
          expect(modelFromPrismaModelBuilder.build).toHaveBeenCalledWith(
            prismaModelFixture2,
          );
        });

        it('should return the expected result', () => {
          expect(result).toStrictEqual([modelFixture1, modelFixture2]);
        });
      });
    });
  });
});
