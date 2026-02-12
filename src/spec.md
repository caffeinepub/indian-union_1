# Specification

## Summary
**Goal:** Add authenticated-only Meeting History, Recent Meetings, and Member Search pages with simple case-insensitive search and clear UI states, and expose navigation links to reach them.

**Planned changes:**
- Add a “Meeting History” page for signed-in users that lists all meetings and includes a search input filtering by meeting title or description (case-insensitive), with loading, error, empty, and no-results states.
- Add a “Recent Meetings” page for signed-in users that shows a deterministic bounded subset of the most recent meetings (e.g., latest 10) with a search input filtering within that subset by title or description (case-insensitive), with loading, error, empty, and no-results states.
- Add a “Member Search” page for signed-in users that lists members and includes a search input filtering by username (case-insensitive), with loading, error, empty, and no-results states.
- Update signed-in navigation to include entry points: Meeting History and Recent Meetings under Meetings, and Member Search under Members; ensure unauthenticated users are blocked from these pages and prompted to sign in.

**User-visible outcome:** Signed-in users can navigate to Meeting History, Recent Meetings, and Member Search, quickly filter the displayed lists via search, and see clear feedback when data is loading, missing, errors occur, or a search returns no matches.
