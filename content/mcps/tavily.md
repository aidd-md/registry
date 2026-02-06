---
slug: tavily
name: Tavily Search
description: AI-optimized search API designed for LLM applications
author: Tavily
authorUrl: https://github.com/tavily-ai
githubUrl: https://github.com/tavily-ai/tavily-mcp
tags:
  - search
  - web
  - ai
  - research
compatibility:
  - claude-code
  - cursor
  - vscode
category: search
transport:
  - stdio
features:
  - Web search
  - Content extraction
  - Research mode
  - Domain filtering
configSnippet:
  mcpServers:
    tavily:
      command: npx
      args:
        - -y
        - tavily-mcp@latest
      env:
        TAVILY_API_KEY: <your-key>
createdAt: 2025-02-01
updatedAt: 2026-01-18
contentType: mcp-server
---

# Tavily Search

AI-optimized search with content extraction, research mode, and domain filtering.
