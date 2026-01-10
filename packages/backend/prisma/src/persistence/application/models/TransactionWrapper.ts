import { Wrapper } from '@hexkit/patterns';

export interface TransactionWrapper<T> extends Wrapper<T>, AsyncDisposable {
  rollback(): Promise<void>;
  tryCommit(): Promise<void>;
}
