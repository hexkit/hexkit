# API Model

API models are versioned representations of domain data exposed through REST APIs. They decouple the external API contract from internal domain entities, allowing independent evolution of both.

Domain entities may contain fields that should not be exposed (e.g., internal flags, sensitive data) or use structures inconvenient for API consumers. API models solve this by providing a stable, versioned interface.

## Naming Convention

API models follow the pattern `{EntityName}V{Version}`:

- `UserV1` - User representation for API version 1
- `OrderV2` - Order representation for API version 2

## Example

`src/user/application/models/UserV1.ts`:

```typescript
export interface UserV1 {
  id: string;
  email: string;
  displayName: string;
  createdAt: string; // ISO 8601 format
}
```

`src/user/application/models/CreateUserRequestV1.ts`:

```typescript
export interface CreateUserRequestV1 {
  email: string;
  name: string;
}
```

## Builder for Conversion

Use builders to convert domain entities to API models:

`src/user/adapter/http/builders/UserV1FromUserBuilder.ts`:

```typescript
import { injectable } from 'inversify';

import { Builder } from '@myorg/backend-common';
import { User } from '../../../domain/entities/User.js';
import { UserV1 } from '../../../application/models/UserV1.js';

@injectable()
export class UserV1FromUserBuilder implements Builder<UserV1, [User]> {
  public build(user: User): UserV1 {
    return {
      id: user.id,
      email: user.email,
      displayName: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
```
