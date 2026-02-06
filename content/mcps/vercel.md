---
slug: vercel
name: Vercel
description: Manage Vercel deployments, projects, and environment variables
author: Vercel
authorUrl: https://github.com/vercel
githubUrl: https://github.com/vercel/mcp-server-vercel
tags:
  - vercel
  - deployment
  - hosting
  - edge
compatibility:
  - claude-code
  - cursor
  - vscode
category: cloud
transport:
  - stdio
features:
  - Deploy management
  - Project config
  - Environment variables
  - Domain management
  - Log streaming
configSnippet:
  mcpServers:
    vercel:
      command: npx
      args:
        - -y
        - "@vercel/mcp-server-vercel"
      env:
        VERCEL_TOKEN: <your-token>
createdAt: 2025-02-10
updatedAt: 2026-01-22
contentType: mcp-server
---

# Vercel

Deployment management, project config, environment variables, and domain management.
