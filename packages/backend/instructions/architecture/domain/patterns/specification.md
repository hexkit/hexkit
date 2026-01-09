# Specification

Business rules are implemented using this pattern.

### Interface

```typescript
export interface Spec<TArgs extends unknown[]> {
  isSatisfiedBy(...args: TArgs): boolean;
}
```

### Example

```typescript
export class GameCanHoldMoreGameSlotsSpec implements Spec<[Game, GameSpec]> {
  public isSatisfiedBy(game: Game, gameSpec: GameSpec): boolean {
    return (
      game.state.status === GameStatus.nonStarted &&
      game.state.slots.length < gameSpec.gameSlotsAmount
    );
  }
}
```

## Report Based Specification

Sometimes a more expressive result is expected in order to provide feedback that explains why a business rule is not fulfilled. This motivates the creation of a reported based specification pattern.

### Interface

```typescript
import { Either } from '../patterns/fp/Either';

export interface ReportBasedSpec<TArgs extends unknown[], TReport> {
  isSatisfiedOrReport(...args: TArgs): Either<TReport, undefined>;
}
```

### Example

```typescript
export class IsValidUserCreateQuerySpec
  implements ReportBasedSpec<[UserCreateQuery], string[]>
{
  public isSatisfiedOrReport(
    userCreateQuery: UserCreateQuery,
  ): Either<string[], undefined> {
    const errors: string[] = [];

    if (!EMAIL_REGEXP.test(userCreateQuery.email)) {
      errors.push(`"${userCreateQuery.email}" is not a valid email`);
    }

    if (userCreateQuery.name.trim().length === 0) {
      errors.push('Expected a non empty name');
    }

    return errors.length === 0
      ? {
          isRight: true,
          value: undefined,
        }
      : {
          isRight: false,
          value: errors,
        };
  }
}
```
