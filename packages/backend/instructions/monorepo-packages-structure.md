# Monorepo packages structure

An hexkit monorepo is structured by apps. An app is a set of packages that leads to one or multiple deployable applications. For example a `user` app may have packages related to users that are used to deploy a user REST API service and a RabbitMQ consumer of queues that handle user operations.

When managing a monorepo at a given folder, `packages/backend` MUST include backend packages with the following structure:

## Libraries

`packages/backend/libraries/*`: common libraries used in many backend packages of different apps. A `prisma` folder might contain common abstractions used by different prisma adapters to interact with SQL databases.


## Apps

- Given an `[app]` app,

`packages/backend/apps/[app]/*`: packages related to the `[app]` app. Domain, application and adapters packages related to the `[app]` app MUST be located here. For example, given a `user` app:

 - `packages/backend/apps/user/domain`: domain layer of the user app.
 - `packages/backend/apps/user/application`: application layer of the user app.
 - `packages/backend/apps/user/prisma-adapter`: prisma adapter of the user app.
 - `packages/backend/apps/user/rest-api-adapter`: REST API adapter of the user app.

Some well known adapters MAY be documented in furhter documents.

## Tools

 - `packages/backend/tools/*`: packages related to backend development tools, such as code generators, linters, etc. 

### Docker composed based tools

Some docker compose files to run local databases for development and testing SHOULD be located here. If so, a common docker network for backend development and testing MUST be created if not exists. For example, if a `catalog_graphql_api_example_network` netowrk is needed, the following sh script MUST be used to create it and run the docker compose services:

```sh
docker network inspect catalog_graphql_api_example_network >/dev/null 2>&1 || \
  docker network create -d bridge catalog_graphql_api_example_network

docker compose up

```

This way, docker containers can be launched with a `serve` npm script. A `postserve` script MUST be used to stop and remove the containers after development or testing is done. (`docker compose down`).
