---
slug: slack
name: Slack
description: Read and send messages, manage channels in Slack workspaces
author: Anthropic
githubUrl: https://github.com/modelcontextprotocol/servers/tree/main/src/slack
tags:
  - slack
  - messaging
  - channels
  - official
compatibility:
  - claude-code
  - cursor
  - vscode
category: communication
transport:
  - stdio
features:
  - Send messages
  - Read channels
  - List users
  - Search messages
configSnippet:
  mcpServers:
    slack:
      command: npx
      args:
        - -y
        - "@modelcontextprotocol/server-slack"
      env:
        SLACK_BOT_TOKEN: <your-token>
createdAt: 2024-12-01
updatedAt: 2026-01-10
contentType: mcp-server
---

# Slack

Slack workspace integration — send messages, read channels, list users, and search.
