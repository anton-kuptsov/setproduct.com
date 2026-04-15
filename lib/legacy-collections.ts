import fs from "fs";
import path from "path";
import type { LegacyPageData } from "../types/legacy";
import { buildLegacyPageData } from "./legacy-page";

function getCollectionDir(collection: string): string {
  return path.join(process.cwd(), "legacy-pages", collection);
}

export function getCollectionSlugs(collection: string): string[] {
  const dir = getCollectionDir(collection);
  return fs
    .readdirSync(dir)
    .filter((entry) => entry.endsWith(".html"))
    .map((entry) => entry.replace(/\.html$/i, ""));
}

export function getCollectionPageData(collection: string, slug: string): LegacyPageData {
  return buildLegacyPageData(`${collection}/${slug}.html`);
}

export function getRootPageSlugs(): string[] {
  const dir = path.join(process.cwd(), "legacy-pages");
  const excluded = new Set(["index", "404"]);

  return fs
    .readdirSync(dir)
    .filter((entry) => entry.endsWith(".html"))
    .map((entry) => entry.replace(/\.html$/i, ""))
    .filter((slug) => !excluded.has(slug));
}

export function getRootPageData(slug: string): LegacyPageData {
  return buildLegacyPageData(`${slug}.html`);
}
