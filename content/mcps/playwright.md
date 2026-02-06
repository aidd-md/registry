---
slug: playwright
name: Playwright
description: Browser automation using Playwright for testing and scraping
author: Microsoft
authorUrl: https://github.com/microsoft
githubUrl: https://github.com/microsoft/playwright-mcp
tags:
  - browser
  - automation
  - testing
  - playwright
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
  - Form interaction
  - Multi-browser support
  - Network interception
configSnippet:
  mcpServers:
    playwright:
      command: npx
      args:
        - -y
        - "@playwright/mcp@latest"
createdAt: 2025-03-10
updatedAt: 2026-01-22
contentType: mcp-server
---

# Playwright

Cross-browser automation with auto-wait, form interaction, and network interception.
