---
slug: brave-search
name: Brave Search
description: Web and local search using the Brave Search API
author: Anthropic
githubUrl: https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search
tags:
  - search
  - web
  - brave
  - official
compatibility:
  - claude-code
  - cursor
  - vscode
category: search
transport:
  - stdio
features:
  - Web search
  - Local search
  - News search
  - Image search
configSnippet:
  mcpServers:
    brave-search:
      command: npx
      args:
        - -y
        - "@modelcontextprotocol/server-brave-search"
      env:
        BRAVE_API_KEY: <your-key>
createdAt: 2024-11-25
updatedAt: 2026-01-10
contentType: mcp-server
---

# Brave Search

Web and local search using the privacy-focused Brave Search API.
