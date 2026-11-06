import { describe, expect, test } from "bun:test";
import {
  normalizeVersion,
  parseAllChangelogUpdates,
  parseChangelogUpdates,
  parsePlatformUpdates,
  productForUpdate,
  versionsFromGitDiff,
} from "./changelog-parse.ts";

const DOCS = `---
title: "Changelog"
---

<Update label="Comfy Cloud v0.485.7" description="October 21, 2026" tags={["Comfy Cloud"]}>

**Billing**
* **Auto top-up**: Refill credits automatically

</Update>

<Update label="ComfyUI v0.44.0" description="November 4, 2026" tags={["ComfyUI"]}>

**Partner Node Updates**
* **Node**: Something

</Update>

<Update label="Comfy Desktop v1.1.8" description="October 22, 2026" tags={["Comfy Desktop"]}>

**Fixes**
* **Assets**: Starts without assets

</Update>

<Update label="v0.43.1" description="October 28, 2026">

**Partner Node Updates**
* **Legacy**: Unprefixed label

</Update>`;

describe("normalizeVersion", () => {
  test("strips product prefix and v", () => {
    expect(normalizeVersion("ComfyUI v0.44.0")).toBe("0.44.0");
    expect(normalizeVersion("Comfy Cloud v0.485.7")).toBe("0.485.7");
    expect(normalizeVersion("Comfy Desktop v1.1.8")).toBe("1.1.8");
    expect(normalizeVersion("v0.43.1")).toBe("0.43.1");
  });
});

describe("productForUpdate", () => {
  test("tags win, then label prefix, then ComfyUI", () => {
    expect(productForUpdate("v0.1.0", ["Comfy Cloud"])).toBe("cloud");
    expect(productForUpdate("Comfy Desktop v1.0.0", [])).toBe("desktop");
    expect(productForUpdate("v0.44.0", [])).toBe("comfyui");
  });
});

describe("parseAllChangelogUpdates", () => {
  test("reads tagged and legacy blocks in file order", () => {
    const all = parseAllChangelogUpdates(DOCS);
    expect(all.map((e) => `${e.product}:${e.version}`)).toEqual([
      "cloud:0.485.7",
      "comfyui:0.44.0",
      "desktop:1.1.8",
      "comfyui:0.43.1",
    ]);
    expect(all[0]!.date).toBe("October 21, 2026");
    expect(all[0]!.label).toBe("Comfy Cloud v0.485.7");
    expect(all[0]!.body).toContain("Auto top-up");
  });

  test("parseChangelogUpdates keeps ComfyUI only", () => {
    expect(parseChangelogUpdates(DOCS).map((e) => e.version)).toEqual(["0.44.0", "0.43.1"]);
  });

  test("parsePlatformUpdates filters by product", () => {
    expect(parsePlatformUpdates(DOCS, "cloud").map((e) => e.label)).toEqual([
      "Comfy Cloud v0.485.7",
    ]);
    expect(parsePlatformUpdates(DOCS, "desktop").map((e) => e.label)).toEqual([
      "Comfy Desktop v1.1.8",
    ]);
  });
});

describe("versionsFromGitDiff", () => {
  test("new ComfyUI block counts", () => {
    const diff = `+<Update label="ComfyUI v0.45.0" description="November 11, 2026" tags={["ComfyUI"]}>`;
    expect(versionsFromGitDiff(diff)).toEqual(["0.45.0"]);
  });

  test("relabel of an existing block does not count", () => {
    const diff = [
      `-<Update label="v0.44.0" description="November 4, 2026">`,
      `+<Update label="ComfyUI v0.44.0" description="November 4, 2026" tags={["ComfyUI"]}>`,
    ].join("\n");
    expect(versionsFromGitDiff(diff)).toEqual([]);
  });

  test("Cloud and Desktop blocks never count as CMS versions", () => {
    const diff = [
      `+<Update label="Comfy Cloud v0.44.0" description="November 4, 2026" tags={["Comfy Cloud"]}>`,
      `+<Update label="Comfy Desktop v1.1.9" description="November 6, 2026" tags={["Comfy Desktop"]}>`,
    ].join("\n");
    expect(versionsFromGitDiff(diff)).toEqual([]);
  });
});
