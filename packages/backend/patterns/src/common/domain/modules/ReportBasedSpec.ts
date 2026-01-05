import { Either } from '../patterns/fp/Either.js';

export interface ReportBasedSpec<TArgs extends unknown[], TReport> {
  isSatisfiedOrReport(...args: TArgs): Either<TReport, undefined>;
}
