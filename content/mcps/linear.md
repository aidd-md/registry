---
slug: linear
name: Linear
description: Issue tracking and project management with Linear
author: Linear
authorUrl: https://github.com/linear
githubUrl: https://github.com/linear/linear-mcp-server
tags:
  - linear
  - issues
  - project-management
  - agile
compatibility:
  - claude-code
  - cursor
  - vscode
category: devtools
transport:
  - stdio
features:
  - Create issues
  - Search issues
  - Update status
  - List projects
  - Team management
configSnippet:
  mcpServers:
    linear:
      command: npx
      args:
        - -y
        - "@linear/mcp-server"
      env:
        LINEAR_API_KEY: <your-key>
createdAt: 2025-03-05
updatedAt: 2026-01-20
contentType: mcp-server
---

# Linear

Issue tracking, project management, and team coordination with Linear.
