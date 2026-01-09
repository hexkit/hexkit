# Unit testing

Warning: The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT",
"RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

Almost every module created SHOULD include its tests. Test modules MUST be written at the same directory using `vitest`.

## Structure of a test module

Test modules are composed by nested `describe` calls. Every describe call includes a block with nested `describe` calls. Every `describe` block is associated with a certain scope of the original implementation.

### 1. Testing stateless classes

### 1.1. The class scope

The first describe block contains the scope of the tested class. It SHOULD declare an instance of the class to be tested.

The class `Foo`

```ts
export class Foo {
  constructor(private readonly bar: Bar) {}

  ...
}
```

Could be tested with the following implementation

```ts
describe(Foo, () => {
  let barMock: Mocked<Bar>;
  let foo: Foo;

  beforeAll(() => {
    barMock = {
      ...,
    };

    foo = new Foo(barMock);
  });

  ...
});

```

### 1.2. The method / function scope

The second describe block is the method one. All the tests regarding a class public method MUST be in the method scope

The class `Foo`

```ts
export class Foo {
  constructor(private readonly bar: Bar) {}

  public sayHello(): void {
    ...
  }
}

```

Could be tested with the following implementation

```ts
describe(Foo, () => {
  let barMock: Mocked<Bar>;
  let foo: Foo;

  beforeAll(() => {
    barMock = {
      ...,
    };

    foo = new Foo(barMock);
  });

  describe('.sayHello', () => {
    ...
  });
});

```

### 1.3. The method input scope

Specific inputs MAY be required in order to test certain flows. For example:

```ts
public composeHelloMessage(name: string): string {
  if (name === 'Zoe') {
    return 'Talk to my hand Zoe';
  } else {
    return `Hi ${name}, I'm glad to see you`;
  }
}

```

Two different inputs are required:

1. The string `'Zoe'`.
2. Any string different than `Zoe`.

In these cases a describe block for each case MUST be included.

The class `Foo`

```ts
export class Foo {
  constructor(private readonly bar: Bar) {}

  public composeHelloMessage(name: string): string {
    if (name === 'Zoe') {
      return 'Talk to my hand Zoe';
    } else {
      return `Hi ${name}, I'm glad to see you`;
    }
  }
}

```

Could be tested with the following implementation

```ts
describe(Foo, () => {
  let barMock: Mocked<Bar>;
  let foo: Foo;

  beforeAll(() => {
    barMock = {
      ...,
    };

    foo = new Foo(barMock);
  });

  describe('.composeHelloMessage', () => {
    describe('having a name with value "Zoe"', () => {
      let nameFixture: string;

      beforeAll(() => {
        nameFixture = 'Zoe';
      });

      ...
    });

    describe('having a name with value different than "Zoe"', () => {
      let nameFixture: string;

      beforeAll(() => {
        nameFixture = 'Bob';
      });

      ...
    });
  });
});

```

If there's only a single flow depending on the input, the method input scope MUST be omitted

### 1.4. The code flow scope

Every code flow SHOULD be covered in a describe block. If, given an input, only one flow is allowed, then the describe name associated should be `when called`. If not, it should be `when called, and [behavior]` where behavior is the dependencies behavior that leds to that code flow.

**Important note**: Sometimes several flows shares a common branch. Every flow MUST be tested but a describe block to test that common branch MAY be added to test that common flow.

Once we are in this scope, all the assertions associated with this code flow should be included.

The class Foo

```ts
export class Foo {
  constructor(private readonly bar: Bar) {}

  public composeHelloMessage(name: string): string {
    if (name === this.bar.getUnderisableName()) {
      return 'Talk to my hand';
    } else {
      return `Hi ${name}, I'm glad to see you`;
    }
  }
}

```

MAY be tested with the following implementation

```ts
describe(Foo, () => {
  let barMock: Mocked<Bar>;
  let foo: Foo;

  beforeAll(() => {
    barMock = {
      ...,
    };

    foo = new Foo(barMock);
  });

  describe('.composeHelloMessage', () => {

    describe('when called', () => { // This is an example of common branch
      let undesirableNameFixture: string;
      let nameFixture: string;

      let result: unknown;

      beforeAll(() => {
        nameFixture = 'Anna';
        undesirableNameFixture = 'Carl';

        barMock.getUnderisableName.mockReturnValueOnce(undesirableNameFixture);

        result = foo.composeHelloMessage(nameFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bar.getUndesirableName()', () => {
        expect(barMock.getUnderisableName).toHavBeenCalledTimes(1);
        expect(barMock.getUnderisableName).toHavBeenCalledWith(nameFixture);
      });
    });

    describe('when called, and bar.getUndesirableName() is equal to name', () => {
      let undesirableNameFixture: string;
      let nameFixture: string;

      beforeAll(() => {
        nameFixture = 'Anna';
        undesirableNameFixture = nameFixture;

        result = foo.composeHelloMessage(nameFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should return a string', () => {
        expect(result).toBe('Talk to my hand');
      });
    });

    describe('when called, and bar.getUndesirableName() is distinct to name', () => {
      let undesirableNameFixture: string;
      let nameFixture: string;

      let result: unknown;

      beforeAll(() => {
        nameFixture = 'Anna';
        undesirableNameFixture = 'Carl';

        barMock.getUnderisableName.mockReturnValueOnce(undesirableNameFixture);

        result = foo.composeHelloMessage(nameFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should return a string', () => {
        expect(result).toBe(`Hi ${nameFixture}, I'm glad to see you`);
      });
    });
  });
});

```

When writting mock assertions, they SHOULD assert the number of times the mock was called and the input is the expected one each time it was called. When testing `bar.getUndesirableName()` mock, the it description is `should call bar.getUndesirableName()`, no detailed description should be added like `should call bar.getUndesirableName() with name`.

If there're method input scope describe blocks, code flow scope describe blocks MUST be inside them.

### 2. Testing statefull classes

Testing statefull classes is similar than testing stateless classes. The only difference is class instantiation: a class instance MUST be declared and instantiated in the code flow scope describe block. The class Foo:

```ts
export class Foo {
  constructor(private undesirableName: string) {}

  public composeHelloMessage(name: string): string {
    if (name === this.undesirableName) {
      return 'Talk to my hand';
    } else {
      this.setUndesirableName(name);

      return `Hi ${name}, I'm glad to see you`;
    }
  }

  private setUndesirableName(undesirableName: string): void {
    this.undesirableName = undesirableName;
  }
}

```

MAY be tested with the following implementation:

```ts
describe(Foo, () => {
  describe('.composeHelloMessage', () => {

    describe('when called, and bar.getUndesirableName() is equal to name', () => {
      let undesirableNameFixture: string;
      let nameFixture: string;

      let foo: Foo;

      let result: unknown;

      beforeAll(() => {
        nameFixture = 'Anna';
        undesirableNameFixture = nameFixture;

        foo = new Foo(undesirableNameFixture);

        result = foo.composeHelloMessage(nameFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should return a string', () => {
        expect(result).toBe('Talk to my hand');
      });
    });

    describe('when called, and bar.getUndesirableName() is distinct to name', () => {
      let undesirableNameFixture: string;
      let nameFixture: string;

      let foo: Foo;

      let result: unknown;

      beforeAll(() => {
        nameFixture = 'Anna';
        undesirableNameFixture = 'Carl';

        foo = new Foo(undesirableNameFixture);

        result = foo.composeHelloMessage(nameFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should return a string', () => {
        expect(result).toBe(`Hi ${nameFixture}, I'm glad to see you`);
      });
    });
  });
});

```
