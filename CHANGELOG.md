# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0](https://github.com/JR33D/jotty-mcp-server/compare/v1.1.0...v1.2.0) (2025-11-16)


### Features

* **mcp-sdk:** Upgrade @modelcontextprotocol/sdk and adapt server code ([#19](https://github.com/JR33D/jotty-mcp-server/issues/19)) ([c6a1589](https://github.com/JR33D/jotty-mcp-server/commit/c6a1589bafbb6acadac241a947c25d54bff56605))
* **mcp-tools:** Add new tools for Jotty API endpoints ([#17](https://github.com/JR33D/jotty-mcp-server/issues/17)) ([37be715](https://github.com/JR33D/jotty-mcp-server/commit/37be715d43dd928482daae77892ec36f1fe59c4a))

## [1.1.0](https://github.com/JR33D/jotty-mcp-server/compare/v1.0.0...v1.1.0) (2025-11-08)


### Features

* Update dependencies and refactor for SDK changes ([#9](https://github.com/JR33D/jotty-mcp-server/issues/9)) ([8809449](https://github.com/JR33D/jotty-mcp-server/commit/8809449aaccf55caa3e5898cfc84ffff992cf6d2))

## 1.0.0 (2025-11-06)


### Features

* **auth:** Implement API key authentication middleware ([afb3cad](https://github.com/JR33D/jotty-mcp-server/commit/afb3cad2f884abe21ec0d8feca9c2431b2c94688))
* initial 1.0 release of Jotty MCP Server ([54f8ec9](https://github.com/JR33D/jotty-mcp-server/commit/54f8ec9583ad0c7d1832fa8e9585e287797467b5))
* **logging:** integrate Winston for structured console logging ([61af4d4](https://github.com/JR33D/jotty-mcp-server/commit/61af4d4c87ca542277179312633e070e26ca7a20))
* Prepare for prompt functionality and refactor codebase ([5ce3387](https://github.com/JR33D/jotty-mcp-server/commit/5ce3387cfdbdb2268f6823b024045ad8fdb89716))
* **project-setup:** Initial commit of Jotty MCP Server with core features and setup ([39d7738](https://github.com/JR33D/jotty-mcp-server/commit/39d7738a3599eeef43544908d93c42c11c91fdd3))
* **server:** Add health endpoint ([90fc12e](https://github.com/JR33D/jotty-mcp-server/commit/90fc12e7e37377193a1a0221851005d3a4bdb367))
* **tests:** Mock environment variables for unit tests ([7286108](https://github.com/JR33D/jotty-mcp-server/commit/72861084f48be14d8df7c406803bc097e0d4375c))
* Update build and test configurations for compiled JS ([ffb634a](https://github.com/JR33D/jotty-mcp-server/commit/ffb634a57c2037fa17f10fd9d21e7e1bac6af106))


### Bug Fixes

* **ci:** Disable GHA cache for Docker build ([79e6d33](https://github.com/JR33D/jotty-mcp-server/commit/79e6d3394c19917e67dc57ddd4c0f2ab6d6b6d1b))
* **ci:** Provide environment variables for test execution ([741c10a](https://github.com/JR33D/jotty-mcp-server/commit/741c10a719473209c0f07e4f61ce1eb16d26ede2))
* **imports:** update import statements for default exports ([f48b028](https://github.com/JR33D/jotty-mcp-server/commit/f48b028ef10693a0793651c639a6664d31e1893a))
* **lint:** Resolve remaining linting issues ([ab56f19](https://github.com/JR33D/jotty-mcp-server/commit/ab56f19527ad03fcd5fc3ddb2cb842b05b55e4af))
* **modules, dev:** Resolve module loading and dev server startup issues ([e92f9e3](https://github.com/JR33D/jotty-mcp-server/commit/e92f9e3ec0f4016c1cbda71766cf097e8b64ad74))
* **server:** prevent body parser from breaking SSE by using raw middleware on /mcp ([f614ef7](https://github.com/JR33D/jotty-mcp-server/commit/f614ef7679b278d1c9d056caabaa363b51b28a92))

## [1.0.0] - 2025-11-05

### Added

-   Initial release of the Jotty MCP Server.
-   Started with [Alexander's](https://github.com/alexanderop/mcp-server-starter-ts/tree/main) `mcp-server-starter-ts` template.
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
    -   Unit tests for `jotty-client` and all MCP tools.
-   Docker configuration for production and development environments (`Dockerfile`, `docker-compose.yml`).
-   Extensive documentation:
    -   `README.md`
    -   `docs/DEVELOPMENT.md`
    -   `docs/API.md`
