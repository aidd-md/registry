---
slug: filesystem
name: Filesystem
description: Read, write, and manage files and directories securely
author: Anthropic
authorUrl: https://github.com/anthropics
githubUrl: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
tags:
  - filesystem
  - files
  - directories
  - official
compatibility:
  - claude-code
  - cursor
  - vscode
  - windsurf
category: file-system
transport:
  - stdio
features:
  - Read files
  - Write files
  - List directories
  - Search files
  - Move/copy files
configSnippet:
  mcpServers:
    filesystem:
      command: npx
      args:
        - -y
        - "@modelcontextprotocol/server-filesystem"
        - /path/to/allowed
createdAt: 2024-11-25
updatedAt: 2026-01-15
contentType: mcp-server
---

# Filesystem

Read, write, and manage files and directories securely with configurable access controls.
