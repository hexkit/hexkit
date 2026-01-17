# Architecture

The current architecture is established following an hexagonal architecture approach.

The layers established are domain, application and adapter (most of the literature 
refers this last layer as "infrastructure" or "framework").

An overview of each layer can be found in these docs:

## Domain Layer
*   [Introduction](./domain/introduction.md): The conceptual model of the business logic.
*   **Concepts**
    *   [Entity](./domain/concepts/entity.md): Objects defined by identity rather than attributes (e.g., a `User`).
    *   [Value Object](./domain/concepts/value-object.md): Objects that describe aspects of the domain but lack identity.
*   **Patterns**
    *   [Builder](./domain/patterns/builder.md): Pattern for constructing complex objects step-by-step.
    *   [Services](./domain/patterns/services.md): Objects handling domain operations and isolating business logic.
    *   [Specification](./domain/patterns/specification.md): Pattern for implementing and validating business rules (`isSatisfiedBy`).

## Application Layer
*   [Introduction](./application/introduction.md): Agnostic application logic that coordinates tasks.
*   **Patterns**
    *   [API Model](./application/patterns/api-model.md): Versioned representations of domain data for REST APIs.
    *   [Controller](./application/patterns/controller.md): Handles requests agnostically, independent of the specific framework.
    *   [Port](./application/patterns/port.md): Defines contracts for inputs and outputs to decouple the core from external libraries.
    *   [Use Case Handler](./application/patterns/use-case-handler.md): Manages application logic separate from pure domain logic.
*   *   **Services**
        *   [Environment Service](./application/patterns/services/environment-service.md): Provides centralized, type-safe access to application configuration and environment variables.

## Adapter Layer
*   [Introduction](./adapter/introduction.md): Infrastructure and implementation-specific code (e.g., database repositories).
*   **Patterns**
    *   [Adapter](./adapter/patterns/adapter.md): Implements or utilizes ports to connect the core application with external drivers.
*   **Inversify patterns**
    *   [Inversify container modules](./adapter/inversify-patterns/container-module.md): Organizes dependency injection bindings using InversifyJS.
    *   [Inversify controller](./adapter/inversify-patterns/controller.md): HTTP controllers using `@inversifyjs/http-core`.
*   **Prisma patterns**
    *   [Prisma persistence service](./adapter/prisma-patterns/persistence-service.md): Implements repositories using Prisma ORM to interact with the database.
