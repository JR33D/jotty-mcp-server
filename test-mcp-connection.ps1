# test-mcp-connection.ps1

# --- Configuration ---
$mcpServerUri = "http://localhost:3000/mcp"
$clientName = "PowerShell-Test-Client"
$clientVersion = "1.0.0"
$initialProtocolVersion = "1.0.0" # Protocol version for the initial 'initialize' request
$negotiatedProtocolVersion = "2025-06-18" # The protocol version returned by your server in the initialize response

Write-Host "--- Starting MCP Connection Test ---"

# --- Step 1: Send Initialize Request ---
Write-Host "`n--- Sending Initialize Request ---"
$initializeBody = @{
    jsonrpc = "2.0"
    method = "initialize"
    params = @{
        protocolVersion = $initialProtocolVersion
        capabilities = @{}
        clientInfo = @{
            name = $clientName
            version = $clientVersion
        }
    }
    id = 1
} | ConvertTo-Json -Compress

try {
    $initializeResponse = Invoke-WebRequest -Uri $mcpServerUri `
        -Method POST `
        -Headers @{
            "Content-Type"="application/json";
            "Accept"="application/json, text/event-stream";
            "User-Agent"=$clientName
        } `
        -Body $initializeBody `
        -ErrorAction Stop

    Write-Host "Initialize Request successful (Status: $($initializeResponse.StatusCode))"
    # Extract session ID
    $mcpSessionId = $initializeResponse.Headers.'mcp-session-id'
    if ($null -eq $mcpSessionId) {
        Write-Error "Mcp-Session-Id header not found in initialize response. Exiting."
        exit 1
    }
    Write-Host "Extracted Mcp-Session-Id: $mcpSessionId"

    # You can also parse the content to get the negotiated protocol version if it differs
    # $parsedContent = $initializeResponse.Content | ConvertFrom-Json
    # $negotiatedProtocolVersion = $parsedContent.result.protocolVersion
    # Write-Host "Negotiated Protocol Version: $negotiatedProtocolVersion"

} catch {
    Write-Error "Initialize Request failed: $($_.Exception.Message)"
    exit 1
}

# --- Step 2: Send Tools/List Request ---
Write-Host "`n--- Sending Tools/List Request ---"
$toolsListBody = @{
    jsonrpc = "2.0"
    method = "tools/list"
    params = @{}
    id = 2
} | ConvertTo-Json -Compress

try {
    $toolsListResponse = Invoke-WebRequest -Uri $mcpServerUri `
        -Method POST `
        -Headers @{
            "Content-Type"="application/json";
            "Accept"="application/json, text/event-stream";
            "User-Agent"=$clientName;
            "Mcp-Session-Id"=$mcpSessionId;
            "Mcp-Protocol-Version"=$negotiatedProtocolVersion
        } `
        -Body $toolsListBody `
        -ErrorAction Stop

    Write-Host "Tools/List Request successful (Status: $($toolsListResponse.StatusCode))"
    Write-Host "`n--- Tools/List Response Content ---"
    $toolsListResponse.Content
    Write-Host "-----------------------------------"

} catch {
    Write-Error "Tools/List Request failed: $($_.Exception.Message)"
    exit 1
}

Write-Host "`n--- MCP Connection Test Complete ---"
