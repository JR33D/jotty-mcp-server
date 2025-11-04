# API Reference

This document provides a comprehensive reference for all the MCP tools exposed by the Jotty MCP Server.

---

## Checklist Tools

### `get_all_checklists`

-   **Description:** Retrieves all checklists for the authenticated user.
-   **Schema:** `z.object({})` (No input parameters)
-   **Handler:** Calls `jottyClient.getAllChecklists()`.
-   **Returns:** A JSON array of `Checklist` objects.

### `add_checklist_item`

-   **Description:** Adds a new item to a specified checklist.
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

### `check_item`

-   **Description:** Marks an item in a checklist as complete.
-   **Schema:**
    ```typescript
z.object({
  listId: z.string(),
  itemIndex: z.number(),
})
    ```
-   **Handler:** Calls `jottyClient.checkItem(listId, itemIndex)`.
-   **Returns:** A JSON `ChecklistItem` object.

### `uncheck_item`

-   **Description:** Marks an item in a checklist as incomplete.
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

### `get_all_notes`

-   **Description:** Retrieves all notes for the authenticated user.
-   **Schema:** `z.object({})` (No input parameters)
-   **Handler:** Calls `jottyClient.getAllNotes()`.
-   **Returns:** A JSON array of `Note` objects.

### `create_note`

-   **Description:** Creates a new note.
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

---

## Admin Tools

### `get_user_info`

-   **Description:** Get information about a specific Jotty user.
-   **Schema:**
    ```typescript
z.object({
  username: z.string(),
})
    ```
-   **Handler:** Calls `jottyClient.getUserInfo(username)`.
-   **Returns:** A JSON `UserInfo` object.

### `get_categories`

-   **Description:** Retrieves all available categories for organizing items.
-   **Schema:** `z.object({})` (No input parameters)
-   **Handler:** Calls `jottyClient.getCategories()`.
-   **Returns:** A JSON array of `Category` objects.

### `get_summary`

-   **Description:** Get summary statistics from your Jotty account.
-   **Schema:**
    ```typescript
z.object({
  username: z.string().optional(),
})
    ```
-   **Handler:** Calls `jottyClient.getSummary()`.
-   **Returns:** A JSON `SummaryStats` object.

### `export_data`

-   **Description:** Starts a full export of your Jotty data.
-   **Schema:**
    ```typescript
z.object({
  type: z.enum(['json', 'csv']),
  username: z.string().optional(),
})
    ```
-   **Handler:** Calls `jottyClient.exportData(type, username)`.
-   **Returns:** A JSON object with an `exportId`.

### `get_export_progress`

-   **Description:** Checks the progress of an ongoing data export.
-   **Schema:**
    ```typescript
z.object({
  exportId: z.string(),
})
    ```
-   **Handler:** Calls `jottyClient.getExportProgress(exportId)`.
-   **Returns:** A JSON `ExportStatus` object.
