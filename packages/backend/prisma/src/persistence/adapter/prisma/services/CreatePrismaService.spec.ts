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

import { PrismaCreationDelegate } from '../models/PrismaCreationDelegate.js';
import { PrismaTransactionWrapper } from '../models/PrismaTransactionWrapper.js';
import { CreatePrismaService } from './CreatePrismaService.js';

class CreatePrismaServiceMock extends CreatePrismaService<
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
    ) => PrismaCreationDelegate<unknown, any, unknown>
  >;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delegate: PrismaCreationDelegate<unknown, any, unknown>,
    modelFromPrismaModelBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    prismaCreateArgsFromCreateQueryBuilder:
      | Builder<unknown, [unknown]>
      | BuilderAsync<unknown, [unknown]>,
    getDelegateMock: Mock<
      (
        transactionClient: unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => PrismaCreationDelegate<unknown, any, unknown>
    >,
  ) {
    super(
      delegate,
      modelFromPrismaModelBuilder,
      prismaCreateArgsFromCreateQueryBuilder,
    );

    this.#getDelegateMock = getDelegateMock;
  }

  protected _getDelegate(
    transactionClient: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): PrismaCreationDelegate<unknown, any, unknown> {
    return this.#getDelegateMock(transactionClient);
  }
}

describe(CreatePrismaService, () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let delegateMock: Mocked<PrismaCreationDelegate<unknown, any, unknown>>;
  let modelFromPrismaModelBuilder: Mocked<BuilderAsync<unknown, [unknown]>>;
  let prismaCreateArgsFromCreateQueryBuilder: Mocked<
    BuilderAsync<unknown, [unknown]>
  >;
  let getDelegateMock: Mock<
    (
      transactionClient: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => PrismaCreationDelegate<unknown, any, unknown>
  >;

  let createPrismaService: CreatePrismaServiceMock;

  beforeAll(() => {
    delegateMock = {
      create: vitest.fn(),
      createManyAndReturn: vitest.fn(),
    };
    modelFromPrismaModelBuilder = {
      build: vitest.fn(),
    } as Partial<Mocked<BuilderAsync<unknown, [unknown]>>> as Mocked<
      BuilderAsync<unknown, [unknown]>
    >;
    prismaCreateArgsFromCreateQueryBuilder = {
      build: vitest.fn(),
    } as Partial<Mocked<BuilderAsync<unknown, [unknown]>>> as Mocked<
      BuilderAsync<unknown, [unknown]>
    >;
    getDelegateMock = vitest.fn();
    createPrismaService = new CreatePrismaServiceMock(
      delegateMock,
      modelFromPrismaModelBuilder,
      prismaCreateArgsFromCreateQueryBuilder,
      getDelegateMock,
    );
  });

  describe('.create', () => {
    describe('having no transaction', () => {
      let queryFixture: unknown;

      beforeAll(() => {
        queryFixture = Symbol();
      });

      describe('when called', () => {
        let prismaCreateArgsFixture: unknown;
        let prismaModelFixture: unknown;
        let modelFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          prismaCreateArgsFixture = Symbol();
          prismaModelFixture = Symbol();
          modelFixture = Symbol();

          prismaCreateArgsFromCreateQueryBuilder.build.mockResolvedValueOnce(
            prismaCreateArgsFixture,
          );
          delegateMock.create.mockResolvedValueOnce(prismaModelFixture);
          modelFromPrismaModelBuilder.build.mockResolvedValueOnce(modelFixture);

          result = await createPrismaService.create(queryFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should not call getDelegate()', () => {
          expect(getDelegateMock).not.toHaveBeenCalled();
        });

        it('should call prismaCreateArgsFromCreateQueryBuilder.build()', () => {
          expect(
            prismaCreateArgsFromCreateQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call delegate.create()', () => {
          expect(delegateMock.create).toHaveBeenCalledExactlyOnceWith(
            prismaCreateArgsFixture,
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
    });

    describe('having a transaction', () => {
      let queryFixture: unknown;
      let transactionFixture: Wrapper<unknown>;
      let transactionClientFixture: unknown;

      beforeAll(() => {
        queryFixture = Symbol();
        transactionClientFixture = Symbol();
        transactionFixture = {
          unwrap: vitest.fn().mockResolvedValueOnce(transactionClientFixture),
        };

        vitest.mocked(PrismaTransactionWrapper.is).mockReturnValueOnce(true);
      });

      afterAll(() => {
        vitest.restoreAllMocks();
      });

      describe('when called', () => {
        let transactionDelegateMock: Mocked<
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          PrismaCreationDelegate<unknown, any, unknown>
        >;
        let prismaCreateArgsFixture: unknown;
        let prismaModelFixture: unknown;
        let modelFixture: unknown;

        let result: unknown;

        beforeAll(async () => {
          transactionDelegateMock = {
            create: vitest.fn(),
            createManyAndReturn: vitest.fn(),
          };
          prismaCreateArgsFixture = Symbol();
          prismaModelFixture = Symbol();
          modelFixture = Symbol();

          getDelegateMock.mockReturnValueOnce(transactionDelegateMock);
          prismaCreateArgsFromCreateQueryBuilder.build.mockResolvedValueOnce(
            prismaCreateArgsFixture,
          );
          transactionDelegateMock.create.mockResolvedValueOnce(
            prismaModelFixture,
          );
          modelFromPrismaModelBuilder.build.mockResolvedValueOnce(modelFixture);

          result = await createPrismaService.create(
            queryFixture,
            transactionFixture,
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

        it('should call prismaCreateArgsFromCreateQueryBuilder.build()', () => {
          expect(
            prismaCreateArgsFromCreateQueryBuilder.build,
          ).toHaveBeenCalledExactlyOnceWith(queryFixture);
        });

        it('should call transactionDelegate.create()', () => {
          expect(
            transactionDelegateMock.create,
          ).toHaveBeenCalledExactlyOnceWith(prismaCreateArgsFixture);
        });

        it('should not call delegate.create()', () => {
          expect(delegateMock.create).not.toHaveBeenCalled();
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
    });
  });
});
