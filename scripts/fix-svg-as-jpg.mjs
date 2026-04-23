#!/usr/bin/env node
// Rename all *.jpg files that are actually SVG (content starts with `<svg` or `<?xml`)
// to *.svg, and update all MDX references accordingly.
//
// Usage:
//   node scripts/fix-svg-as-jpg.mjs --dry   # preview only
//   node scripts/fix-svg-as-jpg.mjs         # apply

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const PUBLIC_DIR = path.join(ROOT, 'public');
const CONTENT_DIR = path.join(ROOT, 'content');
const DRY = process.argv.includes('--dry');

async function walk(dir, filterExt) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (!filterExt || filterExt.some((ext) => p.toLowerCase().endsWith(ext))) out.push(p);
    }
  }
  return out;
}

function isSvgBuffer(buf) {
  const head = buf.slice(0, 512).toString('utf8').trimStart().toLowerCase();
  return head.startsWith('<svg') || head.startsWith('<?xml');
}

async function main() {
  const jpgFiles = await walk(PUBLIC_DIR, ['.jpg']);
  const renames = [];
  for (const p of jpgFiles) {
    const buf = await fs.readFile(p);
    if (isSvgBuffer(buf)) {
      const to = p.replace(/\.jpg$/i, '.svg');
      renames.push({ from: p, to });
    }
  }

  console.log(`[fix-svg] files to rename: ${renames.length}`);

  if (renames.length === 0) {
    console.log('nothing to do');
    return;
  }

  // Build URL-level rewrite table, relative to /public
  const urlRewrites = new Map();
  for (const { from, to } of renames) {
    const urlFrom = '/' + path.relative(PUBLIC_DIR, from).split(path.sep).join('/');
    const urlTo = '/' + path.relative(PUBLIC_DIR, to).split(path.sep).join('/');
    urlRewrites.set(urlFrom, urlTo);
  }

  // Scan MDX/MD for references and prepare replacements
  const contentFiles = await walk(CONTENT_DIR, ['.mdx', '.md']);
  let filesTouched = 0;
  let totalReplacements = 0;

  for (const file of contentFiles) {
    const text = await fs.readFile(file, 'utf8');
    let updated = text;
    let localCount = 0;
    for (const [from, to] of urlRewrites) {
      const parts = updated.split(from);
      if (parts.length > 1) {
        localCount += parts.length - 1;
        updated = parts.join(to);
      }
    }
    if (localCount > 0) {
      filesTouched++;
      totalReplacements += localCount;
      if (DRY) {
        console.log(`  [dry] ${path.relative(ROOT, file)} — ${localCount} replacement(s)`);
      } else {
        await fs.writeFile(file, updated);
        console.log(`  updated ${path.relative(ROOT, file)} — ${localCount} replacement(s)`);
      }
    }
  }

  console.log(`[fix-svg] content files touched: ${filesTouched}, replacements: ${totalReplacements}`);

  if (DRY) {
    console.log('\n--- sample rename plan ---');
    for (const { from, to } of renames.slice(0, 10)) {
      console.log(`  ${path.relative(ROOT, from)}  ->  ${path.relative(ROOT, to)}`);
    }
    if (renames.length > 10) console.log(`  ... and ${renames.length - 10} more`);
    console.log('\n(dry run) no files renamed');
    return;
  }

  // Rename files
  for (const { from, to } of renames) {
    await fs.rename(from, to);
  }
  console.log(`[fix-svg] renamed ${renames.length} file(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
