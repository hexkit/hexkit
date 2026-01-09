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

import { PrismaTransactionWrapper } from '../models/PrismaTransactionWrapper';
import { PrismaUpdateDelegate } from '../models/PrismaUpdateDelegate';
import { UpdateManyPrismaService } from './UpdateManyPrismaService';

class UpdateManyPrismaServiceMock extends UpdateManyPrismaService<
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
> {
  readonly #getDelegateMock: Mock<
    (transactionClient: unknown) => PrismaUpdateDelegate<unknown, unknown>
  >;

  constructor(
    delegate: PrismaUpdateDelegate<unknown, unknown>,
    modelFromPrismaModelBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    prismaUpdateManyArgsFromUpdateQueryBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    getDelegateMock: Mock<
      (transactionClient: unknown) => PrismaUpdateDelegate<unknown, unknown>
    >,
  ) {
    super(
      delegate,
      modelFromPrismaModelBuilder,
      prismaUpdateManyArgsFromUpdateQueryBuilder,
    );

    this.#getDelegateMock = getDelegateMock;
  }

  protected _getDelegate(
    transactionClient: unknown,
  ): PrismaUpdateDelegate<unknown, unknown> {
    return this.#getDelegateMock(transactionClient);
  }
}

describe(UpdateManyPrismaService, () => {
  let delegateMock: Mocked<PrismaUpdateDelegate<unknown, unknown>>;
  let modelFromPrismaModelBuilder: Mocked<BuilderAsync<unknown, [unknown]>>;
  let prismaUpdateManyArgsFromUpdateQueryBuilder: Mocked<
    BuilderAsync<unknown, [unknown]>
  >;
  let getDelegateMock: Mock<
    (transactionClient: unknown) => PrismaUpdateDelegate<unknown, unknown>
  >;

  let updateManyPrismaService: UpdateManyPrismaServiceMock;

  beforeAll(() => {
    delegateMock = {
      updateManyAndReturn: vitest.fn(),
    };
    modelFromPrismaModelBuilder = {
      build: vitest.fn(),
    } as Partial<Mocked<BuilderAsync<unknown, [unknown]>>> as Mocked<
      BuilderAsync<unknown, [unknown]>
    >;
    prismaUpdateManyArgsFromUpdateQueryBuilder = {
      build: vitest.fn(),
    } as Partial<Mocked<BuilderAsync<unknown, [unknown]>>> as Mocked<
      BuilderAsync<unknown, [unknown]>
    >;
    getDelegateMock = vitest.fn();
    updateManyPrismaService = new UpdateManyPrismaServiceMock(
      delegateMock,
      modelFromPrismaModelBuilder,
      prismaUpdateManyArgsFromUpdateQueryBuilder,
      getDelegateMock,
    );
  });

  describe('.updateMany', () => {
    describe('having no transaction', () => {
      let queryFixture: unknown;

      beforeAll(() => {
        queryFixture = Symbol();
      });

      describe('when called', () => {
        let prismaUpdateManyArgsFixture: unknown;
        let prismaModelsFixture: unknown[];
        let modelFixture1: unknown;
        let modelFixture2: unknown;

        let result: unknown[];

        beforeAll(async () => {
          prismaUpdateManyArgsFixture = Symbol();
          const prismaModelFixture1: unknown = Symbol();
          const prismaModelFixture2: unknown = Symbol();
          prismaModelsFixture = [prismaModelFixture1, prismaModelFixture2];
          modelFixture1 = Symbol();
          modelFixture2 = Symbol();

          prismaUpdateManyArgsFromUpdateQueryBuilder.build.mockResolvedValueOnce(
            prismaUpdateManyArgsFixture,
          );
          delegateMock.updateManyAndReturn.mockResolvedValueOnce(
            prismaModelsFixture,
          );
          modelFromPrismaModelBuilder.build
            .mockResolvedValueOnce(modelFixture1)
            .mockResolvedValueOnce(modelFixture2);

          result = await updateManyPrismaService.updateMany(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaUpdateManyArgsFromUpdateQueryBuilder.build()', () => {
          expect(
            prismaUpdateManyArgsFromUpdateQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.updateManyAndReturn()', () => {
          expect(
            delegateMock.updateManyAndReturn,
          ).toHaveBeenCalledExactlyOnceWith(prismaUpdateManyArgsFixture);
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
        let prismaUpdateManyArgsFixture: unknown;
        let prismaModelsFixture: unknown[];

        let result: unknown[];

        beforeAll(async () => {
          prismaUpdateManyArgsFixture = Symbol();
          prismaModelsFixture = [];

          prismaUpdateManyArgsFromUpdateQueryBuilder.build.mockResolvedValueOnce(
            prismaUpdateManyArgsFixture,
          );
          delegateMock.updateManyAndReturn.mockResolvedValueOnce(
            prismaModelsFixture,
          );

          result = await updateManyPrismaService.updateMany(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaUpdateManyArgsFromUpdateQueryBuilder.build()', () => {
          expect(
            prismaUpdateManyArgsFromUpdateQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.updateManyAndReturn()', () => {
          expect(
            delegateMock.updateManyAndReturn,
          ).toHaveBeenCalledExactlyOnceWith(prismaUpdateManyArgsFixture);
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
          PrismaUpdateDelegate<unknown, unknown>
        >;
        let prismaUpdateManyArgsFixture: unknown;
        let modelFixture1: unknown;
        let modelFixture2: unknown;
        let prismaModelFixture1: unknown;
        let prismaModelFixture2: unknown;

        let result: unknown[];

        beforeAll(async () => {
          transactionDelegateMock = {
            updateManyAndReturn: vitest.fn(),
          };

          prismaUpdateManyArgsFixture = Symbol();
          prismaModelFixture1 = Symbol();
          prismaModelFixture2 = Symbol();

          modelFixture1 = Symbol();
          modelFixture2 = Symbol();

          getDelegateMock.mockReturnValueOnce(transactionDelegateMock);

          prismaUpdateManyArgsFromUpdateQueryBuilder.build.mockResolvedValueOnce(
            prismaUpdateManyArgsFixture,
          );
          transactionDelegateMock.updateManyAndReturn.mockResolvedValueOnce([
            prismaModelFixture1,
            prismaModelFixture2,
          ]);

          modelFromPrismaModelBuilder.build
            .mockResolvedValueOnce(modelFixture1)
            .mockResolvedValueOnce(modelFixture2);

          result = await updateManyPrismaService.updateMany(
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

        it('should call prismaUpdateManyArgsFromUpdateQueryBuilder.build()', () => {
          expect(
            prismaUpdateManyArgsFromUpdateQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call transactionDelegate.updateManyAndReturn()', () => {
          expect(
            transactionDelegateMock.updateManyAndReturn,
          ).toHaveBeenCalledExactlyOnceWith(prismaUpdateManyArgsFixture);
        });

        it('should not call delegate.updateManyAndReturn()', () => {
          expect(delegateMock.updateManyAndReturn).not.toHaveBeenCalled();
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
