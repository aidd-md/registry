---
slug: postgres
name: PostgreSQL
description: Read-only access to PostgreSQL databases with schema inspection
author: Anthropic
githubUrl: https://github.com/modelcontextprotocol/servers/tree/main/src/postgres
tags:
  - database
  - postgresql
  - sql
  - official
compatibility:
  - claude-code
  - cursor
  - vscode
category: database
transport:
  - stdio
features:
  - Query execution
  - Schema inspection
  - Table listing
  - Index info
configSnippet:
  mcpServers:
    postgres:
      command: npx
      args:
        - -y
        - "@modelcontextprotocol/server-postgres"
        - postgresql://localhost/mydb
createdAt: 2024-11-25
updatedAt: 2026-01-12
contentType: mcp-server
---

# PostgreSQL

Read-only PostgreSQL access with schema inspection and query execution.
