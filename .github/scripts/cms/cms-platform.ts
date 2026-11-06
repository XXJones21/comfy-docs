/**
 * Fold Comfy Cloud and Comfy Desktop changelog entries into the ComfyUI
 * popup (Option A).
 *
 * The in-app popup compares each Strapi entry's `version` with the running
 * ComfyUI version, so Cloud and Desktop versions cannot be CMS versions of
 * their own. Instead, each project's popup for the next ComfyUI version gets
 * one extra section:
 *
 *   comfyui project → **Comfy Desktop Updates** (local and Desktop users)
 *   cloud project   → **Comfy Cloud Updates**   (Cloud users)
 *
 * Which ComfyUI version an entry rides in is recorded in
 * platform-folds.json, so a re-run (`--force`) rebuilds the same section and
 * an entry is never announced twice.
 */

import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import {
  compareSemver,
  parseChangelogUpdates,
  parsePlatformUpdates,
  type ChangelogProduct,
  type ReleaseNoteEntry,
} from "./changelog-parse.ts";
import {
  configForProject,
  englishStagingLocale,
  getProjectConfig,
  type CmsConfig,
} from "./cms-config.ts";
import {
  buildPlatformSimplifyUserPrompt,
  CMS_PLATFORM_SIMPLIFY_SYSTEM_PROMPT,
} from "./cms-simplify-prompt.ts";
import { readStaging, writeStagingCheckpoint } from "./cms-staging-io.ts";
import { isEnPublishedInRegistry, loadPublishedVersions } from "./published-versions.ts";
import { parseEnglishChangelogDate } from "../i18n/chunked-translate.ts";

export type PlatformProduct = Exclude<ChangelogProduct, "comfyui">;

export interface PlatformFoldConfig {
  /** Which docs entries this project's popup carries. */
  product: PlatformProduct;
  /** Bold section label added to the popup, e.g. `Comfy Cloud Updates`. */
  section_label: string;
  /** Ignore entries dated before this English date (e.g. `October 1, 2026`). */
  since?: string;
  /** Bullet cap for the section (default 3). */
  max_bullets?: number;
}

/** project id → docs label → ComfyUI version the entry was folded into. */
export type PlatformFolds = Record<string, Record<string, string>>;

const DEFAULT_MAX_BULLETS = 3;

export function platformFoldsPath(): string {
  return join(import.meta.dir, "platform-folds.json");
}

export async function loadPlatformFolds(): Promise<PlatformFolds> {
  try {
    return JSON.parse(await readFile(platformFoldsPath(), "utf-8")) as PlatformFolds;
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return {};
    throw error;
  }
}

export async function savePlatformFolds(folds: PlatformFolds): Promise<void> {
  await writeFile(platformFoldsPath(), `${JSON.stringify(folds, null, 2)}\n`, "utf-8");
}

function dateKey(date: string): number | null {
  const d = parseEnglishChangelogDate(date);
  return d ? d.year * 10000 + d.month * 100 + d.day : null;
}

/** Entries on or after `since` (entries with unparseable dates are kept). */
export function entriesSince(entries: ReleaseNoteEntry[], since?: string): ReleaseNoteEntry[] {
  const floor = since ? dateKey(since) : null;
  if (floor === null) return entries;
  return entries.filter((e) => {
    const k = dateKey(e.date);
    return k === null || k >= floor;
  });
}

/**
 * Platform entries for one ComfyUI version of one project.
 *
 * - Entries already folded into `version` are always selected (re-runs).
 * - Entries not folded anywhere are selected only when `canAssignNew`
 *   (the newest ComfyUI version in the docs changelog, not yet published).
 * - Entries folded into another version are never selected.
 */
export function selectPlatformEntries(
  entries: ReleaseNoteEntry[],
  projectFolds: Record<string, string>,
  version: string,
  canAssignNew: boolean
): { selected: ReleaseNoteEntry[]; newlyAssigned: ReleaseNoteEntry[] } {
  const selected: ReleaseNoteEntry[] = [];
  const newlyAssigned: ReleaseNoteEntry[] = [];
  for (const entry of entries) {
    const assigned = projectFolds[entry.label];
    if (assigned === version) {
      selected.push(entry);
    } else if (assigned === undefined && canAssignNew) {
      selected.push(entry);
      newlyAssigned.push(entry);
    }
  }
  return { selected, newlyAssigned };
}

function isBoldSectionLine(line: string): string | null {
  return line.trim().match(/^\*\*([^*]+)\*\*$/)?.[1]?.trim() ?? null;
}

/** Remove the named bold sections (label line through the line before the next bold section). */
export function stripPlatformSections(body: string, sectionLabels: string[]): string {
  const wanted = new Set(sectionLabels.map((l) => l.trim()));
  const out: string[] = [];
  let skipping = false;
  for (const line of body.split("\n")) {
    const section = isBoldSectionLine(line);
    if (section !== null) skipping = wanted.has(section);
    if (!skipping) out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Strip every platform section, then append `section` (if any) at the end. */
export function withPlatformSection(
  body: string,
  sectionLabels: string[],
  section: string | null
): string {
  const base = stripPlatformSections(body, sectionLabels);
  if (!section?.trim()) return base;
  return `${base}\n\n${section.trim()}`.trim();
}

/** Release data handed to the simplify prompt, oldest entry first. */
export function buildPlatformSourceBody(entries: ReleaseNoteEntry[]): string {
  return [...entries]
    .reverse()
    .map((e) => `=== ${e.label} (${e.date}) ===\n${e.body}`)
    .join("\n\n");
}

/** Ensure the model output starts with the expected bold section label. */
export function normalizePlatformSection(raw: string, sectionLabel: string): string {
  const lines = raw.trim().split("\n");
  const first = isBoldSectionLine(lines[0] ?? "");
  const bullets = (first !== null ? lines.slice(1) : lines).filter((l) => l.trim());
  // A label with no bullets means nothing in the source was user-facing.
  if (bullets.length === 0) return "";
  return [`**${sectionLabel}**`, ...bullets].join("\n");
}

export function allPlatformSectionLabels(config: CmsConfig): string[] {
  return (config.projects ?? [])
    .map((p) => p.platform?.section_label)
    .filter((l): l is string => !!l);
}

/** Newest ComfyUI version in the docs changelog (by semver). */
export function latestComfyuiVersion(docsEnContent: string): string | undefined {
  return parseChangelogUpdates(docsEnContent)
    .map((e) => e.version)
    .sort((a, b) => compareSemver(b, a))[0];
}

export type SimplifyFn = (
  messages: Array<{ role: "system" | "user"; content: string }>
) => Promise<string>;

/**
 * Add (or refresh) the platform section on this project's staging EN blocks
 * for `versions`. Also strips other products' sections, which arrive when
 * cloud staging is merged from comfyui.
 */
export async function foldPlatformUpdates(
  baseConfig: CmsConfig,
  projectId: string,
  versions: string[],
  docsEnContent: string,
  dryRun: boolean,
  simplify: SimplifyFn
): Promise<{ folded: number; stripped: number }> {
  const platform = getProjectConfig(baseConfig, projectId).platform;
  const config = configForProject(baseConfig, projectId);
  const enPath = englishStagingLocale(config).changelog!;
  const sectionLabels = allPlatformSectionLabels(baseConfig);

  let staging = await readStaging(enPath);
  const stagingEntries = parseChangelogUpdates(staging);
  const registry = await loadPublishedVersions();
  const folds = await loadPlatformFolds();
  const projectFolds = { ...(folds[projectId] ?? {}) };

  const entries = platform
    ? entriesSince(parsePlatformUpdates(docsEnContent, platform.product), platform.since)
    : [];

  const ordered = [...new Set(versions)].sort((a, b) => compareSemver(b, a));
  // New items only ride in the newest ComfyUI version of the docs changelog:
  // the popup shows the newest release, so folding into an older backfilled
  // version would hide them.
  const latest = latestComfyuiVersion(docsEnContent);

  let folded = 0;
  let stripped = 0;

  for (const version of ordered) {
    const stagingEntry = stagingEntries.find((e) => e.version === version);
    if (!stagingEntry) continue;

    const canAssignNew =
      version === latest && !isEnPublishedInRegistry(registry, projectId, version);
    const { selected, newlyAssigned } = selectPlatformEntries(
      entries,
      projectFolds,
      version,
      canAssignNew
    );

    let section: string | null = null;
    if (platform && selected.length > 0) {
      const labels = selected.map((e) => e.label).join(", ");
      if (dryRun) {
        console.log(`  would fold ${labels} into ${projectId}/v${version} (${platform.section_label})`);
        folded++;
        continue;
      }
      const raw = await simplify([
        { role: "system", content: CMS_PLATFORM_SIMPLIFY_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildPlatformSimplifyUserPrompt(
            buildPlatformSourceBody(selected),
            platform.section_label,
            platform.max_bullets ?? DEFAULT_MAX_BULLETS
          ),
        },
      ]);
      if (!raw.trim()) throw new Error(`Empty platform section for ${projectId}/v${version}`);
      section = normalizePlatformSection(raw, platform.section_label) || null;
      for (const e of newlyAssigned) projectFolds[e.label] = version;
      console.log(`  folded ${labels} into ${projectId}/v${version} → saved`);
      folded++;
    }

    if (dryRun) continue;
    const body = withPlatformSection(stagingEntry.body, sectionLabels, section);
    if (body === stagingEntry.body.trim()) continue;
    if (!section) stripped++;
    staging = await writeStagingCheckpoint(enPath, staging, {
      label: `v${version}`,
      content: `<Update label="v${version}" description="${stagingEntry.date}">\n\n${body}\n\n</Update>`,
    });
  }

  if (!dryRun) {
    folds[projectId] = projectFolds;
    await savePlatformFolds(folds);
  }
  return { folded, stripped };
}
