# Services

Important domain operations are handled by services. These objects allow us
to isolate business logic such as the action of shuffling cards in a game.

### Example

```typescript
export class GameService {
  public getGameSlotOrThrow(game: Game, index: number): GameSlot {
    const gameSlot = game.state.slots[index];

    if (gameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Expecting a game slot at index "${index}", none found.`,
      );
    }

    return gameSlot;
  }
}
```
