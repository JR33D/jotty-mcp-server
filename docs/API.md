# API Reference

This document provides a comprehensive reference for all the MCP tools exposed by the Jotty MCP Server.

## Authentication

When using the HTTP transport, all requests to the `/mcp` endpoint must be authenticated. This is done by providing an API key in the `Authorization` header.

-   **Header:** `Authorization`
-   **Format:** `ApiKey <your-api-key>`

Replace `<your-api-key>` with the value you set for the `API_KEY` environment variable in your `.env` file.

Requests without a valid API key will be rejected with a `401 Unauthorized` status code.

---

## Checklist Tools

### `AllChecklistsFetcher`

-   **Description:** Retrieves all checklists associated with the authenticated user from the Jotty API. This tool provides agents with access to the user's complete list of checklists within the MCP system.
-   **Schema:** `z.object({})` (No input parameters)
-   **Handler:** Calls `jottyClient.getAllChecklists()`.
-   **Returns:** A JSON array of `Checklist` objects.

### `ChecklistItemAdder`

-   **Description:** Adds a new item to a specified checklist via the Jotty API. This tool allows agents to extend existing checklists with new tasks or entries within the MCP system.
-   **Schema:**
    ```typescript
z.object({
  listId: z.string(),
  text: z.string(),
  status: z.enum(['todo', 'done', 'in_progress', 'paused']).optional(),
  time: z.number().optional(),
})
    ```
-   **Handler:** Calls `jottyClient.addChecklistItem(listId, { text, status, time })`.
-   **Returns:** A JSON `ChecklistItem` object.

### `ChecklistItemChecker`

-   **Description:** Marks an item in a checklist as complete via the Jotty API. This tool allows agents to update the status of checklist items within the MCP system.
-   **Schema:**
    ```typescript
z.object({
  listId: z.string(),
  itemIndex: z.number(),
})
    ```
-   **Handler:** Calls `jottyClient.checkItem(listId, itemIndex)`.
-   **Returns:** A JSON `ChecklistItem` object.

### `ChecklistItemUnchecker`

-   **Description:** Marks an item in a checklist as incomplete via the Jotty API. This tool enables agents to manage the status of checklist items within the MCP system.
-   **Schema:**
    ```typescript
z.object({
  listId: z.string(),
  itemIndex: z.number(),
})
    ```
-   **Handler:** Calls `jottyClient.uncheckItem(listId, itemIndex)`.
-   **Returns:** A JSON `ChecklistItem` object.

---

## Note Tools

### `AllNotesFetcher`

-   **Description:** Retrieves all notes associated with the authenticated user from the Jotty API. This tool facilitates access to user-specific note data within the MCP system.
-   **Schema:** `z.object({})` (No input parameters)
-   **Handler:** Calls `jottyClient.getAllNotes()`.
-   **Returns:** A JSON array of `Note` objects.

### `NoteCreator`

-   **Description:** Facilitates the creation of new notes for the authenticated user via the Jotty API. This tool allows agents to add new textual information to the user's collection within the MCP system.
-   **Schema:**
    ```typescript
z.object({
  title: z.string(),
  content: z.string().optional(),
  category: z.string().optional(),
})
    ```
-   **Handler:** Calls `jottyClient.createNote({ title, content, category })`.
-   **Returns:** A JSON `Note` object.

### `NoteUpdater`

-   **Description:** Updates an existing note for the authenticated user via the Jotty API.
-   **Schema:**
    ```typescript
z.object({
  noteId: z.string(),
  title: z.string(),
  content: z.string().optional(),
  category: z.string().optional(),
  originalCategory: z.string().optional(),
})
    ```
-   **Handler:** Calls `jottyClient.updateNote(noteId, { title, content, category, originalCategory })`.
-   **Returns:** A JSON `Note` object.

### `NoteDeleter`

-   **Description:** Deletes an existing note for the authenticated user via the Jotty API.
-   **Schema:**
    ```typescript
z.object({
  noteId: z.string(),
})
    ```
-   **Handler:** Calls `jottyClient.deleteNote(noteId)`.
-   **Returns:** A JSON object with a `success` boolean.

---

## Admin Tools

### `UserInfoFetcher`

-   **Description:** Retrieves detailed information for a specified Jotty user. This administrative tool provides insights into user profiles within the MCP system.
-   **Schema:**
    ```typescript
z.object({
  username: z.string(),
})
    ```
-   **Handler:** Calls `jottyClient.getUserInfo(username)`.
-   **Returns:** A JSON `UserInfo` object.

### `CategoryFetcher`

-   **Description:** Retrieves all available categories from the Jotty API. This administrative tool provides a comprehensive list of categorization options within the MCP system.
-   **Schema:** `z.object({})` (No input parameters)
-   **Handler:** Calls `jottyClient.getCategories()`.
-   **Returns:** A JSON array of `Category` objects.

### `AccountSummaryFetcher`

-   **Description:** Retrieves summary statistics for the authenticated Jotty account. This administrative tool provides an overview of account activity and data within the MCP system.
-   **Schema:**
    ```typescript
z.object({
  username: z.string().optional(),
})
    ```
-   **Handler:** Calls `jottyClient.getSummary()`.
-   **Returns:** A JSON `SummaryStats` object.

### `DataExporter`

-   **Description:** Initiates a full export of Jotty user data in a specified format. This administrative tool enables comprehensive data backup and migration within the MCP system.
-   **Schema:**
    ```typescript
z.object({
  type: z.enum(['json', 'csv']),
  username: z.string().optional(),
})
    ```
-   **Handler:** Calls `jottyClient.exportData(type, username)`.
-   **Returns:** A JSON object with an `exportId`.

### `ExportProgressMonitor`

-   **Description:** Monitors the progress of a specified data export operation. This administrative tool provides real-time status updates for data export tasks within the MCP system.
-   **Schema:**
    ```typescript
z.object({
  exportId: z.string(),
})
    ```
-   **Handler:** Calls `jottyClient.getExportProgress(exportId)`.
-   **Returns:** A JSON `ExportStatus` object.

### `LinkIndexRebuilder`

-   **Description:** Rebuilds the internal link index for a specific user.
-   **Schema:**
    ```typescript
z.object({
  username: z.string(),
})
    ```
-   **Handler:** Calls `jottyClient.rebuildLinkIndex(username)`.
-   **Returns:** A JSON object with a `success` boolean and a `message`.

---

## System Resources

### `HealthChecker`

-   **Description:** Checks the health of the Jotty API.
-   **Schema:** `z.object({})` (No input parameters)
-   **Handler:** Calls `jottyClient.getHealth()`.
-   **Returns:** A JSON object with `status`, `version`, and `timestamp`.
