# E2E test: filter / search / sort UI wiring

Regression guard for the shared filter/search/sort **UI shells** (`FilterPanel`,
`MultiSelectFilter`, `SortableHeader`) that wire the cascading-filter / search /
sort hooks to both screens. The hooks themselves are covered by unit tests
(`client/src/hooks/*.test.ts`); this test covers the component layer that could
break independently of correct hook logic.

## How to run

Run via the Replit **testing** skill (`runTest`). Paste the test plan below as the
`testPlan`. The app must be running on the `Start application` workflow. Data is
fetched live from Google Sheets, so assert on relative changes (rows decrease,
option counts narrow) rather than exact counts.

## Route mapping (wouter)

- `/results` → Vendor Results screen (`Home.tsx`)
- `/` and `/implementations` → IPS Implementation Registry (`Implementations.tsx`)

## Test plan

### Part A — Vendor Results (`/results`)

1. [New Context] Create a new browser context (desktop viewport).
2. [Browser] Navigate to `/results`. Wait for rows (`data-testid^="row-result-"`).
3. [Verify] At least 5 result rows are visible.
4. [Browser] Open the Actor filter dropdown (`button-filter-actor`). Note the
   number of option buttons (`data-testid^="option-"`) = ACTOR_COUNT_BEFORE. Close it.
5. [Browser] Open the Year filter (`button-filter-year`), select `option-2024`, close it.
6. [Verify] Badge `badge-filter-2024` and `button-reset-filters` are visible.
7. [Browser] Re-open the Actor filter (`button-filter-actor`).
8. [Verify] Option count now = ACTOR_COUNT_AFTER, and ACTOR_COUNT_AFTER <=
   ACTOR_COUNT_BEFORE (cascading narrows the actor options to those co-occurring
   with year 2024). Report both numbers. Close the dropdown.
9. [Browser] Click `button-reset-filters` to clear filters.
10. [Verify] Note total visible rows = ROWS_BEFORE_SEARCH.
11. [Browser] Type `Altera` into `input-search-all`.
12. [Verify] Visible rows < ROWS_BEFORE_SEARCH and every visible
    `text-company-*` cell contains `Altera`. Clear the search afterward.
13. [Verify] `button-sort-company` shows the neutral up/down icon (unsorted).
14. [Browser] Click `button-sort-company` once.
15. [Verify] Header shows the ascending (arrow-up) icon and the first company
    cell is alphabetically early.
16. [Browser] Click `button-sort-company` a second time.
17. [Verify] Header shows the descending (arrow-down) icon and the first company
    cell is alphabetically late.
18. [Browser] Click `button-sort-company` a third time.
19. [Verify] Header returns to the neutral up/down icon (unsorted).

### Part B — IPS Implementation Registry (`/`)

20. [Browser] Navigate to `/`. Wait for rows (`data-testid^="row-impl-"`).
21. [Verify] At least 3 implementation rows are visible.
22. [Browser] Open the Approach filter (`button-filter-implementation-approach`).
    Note option count = APPROACH_COUNT_BEFORE. Close it.
23. [Browser] Open the Jurisdiction filter (`button-filter-jurisdiction`), select
    `option-Australia`, close it.
24. [Verify] Badge `badge-impl-filter-Australia` and `button-impl-reset-filters`
    are visible.
25. [Browser] Re-open the Approach filter.
26. [Verify] Option count = APPROACH_COUNT_AFTER, and APPROACH_COUNT_AFTER <=
    APPROACH_COUNT_BEFORE (cascading narrows approaches to those used by
    Australia). Report both numbers. Close the dropdown.
27. [Browser] Click `button-impl-reset-filters` to clear filters.
28. [Verify] Note total visible rows = IMPL_ROWS_BEFORE.
29. [Browser] Type `Australia` into `input-impl-search-all`.
30. [Verify] Visible rows < IMPL_ROWS_BEFORE and visible `text-jurisdiction-*`
    cells contain `Australia`. Clear the search afterward.
31. [Verify] `button-sort-jurisdiction` shows the ascending icon by default
    (this table sorts by Jurisdiction asc on load).
32. [Browser] Click `button-sort-approach` once.
33. [Verify] `button-sort-approach` shows the ascending icon and
    `button-sort-jurisdiction` reverts to the neutral up/down icon.
34. [Browser] Click `button-sort-approach` a second time.
35. [Verify] `button-sort-approach` shows the descending icon.
36. [Browser] Click `button-sort-approach` a third time.
37. [Verify] `button-sort-approach` returns to the neutral up/down icon (unsorted).

Report PASS only if every `[Verify]` step holds on both screens.

## Why these assertions catch component-layer regressions

- A broken filter→`onChange` binding means no badge appears (steps 6, 24) and the
  dropdowns never narrow (steps 8, 26).
- A broken search binding means the row count never drops (steps 12, 30).
- A broken sort-arrow indicator or `onSort` wiring means the icon does not cycle
  asc → desc → unsorted (steps 13-19, 31-37).

Last verified passing: both screens, June 2026.
