# Jotty MCP Server

![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP (Model Context Protocol) server designed to connect Claude Desktop to the Jotty REST API, enabling language models to interact with your Jotty checklists and notes.

This project is built using Alexander's [mcp-server-starter-ts](https://github.com/alexanderop/mcp-server-starter-ts) template, providing a robust and extensible foundation for MCP server development.

## Features

This server exposes 11 tools to interact with your Jotty data:

- **Checklists:**
  - `get_all_checklists`: Retrieve all checklists for the authenticated user.
  - `add_checklist_item`: Add an item to a specified checklist.
  - `check_item`: Mark an item in a checklist as complete.
  - `uncheck_item`: Mark an item in a checklist as incomplete.
- **Notes:**
  - `get_all_notes`: Retrieve all notes for the authenticated user.
  - `create_note`: Create a new note with a title, optional content, and category.
- **Admin & Data Management:**
  - `get_user_info`: Get information about a specific Jotty user.
  - `get_categories`: Retrieve all available categories for organizing items.
  - `get_summary`: Get summary statistics from your Jotty account.
  - `export_data`: Start a full export of your Jotty data (JSON or CSV).
  - `get_export_progress`: Check the progress of an ongoing data export.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/jotty-mcp-server.git
cd jotty-mcp-server
```

### 2. Install Dependencies

```bash
npm install
```

## Configuration

1.  **Environment Variables:**
    Create a `.env` file in the project root by copying `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Edit the `.env` file and provide your Jotty API details:
    ```
    JOTTY_BASE_URL=http://localhost:1122
    JOTTY_API_KEY=ck_xxxxxxxxxxxxxxxx
    ```

2.  **CORS Origin (for HTTP transport):**
    If you are using the HTTP transport and accessing the server from a different domain, ensure `CORS_ORIGIN` in your `.env` file (or `docker-compose.yml`) is configured correctly. By default, it's set to `*` (allowing all origins).

## Usage

### Running the Server

-   **Development Mode (with hot-reloading):**
    ```bash
npm run dev
    ```

-   **Production Mode (Standard I/O - stdio):**
    ```bash
npm run serve:stdio
    ```

-   **Production Mode (HTTP Transport):**
    ```bash
npm run serve:http
    ```
    The HTTP server will listen on `http://localhost:3000/mcp` by default.

### Docker Deployment

To build and run the server using Docker Compose:

1.  Ensure your `.env` file is configured with `JOTTY_BASE_URL` and `JOTTY_API_KEY`.
2.  From the project root, run:
    ```bash
docker-compose up --build
    ```
    The server will be accessible via HTTP on port `3000`.

### Usage with Claude Desktop

1.  Start the Jotty MCP Server (either in development mode, production stdio, or production HTTP).
2.  In Claude Desktop, navigate to `Settings > Model Context`.
3.  Click "Add Server" and configure it:
    *   **For stdio transport:** Select "Standard I/O" and point to the server executable (e.g., `node build/index.js` after running `npm run build`).
    *   **For HTTP transport:** Select "HTTP" and enter the server URL (e.g., `http://localhost:3000/mcp`).
4.  The Jotty tools will now be available for use in your Claude conversations.

## Testing

To run all unit and integration tests:

```bash
npm test
```

This command executes tests located in `tests/**/*.test.ts` and `src/__tests__/**/*.test.ts`.

## API Reference

For a detailed breakdown of all available tools and their parameters, please refer to [API.md](./docs/API.md).

## Troubleshooting

-   **`JOTTY_API_KEY not set` or invalid:** Ensure your `.env` file is correctly configured with a valid `JOTTY_API_KEY` starting with `ck_`.
-   **Jotty API connection issues:** Verify that `JOTTY_BASE_URL` in your `.env` is correct and your Jotty instance is running and accessible.
-   **Module resolution errors during build:** If you encounter TypeScript errors related to module imports, ensure `npm install` has been run successfully and that your Node.js version meets the `engines` requirement in `package.json`.
-   **CORS issues (HTTP transport):** If Claude Desktop (or another client) is having trouble connecting via HTTP, check the `CORS_ORIGIN` setting in your environment variables.

## License

This project is licensed under the MIT License.
