# Deployment Guide

This guide provides instructions for deploying and running the Jotty MCP Server in various environments.

## 1. Local Development (stdio)

For local development and testing, you can run the server using `npm run dev` or `npm run serve:stdio`.

### Using `npm run dev` (Recommended for Development)

This command starts the server with hot-reloading, making it ideal for active development.

```bash
cd /path/to/your/jotty-mcp-server
npm run dev
```

-   **Transport:** Uses HTTP transport by default, listening on `http://localhost:3000/mcp`.
-   **Environment Variables:** Reads from your local `.env` file.

### Using `npm run serve:stdio`

This runs the compiled server using the standard I/O transport.

```bash
cd /path/to/your/jotty-mcp-server
npm run build # Ensure the project is built
npm run serve:stdio
```

-   **Transport:** Uses stdio transport.
-   **Environment Variables:** Reads from your local `.env` file.

## 2. Docker Deployment

Docker provides a consistent and isolated environment for running your MCP server.

### Prerequisites

-   Docker and Docker Compose installed on your system.

### Steps

1.  **Configure `.env`:** Ensure your `.env` file in the project root is correctly configured with `JOTTY_BASE_URL` and `JOTTY_API_KEY`.

2.  **Build and Run with Docker Compose:**
    Navigate to the project root and run:
    ```bash
docker-compose up --build
    ```
    -   This will build the Docker image (if not already built or if changes are detected) and start the `jotty-mcp-server` container.
    -   The server will be accessible via HTTP on port `3000` on your host machine (e.g., `http://localhost:3000/mcp`).

3.  **Stop the containers:**
    ```bash
docker-compose down
    ```

## 3. Remote HTTP Deployment

For deploying to a remote server, you would typically build the Docker image and deploy it to a container orchestration platform (e.g., Kubernetes, Docker Swarm) or a cloud service (e.g., AWS ECS, Google Cloud Run, Azure Container Instances).

### Steps (General)

1.  **Build the Docker Image:**
    ```bash
docker build -t your-dockerhub-username/jotty-mcp-server:0.1.0 .
    ```

2.  **Push to a Container Registry:**
    ```bash
docker push your-dockerhub-username/jotty-mcp-server:0.1.0
    ```

3.  **Deploy to your Platform:** Refer to your chosen platform's documentation for deploying Docker images. Ensure you configure the necessary environment variables (`JOTTY_BASE_URL`, `JOTTY_API_KEY`, `PORT`, `CORS_ORIGIN`) in your deployment configuration.

## 4. Using the MCP Inspector for Debugging

The MCP Inspector is a valuable tool for debugging interactions with your MCP server.

### For stdio transport:

```bash
npm run build
npx @modelcontextprotocol/inspector node build/index.js
```

### For HTTP transport:

```bash
npm run build
npm run serve:http &
npx @modelcontextprotocol/inspector http://localhost:3000/mcp
```

## 5. Production Considerations

-   **Security:**
    -   **API Keys:** Never hardcode `JOTTY_API_KEY` in your code or commit it to version control. Use environment variables or a secure secret management system.
    -   **CORS:** Restrict `CORS_ORIGIN` to only the domains that need to access your MCP server.
    -   **Non-root User:** The provided `Dockerfile` already uses a non-root user for improved security.
-   **Scalability:** For high-traffic scenarios, consider deploying multiple instances of your MCP server behind a load balancer.
-   **Monitoring & Logging:** Integrate with a robust logging and monitoring solution to track server health and performance.
-   **Error Handling:** Ensure all API calls and tool executions have comprehensive error handling and logging.
-   **Resource Limits:** Configure appropriate CPU and memory limits for your Docker containers or cloud instances.
