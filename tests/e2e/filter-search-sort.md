# E2E test: filter / search / sort UI wiring

Regression guard for the shared filter/search/sort **UI shells** (`FilterPanel`,
`MultiSelectFilter`, `SortableHeader`) that wire the cascading-filter / search /
sort hooks to both screens. The hooks themselves are covered by unit tests
(`client/src/hooks/*.test.ts`); this test covers the component layer that could
break independently of correct hook logic.

## How to run

Run via the Replit **testing** skill (`runTest`). Paste the test plan below as the
`testPlan`. The app must be running on the `Start application` workflow. Data is
fetched live from Google Sheets and changes over time, so the plan must **not**
hard-code company names, jurisdictions, years, or row counts. Instead, capture a
currently visible value at runtime and reuse it for later assertions, and assert
only on relative changes (rows decrease, option counts narrow) rather than exact
content or counts.

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
5. [Browser] Open the Year filter (`button-filter-year`). Read the **first**
   available option button (`data-testid^="option-"`); capture its visible label
   as YEAR_VALUE and the suffix of its `data-testid` (the part after `option-`) as
   YEAR_OPTION_ID. Click that option, then close the dropdown.
6. [Verify] A filter badge for the captured year is visible
   (`data-testid="badge-filter-{YEAR_VALUE}"`) and `button-reset-filters` is visible.
7. [Browser] Re-open the Actor filter (`button-filter-actor`).
8. [Verify] Option count now = ACTOR_COUNT_AFTER, and ACTOR_COUNT_AFTER <=
   ACTOR_COUNT_BEFORE (cascading narrows the actor options to those co-occurring
   with the selected year). Report both numbers. Close the dropdown.
9. [Browser] Click `button-reset-filters` to clear filters.
10. [Verify] Note total visible rows = ROWS_BEFORE_SEARCH.
11. [Browser] Read the first visible company cell (`data-testid^="text-company-"`)
    and capture its trimmed text as COMPANY_VALUE. Pick a distinctive search token
    from it (e.g. the first whole word of COMPANY_VALUE) and capture it as
    COMPANY_TOKEN.
12. [Browser] Type COMPANY_TOKEN into `input-search-all`.
13. [Verify] Visible rows < ROWS_BEFORE_SEARCH and every visible
    `text-company-*` cell contains COMPANY_TOKEN (case-insensitive). Clear the
    search afterward.
14. [Verify] `button-sort-company` shows the neutral up/down icon (unsorted).
15. [Browser] Click `button-sort-company` once.
16. [Verify] Header shows the ascending (arrow-up) icon and the first company
    cell is alphabetically <= the last visible company cell.
17. [Browser] Click `button-sort-company` a second time.
18. [Verify] Header shows the descending (arrow-down) icon and the first company
    cell is alphabetically >= the last visible company cell.
19. [Browser] Click `button-sort-company` a third time.
20. [Verify] Header returns to the neutral up/down icon (unsorted).

### Part B — IPS Implementation Registry (`/`)

21. [Browser] Navigate to `/`. Wait for rows (`data-testid^="row-impl-"`).
22. [Verify] At least 3 implementation rows are visible.
23. [Browser] Open the Approach filter (`button-filter-implementation-approach`).
    Note option count = APPROACH_COUNT_BEFORE. Close it.
24. [Browser] Read the first visible jurisdiction cell
    (`data-testid^="text-jurisdiction-"`) and capture its trimmed text as
    JURISDICTION_VALUE.
25. [Browser] Open the Jurisdiction filter (`button-filter-jurisdiction`), select
    the option whose label/`data-testid` suffix matches JURISDICTION_VALUE
    (`data-testid="option-{JURISDICTION_VALUE}"`), then close it.
26. [Verify] A filter badge for the captured jurisdiction is visible
    (`data-testid="badge-impl-filter-{JURISDICTION_VALUE}"`) and
    `button-impl-reset-filters` is visible.
27. [Browser] Re-open the Approach filter.
28. [Verify] Option count = APPROACH_COUNT_AFTER, and APPROACH_COUNT_AFTER <=
    APPROACH_COUNT_BEFORE (cascading narrows approaches to those used by the
    selected jurisdiction). Report both numbers. Close the dropdown.
29. [Browser] Click `button-impl-reset-filters` to clear filters.
30. [Verify] Note total visible rows = IMPL_ROWS_BEFORE.
31. [Browser] Type JURISDICTION_VALUE into `input-impl-search-all`.
32. [Verify] Visible rows < IMPL_ROWS_BEFORE and every visible
    `text-jurisdiction-*` cell contains JURISDICTION_VALUE (case-insensitive).
    Clear the search afterward.
33. [Verify] `button-sort-jurisdiction` shows the ascending icon by default
    (this table sorts by Jurisdiction asc on load).
34. [Browser] Click `button-sort-approach` once.
35. [Verify] `button-sort-approach` shows the ascending icon and
    `button-sort-jurisdiction` reverts to the neutral up/down icon.
36. [Browser] Click `button-sort-approach` a second time.
37. [Verify] `button-sort-approach` shows the descending icon.
38. [Browser] Click `button-sort-approach` a third time.
39. [Verify] `button-sort-approach` returns to the neutral up/down icon (unsorted).

Report PASS only if every `[Verify]` step holds on both screens.

## Why these assertions catch component-layer regressions

- A broken filter→`onChange` binding means no badge appears (steps 6, 26) and the
  dropdowns never narrow (steps 8, 28).
- A broken search binding means the row count never drops (steps 13, 32).
- A broken sort-arrow indicator or `onSort` wiring means the icon does not cycle
  asc → desc → unsorted (steps 14-20, 33-39).

## Why values are captured at runtime

The plan reads a live company, jurisdiction, and year from the rendered UI before
asserting on them, so it stays valid as the Google Sheets source data changes. No
step assumes a specific vendor, country, year, or row count.

Last verified passing: both screens, June 2026.
