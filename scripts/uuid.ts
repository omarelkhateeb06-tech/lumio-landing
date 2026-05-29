// Shared id + slug helpers for content tooling (seed generator + lesson importer).
// Deterministic uuid v5 derivation keeps ids stable across runs so generated SQL
// upserts cleanly instead of duplicating rows.

import { createHash } from "node:crypto";

// Stable Lumio namespace for deterministic uuid v5 derivation. Do not change:
// existing rows are keyed off ids derived from this value.
export const NAMESPACE = "0d3f6a2c-8b1e-4c7a-9f5d-2e6b1a4c8d90";

export function uuidv5(name: string, namespace = NAMESPACE): string {
  const nsHex = namespace.replace(/-/g, "");
  const buf = Buffer.concat([Buffer.from(nsHex, "hex"), Buffer.from(name, "utf8")]);
  const hash = createHash("sha1").update(buf).digest();
  const bytes = hash.subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // version 5
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Canonical id derivation — the single source of truth for content row ids.
export const idFor = {
  module: (slug: string) => uuidv5(`module:${slug}`),
  lesson: (slug: string) => uuidv5(`lesson:${slug}`),
  block: (lessonSlug: string, orderIndex: number) => uuidv5(`block:${lessonSlug}:${orderIndex}`),
  tag: (slug: string) => uuidv5(`tag:${slug}`),
};
