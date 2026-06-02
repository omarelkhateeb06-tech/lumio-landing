// ─────────────────────────────────────────────────────────────────────────────
// Content registry — the single source of truth for the controlled vocabulary
// the lesson importer validates against: modules and tags.
//
// Lesson files reference `module` and `tags` by slug. The importer rejects any
// lesson that references a slug not listed here, which keeps the taxonomy clean
// as the library grows to hundreds of files. Adding a new module or tag is a
// one-line edit below; re-running the importer upserts it.
//
// Tag kinds mirror the DB CHECK constraint on tags.kind:
//   industry  — maps to cert industry tracks; the strongest buyer signal
//   use_case  — job-to-be-done (email, meetings, ...); broad cross-industry reuse
//   topic     — finer-grained than a module (prompting, hallucinations, ...)
// Skill level is a column on each lesson (beginner/growing/confident), not a tag.
// Role (nurse, teacher) comes from the onboarding profile, not from lesson tags.
// ─────────────────────────────────────────────────────────────────────────────

export interface ModuleDef {
  slug: string;
  title: string;
}

export type TagKind = "industry" | "use_case" | "topic" | "job_category";

export interface TagDef {
  slug: string;
  kind: TagKind;
  label: string;
}

// Ordered — array position is the module's order_index.
export const MODULES: ModuleDef[] = [
  { slug: "foundations", title: "Foundations" },
  { slug: "first-steps", title: "First Steps" },
  { slug: "everyday-work", title: "Everyday work" },
  { slug: "creation", title: "Creation" },
  { slug: "business-workflows", title: "Business workflows" },
  { slug: "working-well-with-ai", title: "Working well with AI" },
  { slug: "industry-deep-dives", title: "Industry deep dives" },
  { slug: "building-with-ai", title: "Building with AI" },
  { slug: "responsibility-and-judgment", title: "Responsibility & judgment" },
];

export const TAGS: TagDef[] = [
  // ── industry ──────────────────────────────────────────────────────────────
  { slug: "general", kind: "industry", label: "General" },
  { slug: "healthcare", kind: "industry", label: "Healthcare" },
  { slug: "legal", kind: "industry", label: "Legal" },
  { slug: "education", kind: "industry", label: "Education" },
  { slug: "finance", kind: "industry", label: "Finance" },
  { slug: "operations", kind: "industry", label: "Operations" },
  { slug: "hr", kind: "industry", label: "HR" },
  { slug: "customer-service", kind: "industry", label: "Customer service" },

  // ── use_case (job-to-be-done) ───────────────────────────────────────────────
  { slug: "email", kind: "use_case", label: "Email" },
  { slug: "meetings", kind: "use_case", label: "Meetings" },
  { slug: "writing", kind: "use_case", label: "Writing" },
  { slug: "editing", kind: "use_case", label: "Editing" },
  { slug: "research", kind: "use_case", label: "Research" },
  { slug: "data", kind: "use_case", label: "Data & analysis" },
  { slug: "hiring", kind: "use_case", label: "Hiring" },
  { slug: "customer-comms", kind: "use_case", label: "Customer communication" },
  { slug: "scheduling", kind: "use_case", label: "Scheduling" },
  { slug: "planning", kind: "use_case", label: "Planning" },
  { slug: "summarizing", kind: "use_case", label: "Summarizing" },
  { slug: "brainstorming", kind: "use_case", label: "Brainstorming" },

  // ── topic ───────────────────────────────────────────────────────────────────
  { slug: "fundamentals", kind: "topic", label: "Fundamentals" },
  { slug: "prompting", kind: "topic", label: "Prompting" },
  { slug: "framing", kind: "topic", label: "Framing & briefs" },
  { slug: "hallucinations", kind: "topic", label: "Accuracy & hallucinations" },
  { slug: "custom-instructions", kind: "topic", label: "Custom instructions" },
  { slug: "tool-selection", kind: "topic", label: "Choosing the right tool" },
  { slug: "image-gen", kind: "topic", label: "Image generation" },
  { slug: "automation", kind: "topic", label: "Automation" },
  { slug: "workflows", kind: "topic", label: "Workflows" },
];

export const MODULE_SLUGS = new Set(MODULES.map((m) => m.slug));
export const TAG_BY_SLUG = new Map(TAGS.map((t) => [t.slug, t]));
