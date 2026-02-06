# Contributing to aidd.md Registry

Thank you for contributing! This guide explains how to add new entries to the registry.

## Adding an MCP Server

1. Create a new file in `mcp-servers/` named `your-server-slug.yaml`
2. Use this template:

```yaml
slug: your-server-slug
name: Your Server Name
description: A brief one-line description
author: Your Name
authorUrl: https://github.com/yourname
githubUrl: https://github.com/yourname/your-mcp-server
category: devtools  # ai-llm | database | browser | cloud | devtools | communication | file-system | search | monitoring | security | other
transport:
  - stdio
features:
  - Feature one
  - Feature two
tags:
  - tag1
  - tag2
compatibility:
  - claude-code
  - cursor
  - vscode
configSnippet:
  your-server:
    command: npx
    args:
      - -y
      - your-mcp-package
```

3. Open a Pull Request

## Adding Content (Skills, Rules, Workflows, etc.)

1. Create a new file in `content/{type}/` named `your-entry-slug.md`
   - Types: `agents`, `skills`, `rules`, `workflows`, `templates`, `knowledge`, `spec`
2. Use this template:

```markdown
---
slug: your-entry-slug
name: Your Entry Name
description: A brief one-line description
contentType: skill
author: Your Name
authorUrl: https://github.com/yourname
githubUrl: https://github.com/yourname/your-repo
tags:
  - tag1
  - tag2
compatibility:
  - claude-code
  - cursor
installCommand: "npx @your-scope/cli install skill your-entry-slug"
---

# Your Entry Name

Your detailed description in Markdown.

## Features

- Feature one
- Feature two
```

3. Open a Pull Request

## Guidelines

- **Slug**: Must be unique, lowercase, kebab-case (e.g., `my-cool-server`)
- **Description**: One line, under 120 characters
- **Tags**: 2-6 relevant tags
- **Category**: Must be one of the valid categories listed above
- **Compatibility**: List the AI agents/editors that support your entry

## Validation

PRs are automatically validated. Common issues:

- Missing required fields (slug, name, description, author)
- Duplicate slug (already exists in the registry)
- Invalid category or content type
- YAML/frontmatter syntax errors

## Review Process

1. Submit your PR
2. CI validates the entry automatically
3. A maintainer reviews the content
4. Once approved, it's merged and automatically published
