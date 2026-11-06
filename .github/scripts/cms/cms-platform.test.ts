import { describe, expect, test } from "bun:test";
import type { ReleaseNoteEntry } from "./changelog-parse.ts";
import {
  buildPlatformSourceBody,
  entriesSince,
  latestComfyuiVersion,
  normalizePlatformSection,
  selectPlatformEntries,
  stripPlatformSections,
  withPlatformSection,
} from "./cms-platform.ts";

const LABELS = ["Comfy Cloud Updates", "Comfy Desktop Updates"];

function entry(label: string, date: string): ReleaseNoteEntry {
  return { label, date, version: "0", body: `* body of ${label}`, product: "cloud" };
}

const POPUP = `**New Open-Source Model Support**
* **Model**: A model

**Partner Node Updates**
* **Node**: A node`;

describe("selectPlatformEntries", () => {
  const a = entry("Comfy Cloud v0.485.7", "October 21, 2026");
  const b = entry("Comfy Cloud v0.541.1", "November 5, 2026");

  test("unassigned entries go to the newest unpublished version", () => {
    const r = selectPlatformEntries([b, a], {}, "0.45.0", true);
    expect(r.selected.map((e) => e.label)).toEqual([b.label, a.label]);
    expect(r.newlyAssigned).toHaveLength(2);
  });

  test("unassigned entries wait when the version cannot take new items", () => {
    const r = selectPlatformEntries([b, a], {}, "0.44.0", false);
    expect(r.selected).toHaveLength(0);
  });

  test("re-runs keep earlier assignments and never repeat an entry", () => {
    const folds = { [a.label]: "0.44.0" };
    expect(selectPlatformEntries([b, a], folds, "0.44.0", false).selected.map((e) => e.label)).toEqual([
      a.label,
    ]);
    const next = selectPlatformEntries([b, a], folds, "0.45.0", true);
    expect(next.selected.map((e) => e.label)).toEqual([b.label]);
  });
});

describe("entriesSince", () => {
  test("drops entries before the cutoff", () => {
    const old = entry("Comfy Cloud v0.400.0", "September 2, 2026");
    const recent = entry("Comfy Cloud v0.485.7", "October 21, 2026");
    expect(entriesSince([recent, old], "October 1, 2026")).toEqual([recent]);
    expect(entriesSince([recent, old])).toHaveLength(2);
  });
});

describe("platform sections", () => {
  const cloud = "**Comfy Cloud Updates**\n* **Auto top-up**: Refill credits automatically";
  const desktop = "**Comfy Desktop Updates**\n* **Assets**: Starts without assets";

  test("appends a section after the ComfyUI sections", () => {
    expect(withPlatformSection(POPUP, LABELS, cloud)).toBe(`${POPUP}\n\n${cloud}`);
  });

  test("replaces another product's section (cloud copy of comfyui staging)", () => {
    const comfyuiStaging = `${POPUP}\n\n${desktop}`;
    expect(withPlatformSection(comfyuiStaging, LABELS, cloud)).toBe(`${POPUP}\n\n${cloud}`);
    expect(withPlatformSection(comfyuiStaging, LABELS, null)).toBe(POPUP);
  });

  test("strip leaves ComfyUI sections alone", () => {
    expect(stripPlatformSections(POPUP, LABELS)).toBe(POPUP);
  });

  test("normalize forces the configured label", () => {
    expect(normalizePlatformSection("* **A**: b", "Comfy Cloud Updates")).toBe(
      "**Comfy Cloud Updates**\n* **A**: b"
    );
    expect(normalizePlatformSection("**Cloud**\n\n* **A**: b", "Comfy Cloud Updates")).toBe(
      "**Comfy Cloud Updates**\n* **A**: b"
    );
    expect(normalizePlatformSection("**Comfy Cloud Updates**", "Comfy Cloud Updates")).toBe("");
  });

  test("source body lists releases oldest first", () => {
    const body = buildPlatformSourceBody([
      entry("Comfy Desktop v1.1.8", "October 22, 2026"),
      entry("Comfy Desktop v1.1.7", "October 13, 2026"),
    ]);
    expect(body.indexOf("v1.1.7")).toBeLessThan(body.indexOf("v1.1.8"));
  });
});

describe("latestComfyuiVersion", () => {
  test("ignores Cloud and Desktop versions", () => {
    const docs = [
      `<Update label="Comfy Cloud v0.541.1" description="November 5, 2026" tags={["Comfy Cloud"]}>\n* a\n</Update>`,
      `<Update label="ComfyUI v0.44.0" description="November 4, 2026" tags={["ComfyUI"]}>\n* b\n</Update>`,
      `<Update label="Comfy Desktop v1.1.8" description="October 22, 2026" tags={["Comfy Desktop"]}>\n* c\n</Update>`,
      `<Update label="v0.39.2" description="October 8, 2026">\n* d\n</Update>`,
    ].join("\n\n");
    expect(latestComfyuiVersion(docs)).toBe("0.44.0");
  });
});
