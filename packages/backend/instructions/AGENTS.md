# AGENTS.md

## Overview
This document illustrates the contents of the backend development instructions.

## Index

### Architecture
*   [Introduction](architecture/introduction.md): Overview of the hexagonal architecture approach (Domain, Application, Adapter layers).

### Monorepo packages structure
*   [Monorepo packages structure](monorepo-packages-structure.md): Guidelines on structuring backend packages within a monorepo.

### Package source code structure
*   [Package source code structure](package-source-code-structure.md): Mandatory organization of source code within packages.

### Tasks
*   [Create package](tasks/create-package.md): Instructions to create a new package within the monorepo.
*   [Monorepo initialization](tasks/monorepo-initialization.md): Guide to initialize a new monorepo.
*   Prisma
    *   [Create Prisma adapter package](tasks/prisma/create-prisma-adapter-package.md): Instructions to create a new Prisma adapter package within the monorepo.

### Testing
*   [Overview](testing/index.md): Entry point for testing documentation.
*   [Fixtures](testing/fixtures.md): Guide on using static factory methods to create consistent test data.
*   [Unit Testing](testing/unit-testing.md): Guidelines and requirements for writing unit tests using `vitest`.
