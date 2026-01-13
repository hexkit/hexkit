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

import { PrismaBatchPayload } from '../models/PrismaBatchPayload.js';
import { PrismaDeletionDelegate } from '../models/PrismaDeletionDelegate.js';
import { PrismaTransactionWrapper } from '../models/PrismaTransactionWrapper.js';
import { DeleteManyPrismaService } from './DeleteManyPrismaService.js';

class DeleteManyPrismaServiceMock extends DeleteManyPrismaService<
  unknown,
  unknown,
  unknown
> {
  readonly #getDelegateMock: Mock<
    (
      transactionClient: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => PrismaDeletionDelegate<any, unknown, any>
  >;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaDeletionDelegate<any, unknown, any>,
    prismaDeleteManyArgsFromDeleteQueryBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    getDelegateMock: Mock<
      (
        transactionClient: unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => PrismaDeletionDelegate<any, unknown, any>
    >,
  ) {
    super(delegate, prismaDeleteManyArgsFromDeleteQueryBuilder);

    this.#getDelegateMock = getDelegateMock;
  }

  protected _getDelegate(
    transactionClient: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): PrismaDeletionDelegate<any, unknown, any> {
    return this.#getDelegateMock(transactionClient);
  }
}

describe(DeleteManyPrismaService, () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let delegateMock: Mocked<PrismaDeletionDelegate<any, unknown, any>>;
  let prismaDeleteManyArgsFromDeleteQueryBuilder: Mocked<
    BuilderAsync<unknown, [unknown]>
  >;
  let getDelegateMock: Mock<
    (
      transactionClient: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => PrismaDeletionDelegate<any, unknown, any>
  >;

  let deleteManyPrismaService: DeleteManyPrismaServiceMock;

  beforeAll(() => {
    delegateMock = {
      delete: vitest.fn(),
      deleteMany: vitest.fn(),
    };
    prismaDeleteManyArgsFromDeleteQueryBuilder = {
      build: vitest.fn(),
    } as Partial<Mocked<BuilderAsync<unknown, [unknown]>>> as Mocked<
      BuilderAsync<unknown, [unknown]>
    >;
    getDelegateMock = vitest.fn();
    deleteManyPrismaService = new DeleteManyPrismaServiceMock(
      delegateMock,
      prismaDeleteManyArgsFromDeleteQueryBuilder,
      getDelegateMock,
    );
  });

  describe('.deleteMany', () => {
    describe('having no transaction', () => {
      let queryFixture: unknown;

      beforeAll(() => {
        queryFixture = Symbol();
      });

      describe('when called', () => {
        let prismaDeleteManyArgsFixture: unknown;
        let batchPayloadFixture: PrismaBatchPayload;

        let result: number;

        beforeAll(async () => {
          prismaDeleteManyArgsFixture = Symbol();
          batchPayloadFixture = { count: 5 };

          prismaDeleteManyArgsFromDeleteQueryBuilder.build.mockResolvedValueOnce(
            prismaDeleteManyArgsFixture,
          );
          delegateMock.deleteMany.mockResolvedValueOnce(batchPayloadFixture);

          result = await deleteManyPrismaService.deleteMany(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaDeleteManyArgsFromDeleteQueryBuilder.build()', () => {
          expect(
            prismaDeleteManyArgsFromDeleteQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.deleteMany()', () => {
          expect(delegateMock.deleteMany).toHaveBeenCalledExactlyOnceWith(
            prismaDeleteManyArgsFixture,
          );
        });

        it('should return the expected count', () => {
          expect(result).toBe(5);
        });
      });

      describe('when called with zero deletions', () => {
        let prismaDeleteManyArgsFixture: unknown;
        let batchPayloadFixture: PrismaBatchPayload;

        let result: number;

        beforeAll(async () => {
          prismaDeleteManyArgsFixture = Symbol();
          batchPayloadFixture = { count: 0 };

          prismaDeleteManyArgsFromDeleteQueryBuilder.build.mockResolvedValueOnce(
            prismaDeleteManyArgsFixture,
          );
          delegateMock.deleteMany.mockResolvedValueOnce(batchPayloadFixture);

          result = await deleteManyPrismaService.deleteMany(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaDeleteManyArgsFromDeleteQueryBuilder.build()', () => {
          expect(
            prismaDeleteManyArgsFromDeleteQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.deleteMany()', () => {
          expect(delegateMock.deleteMany).toHaveBeenCalledExactlyOnceWith(
            prismaDeleteManyArgsFixture,
          );
        });

        it('should return zero', () => {
          expect(result).toBe(0);
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
          PrismaDeletionDelegate<any, unknown, any>
        >;
        let prismaDeleteManyArgsFixture: unknown;
        let batchPayloadFixture: PrismaBatchPayload;

        let result: number;

        beforeAll(async () => {
          transactionDelegateMock = {
            delete: vitest.fn(),
            deleteMany: vitest.fn(),
          };

          prismaDeleteManyArgsFixture = Symbol();
          batchPayloadFixture = { count: 3 };

          getDelegateMock.mockReturnValueOnce(transactionDelegateMock);

          prismaDeleteManyArgsFromDeleteQueryBuilder.build.mockResolvedValueOnce(
            prismaDeleteManyArgsFixture,
          );
          transactionDelegateMock.deleteMany.mockResolvedValueOnce(
            batchPayloadFixture,
          );

          result = await deleteManyPrismaService.deleteMany(
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

        it('should call prismaDeleteManyArgsFromDeleteQueryBuilder.build()', () => {
          expect(
            prismaDeleteManyArgsFromDeleteQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call transactionDelegate.deleteMany()', () => {
          expect(
            transactionDelegateMock.deleteMany,
          ).toHaveBeenCalledExactlyOnceWith(prismaDeleteManyArgsFixture);
        });

        it('should not call delegate.deleteMany()', () => {
          expect(delegateMock.deleteMany).not.toHaveBeenCalled();
        });

        it('should return the expected count', () => {
          expect(result).toBe(3);
        });
      });
    });
  });
});
