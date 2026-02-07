// ---------------------------------------------------------------------------
// Sync script: keeps registry in sync with the main aidd.md repo
// ---------------------------------------------------------------------------
// Usage:
//   node scripts/sync.mjs                          # Dry run (default)
//   node scripts/sync.mjs --source /path/to/repo   # Override source repo path
//   node scripts/sync.mjs --apply                  # Apply timestamp updates
//   node scripts/sync.mjs --discover               # Only show unmapped files
//   node scripts/sync.mjs --apply --create-stubs   # Create stubs for new files
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import matter from 'gray-matter';
import YAML from 'yaml';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

// ── CLI args ─────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flags = {
  apply: args.includes('--apply'),
  discover: args.includes('--discover'),
  createStubs: args.includes('--create-stubs'),
  source: null,
};

const sourceIdx = args.indexOf('--source');
if (sourceIdx !== -1 && args[sourceIdx + 1]) {
  flags.source = args[sourceIdx + 1];
}

// ── Load manifest ────────────────────────────────────────────────

const manifest = JSON.parse(readFileSync(join(ROOT, 'scripts', 'sync-manifest.json'), 'utf-8'));
const sourceRepo = flags.source || join(ROOT, manifest.sourceRepo);

if (!existsSync(sourceRepo)) {
  console.error(`Source repo not found: ${sourceRepo}`);
  console.error('Use --source /path/to/aidd.md to specify the path');
  process.exit(1);
}

if (!existsSync(join(sourceRepo, 'AGENTS.md'))) {
  console.error(`Not a valid aidd.md repo (missing AGENTS.md): ${sourceRepo}`);
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split('T')[0];
}

function getFileMtime(filePath) {
  try {
    return statSync(filePath).mtime;
  } catch {
    return null;
  }
}

function parseRegistryEntry(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    const data = parsed.data;
    // Coerce dates
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Date) {
        data[key] = value.toISOString().split('T')[0];
      }
    }
    return { data, content: parsed.content, raw };
  } catch {
    return null;
  }
}

function registryFilePath(key) {
  // key = "knowledge/react" → content/knowledge/react.md
  return join(ROOT, 'content', `${key}.md`);
}

function updateFrontmatterDate(filePath, field, value) {
  const raw = readFileSync(filePath, 'utf-8');
  const parsed = matter(raw);
  parsed.data[field] = value;
  // Coerce all dates to strings
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v instanceof Date) {
      parsed.data[k] = v.toISOString().split('T')[0];
    }
  }
  const fm = YAML.stringify(parsed.data, { lineWidth: 120 });
  const content = `---\n${fm}---\n${parsed.content}`;
  writeFileSync(filePath, content);
}

function inferContentType(relPath) {
  // relPath = "content/knowledge/frontend/css/tailwind.md"
  const parts = relPath.replace(/\\/g, '/').split('/');
  // parts[0] = "content", parts[1] = type
  const typeMap = {
    knowledge: 'knowledge',
    skills: 'skill',
    rules: 'rule',
    workflows: 'workflow',
    specs: 'spec',
    templates: 'template',
  };
  return typeMap[parts[1]] || parts[1];
}

function inferSlug(relPath, contentType) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  const filename = basename(relPath, '.md');

  if (contentType === 'skill') {
    // content/skills/system-architect/SKILL.md → system-architect
    return parts[parts.length - 2];
  }

  // For everything else, use the filename
  return filename.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

function inferName(sourcePath) {
  try {
    const raw = readFileSync(sourcePath, 'utf-8');
    const parsed = matter(raw);
    // Try frontmatter name
    if (parsed.data.name) return parsed.data.name;
    // Try first # heading
    const headingMatch = parsed.content.match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1].trim();
    // Fallback to filename
    return basename(sourcePath, '.md')
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } catch {
    return basename(sourcePath, '.md');
  }
}

function inferDescription(sourcePath) {
  try {
    const raw = readFileSync(sourcePath, 'utf-8');
    const parsed = matter(raw);
    if (parsed.data.description) return parsed.data.description;
    // First non-empty, non-heading line
    const lines = parsed.content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---') && !trimmed.startsWith('>')) {
        return trimmed.length > 200 ? trimmed.slice(0, 197) + '...' : trimmed;
      }
    }
    return 'No description available';
  } catch {
    return 'No description available';
  }
}

function shouldSkipFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const filename = basename(normalized);
  if (filename === 'routing.md') return true;
  if (filename === 'README.md') return true;
  if (filename === 'competency-matrix.md') return true;
  if (normalized.includes('/hooks/')) return true;
  if (normalized.includes('/references/')) return true;
  // Skills: only SKILL.md inside skill dirs, skip other files
  if (normalized.includes('/skills/') && filename !== 'SKILL.md' && dirname(normalized).split('/').length > 3) return true;
  return false;
}

// ── Pass 1: Verify mapped entries ────────────────────────────────

const results = {
  synced: [],
  needsUpdate: [],
  orphaned: [],
  missingRegistry: [],
  discovered: [],
  registryOnly: [],
};

console.log(`Syncing registry with: ${sourceRepo}\n`);

for (const [key, sourcePath] of Object.entries(manifest.entries)) {
  const regFile = registryFilePath(key);
  const regExists = existsSync(regFile);

  if (sourcePath === null) {
    // Registry-only entry
    if (regExists) {
      results.registryOnly.push(key);
    }
    continue;
  }

  const srcFile = join(sourceRepo, sourcePath);
  const srcExists = existsSync(srcFile);

  if (!srcExists && regExists) {
    results.orphaned.push({ key, sourcePath });
    continue;
  }

  if (srcExists && !regExists) {
    results.missingRegistry.push({ key, sourcePath });
    continue;
  }

  if (!srcExists && !regExists) {
    results.orphaned.push({ key, sourcePath });
    continue;
  }

  // Both exist — compare timestamps (day precision)
  const srcMtime = getFileMtime(srcFile);
  const reg = parseRegistryEntry(regFile);

  if (!reg) {
    results.orphaned.push({ key, sourcePath, reason: 'parse error' });
    continue;
  }

  const regDateStr = reg.data.updatedAt || '1970-01-01';
  const srcDateStr = srcMtime ? srcMtime.toISOString().split('T')[0] : '1970-01-01';
  const regDate = new Date(regDateStr);

  if (srcDateStr > regDateStr) {
    results.needsUpdate.push({ key, sourcePath, srcDate: srcDateStr, regDate: regDateStr });
  } else {
    results.synced.push(key);
  }
}

// ── Pass 2: Discover unmapped files ──────────────────────────────

if (!flags.discover || flags.discover) {
  const contentDirs = ['knowledge', 'skills', 'rules', 'workflows', 'specs', 'templates'];
  const mappedSources = new Set(
    Object.values(manifest.entries).filter(v => v !== null)
  );

  for (const dir of contentDirs) {
    const dirPath = join(sourceRepo, 'content', dir);
    if (!existsSync(dirPath)) continue;

    const pattern = join(dirPath, '**', '*.md').replace(/\\/g, '/');
    const files = glob.sync(pattern);

    for (const file of files) {
      const relPath = relative(sourceRepo, file).replace(/\\/g, '/');
      if (shouldSkipFile(relPath)) continue;
      if (mappedSources.has(relPath)) continue;

      const contentType = inferContentType(relPath);
      const slug = inferSlug(relPath, contentType);
      results.discovered.push({ relPath, contentType, slug });
    }
  }
}

// ── Pass 3: Report ───────────────────────────────────────────────

const pad = (s, n) => s.padEnd(n);

console.log('── Sync Report ──────────────────────────────────────\n');

if (results.synced.length > 0) {
  console.log(`  ${results.synced.length} entries in sync`);
}

if (results.registryOnly.length > 0) {
  console.log(`  ${results.registryOnly.length} registry-only entries (no source)`);
}

if (results.needsUpdate.length > 0) {
  console.log(`\n  ${results.needsUpdate.length} entries need timestamp update:`);
  for (const { key, regDate } of results.needsUpdate) {
    console.log(`    ${pad(key, 40)} updatedAt: ${regDate} → ${today()}`);
  }
}

if (results.orphaned.length > 0) {
  console.log(`\n  ${results.orphaned.length} orphaned mappings (source not found):`);
  for (const { key, sourcePath } of results.orphaned) {
    console.log(`    ${pad(key, 40)} → ${sourcePath}`);
  }
}

if (results.missingRegistry.length > 0) {
  console.log(`\n  ${results.missingRegistry.length} manifest entries without registry file:`);
  for (const { key, sourcePath } of results.missingRegistry) {
    console.log(`    ${pad(key, 40)} → ${sourcePath}`);
  }
}

if (results.discovered.length > 0) {
  console.log(`\n  ${results.discovered.length} unmapped files in source repo:`);
  for (const { relPath, contentType, slug } of results.discovered) {
    console.log(`    ${pad(`${contentType}/${slug}`, 40)} ← ${relPath}`);
  }
}

// Summary line
console.log('\n── Summary ──────────────────────────────────────────');
const total = Object.keys(manifest.entries).length;
const mapped = Object.values(manifest.entries).filter(v => v !== null).length;
console.log(`  Total entries: ${total} (${mapped} mapped, ${total - mapped} registry-only)`);
console.log(`  In sync: ${results.synced.length} | Updates: ${results.needsUpdate.length} | Orphaned: ${results.orphaned.length} | New: ${results.discovered.length}`);

// ── Pass 4: Apply (only with --apply) ────────────────────────────

if (!flags.apply && (results.needsUpdate.length > 0 || results.discovered.length > 0)) {
  console.log('\n  Run with --apply to update timestamps');
  if (results.discovered.length > 0) {
    console.log('  Run with --apply --create-stubs to also create stub entries');
  }
}

if (flags.apply) {
  let updated = 0;
  let created = 0;

  // Update timestamps
  for (const { key } of results.needsUpdate) {
    const regFile = registryFilePath(key);
    updateFrontmatterDate(regFile, 'updatedAt', today());
    updated++;
  }

  if (updated > 0) {
    console.log(`\n  Updated ${updated} timestamps`);
  }

  // Create stubs for discovered files
  if (flags.createStubs && results.discovered.length > 0) {
    const GH = 'https://github.com/DerianAndre/aidd.md';
    const manifestData = JSON.parse(readFileSync(join(ROOT, 'scripts', 'sync-manifest.json'), 'utf-8'));

    for (const { relPath, contentType, slug } of results.discovered) {
      const srcFile = join(sourceRepo, relPath);
      const name = inferName(srcFile);
      const description = inferDescription(srcFile);
      const registryType = {
        knowledge: 'knowledge',
        skill: 'skills',
        rule: 'rules',
        workflow: 'workflows',
        spec: 'specs',
        template: 'templates',
      }[contentType] || contentType;

      const fm = {
        slug,
        name,
        description,
        contentType,
        author: 'aidd.md',
        githubUrl: `${GH}/tree/main/${relPath}`,
        tags: [slug],
        compatibility: ['claude-code', 'cursor'],
        installCommand: `npx @aidd.md/cli install ${contentType} ${slug}`,
        createdAt: today(),
        updatedAt: today(),
      };

      const outDir = join(ROOT, 'content', registryType);
      const outFile = join(outDir, `${slug}.md`);
      const fmYaml = YAML.stringify(fm, { lineWidth: 120 });
      const body = `# ${name}\n\n${description}`;
      writeFileSync(outFile, `---\n${fmYaml}---\n\n${body}\n`);

      // Add to manifest
      manifestData.entries[`${registryType}/${slug}`] = relPath;
      created++;
    }

    // Write updated manifest
    writeFileSync(
      join(ROOT, 'scripts', 'sync-manifest.json'),
      JSON.stringify(manifestData, null, 2) + '\n'
    );

    if (created > 0) {
      console.log(`  Created ${created} stub entries (manifest updated)`);
    }
  }
}

console.log('');
