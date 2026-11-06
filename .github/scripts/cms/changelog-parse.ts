/**
 * Parse `<Update>` blocks from changelog/index.mdx.
 *
 * The docs changelog covers three products in one feed. Each block names its
 * product with a `tags` attribute and a label prefix:
 *
 *   <Update label="ComfyUI v0.44.0" description="November 4, 2026" tags={["ComfyUI"]}>
 *   <Update label="Comfy Cloud v0.485.7" description="October 21, 2026" tags={["Comfy Cloud"]}>
 *   <Update label="Comfy Desktop v1.1.8" description="October 22, 2026" tags={["Comfy Desktop"]}>
 *
 * Legacy labels without a prefix (`v0.44.0`) are ComfyUI. CMS staging files
 * keep bare `v0.44.0` labels, because the in-app popup compares the Strapi
 * `version` field against the running ComfyUI version.
 */

export type ChangelogProduct = "comfyui" | "cloud" | "desktop";

export interface ReleaseNoteEntry {
  /** Bare semver of the entry's own product (`0.44.0`, `0.485.7`, `1.1.8`). */
  version: string;
  date: string;
  body: string;
  /** Label exactly as written in the source file. */
  label: string;
  product: ChangelogProduct;
}

/** Product tag (in `tags={[...]}`) and label prefix for each product. */
export const PRODUCT_NAMES: Record<ChangelogProduct, string> = {
  comfyui: "ComfyUI",
  cloud: "Comfy Cloud",
  desktop: "Comfy Desktop",
};

const PREFIX_RE = /^(ComfyUI|Comfy Cloud|Comfy Desktop)\s+/i;

export function normalizeVersion(label: string): string {
  return label.trim().replace(PREFIX_RE, "").replace(/^v/i, "").trim();
}

function productFromName(name: string): ChangelogProduct | null {
  const n = name.trim().toLowerCase();
  if (n === "comfyui") return "comfyui";
  if (n === "comfy cloud") return "cloud";
  if (n === "comfy desktop") return "desktop";
  return null;
}

function parseTags(attrs: string): string[] {
  const m = attrs.match(/\btags=\{\s*\[([^\]]*)\]\s*\}/);
  if (!m) return [];
  return [...m[1]!.matchAll(/"([^"]+)"|'([^']+)'/g)].map((t) => (t[1] ?? t[2])!.trim());
}

/** Product from tags first, then from the label prefix. No match = ComfyUI. */
export function productForUpdate(label: string, tags: string[]): ChangelogProduct {
  for (const tag of tags) {
    const p = productFromName(tag);
    if (p) return p;
  }
  const prefix = label.trim().match(PREFIX_RE)?.[1];
  return (prefix && productFromName(prefix)) || "comfyui";
}

function attr(attrs: string, name: string): string | null {
  return attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;
}

/** Every `<Update>` block, any product, attributes in any order. */
export function parseAllChangelogUpdates(content: string): ReleaseNoteEntry[] {
  const entries: ReleaseNoteEntry[] = [];
  const re = /<Update\b([^>]*)>([\s\S]*?)<\/Update>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    const attrs = match[1]!;
    const label = attr(attrs, "label");
    const date = attr(attrs, "description");
    if (!label || date === null) continue;
    entries.push({
      version: normalizeVersion(label),
      date: date.trim(),
      body: match[2]!.trim(),
      label,
      product: productForUpdate(label, parseTags(attrs)),
    });
  }
  return entries;
}

/**
 * ComfyUI `<Update>` blocks only. These are the entries that become CMS
 * versions; Cloud and Desktop blocks are folded in as sections instead
 * (see cms-platform.ts).
 */
export function parseChangelogUpdates(content: string): ReleaseNoteEntry[] {
  return parseAllChangelogUpdates(content).filter((e) => e.product === "comfyui");
}

/** Cloud or Desktop `<Update>` blocks, newest first as written. */
export function parsePlatformUpdates(
  content: string,
  product: Exclude<ChangelogProduct, "comfyui">
): ReleaseNoteEntry[] {
  return parseAllChangelogUpdates(content).filter((e) => e.product === product);
}

export function compareSemver(a: string, b: string): number {
  const pa = a.split(".").map((n) => Number(n) || 0);
  const pb = b.split(".").map((n) => Number(n) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function meetsMinVersion(version: string, minVersion: string): boolean {
  return compareSemver(version, minVersion) >= 0;
}

function comfyuiVersionFromLabelLine(line: string): string | null {
  const m = line.match(/<Update\b([^>]*)/);
  if (!m) return null;
  const label = attr(m[1]!, "label");
  if (!label) return null;
  if (productForUpdate(label, parseTags(m[1]!)) !== "comfyui") return null;
  return normalizeVersion(label);
}

/**
 * New ComfyUI versions in a git diff of changelog/index.mdx.
 *
 * A version counts as new only when its `<Update>` line was added and no
 * `<Update>` line for the same version was removed. Relabeling or retagging
 * an existing block (`v0.44.0` → `ComfyUI v0.44.0`) changes that line on
 * both sides of the diff and must not re-sync published versions.
 */
export function versionsFromGitDiff(diff: string): string[] {
  const added = new Set<string>();
  const removed = new Set<string>();
  for (const line of diff.split("\n")) {
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    if (line.startsWith("+")) {
      const v = comfyuiVersionFromLabelLine(line);
      if (v) added.add(v);
    } else if (line.startsWith("-")) {
      const v = comfyuiVersionFromLabelLine(line);
      if (v) removed.add(v);
    }
  }
  return [...added].filter((v) => !removed.has(v));
}
