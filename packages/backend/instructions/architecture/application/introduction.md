# Introduction

The application layer contains agnostic application logic. It doesn't know which
driver is used to connect to a data source, but it knows there's a datasource.
It doesn't know about business logic, but can rely on the domain layer to get
that knowledge. It coordinates tasks and delegates work to other layers.
