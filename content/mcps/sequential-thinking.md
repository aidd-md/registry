---
slug: sequential-thinking
name: Sequential Thinking
description: Dynamic, reflective problem-solving through structured thought sequences
author: Anthropic
githubUrl: https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking
tags:
  - reasoning
  - thinking
  - problem-solving
  - official
compatibility:
  - claude-code
  - cursor
  - vscode
category: ai-llm
transport:
  - stdio
features:
  - Structured reasoning
  - Thought revision
  - Branch exploration
  - Hypothesis adjustment
configSnippet:
  mcpServers:
    sequential-thinking:
      command: npx
      args:
        - -y
        - "@modelcontextprotocol/server-sequential-thinking"
createdAt: 2025-01-15
updatedAt: 2026-01-20
contentType: mcp-server
---

# Sequential Thinking

Structured reasoning with thought revision, branch exploration, and hypothesis adjustment.
