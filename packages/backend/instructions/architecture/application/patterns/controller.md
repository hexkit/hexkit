# Controller

This pattern handles request to a certain endpoint in an agnostic way: it's
not aware of the current http framework used to establish the http server.

This modules are commonly wrapped in a non agnostic controller which acts as
a driving adapter.

### Example

```typescript
import { Builder, Handler } from '@cornie-js/backend-common';

// Abstract class defined in the http library
export abstract class HttpRequestController<
  TRequest extends Request | RequestWithBody = Request | RequestWithBody,
  TUseCaseParams extends unknown[] = unknown[],
  TUseCaseResult = unknown,
> implements Handler<[TRequest], Response | ResponseWithBody<unknown>>
{
  // ... implementation details
  protected abstract _handleUseCase(
    ...useCaseParams: TUseCaseParams
  ): Promise<TUseCaseResult>;
}

export class PostUserHttpRequestController extends HttpRequestController<
  RequestWithBody,
  [UserCreateQuery],
  User
> {
  constructor(
    private readonly userManagementInputPort: UserManagementInputPort,
    // ... other dependencies
  ) {
    super(/* ... */);
  }

  protected async _handleUseCase(
    userCreateQuery: UserCreateQuery,
  ): Promise<User> {
    return this.userManagementInputPort.create(userCreateQuery);
  }
}
```
