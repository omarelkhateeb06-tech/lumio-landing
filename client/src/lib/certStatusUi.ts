// ─────────────────────────────────────────────────────────────────────────────
// Presentation tokens for a certificate's status pill/badge.
//
// This lives in its own UI module (not certs.ts) on purpose: the color tokens
// come from the design system (theme.ts), so the dependency arrow stays
// UI -> data (this file imports the CertStatus *type* from certs.ts) and never
// data -> UI. Both the dashboard card and the cert overview badge read this one
// map, so a recolor or a new status can't leave the two surfaces disagreeing
// (First Principles MED).
// ─────────────────────────────────────────────────────────────────────────────

import { C } from "@/lib/theme";
import type { CertStatus } from "@/lib/certs";

export const CERT_STATUS_TONE: Record<CertStatus, { bg: string; border: string; ink: string }> = {
  "not-started": { bg: C.surface, border: C.hairline, ink: C.umber },
  "in-progress": { bg: C.surface, border: C.orangeWashBorder, ink: C.orangeInk },
  "capstone-unlocked": { bg: C.surface, border: C.orangeWashBorder, ink: C.orangeInk },
  submitted: { bg: C.orangeWash, border: C.orangeWashBorder, ink: C.orangeInk },
  "needs-revision": { bg: C.orangeWash, border: C.orangeWashBorder, ink: C.orangeInk },
  certified: { bg: C.surface, border: C.orangeWashBorder, ink: C.forest },
};
