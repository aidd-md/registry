---
slug: sentry
name: Sentry
description: Error tracking and performance monitoring integration
author: Sentry
authorUrl: https://github.com/getsentry
githubUrl: https://github.com/getsentry/sentry-mcp
tags:
  - errors
  - monitoring
  - performance
  - debugging
compatibility:
  - claude-code
  - cursor
  - vscode
category: monitoring
transport:
  - stdio
features:
  - Error retrieval
  - Issue search
  - Performance data
  - Stack trace analysis
configSnippet:
  mcpServers:
    sentry:
      command: npx
      args:
        - -y
        - "@sentry/mcp-server@latest"
      env:
        SENTRY_AUTH_TOKEN: <your-token>
createdAt: 2025-02-15
updatedAt: 2026-01-18
contentType: mcp-server
---

# Sentry

Error tracking, issue search, performance data, and stack trace analysis.
