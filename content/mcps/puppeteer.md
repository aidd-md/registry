---
slug: puppeteer
name: Puppeteer
description: Browser automation for web scraping, screenshots, and testing
author: Anthropic
githubUrl: https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer
tags:
  - browser
  - automation
  - scraping
  - screenshots
  - official
compatibility:
  - claude-code
  - cursor
  - vscode
category: browser
transport:
  - stdio
features:
  - Navigate pages
  - Take screenshots
  - Click elements
  - Fill forms
  - Execute JavaScript
configSnippet:
  mcpServers:
    puppeteer:
      command: npx
      args:
        - -y
        - "@modelcontextprotocol/server-puppeteer"
createdAt: 2024-11-25
updatedAt: 2026-01-18
contentType: mcp-server
---

# Puppeteer

Browser automation for web scraping, screenshots, and form testing.
