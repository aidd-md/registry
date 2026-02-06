---
slug: neon
name: Neon
description: Serverless Postgres management with branching and autoscaling
author: Neon
authorUrl: https://github.com/neondatabase
githubUrl: https://github.com/neondatabase/mcp-server-neon
tags:
  - neon
  - postgres
  - serverless
  - database
  - branching
compatibility:
  - claude-code
  - cursor
  - vscode
category: database
transport:
  - stdio
features:
  - Database branching
  - Query execution
  - Schema management
  - Autoscaling control
configSnippet:
  mcpServers:
    neon:
      command: npx
      args:
        - -y
        - "@neondatabase/mcp-server-neon"
      env:
        NEON_API_KEY: <your-key>
createdAt: 2025-03-01
updatedAt: 2026-01-20
contentType: mcp-server
---

# Neon

Serverless Postgres with database branching, query execution, and autoscaling.
