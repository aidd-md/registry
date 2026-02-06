// ---------------------------------------------------------------------------
// Build script: compiles YAML + Markdown entries into dist/*.json
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import YAML from 'yaml';
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

// ── Build MCP Servers ────────────────────────────────────────────

function buildMcpServers() {
  const pattern = join(ROOT, 'mcp-servers', '*.yaml').replace(/\\/g, '/');
  const files = glob.sync(pattern);
  const entries = [];

  for (const file of files) {
    const raw = readFileSync(file, 'utf-8');
    const data = coerceDates(YAML.parse(raw));

    entries.push({
      type: 'mcp-server',
      slug: data.slug,
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || undefined,
      author: data.author,
      authorUrl: data.authorUrl || undefined,
      githubUrl: data.githubUrl || undefined,
      npmPackage: data.npmPackage || undefined,
      category: data.category,
      tags: data.tags || [],
      transport: data.transport || ['stdio'],
      features: data.features || [],
      installCount: 0,
      trending: data.trending || false,
      official: isOfficial(data.githubUrl),
      createdAt: data.createdAt || now(),
      updatedAt: data.updatedAt || now(),
      configSnippet: data.configSnippet || {},
      compatibility: data.compatibility || [],
    });
  }

  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  return entries;
}

// ── Build Content ────────────────────────────────────────────────

function buildContent() {
  const pattern = join(ROOT, 'content', '**', '*.md').replace(/\\/g, '/');
  const files = glob.sync(pattern);
  const entries = [];

  for (const file of files) {
    const raw = readFileSync(file, 'utf-8');
    const parsed = matter(raw);
    const data = coerceDates(parsed.data);
    const markdownContent = parsed.content.trim();

    entries.push({
      type: 'content',
      slug: data.slug,
      name: data.name,
      description: data.description,
      longDescription: data.longDescription || undefined,
      author: data.author,
      authorUrl: data.authorUrl || undefined,
      githubUrl: data.githubUrl || undefined,
      contentType: data.contentType,
      tags: data.tags || [],
      installCount: 0,
      trending: data.trending || false,
      official: isOfficial(data.githubUrl),
      createdAt: data.createdAt || now(),
      updatedAt: data.updatedAt || now(),
      markdownContent,
      installCommand: data.installCommand || undefined,
      compatibility: data.compatibility || [],
    });
  }

  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  return entries;
}

// ── Main ─────────────────────────────────────────────────────────

function main() {
  if (!existsSync(DIST)) {
    mkdirSync(DIST, { recursive: true });
  }

  const mcpServers = buildMcpServers();
  const content = buildContent();

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
