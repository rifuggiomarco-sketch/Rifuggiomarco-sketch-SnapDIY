# Security Specification for SnapDIY

## 1. Data Invariants
- A **User** must be authenticated to create a profile or save projects.
- A **SavedProject** cannot exist without a valid **Project** ID.
- Access to **Inventory** (Laboratorio) is strictly restricted to the owner of the inventory.
- Users can update their own profile fields but cannot modify system-only fields (to be refined in production, for now bioPoints and counts are allowed for the prototype).
- **Projects** are read-only for public users.

## 2. The "Dirty Dozen" Payloads (Test Targets)
1. **Spoofing Identity**: Authenticated as User A, attempting to write to `/users/UserB`.
2. **Resource Poisoning**: Attempting to create an `inventory` item with a 1MB name.
3. **Orphaned Save**: Attempting to save a project that does not exist in `/projects`.
4. **Invalid Type**: Updating `completedCount` with a string instead of a number.
5. **Privilege Escalation**: Attempting to set `isPro: true` without valid authorization (though currently not strictly enforced in rules beyond key checking).
6. **Shadow Update**: Updating a profile with an undocumented field `isAdmin: true`.
7. **Negative Quantity**: Setting `inventory` quantity to -1.
8. **Malicious ID**: Attempting to create a document with a path-injection ID like `../system/config`.
9. **Expired Timestamp**: Providing a client-side timestamp for `lastScanned` that is in the future.
10. **Public Write**: Attempting to write to `/projects` without authentication.
11. **Mass Delete**: Attempting to delete another user's saved projects.
12. **PII Leak**: Attempting to `list` the `/users` collection as an unauthenticated user to scrape emails.

## 3. Conflict Report & Evaluation
| Collection | Identity Spoofing | Resource Poisoning | State Logic |
|------------|-------------------|--------------------|-------------|
| users      | Blocked (isOwner) | Blocked (size)     | Enforced    |
| inventory  | Blocked (isOwner) | Blocked (size)     | Enforced    |
| projects   | Read-Only         | Read-Only          | N/A         |
| saved      | Blocked (isOwner) | Blocked (isValid)  | Enforced    |
