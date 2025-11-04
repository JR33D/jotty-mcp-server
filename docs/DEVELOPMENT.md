# Development Guide

This guide provides information for developers working on the Jotty MCP Server.

## Setting Up Your Development Environment

1.  **Clone the repository:**
    ```bash
git clone https://github.com/your-username/jotty-mcp-server.git
cd jotty-mcp-server
    ```

2.  **Install dependencies:**
    ```bash
npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file by copying `.env.example` and fill in your Jotty API details:
    ```bash
cp .env.example .env
    ```
    ```
    JOTTY_BASE_URL=http://localhost:1122
    JOTTY_API_KEY=ck_xxxxxxxxxxxxxxxx
    ```

4.  **Run in Development Mode:**
    ```bash
npm run dev
    ```
    This command uses `node dev` which typically watches for changes and restarts the server, providing a hot-reloading experience.

## Project Structure

The project follows a modular structure based on the `mcp-server-starter-ts` template:

-   `src/`:
    -   `config.ts`: Environment variable loading and Zod validation.
    -   `lib/`: Shared utility modules, e.g., `jotty-client.ts` for Jotty API interactions.
    -   `registry/`: Modules for auto-loading tools, resources, and prompts.
    -   `server/`: Server bootstrapping and transport configuration (`boot.ts`).
    -   `tools/`: Contains the MCP tool definitions, organized by category:
        -   `checklists/`: Tools related to Jotty checklists.
        -   `notes/`: Tools related to Jotty notes.
        -   `admin/`: Tools for administrative tasks like user info, categories, and data export.
    -   `__tests__/`: Unit tests for core modules like `jotty-client.ts`.
-   `tests/`: Integration tests for MCP tools.
-   `_templates/`: Hygen templates for generating new tools, prompts, and resources.
-   `build/`: Compiled JavaScript output (after `npm run build`).
-   `mcp.json`: VS Code integration for MCP development.

## How to Add New Tools, Resources, or Prompts

This template uses [Hygen](https://www.hygen.io/) for code generation. You can use the provided generators to quickly scaffold new MCP components.

### Adding a New Tool

```bash
npm run gen:tool
```

Follow the prompts to create a new tool. This will generate the tool definition file and a corresponding test file.

### Adding a New Prompt

```bash
npm run gen:prompt
```

### Adding a New Resource

```bash
npm run gen:resource
```

## Testing Strategies

-   **Unit Tests:** Located in `src/__tests__/`. These focus on individual functions or classes in isolation (e.g., `jotty-client.test.ts`).
-   **Integration Tests:** Located in `tests/`. These test the MCP tools by simulating calls to their handlers and verifying their interaction with the `JottyClient` (which is mocked during testing).

To run all tests:

```bash
npm test
```

## Debugging Tips

-   **Node.js Debugger:** You can attach a Node.js debugger to your running development server. Most IDEs (like VS Code) have built-in support for this.
-   **Console Logging:** Utilize `console.log` and `console.error` for quick debugging. The `JottyClient` already includes logging for API requests and responses.
-   **MCP Inspector:** The template includes scripts to use the MCP Inspector for debugging MCP server interactions:
    -   `npm run inspect`: Inspects the server running via stdio.
    -   `npm run inspect:http`: Inspects the server running via HTTP.
-   **Environment Variables:** Double-check your `.env` file for correct values, especially `JOTTY_BASE_URL` and `JOTTY_API_KEY`.
