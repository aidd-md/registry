// ---------------------------------------------------------------------------
// Build script: compiles content/**/*.md entries into dist/*.json
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import matter from 'gray-matter';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const DIST = join(ROOT, 'dist');
const VERSION = '1.0.0';

// ── Helpers ──────────────────────────────────────────────────────

function isOfficial(githubUrl) {
  if (!githubUrl) return false;
  return githubUrl.startsWith('https://github.com/aidd-md/') ||
         githubUrl.startsWith('https://github.com/DerianAndre/aidd.md');
}

function now() {
  return new Date().toISOString().split('T')[0];
}

function coerceDates(obj) {
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date) {
      obj[key] = value.toISOString().split('T')[0];
    }
  }
  return obj;
}

// ── Build all entries from content/**/*.md ───────────────────────

function buildEntries() {
  const pattern = join(ROOT, 'content', '**', '*.md').replace(/\\/g, '/');
  const files = glob.sync(pattern);
  const mcpServers = [];
  const content = [];

  for (const file of files) {
    const raw = readFileSync(file, 'utf-8');
    const parsed = matter(raw);
    const data = coerceDates(parsed.data);
    const markdownContent = parsed.content.trim();
    const isMcp = data.contentType === 'mcp-server';

    const entry = {
      type: isMcp ? 'mcp-server' : 'content',
      slug: data.slug,
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || undefined,
      author: data.author,
      authorUrl: data.authorUrl || undefined,
      githubUrl: data.githubUrl || undefined,
      tags: data.tags || [],
      installCount: 0,
      trending: data.trending || false,
      official: isOfficial(data.githubUrl),
      createdAt: data.createdAt || now(),
      updatedAt: data.updatedAt || now(),
      compatibility: data.compatibility || [],
    };

    if (isMcp) {
      entry.npmPackage = data.npmPackage || undefined;
      entry.category = data.category;
      entry.transport = data.transport || ['stdio'];
      entry.features = data.features || [];
      entry.configSnippet = data.configSnippet || {};
      mcpServers.push(entry);
    } else {
      entry.contentType = data.contentType;
      entry.markdownContent = markdownContent;
      entry.installCommand = data.installCommand || undefined;
      content.push(entry);
    }
  }

  mcpServers.sort((a, b) => a.slug.localeCompare(b.slug));
  content.sort((a, b) => a.slug.localeCompare(b.slug));
  return { mcpServers, content };
}

// ── Main ─────────────────────────────────────────────────────────

function main() {
  if (!existsSync(DIST)) {
    mkdirSync(DIST, { recursive: true });
  }

  const { mcpServers, content } = buildEntries();

  const mcpResponse = {
    version: VERSION,
    updatedAt: new Date().toISOString(),
    entries: mcpServers,
  };

  const contentResponse = {
    version: VERSION,
    updatedAt: new Date().toISOString(),
    entries: content,
  };

  writeFileSync(join(DIST, 'mcp-servers.json'), JSON.stringify(mcpResponse, null, 2) + '\n');
  writeFileSync(join(DIST, 'content.json'), JSON.stringify(contentResponse, null, 2) + '\n');

  console.log(`Built ${mcpServers.length} MCP servers -> dist/mcp-servers.json`);
  console.log(`Built ${content.length} content entries -> dist/content.json`);
}

main();
