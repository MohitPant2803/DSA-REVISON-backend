# Backend Agent Instructions & Rules

Before editing the backend repository or seeder files, ensure you follow these strict rules:

## 1. Database ObjectId Hardcoding Rule
Always ensure that the `_id` (ObjectId) for all default seed folders and cards are statically hardcoded in `staticIds.ts` (in the backend seeder directory). Never generate them dynamically with random IDs, and do not change existing hardcoded IDs as it will break the client app offline synchronization and result in duplicate folders/cards. If new folders or cards are added, their IDs must be generated deterministically and added to `staticIds.ts`.
