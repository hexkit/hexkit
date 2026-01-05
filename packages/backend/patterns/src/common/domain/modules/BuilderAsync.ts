import { Builder } from './Builder.js';

export type BuilderAsync<
  TResult = unknown,
  TParams extends unknown[] = [],
> = Builder<Promise<TResult>, TParams>;
