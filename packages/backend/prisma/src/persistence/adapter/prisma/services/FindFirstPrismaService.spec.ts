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

import { PrismaFindDelegate } from '../models/PrismaFindDelegate.js';
import { PrismaTransactionWrapper } from '../models/PrismaTransactionWrapper.js';
import { FindFirstPrismaService } from './FindFirstPrismaService.js';

class FindFirstPrismaServiceMock extends FindFirstPrismaService<
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
    ) => PrismaFindDelegate<unknown, any, unknown>
  >;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaFindDelegate<unknown, any, unknown>,
    modelFromPrismaModelBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    prismaFindArgsFromFindQueryBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    getDelegateMock: Mock<
      (
        transactionClient: unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => PrismaFindDelegate<unknown, any, unknown>
    >,
  ) {
    super(
      delegate,
      modelFromPrismaModelBuilder,
      prismaFindArgsFromFindQueryBuilder,
    );

    this.#getDelegateMock = getDelegateMock;
  }

  protected _getDelegate(
    transactionClient: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): PrismaFindDelegate<unknown, any, unknown> {
    return this.#getDelegateMock(transactionClient);
  }
}

describe(FindFirstPrismaService, () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let delegateMock: Mocked<PrismaFindDelegate<unknown, any, unknown>>;
  let modelFromPrismaModelBuilder: Mocked<BuilderAsync<unknown, [unknown]>>;
  let prismaFindArgsFromFindQueryBuilder: Mocked<
    BuilderAsync<unknown, [unknown]>
  >;
  let getDelegateMock: Mock<
    (
      transactionClient: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => PrismaFindDelegate<unknown, any, unknown>
  >;

  let findFirstPrismaService: FindFirstPrismaServiceMock;

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
    prismaFindArgsFromFindQueryBuilder = {
      build: vitest.fn(),
    } as Partial<Mocked<BuilderAsync<unknown, [unknown]>>> as Mocked<
      BuilderAsync<unknown, [unknown]>
    >;
    getDelegateMock = vitest.fn();
    findFirstPrismaService = new FindFirstPrismaServiceMock(
      delegateMock,
      modelFromPrismaModelBuilder,
      prismaFindArgsFromFindQueryBuilder,
      getDelegateMock,
    );
  });

  describe('.findFirst', () => {
    describe('having no transaction', () => {
      let queryFixture: unknown;

      beforeAll(() => {
        queryFixture = Symbol();
      });

      describe('when called and prisma model is found', () => {
        let prismaFindArgsFixture: unknown;
        let prismaModelFixture: unknown;
        let modelFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          prismaFindArgsFixture = Symbol();
          prismaModelFixture = Symbol();
          modelFixture = Symbol();

          prismaFindArgsFromFindQueryBuilder.build.mockResolvedValueOnce(
            prismaFindArgsFixture,
          );
          delegateMock.findFirst.mockResolvedValueOnce(prismaModelFixture);
          modelFromPrismaModelBuilder.build.mockResolvedValueOnce(modelFixture);

          result = await findFirstPrismaService.findFirst(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaFindArgsFromFindQueryBuilder.build()', () => {
          expect(
            prismaFindArgsFromFindQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.findFirst()', () => {
          expect(delegateMock.findFirst).toHaveBeenCalledExactlyOnceWith(
            prismaFindArgsFixture,
          );
        });

        it('should call modelFromPrismaModelBuilder.build()', () => {
          expect(
            modelFromPrismaModelBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(prismaModelFixture);
        });

        it('should return the expected result', () => {
          expect(result).toBe(modelFixture);
        });
      });

      describe('when called and prisma model is not found', () => {
        let prismaFindArgsFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          prismaFindArgsFixture = Symbol();

          prismaFindArgsFromFindQueryBuilder.build.mockResolvedValueOnce(
            prismaFindArgsFixture,
          );
          delegateMock.findFirst.mockResolvedValueOnce(null);

          result = await findFirstPrismaService.findFirst(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaFindArgsFromFindQueryBuilder.build()', () => {
          expect(
            prismaFindArgsFromFindQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.findFirst()', () => {
          expect(delegateMock.findFirst).toHaveBeenCalledExactlyOnceWith(
            prismaFindArgsFixture,
          );
        });

        it('should not call modelFromPrismaModelBuilder.build()', () => {
          expect(modelFromPrismaModelBuilder.build).not.toHaveBeenCalled();
        });

        it('should return null', () => {
          expect(result).toBeNull();
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

      describe('when called and prisma model is found', () => {
        let transactionDelegateMock: Mocked<
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          PrismaFindDelegate<unknown, any, unknown>
        >;
        let prismaFindArgsFixture: unknown;
        let prismaModelFixture: unknown;
        let modelFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          transactionDelegateMock = {
            findFirst: vitest.fn(),
            findMany: vitest.fn(),
          };

          prismaFindArgsFixture = Symbol();
          prismaModelFixture = Symbol();
          modelFixture = Symbol();

          getDelegateMock.mockReturnValueOnce(transactionDelegateMock);

          prismaFindArgsFromFindQueryBuilder.build.mockResolvedValueOnce(
            prismaFindArgsFixture,
          );
          transactionDelegateMock.findFirst.mockResolvedValueOnce(
            prismaModelFixture,
          );
          modelFromPrismaModelBuilder.build.mockResolvedValueOnce(modelFixture);

          result = await findFirstPrismaService.findFirst(
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

        it('should call prismaFindArgsFromFindQueryBuilder.build()', () => {
          expect(
            prismaFindArgsFromFindQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call transactionDelegate.findFirst()', () => {
          expect(
            transactionDelegateMock.findFirst,
          ).toHaveBeenCalledExactlyOnceWith(prismaFindArgsFixture);
        });

        it('should not call delegate.findFirst()', () => {
          expect(delegateMock.findFirst).not.toHaveBeenCalled();
        });

        it('should call modelFromPrismaModelBuilder.build()', () => {
          expect(
            modelFromPrismaModelBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(prismaModelFixture);
        });

        it('should return the expected result', () => {
          expect(result).toBe(modelFixture);
        });
      });

      describe('when called and prisma model is not found', () => {
        let transactionDelegateMock: Mocked<
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          PrismaFindDelegate<unknown, any, unknown>
        >;
        let prismaFindArgsFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          transactionDelegateMock = {
            findFirst: vitest.fn(),
            findMany: vitest.fn(),
          };

          prismaFindArgsFixture = Symbol();

          vitest.mocked(PrismaTransactionWrapper.is).mockReturnValueOnce(true);

          getDelegateMock.mockReturnValueOnce(transactionDelegateMock);

          prismaFindArgsFromFindQueryBuilder.build.mockResolvedValueOnce(
            prismaFindArgsFixture,
          );
          transactionDelegateMock.findFirst.mockResolvedValueOnce(null);

          result = await findFirstPrismaService.findFirst(
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

        it('should call prismaFindArgsFromFindQueryBuilder.build()', () => {
          expect(
            prismaFindArgsFromFindQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call transactionDelegate.findFirst()', () => {
          expect(
            transactionDelegateMock.findFirst,
          ).toHaveBeenCalledExactlyOnceWith(prismaFindArgsFixture);
        });

        it('should not call delegate.findFirst()', () => {
          expect(delegateMock.findFirst).not.toHaveBeenCalled();
        });

        it('should not call modelFromPrismaModelBuilder.build()', () => {
          expect(modelFromPrismaModelBuilder.build).not.toHaveBeenCalled();
        });

        it('should return null', () => {
          expect(result).toBeNull();
        });
      });
    });
  });
});
