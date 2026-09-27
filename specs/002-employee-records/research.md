# Research: Employee Records

## Decisions

### Database-side discovery

- **Decision**: Compose optional search and filters as JPA specifications and use pageable repository execution.
- **Rationale**: Bounds memory/network use and keeps the 10,000-record dataset responsive.
- **Alternatives considered**: Client filtering requires transferring the full dataset; fixed query permutations grow combinatorially.

### DTO boundary and bean validation

- **Decision**: Accept `EmployeeRequest`, return `EmployeeResponse`, and validate requests before service execution.
- **Rationale**: Keeps persistence internals out of the public contract and produces consistent field errors.
- **Alternatives considered**: Exposing entities couples API clients to storage mappings.

### Duplicate handling

- **Decision**: Check employee ID and email in the service and retain database uniqueness as the final authority.
- **Rationale**: Produces clear conflicts while remaining correct under concurrent writes.

### Bounded pagination

- **Decision**: Default to 25 and cap requested size at 100.
- **Rationale**: Supports scanning without unbounded responses.