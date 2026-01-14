# Inversify container module

Dependency injections are organized using InversifyJS container modules:

- Unless there's a clear advantage or requirement, prefer singleton scoped services.
- Container modules should be exported in the index file so they can be easily imported and loaded in the container of the package used as entrypoint. An exception to this rule are container modules that are only used internally within the package, like container modules of the entrypoint package itself.

`src/category/adapter/inversify/modules/CategoryContainerModule.ts`:

```ts
import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

import { CategoryRepository } from '../repositories/CategoryRepository.js';
import { CategoryResolvers } from '../resolvers/CategoryResolvers.js';

export class CategoryContainerModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions): void => {
      options.bind(CategoryRepository).toSelf().inSingletonScope();
      options.bind(CategoryResolvers).toSelf().inSingletonScope();
    });
  }
}

```
