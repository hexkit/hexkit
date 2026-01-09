# Adapter

An adapter is mostly a module that implements or relies on a port.

  - An input adapter invokes the application core through its input port.
  - An output adapter is invoked by the application core through the agnostic interface
    defined by its implemented output port.

### Port Interface

```typescript
export interface UserPersistenceOutputPort {
  create(userCreateQuery: UserCreateQuery): Promise<User>;
  find(userFindQuery: UserFindQuery): Promise<User[]>;
}
```

### Adapter Implementation

```typescript
export class UserPersistenceTypeOrmAdapter
  implements UserPersistenceOutputPort
{
  constructor(
    private readonly createUserTypeOrmService: CreateUserTypeOrmService,
    private readonly findUserTypeOrmService: FindUserTypeOrmService,
  ) {}

  public async create(userCreateQuery: UserCreateQuery): Promise<User> {
    return this.createUserTypeOrmService.insertOne(userCreateQuery);
  }

  public async find(userFindQuery: UserFindQuery): Promise<User[]> {
    return this.findUserTypeOrmService.find(userFindQuery);
  }
}
```
