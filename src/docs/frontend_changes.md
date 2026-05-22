# Frontend Change Log

This document tracks all frontend modifications required as we refactor the backend architecture. Each major backend change is paired with the corresponding frontend updates.

---

## 1. Add `cardIds` array to Folder schema

**Backend Change**: Added `cardIds: Types.ObjectId[]` to `Folder` model.

**Frontend Impact**:
- Update `src/types/folder.ts` to include `cardIds: string[]`.
- Modify folder service (`src/services/folderService.ts`) to map `cardIds` from the API response.
- Adjust any UI components that display folder contents to use `folder.cardIds` instead of iterating over embedded cards.
- Ensure the folder creation/edit forms submit `cardIds` (initially empty).

---

## 2. Introduce `SessionQueue` model & API

**Backend Change**: New `SessionQueue` model to represent a playback queue (ordered list of card IDs) decoupled from folders/playlists.

**Frontend Impact**:
- Add a new service `src/services/sessionQueueService.ts` with CRUD methods (`createQueue`, `getQueue`, `updateQueue`).
- Create TypeScript type `SessionQueue` in `src/types/index.ts`.
- Update the Reel player component to fetch the queue via `sessionQueueService.getQueue` and consume `cardId`s.
- Remove any direct folder/playlist dependencies from the Reel player.
- Add UI actions for "Shuffle" and "Replay" that manipulate the session queue via the service.

---

## 3. Introduce `UserCardState` model & API

**Backend Change**: New `UserCardState` model tracks per‑user state such as liked, watch‑later, and progress for each card.

**Frontend Impact**:
- Add `src/types/userCardState.ts` with fields `cardId`, `liked`, `watchLater`, `progress`.
- Create `src/services/userCardStateService.ts` for fetching and updating these states.
- Update bookmark, liked, and watch‑later UI components to call the new service instead of the old `Bookmark` model.
- Synchronize progress updates (e.g., when a reel finishes) with `userCardStateService.updateProgress`.

---

## 4. Update Playlist API to use ordered `cardIds`

**Backend Change**: Playlist now stores `orderedCardIds: Types.ObjectId[]` directly.

**Frontend Impact**:
- Modify `src/types/playlist.ts` to reflect `orderedCardIds: string[]`.
- Adjust playlist service (`src/services/playlistService.ts`) to handle the new field.
- Update playlist UI components to render cards based on `orderedCardIds`.
- Ensure drag‑reorder actions call the playlist service to persist the new order.

---

## 5. Migrate existing data scripts (backend migration)

**Backend Change**: Migration scripts to populate `cardIds` in existing folders and convert old playlist items.

**Frontend Impact**:
- No immediate code changes, but after migration ensure the frontend APIs fetch the new fields.
- Add a version check in the initialization flow to detect if migration is required and prompt the user accordingly.

---

## 6. Adjust authentication and user profile endpoints

**Backend Change**: User schema now includes reference to `UserCardState`.

**Frontend Impact**:
- Extend the user profile type (`src/types/user.ts`) with a `cardStateIds: string[]` field.
- Update login/signup flows to retrieve and store these IDs.
- Ensure that the global app store (`src/store/useAppStore.ts`) initializes user state from the new endpoint.

---

*This file will be continuously updated after each subsequent backend change.*
