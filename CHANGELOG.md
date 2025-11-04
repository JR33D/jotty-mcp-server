# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-11-02

### Added

-   Initial release of the Jotty MCP Server.
-   Integration with Alexander's `mcp-server-starter-ts` template.
-   **11 MCP Tools for Jotty API interaction:**
    -   `get_all_checklists`
    -   `add_checklist_item`
    -   `check_item`
    -   `uncheck_item`
    -   `get_all_notes`
    -   `create_note`
    -   `get_user_info`
    -   `get_categories`
    -   `get_summary`
    -   `export_data`
    -   `get_export_progress`
-   Jotty API client (`src/lib/jotty-client.ts`) with authentication, error handling, and logging.
-   Environment variable configuration and validation (`.env`, `.env.example`, `src/config.ts`).
-   Dual transport support (stdio and HTTP) via `src/server/boot.ts`.
-   Comprehensive testing setup:
    -   Unit tests for `jotty-client`.
    -   Integration tests for all MCP tools.
-   Docker configuration for production and development environments (`Dockerfile`, `docker-compose.yml`).
-   Extensive documentation:
    -   `README.md`
    -   `docs/DEVELOPMENT.md`
    -   `docs/API.md`
