---
slug: supabase
name: Supabase
description: Manage Supabase projects, databases, and edge functions
author: Supabase
authorUrl: https://github.com/supabase
githubUrl: https://github.com/supabase-community/supabase-mcp
tags:
  - supabase
  - database
  - auth
  - storage
  - edge-functions
compatibility:
  - claude-code
  - cursor
  - vscode
category: database
transport:
  - stdio
features:
  - Database queries
  - Schema management
  - Auth operations
  - Storage management
  - Edge function deployment
configSnippet:
  mcpServers:
    supabase:
      command: npx
      args:
        - -y
        - supabase-mcp-server@latest
      env:
        SUPABASE_URL: <url>
        SUPABASE_SERVICE_ROLE_KEY: <key>
createdAt: 2025-02-20
updatedAt: 2026-01-28
contentType: mcp-server
---

# Supabase

Database queries, schema management, auth, storage, and edge functions.
