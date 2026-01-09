# Package source code structure

Source code within each package must adhere to the following structure:

```
src/
  index.ts                         # Main entry point
  foundation/
    domain/                        # Foundation domain layer modules
    application/                   # Foundation application layer modules
    adapter/[adapterName]/         # Foundation adapter layer modules
  [moduleName]/
    domain/                        # Module-specific domain layer modules
    application/                   # Module-specific application layer modules
    adapter/[adapterName]/         # Module-specific adapter layer modules
```
