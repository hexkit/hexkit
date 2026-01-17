# Inversify Controller

Controllers handle HTTP requests using the `@inversifyjs/http-core` framework. They act as driving adapters that translate HTTP requests into application logic through input ports.

Controllers return API models (e.g., `UserV1`), not domain entities. This keeps domain internals hidden and allows versioned API evolution.

## Example

`src/user/adapter/http/controllers/UserController.ts`:

```typescript
import { Body, Controller, Get, Params, Post, StatusCode } from '@inversifyjs/http-core';
import { inject } from 'inversify';

import { UserManagementInputPort } from '../../../application/ports/UserManagementInputPort.js';
import { UserV1 } from '../../../application/models/UserV1.js';
import { CreateUserRequestV1 } from '../../../application/models/CreateUserRequestV1.js';
import { UserV1FromUserBuilder } from '../builders/UserV1FromUserBuilder.js';

@Controller('/v1/users')
export class UserController {
  constructor(
    @inject(UserManagementInputPort)
    private readonly userManagementInputPort: UserManagementInputPort,
    @inject(UserV1FromUserBuilder)
    private readonly userV1FromUserBuilder: UserV1FromUserBuilder,
  ) {}

  @Get('/:userId')
  public async getUserById(
    @Params({ name: 'userId' }) userId: string,
  ): Promise<UserV1> {
    const user = await this.userManagementInputPort.findById(userId);

    return this.userV1FromUserBuilder.build(user);
  }

  @Post()
  @StatusCode(201)
  public async createUser(
    @Body() request: CreateUserRequestV1,
  ): Promise<UserV1> {
    const user = await this.userManagementInputPort.create({
      email: request.email,
      name: request.name,
    });

    return this.userV1FromUserBuilder.build(user);
  }
}
```

## Registration

Register controllers in container modules as singletons:

```typescript
import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify';

import { UserController } from '../controllers/UserController.js';
import { UserV1FromUserBuilder } from '../builders/UserV1FromUserBuilder.js';

export class UserHttpContainerModule extends ContainerModule {
  constructor() {
    super((options: ContainerModuleLoadOptions): void => {
      options.bind(UserController).toSelf().inSingletonScope();
      options.bind(UserV1FromUserBuilder).toSelf().inSingletonScope();
    });
  }
}
```
