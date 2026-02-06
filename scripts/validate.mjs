// ---------------------------------------------------------------------------
// Validate script: checks all content/**/*.md entries against JSON schema
// ---------------------------------------------------------------------------

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import matter from 'gray-matter';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

// ── Load schema ──────────────────────────────────────────────────

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const contentSchema = JSON.parse(readFileSync(join(ROOT, 'schemas', 'content.schema.json'), 'utf-8'));
const validateEntry = ajv.compile(contentSchema);

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

const pattern = join(ROOT, 'content', '**', '*.md').replace(/\\/g, '/');
const files = glob.sync(pattern);

console.log(`Validating ${files.length} entries...`);

for (const file of files) {
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

  if (!validateEntry(data)) {
    console.error(`  INVALID ${file}:`);
    for (const err of validateEntry.errors) {
      console.error(`    ${err.instancePath || '/'} ${err.message}`);
    }
    errors++;
  }

  if (data.slug) checkSlugUniqueness(data.slug, file);
}

// ── Summary ──────────────────────────────────────────────────────

console.log('');
if (errors === 0) {
  console.log(`All ${files.length} entries valid.`);
} else {
  console.error(`${errors} error(s) found.`);
  process.exit(1);
}
