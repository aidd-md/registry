---
slug: exa-search
name: Exa Search
description: AI-powered web search with content extraction
author: Exa
authorUrl: https://github.com/exa-labs
githubUrl: https://github.com/exa-labs/exa-mcp-server
tags:
  - search
  - web
  - ai
  - content-extraction
compatibility:
  - claude-code
  - cursor
  - vscode
category: search
transport:
  - stdio
features:
  - Semantic search
  - Content extraction
  - Similar page finding
  - Keyword search
configSnippet:
  mcpServers:
    exa:
      command: npx
      args:
        - -y
        - exa-mcp-server
      env:
        EXA_API_KEY: <your-key>
createdAt: 2025-01-10
updatedAt: 2026-01-15
contentType: mcp-server
---

# Exa Search

Semantic search, content extraction, and similar page discovery.
