---
slug: sqlite
name: SQLite
description: Read and write SQLite databases with full SQL support
author: Anthropic
githubUrl: https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite
tags:
  - database
  - sqlite
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
  - Table management
  - Schema inspection
  - Data export
configSnippet:
  mcpServers:
    sqlite:
      command: uvx
      args:
        - mcp-server-sqlite
        - --db-path
        - /path/to/db.sqlite
createdAt: 2024-11-25
updatedAt: 2026-01-12
contentType: mcp-server
---

# SQLite

Full SQL support for SQLite databases with schema inspection and data export.
