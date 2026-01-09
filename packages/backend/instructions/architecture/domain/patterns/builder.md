# Builder

The builder pattern is used to construct complex objects step by step. It allows the construction of different representations of an object using the same construction code.

### Interface

```typescript
export interface Builder<TResult = unknown, TParams extends unknown[] = []> {
  build(...params: TParams): TResult;
}
```

### Example

```typescript
export class UserBuilder implements Builder<User, [UserCreateQuery]> {
  public build(query: UserCreateQuery): User {
    return {
      id: uuid(),
      email: query.email,
      name: query.name,
      active: true,
    };
  }
}
```
