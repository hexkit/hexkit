# Value object

Quoting from Eric Evans, "an object that represents a descriptive aspect of the domain
with no conceptual identity is called a value object".

### Example

```typescript
import { UserCodeKind } from './UserCodeKind';

export interface UserCode {
  readonly code: string;
  readonly kind: UserCodeKind;
  readonly userId: string;
}
```
