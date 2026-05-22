# Frontend Changes Tracker

## Change 1: Add `cardIds` array to Folder model

- **API Update**: Ensure the folder GET endpoint returns the new `cardIds` field alongside existing folder metadata.
- **TypeScript Types**: Extend the `Folder` interface (e.g., `src/types/folder.ts`) with `cardIds: string[]`.
- **Folder Service (frontend)**: Modify `folderService.ts` to map the response to include `cardIds` and expose a method `getFolderWithCards(folderId)` that returns the folder metadata plus an array of card IDs.
- **UI Adjustments**:
  - In the folder screen/component, replace any logic that directly accessed embedded card objects with logic that fetches cards from the global card store using the `cardIds` list.
  - Update drag‑and‑drop reorder handling to work on the `cardIds` array rather than mutating a folder‑specific order field.
  - Ensure any rendering loops (`map`) use `cardIds` to look up card details.
- **State Management**: If using a store (e.g., Zustand or Redux), add a selector that returns cards for a given folder based on `cardIds`.
- **Testing**: Add or update unit/integration tests for the folder component to verify it correctly renders cards using the new `cardIds` array.

---

### How to Use This Tracker

- After each major backend change, append a new section describing the required frontend updates.
- Keep this file in the backend repository under `src/docs/frontend_changes/README.md` so the frontend team can pull the latest needed changes.
