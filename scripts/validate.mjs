// ---------------------------------------------------------------------------
// Validate script: checks all entries against JSON schemas
// ---------------------------------------------------------------------------

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import YAML from 'yaml';
import matter from 'gray-matter';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

// ── Load schemas ─────────────────────────────────────────────────

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const mcpSchema = JSON.parse(readFileSync(join(ROOT, 'schemas', 'mcp-server.schema.json'), 'utf-8'));
const contentSchema = JSON.parse(readFileSync(join(ROOT, 'schemas', 'content.schema.json'), 'utf-8'));

const validateMcp = ajv.compile(mcpSchema);
const validateContent = ajv.compile(contentSchema);

// ── Helpers ──────────────────────────────────────────────────────

function coerceDates(obj) {
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date) {
      obj[key] = value.toISOString().split('T')[0];
    }
  }
  return obj;
}

// ── Validate ─────────────────────────────────────────────────────

let errors = 0;
const slugs = new Set();

function checkSlugUniqueness(slug, file) {
  if (slugs.has(slug)) {
    console.error(`  DUPLICATE SLUG: "${slug}" in ${file}`);
    errors++;
  }
  slugs.add(slug);
}

// MCP Servers
const mcpPattern = join(ROOT, 'mcp-servers', '*.yaml').replace(/\\/g, '/');
const mcpFiles = glob.sync(mcpPattern);

console.log(`Validating ${mcpFiles.length} MCP server entries...`);

for (const file of mcpFiles) {
  const raw = readFileSync(file, 'utf-8');
  let data;
  try {
    data = coerceDates(YAML.parse(raw));
  } catch (e) {
    console.error(`  YAML ERROR in ${file}: ${e.message}`);
    errors++;
    continue;
  }

  if (!validateMcp(data)) {
    console.error(`  INVALID ${file}:`);
    for (const err of validateMcp.errors) {
      console.error(`    ${err.instancePath || '/'} ${err.message}`);
    }
    errors++;
  }

  if (data.slug) checkSlugUniqueness(data.slug, file);
}

// Content
const contentPattern = join(ROOT, 'content', '**', '*.md').replace(/\\/g, '/');
const contentFiles = glob.sync(contentPattern);

console.log(`Validating ${contentFiles.length} content entries...`);

for (const file of contentFiles) {
  const raw = readFileSync(file, 'utf-8');
  let data;
  try {
    const parsed = matter(raw);
    data = coerceDates(parsed.data);
  } catch (e) {
    console.error(`  FRONTMATTER ERROR in ${file}: ${e.message}`);
    errors++;
    continue;
  }

  if (!validateContent(data)) {
    console.error(`  INVALID ${file}:`);
    for (const err of validateContent.errors) {
      console.error(`    ${err.instancePath || '/'} ${err.message}`);
    }
    errors++;
  }

  if (data.slug) checkSlugUniqueness(data.slug, file);
}

// ── Summary ──────────────────────────────────────────────────────

console.log('');
if (errors === 0) {
  console.log(`All ${mcpFiles.length + contentFiles.length} entries valid.`);
} else {
  console.error(`${errors} error(s) found.`);
  process.exit(1);
}
