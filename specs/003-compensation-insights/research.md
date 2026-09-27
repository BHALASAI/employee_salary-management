# Research: Compensation Insights

## Decisions

### Database projections

- **Decision**: Use count, average, sum, and group-by repository queries.
- **Rationale**: Produces a compact response and avoids materializing 10,000 entities.
- **Alternatives considered**: Browser or service-layer aggregation increases transfer and memory costs.

### Currency-separated totals

- **Decision**: Group base salary totals by currency and omit a global total.
- **Rationale**: Adding nominal USD, EUR, GBP, and other values would imply false comparability.
- **Alternatives considered**: Currency conversion requires rates, effective dates, and governance not present in scope.

### Nominal averages

- **Decision**: Retain implemented global averages and label them `Local currency units`.
- **Rationale**: Preserves baseline behavior while making the lack of conversion visible.
- **Alternatives considered**: Per-currency averages would be stronger analytics but constitute a separate behavior change.

### Lightweight visualization

- **Decision**: Render proportional CSS bars without a chart dependency.
- **Rationale**: The small set of categorical metrics does not justify additional bundle and maintenance cost.