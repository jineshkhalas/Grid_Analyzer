# Build notes

## What was built
A complete Grid Analyzer: FastAPI backend (from-scratch linear algebra), React + Vite + Tailwind frontend with React Flow, Firebase Firestore persistence and Firestore rules.

## Key decisions
| Topic | Decision |
|---|---|
| Units | Everything is **per-unit (p.u.) on one common system base**. The app never prints "MW". If you choose 1 p.u. = 100 MW, multiply flows by 100 yourself. Angles are in radians (degrees also shown). |
| Balance | Total generation must equal total demand within 1e-6 p.u. Otherwise the API returns an `unbalanced` error. Inputs are never changed silently. The editor offers an explicit, user-clicked "Set reference-bus generation to balance" button. |
| Flow sign | `flow(from -> to) = (theta_from - theta_to) / x`. Positive = power runs from the line's first bus to its second. |
| Loading status | `normal` < 80%, `warning` 80-100%, `overloaded` > 100% of capacity (absolute flow). |
| Solver | Gaussian elimination with partial pivoting solves B x = P. Gauss-Jordan inverse is computed only for the educational panel. |
| Sorting | Own stable merge sort (descending loading). |
| Parallel lines | Allowed; their susceptances add. |
| Islanding in an outage | `/api/contingency` answers HTTP 200 with `islanded: true`, the islands, and no flows. Invalid input answers HTTP 422 `{error:{code,message,details}}`. |
| Bus/line IDs | Auto-generated (B1, L1...) and fixed; names are editable. This avoids breaking line endpoints when renaming. |
| Authentication | **Implemented: Firebase Anonymous Authentication.** Each browser gets its own uid; documents hold `ownerId`; rules enforce it. Limitation: anonymous identity is per browser profile. Clearing site data or using another browser/device loses access to those documents. There are no accounts or sharing. |
| Firestore shape | Collections `grids` (buses and lines embedded), `demandscenarios`, `analysisresults`. Matrices are nested arrays, which Firestore forbids, so full results are stored as a JSON string in `payload` (with `lineFlows` kept as an array of objects for browsing). |
| Brief's table names | buses/lines are embedded in `grids`; `demand_scenarios` = `demandscenarios`; `line_flows` = `analysisresults.lineFlows`. |
| Demo mode | If `VITE_FIREBASE_*` are empty, the same storage API uses `localStorage`, so the whole app works offline of Firebase. |
| Timestamps | ISO-8601 strings written by the client (simple and sortable). Server timestamps would be stronger against clock skew. |

## Verification actually performed (in the build sandbox)
- `pytest`: 25 tests passed (linear algebra, graph/BFS, matrix build and reduction, flows, overloads, sorting, validation, unbalanced, disconnected, contingency, islanding, API and CORS).
- `npm install`, `npm run lint` (clean) and `npm run build` (succeeded).
- Started Uvicorn and called `/api/health` and `/api/analyze` over HTTP successfully.

## NOT verified
- The UI was **not opened in a real browser**, so layout, React Flow rendering and interactions were not visually checked.
- **Firebase was not connected** (no project available): Firestore reads/writes, anonymous sign-in and the security rules were not run against a real project or the emulator. Demo-mode storage and the Firestore code path share one interface, but the Firestore path is untested.
- Deployment instructions in the README are untested guidance.

## Known limits
- 2 to 10 buses, up to 60 lines. Layout is an automatic circle (nodes are not draggable). Parallel lines overlap in the diagram.
- No unit tests for the frontend; only lint and build checks.
- Production bundle is about 930 kB (not code-split).
