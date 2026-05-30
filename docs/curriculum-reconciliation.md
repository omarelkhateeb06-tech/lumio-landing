# Lumio Curriculum Reconciliation Spec

> **Status: PLANNING / RECONCILIATION ONLY.** Nothing in this document has been built, seeded, or written to the database. The DB was read only. This file is the spec to review before any build begins.
>
> **Citation key:** problems are cited by their exact audit numbers. `1-150` = original audit (Bucket 1: 1-50 latent value, Bucket 2: 51-100 onboarding friction, Bucket 3: 101-150 deepening). Bucket 4 net-new themes are cited as `4A-1 … 4J-43`.

---

## Revision changelog (v2)

This is a revision of the v1 spec. Six changes were folded in. Summary of what moved:

1. **Depth standard added (new section below).** Per-tier target block counts are now explicit and applied throughout. Every existing 2-block lesson in growing / confident / cert-track tiers is now marked **DEEPEN** with the specific problems and block types to add. Beginner 2-block lessons may stay **KEEP**. Industry Deep Dives is the priority deepen target — 4-5 blocks, non-negotiable. The master table (Section 4) now carries a **target-block-count** column.
2. **Citation gate enforced.** Every lesson in the master table now cites ≥1 problem — there are no `—` placeholders left. Lessons that could not be honestly mapped to a validated problem are named as **CUT candidates** with reasoning (see `calendar-audits-where-did-your-week-go`). Citations are resolved here, not deferred to build.
3. **Foundations micro-lessons merged.** The 12 thin Foundations lessons collapse to **6** richer multi-block lessons. The mental-model set and the attitude set are merged into combined lessons (detail in Section 3). This is the single biggest driver of the lower total.
4. **Stopped optimizing for 100.** Module targets are no longer forced. The honest total is **94 lessons**, reported as-is. No padding. Note: the count barely moved (100→94) — the real trade was **thin→deep**, not many→few. The depth win comes from the 41 DEEPENs (blocks-per-lesson), not from cutting lessons.
5. **D2 paste-safety lesson** (`is-this-safe-to-paste`) is added to **First Steps** (beginner), not Working Well. It is pinned into the Beginner AI Practitioner cert; `inbox-triage` is dropped from that cert. Working Well keeps the deeper policy / shadow-AI / privacy content.
6. **D3 clinical re-tiering applied.** Industry Deep Dives is no longer a blanket "confident" module. Each clinical/legal lesson is tiered by real AI difficulty (handoffs / encounter-notes / chart-summarization / patient-comms = beginner or growing; accuracy-&-privacy guardrail and confidentiality = confident). Cert level is unchanged; only per-lesson tier moves. No lesson-tier/cert-level decoupling.

**Net effect on counts:** v1 = 100 lessons (padded). v2 = **94 lessons** (honest). Arithmetic: 100 − 6 (Foundations 12→6) − 1 (`calendar-audits` CUT) + 1 (paste-safety) = **94**. The count moved only slightly; the substance of v2 is the depth standard (41 DEEPENs), not lesson reduction.

**Cross-spec consistency:** module slugs are locked per D7 of `docs/systems-reconciliation.md` — `foundations`, `first-steps`, `everyday-work`, `creation`, `business-workflows`, `working-well-with-ai`, `industry-deep-dives`, `building-with-ai`, `responsibility-and-judgment`. The cert-slug impact note at the end flags any slug the systems spec pins.

---

## Depth standard (applies to every lesson)

A lesson's required depth is a function of its tier. This table is the rule; the master table in Section 4 carries a per-lesson target-block-count that conforms to it.

| Tier | Modules | Target blocks/lesson |
|---|---|---|
| Beginner | Foundations, First Steps | 2-3 (light is fine) |
| Growing | Everyday Work, Creation, Business Workflows | 3-4 |
| Confident | Working Well, Building, Responsibility | 3-4 |
| Cert-track | Industry Deep Dives | 4-5 (NON-NEGOTIABLE) |

**Reclassification rule applied throughout:**

- Every existing **2-block** lesson in a growing / confident / cert-track tier → **DEEPEN** (the reconciliation table names the problems to add and the block types).
- Beginner 2-block lessons → may stay **KEEP** (structurally fine for tier).
- **Industry Deep Dives is the priority deepen target.** A 2-block lesson behind a $49 cert is a defect. Every Industry lesson is 4-5 blocks.

Block-type vocabulary (6): `reading`, `multiple_choice`, `fill_blank`, `try_it_live`, `before_after`, `mini_project`.

---

## Section 1 — Live State Summary (READ-only DB dump)

Pulled live from Supabase (`gqdazzlqayejqatwxhlz`) via `node scripts/db.mjs query`. No writes performed.

### Totals

- **62 lessons** across **6 modules**.
- **7 mastery checks** (all `question_count = 8`): 1 level-scope (`beginner-level-check`) + 6 module-scope (one per module).

### Module counts

| Module slug | tier (observed) | lesson count |
|---|---|---|
| foundations | beginner | 9 |
| everyday-work | beginner | 10 |
| creation | growing | 9 |
| business-workflows | growing | 9 |
| industry-deep-dives | mixed (beginner/growing/confident) | 17 |
| building-with-ai | confident | 8 |
| **TOTAL** | | **62** |

### Full lesson inventory (by module, order_index)

**foundations (9, beginner)**

| # | slug | block types |
|---|---|---|
| 0 | when-to-use-chatgpt-vs-google | mini_project, reading |
| 1 | spot-when-ai-is-making-things-up | mini_project, reading |
| 2 | the-3-step-framing-technique | **all 6 block types** |
| 3 | stop-writing-prompts-start-writing-briefs | mini_project, reading |
| 4 | set-up-ai-once-so-it-remembers-how-you-work | mini_project, reading |
| 5 | what-ai-cannot-do | before_after, reading |
| 6 | fact-checking-ai-output | reading, try_it_live |
| 7 | ai-and-your-privacy | multiple_choice, reading |
| 8 | the-iteration-loop | reading, try_it_live |

**everyday-work (10, beginner)**

| # | slug | block types |
|---|---|---|
| 0 | the-5-minute-meeting-debrief-protocol | mini_project, reading |
| 1 | inbox-triage-auto-drafting-responses | mini_project, reading |
| 2 | writing-better-briefs-for-external-teams | mini_project, reading |
| 3 | calendar-audits-where-did-your-week-go | mini_project, reading |
| 4 | the-slack-summary-rule | mini_project, reading |
| 5 | summarizing-long-documents | before_after, reading |
| 6 | drafting-professional-emails | reading, try_it_live |
| 7 | preparing-for-meetings | mini_project, reading |
| 8 | rough-notes-to-polished-writing | before_after, reading |
| 9 | ai-for-research | multiple_choice, reading |

**creation (9, growing)**

| # | slug | block types |
|---|---|---|
| 0 | structural-editing-rewrite-without-losing-voice | mini_project, reading |
| 1 | the-brainstorming-loop-getting-past-version-1 | mini_project, reading |
| 2 | make-a-great-image-from-a-sentence | mini_project, reading |
| 3 | synthesizing-research-30-pdfs-into-1-page | mini_project, reading |
| 4 | the-outline-method-for-long-form-content | mini_project, reading |
| 5 | writing-first-drafts | reading, try_it_live |
| 6 | matching-your-voice | before_after, reading |
| 7 | repurposing-content | mini_project, reading |
| 8 | creating-presentations | multiple_choice, reading |

**business-workflows (9, growing)**

| # | slug | block types |
|---|---|---|
| 0 | automating-lead-research | mini_project, reading |
| 1 | turn-a-screen-recording-into-a-step-by-step-guide | mini_project, reading |
| 2 | data-cleaning-for-the-spreadsheet-phobic | mini_project, reading |
| 3 | build-your-own-ai-helper-that-knows-your-company | mini_project, reading |
| 4 | competitor-tracking-on-autopilot | mini_project, reading |
| 5 | building-simple-workflows | before_after, reading |
| 6 | ai-for-team-communication | mini_project, reading |
| 7 | competitive-research | reading, try_it_live |
| 8 | automating-repetitive-tasks | fill_blank, reading |

**industry-deep-dives (17, mixed)**

| # | slug | tier | block types |
|---|---|---|---|
| 0 | ai-in-product-management-spec-writing | confident | mini_project, reading |
| 1 | ai-in-marketing-campaign-drafting | confident | mini_project, reading |
| 2 | ai-in-design-copy-fitting-and-ux-writing | confident | mini_project, reading |
| 3 | ai-in-operations-process-mapping | confident | mini_project, reading |
| 4 | ai-in-finance-quick-p-l-analysis | confident | mini_project, reading |
| 5 | ai-assisted-patient-handoffs-the-sbar-method | beginner | mini_project, reading |
| 6 | turn-rough-encounter-notes-into-clean-documentation | beginner | mini_project, reading |
| 7 | summarize-a-long-patient-chart-before-you-walk-in | growing | mini_project, reading |
| 8 | explain-it-in-plain-language-patient-communication | beginner | mini_project, reading |
| 9 | build-a-shift-change-briefing-in-five-minutes | growing | mini_project, reading |
| 10 | ai-in-legal-work-limits | beginner | multiple_choice, reading |
| 11 | the-accuracy-and-privacy-guardrail-for-clinical-ai | beginner | mini_project, reading |
| 12 | contract-summaries-with-ai | beginner | before_after, reading |
| 13 | legal-research-first-passes | beginner | reading, try_it_live |
| 14 | client-communication-legal | beginner | mini_project, reading |
| 15 | document-review-prep | beginner | fill_blank, reading |
| 16 | confidentiality-and-ai-legal | beginner | multiple_choice, reading |

**building-with-ai (8, confident)**

| # | slug | block types |
|---|---|---|
| 0 | connect-ai-to-your-other-tools-no-code | mini_project, reading |
| 1 | chain-ai-steps-to-finish-a-whole-task | mini_project, reading |
| 2 | pull-data-from-any-website-without-code | mini_project, reading |
| 3 | find-anything-youve-ever-saved-instantly | mini_project, reading |
| 4 | the-autonomous-workday-whats-next | mini_project, reading |
| 5 | prompt-chaining | before_after, reading |
| 6 | building-your-ai-toolkit | mini_project, reading |
| 7 | ai-templates-for-teams | reading, try_it_live |

### Discrepancies to report (not silently adapted)

1. **Lesson count & module slugs match assumptions.** Live = exactly 62 lessons across the 6 expected module slugs (foundations, everyday-work, creation, business-workflows, industry-deep-dives, building-with-ai). No slug drift.
2. **Block-thinness is near-universal.** Every lesson has exactly **2 blocks** (a `reading` + one interactive) **except** `the-3-step-framing-technique`, which has all 6 block types. Under the depth standard above, **every growing/confident/cert-track 2-block lesson is a DEEPEN** (not optional). Beginner 2-block lessons may stay KEEP. This is why the v2 reconciliation table shows far more DEEPEN than v1 did.
3. **industry-deep-dives is a mixed bag.** 5 of 17 lessons are generic-professional confident-tier (PM, marketing, design, operations, finance) that do not fit the "Health + Legal only" decision. These are reclassified to the roadmap appendix (Section 6), not built into the active module.

---

## Section 2 — Reconciliation Table (every existing lesson)

Disposition codes: **KEEP** (carry over, structurally fine for tier; may get +1 block at build, no scope change) · **DEEPEN** (expand scope: add cited problems + block types to hit the tier's target) · **MERGE** (fold into a target) · **RECLASSIFY** (move to a different module) · **CUT** (drop as standalone).

### foundations (9)

Note: the four mental-model / attitude lessons here are the merge inputs (Section 3). The three KEEP lessons below survive as standalone beginner lessons because they each pin into the Beginner cert or carry a distinct task.

| slug | disposition | destination / target | problems | notes |
|---|---|---|---|---|
| when-to-use-chatgpt-vs-google | KEEP | Foundations | 58, 65, 64 | beginner, cert-pinned; 2-3 blocks fine |
| spot-when-ai-is-making-things-up | KEEP | Foundations | 60, 61, 67 | beginner, cert-pinned; hallucination intro |
| what-ai-cannot-do | KEEP | Foundations | 59, 77, 83 | beginner, cert-pinned; limits framing |
| the-3-step-framing-technique | RECLASSIFY | First Steps | 68, 69, 70, 22 | already full 6-block; belongs in beginner first-prompts cluster |
| stop-writing-prompts-start-writing-briefs | RECLASSIFY | First Steps | 68, 69, 73, 76 | foundational prompting skill, beginner |
| set-up-ai-once-so-it-remembers-how-you-work | RECLASSIFY | First Steps | 63, 99, 109 | memory/custom-instructions setup, beginner |
| the-iteration-loop | RECLASSIFY | First Steps | 71, 72, 74 | refine-don't-restart, beginner |
| fact-checking-ai-output | RECLASSIFY → DEEPEN | Working Well with AI | 79, 80, 118 | up to growing→confident; deepen to 3-4 with verification workflow |
| ai-and-your-privacy | RECLASSIFY → DEEPEN | Working Well with AI | 86, 4I-40, 4I-41 | deeper policy/shadow-AI; basic paste-safety (84,85) moves to First Steps per D2 |

### everyday-work (10)

Tier note: these existing lessons are re-tiered into the growing band of a growing-target module — so they are all **DEEPEN to 3-4 blocks**. Citations are resolved here (Change 2). One lesson is named a CUT candidate.

| slug | disposition | destination / target | problems | notes |
|---|---|---|---|---|
| the-5-minute-meeting-debrief-protocol | DEEPEN | Everyday Work | 3 | meeting → action items; add before_after + multiple_choice |
| inbox-triage-auto-drafting-responses | DEEPEN | Everyday Work | 7, 1 | dropped from Beginner cert per D2, remains a lesson; deepen to 3 |
| writing-better-briefs-for-external-teams | DEEPEN | Everyday Work | 8 | add before_after example pair |
| calendar-audits-where-did-your-week-go | **CUT (candidate)** | — | (none) | time-audit, not an AI-output task; no validated-problem map exists. Recommend cut as standalone. |
| the-slack-summary-rule | DEEPEN | Everyday Work | 13 | thread → summary; add try_it_live |
| summarizing-long-documents | DEEPEN | Everyday Work | 11 | add before_after + multiple_choice; cert-eligible |
| drafting-professional-emails | DEEPEN | Everyday Work | 1 | add before_after; cert-pinned candidate |
| preparing-for-meetings | DEEPEN | Everyday Work | 17 | add mini_project agenda build |
| rough-notes-to-polished-writing | DEEPEN | Everyday Work | 10 | add before_after + try_it_live |
| ai-for-research | DEEPEN | Everyday Work | 4 | add source-checking step (links to fact-checking) |

### creation (9) — all growing, all DEEPEN to 3-4

| slug | disposition | destination / target | problems | notes |
|---|---|---|---|---|
| structural-editing-rewrite-without-losing-voice | DEEPEN | Creation | 102 | add before_after voice-preservation pair |
| the-brainstorming-loop-getting-past-version-1 | DEEPEN | Creation | 101 | add try_it_live iteration |
| make-a-great-image-from-a-sentence | DEEPEN | Creation | 25 | add multiple_choice on prompt anatomy |
| synthesizing-research-30-pdfs-into-1-page | DEEPEN | Creation | 27 | add mini_project synthesis |
| the-outline-method-for-long-form-content | DEEPEN | Creation | 26 | add mini_project outline build |
| writing-first-drafts | DEEPEN | Creation | 29 | add before_after |
| matching-your-voice | DEEPEN | Creation | 105 | add try_it_live voice-match |
| repurposing-content | DEEPEN | Creation | 106 | add mini_project repurpose chain |
| creating-presentations | DEEPEN | Creation | 24 | add mini_project deck outline |

### business-workflows (9) — all growing, DEEPEN

| slug | disposition | destination / target | problems | notes |
|---|---|---|---|---|
| automating-lead-research | DEEPEN | Business Workflows | 45 | add mini_project + before_after |
| turn-a-screen-recording-into-a-step-by-step-guide | DEEPEN | Business Workflows | 46 | add mini_project |
| data-cleaning-for-the-spreadsheet-phobic | DEEPEN | Business Workflows | 38 | add structured-data extraction; folds CUT items 37, 39; 3-4 blocks |
| build-your-own-ai-helper-that-knows-your-company | DEEPEN | Business Workflows | 108, 109 | add mini_project setup walk-through |
| competitor-tracking-on-autopilot | MERGE | → competitive-research | — | near-duplicate; consolidate |
| building-simple-workflows | DEEPEN | Business Workflows | 47 | add mini_project |
| ai-for-team-communication | DEEPEN | Business Workflows | 48 | add before_after |
| competitive-research | DEEPEN (MERGE target) | Business Workflows | 114, 49 | absorbs competitor-tracking-on-autopilot; 3-4 blocks |
| automating-repetitive-tasks | DEEPEN | Business Workflows | 50 | add mini_project |

### industry-deep-dives (17) — cert-track, ALL DEEPEN to 4-5 (priority), re-tiered per D3

| slug | disposition | destination / target | tier (D3) | problems | notes |
|---|---|---|---|---|---|
| ai-in-product-management-spec-writing | RECLASSIFY → roadmap | Appendix (PM track) | — | — | generic confident; not Health/Legal |
| ai-in-marketing-campaign-drafting | RECLASSIFY → roadmap | Appendix (Marketing track) | — | — | generic confident |
| ai-in-design-copy-fitting-and-ux-writing | RECLASSIFY → roadmap | Appendix (Design track) | — | — | generic confident |
| ai-in-operations-process-mapping | RECLASSIFY → roadmap | Appendix (Ops track) | — | — | generic confident |
| ai-in-finance-quick-p-l-analysis | RECLASSIFY → roadmap | Appendix (Finance track) | — | — | generic confident |
| ai-assisted-patient-handoffs-the-sbar-method | DEEPEN | Industry Deep Dives | growing | 128 | structured task, low AI difficulty → growing; 4-5 blocks |
| turn-rough-encounter-notes-into-clean-documentation | DEEPEN | Industry Deep Dives | growing | 128 | 4-5 blocks |
| summarize-a-long-patient-chart-before-you-walk-in | DEEPEN | Industry Deep Dives | growing | 128 | 4-5 blocks |
| explain-it-in-plain-language-patient-communication | DEEPEN | Industry Deep Dives | beginner | 128 | plain-language rewrite, low difficulty → beginner; 4-5 blocks |
| build-a-shift-change-briefing-in-five-minutes | DEEPEN | Industry Deep Dives | growing | 128 | 4-5 blocks |
| the-accuracy-and-privacy-guardrail-for-clinical-ai | DEEPEN | Industry Deep Dives | confident | 128 | HIPAA/PHI + accuracy judgment → confident; 4-5 blocks |
| ai-in-legal-work-limits | DEEPEN | Industry Deep Dives | beginner | 129 | 4-5 blocks |
| contract-summaries-with-ai | DEEPEN | Industry Deep Dives | growing | 129 | 4-5 blocks |
| legal-research-first-passes | DEEPEN | Industry Deep Dives | growing | 129 | 4-5 blocks |
| client-communication-legal | DEEPEN | Industry Deep Dives | beginner | 129 | 4-5 blocks |
| document-review-prep | DEEPEN | Industry Deep Dives | growing | 129 | 4-5 blocks |
| confidentiality-and-ai-legal | DEEPEN | Industry Deep Dives | confident | 129 | privilege/confidentiality judgment → confident; 4-5 blocks |

### building-with-ai (8) — confident, DEEPEN to 3-4

| slug | disposition | destination / target | problems | notes |
|---|---|---|---|---|
| connect-ai-to-your-other-tools-no-code | DEEPEN | Building with AI | 144 | add mini_project |
| chain-ai-steps-to-finish-a-whole-task | DEEPEN (MERGE target) | Building with AI | 110, 143 | absorbs prompt-chaining; 3-4 blocks |
| pull-data-from-any-website-without-code | DEEPEN | Building with AI | 144 | add mini_project |
| find-anything-youve-ever-saved-instantly | DEEPEN | Building with AI | 144 | add try_it_live |
| the-autonomous-workday-whats-next | DEEPEN | Building with AI | 140, 141, 4C-10, 4C-11, 4C-12, 4C-13, 4C-14 | folds 4C model-instability + "keeping current"; 3-4 blocks |
| prompt-chaining | MERGE | → chain-ai-steps-to-finish-a-whole-task | — | duplicate concept |
| building-your-ai-toolkit | DEEPEN | Building with AI | 94, 111, 137, 4J-42, 4J-43 | folds 4J prompt-loss / prompt-library; 3-4 blocks |
| ai-templates-for-teams | DEEPEN | Building with AI | 143 | add try_it_live; 3 blocks |

### Reconciliation tally (v2)

- **KEEP:** 3 (foundations beginner survivors) · **DEEPEN:** 41 · **MERGE:** 2 (competitor-tracking, prompt-chaining) · **RECLASSIFY (to active module):** 6 (4 to First Steps, 2 to Working Well) · **RECLASSIFY (to roadmap appendix):** 5 · **CUT as standalone:** 1 (`calendar-audits-where-did-your-week-go`; plus 37/39/66/149/150 handled via fold, see Section 5).
- DEEPEN jumped from 3 (v1) to 41 (v2) because the depth standard makes deepening mandatory for every non-beginner 2-block lesson, not optional.

---

## Section 3 — Net-New & Merged Lessons

### Foundations merges (12 thin lessons → 6 richer lessons)

Per Change 3. The mental-model set and attitude set collapse into combined multi-block lessons. The "first win" content folds forward into First Steps L1 (where the first real action happens).

| new lesson | level | problems | composed from (v1 micro-lessons) | blocks | target |
|---|---|---|---|---|---|
| You're Not Behind (and It's Not Cheating) | beginner | 51, 52, 53, 54, 55, 56 | merges v1 "You're Not Behind" + "Is Using AI Cheating?" + "Will AI Take My Job?" | reading, before_after, multiple_choice | 3 |
| What AI Actually Is (and Isn't) | beginner | 58, 59, 62, 63, 66, 67 | merges "What AI Actually Is" + "Does It Remember Me?" + "Why Same Question Different Answers" | reading, multiple_choice, before_after | 3 |
| Which AI Tool, and Is It Online? | beginner | 57, 64, 65 | merges "ChatGPT vs Claude vs Copilot" + "Is It Searching the Internet?" | reading, multiple_choice | 2-3 |

The three surviving standalone Foundations lessons (`when-to-use-chatgpt-vs-google`, `spot-when-ai-is-making-things-up`, `what-ai-cannot-do`) are KEEP from Section 2 — they each pin into the Beginner cert or carry a distinct verifiable task, so they stay separate rather than being merged. Foundations therefore = **3 merged + 3 KEEP = 6 lessons**. The v1 standalone "Your First Win" (51, 56) is absorbed into First Steps L1.

**Deliberate constraint:** the merges touched only NON-cert-pinned mental-model/attitude lessons. No Beginner-cert-pinned slug was merged or renamed.

### First Steps (NEW module, beginner) — net-new + reclassified-in

| title | level | problems | source | blocks | target |
|---|---|---|---|---|---|
| Your First Five Minutes (and Your First Win) | beginner | 89, 91, 20, 18, 21, 51, 56 | NET-NEW (absorbs Foundations first-win) | mini_project, reading | 2-3 |
| Free vs Paid: What You Actually Need | beginner | 90, 19 | NET-NEW | multiple_choice | 2 |
| The 3-Step Framing Technique | beginner | 68, 69, 70, 22 | RECLASSIFY | all 6 blocks | 6 |
| Stop Writing Prompts, Start Writing Briefs | beginner | 68, 69, 73, 76 | RECLASSIFY | mini_project | 2 |
| What's a Good Job for AI? | beginner | 92, 93 | NET-NEW | before_after | 2 |
| The Jargon Glossary | beginner | 96 | NET-NEW | fill_blank | 2 |
| Set Up AI Once So It Remembers How You Work | beginner | 63, 99, 109 | RECLASSIFY | mini_project | 2 |
| Paste a Document, Give It a Role, Save the Output | beginner | 98, 99, 95 | NET-NEW | mini_project | 2 |
| The Iteration Loop | beginner | 71, 72, 74 | RECLASSIFY | try_it_live | 2 |
| Ask for Less: Beating the Wall of Text | beginner | 97, 100, 70 | NET-NEW | before_after | 2 |
| **Is This Safe to Paste?** | beginner | 84, 85 | NET-NEW (D2 safety) | multiple_choice, before_after | 2-3 |

**D2 note:** `is-this-safe-to-paste` lands here in First Steps (beginner), is pinned into the Beginner AI Practitioner cert, and `inbox-triage` is dropped from that cert. It also strengthens the inherited base of the Healthcare cert (HIPAA/PHI paste-risk awareness). The deeper policy/shadow-AI privacy material stays in Working Well (`ai-and-your-privacy`).

### Everyday Work — net-new (growing-leaning)

| title | level | problems | blocks | target |
|---|---|---|---|---|
| Writing Hard Messages: Saying No Gracefully | growing | 2, 44, 9 | before_after | 3 |
| Replying to an Angry Customer | growing | 6 | before_after | 3 |
| Compare Two Documents Side by Side | beginner | 14 | mini_project | 2-3 |
| Decode the Jargon in Any Document | beginner | 15 | try_it_live | 2-3 |
| Break a Big Task Into a Timeline | growing | 18, 19 | mini_project | 3 |
| Learn New Software or a New Concept Fast | beginner | 30, 31, 32, 34 | try_it_live | 2-3 |

### Creation — net-new

| title | level | problems | blocks | target |
|---|---|---|---|---|
| Cut the Padding: Fixing Bloat and Format Drift | growing | 103 | before_after | 3 |

### Business Workflows — net-new

| title | level | problems | blocks | target |
|---|---|---|---|---|
| Find the Themes Hiding in Your Feedback | growing | 36, 35 | mini_project | 3 |
| AI as a Decision Sounding Board | growing | 40, 41, 42, 22 | try_it_live | 3-4 |

### Working Well with AI (NEW module, growing→confident) — net-new + reclassified-in

| title | level | problems | source | blocks | target |
|---|---|---|---|---|---|
| Fact-Checking AI Output | growing | 79, 80, 118 | RECLASSIFY → DEEPEN | try_it_live | 3-4 |
| AI and Your Privacy | growing | 86, 4I-40, 4I-41 | RECLASSIFY → DEEPEN | multiple_choice | 3-4 |
| Trust Calibration: When to Believe AI | growing | 78, 81, 82, 83 | NET-NEW | multiple_choice | 3 |
| Catching the Subtle Errors | confident | 107, 117, 61 | NET-NEW | before_after | 3-4 |
| Verifying at Scale Without Burning Out | confident | 115, 116, 4G-28 | NET-NEW | mini_project | 3-4 |
| Is This a Fireable Offense? AI Policy at Work | growing | 87, 88 | NET-NEW | multiple_choice | 3 |
| Making AI Stick in Your Real Workflow | growing | 4F-23, 4F-24, 4F-25, 112 | NET-NEW | mini_project | 3 |
| Keeping a Team Consistent With AI | confident | 119, 120, 121, 4G-29 | NET-NEW | mini_project | 3-4 |
| Teaching Skeptics and Bringing Your Team Along | confident | 122, 123 | NET-NEW | before_after | 3 |
| Authentic, Not Lazy: Using AI With Integrity | growing | 4A-1, 4A-2, 4A-5 | NET-NEW | before_after | 3 |
| Keeping Your Message Sounding Human | growing | 4A-2, 4A-4 | NET-NEW | before_after | 3 |
| Wrongly Flagged as AI: What to Do | growing | 4B-6, 4B-7, 4B-8, 4B-9 | NET-NEW | before_after | 3 |
| Depth, Not Surface: Going Beyond the Obvious Answer | confident | 104, 101 | NET-NEW | try_it_live | 3-4 |
| Edit, Don't Paste Raw | growing | 75, 101, 113 | NET-NEW | before_after | 3 |

### Industry Deep Dives — Healthcare net-new (cert-track 4-5 blocks)

| title | level | problems | blocks | target |
|---|---|---|---|---|
| Protecting Your Clinical Judgment | confident | 4H-36, 128, 124 | before_after | 4-5 |
| Keeping the Human Connection in Care | growing | 4H-37, 128 | before_after | 4-5 |

### Building with AI — net-new

| title | level | problems | blocks | target |
|---|---|---|---|---|
| Measuring the Time You Actually Saved | confident | 145, 138 | mini_project | 3-4 |

### Responsibility & Judgment (NEW module, confident) — net-new

| title | level | problems | blocks | target |
|---|---|---|---|---|
| When AI Just Agrees With You (Sycophancy) | confident | 4D-15, 4D-16, 142 | before_after | 3-4 |
| Don't Outsource Your Thinking: Avoiding Skill Atrophy | confident | 124, 125 | before_after | 3 |
| Support Your Decisions, Don't Dodge Them | confident | 126, 127 | mini_project | 3 |
| Disclosing When You Used AI | confident | 146, 4A-3, 147 | multiple_choice | 3 |
| Owning the Errors | confident | 148, 4D-17 | before_after | 3 |
| Set Your Personal Limits and Spot Bias | confident | 139, 149, 150 | multiple_choice | 3 |

---

## Section 4 — Complete Master Curriculum (honest count, not padded)

New 9-module structure (slugs locked per D7). Source codes: **KEEP** / **DEEPEN** (= existing slug) · **NET-NEW** · **MERGE** (combines listed inputs) · **RECLASSIFY** (existing slug moved here). The **target** column conforms to the depth standard. Every lesson cites ≥1 problem (Change 2).

### Module 1 — Foundations (`foundations`, beginner) — 6 lessons

| # | title | level | problems | source | blocks | target |
|---|---|---|---|---|---|---|
| 1 | You're Not Behind (and It's Not Cheating) | beginner | 51, 52, 53, 54, 55, 56 | MERGE | reading, before_after, multiple_choice | 3 |
| 2 | What AI Actually Is (and Isn't) | beginner | 58, 59, 62, 63, 66, 67 | MERGE | reading, multiple_choice, before_after | 3 |
| 3 | Which AI Tool, and Is It Online? | beginner | 57, 64, 65 | MERGE | reading, multiple_choice | 2-3 |
| 4 | When to Use ChatGPT vs Google | beginner | 58, 65, 64 | KEEP | mini_project, reading | 2-3 |
| 5 | Spot When AI Is Making Things Up | beginner | 60, 61, 67 | KEEP | mini_project, reading | 2-3 |
| 6 | What AI Cannot Do | beginner | 59, 77, 83 | KEEP | before_after, reading | 2-3 |

### Module 2 — First Steps (`first-steps`, NEW, beginner) — 11 lessons

| # | title | level | problems | source | blocks | target |
|---|---|---|---|---|---|---|
| 1 | Your First Five Minutes (and Your First Win) | beginner | 89, 91, 20, 18, 21, 51, 56 | NET-NEW | mini_project | 2-3 |
| 2 | Free vs Paid: What You Actually Need | beginner | 90, 19 | NET-NEW | multiple_choice | 2 |
| 3 | The 3-Step Framing Technique | beginner | 68, 69, 70, 22 | RECLASSIFY | all 6 blocks | 6 |
| 4 | Stop Writing Prompts, Start Writing Briefs | beginner | 68, 69, 73, 76 | RECLASSIFY | mini_project | 2 |
| 5 | What's a Good Job for AI? | beginner | 92, 93 | NET-NEW | before_after | 2 |
| 6 | The Jargon Glossary | beginner | 96 | NET-NEW | fill_blank | 2 |
| 7 | Set Up AI Once So It Remembers How You Work | beginner | 63, 99, 109 | RECLASSIFY | mini_project | 2 |
| 8 | Paste a Document, Give It a Role, Save the Output | beginner | 98, 99, 95 | NET-NEW | mini_project | 2 |
| 9 | The Iteration Loop | beginner | 71, 72, 74 | RECLASSIFY | try_it_live | 2 |
| 10 | Ask for Less: Beating the Wall of Text | beginner | 97, 100, 70 | NET-NEW | before_after | 2 |
| 11 | Is This Safe to Paste? | beginner | 84, 85 | NET-NEW (D2) | multiple_choice, before_after | 2-3 |

### Module 3 — Everyday Work (`everyday-work`, growing) — 15 lessons

`calendar-audits-where-did-your-week-go` is CUT (see Section 2). Existing lessons DEEPEN to 3-4.

| # | title | level | problems | source | blocks | target |
|---|---|---|---|---|---|---|
| 1 | The 5-Minute Meeting Debrief Protocol | growing | 3 | DEEPEN | mini_project | 3 |
| 2 | Inbox Triage & Auto-Drafting Responses | growing | 7, 1 | DEEPEN | mini_project | 3 |
| 3 | Writing Better Briefs for External Teams | growing | 8 | DEEPEN | mini_project | 3 |
| 4 | The Slack Summary Rule | growing | 13 | DEEPEN | mini_project | 3 |
| 5 | Summarizing Long Documents | growing | 11 | DEEPEN | before_after | 3 |
| 6 | Drafting Professional Emails | beginner | 1 | DEEPEN | try_it_live | 3 |
| 7 | Preparing for Meetings | growing | 17 | DEEPEN | mini_project | 3 |
| 8 | Rough Notes to Polished Writing | growing | 10 | DEEPEN | before_after | 3 |
| 9 | AI for Research | growing | 4 | DEEPEN | multiple_choice | 3 |
| 10 | Writing Hard Messages: Saying No Gracefully | growing | 2, 44, 9 | NET-NEW | before_after | 3 |
| 11 | Replying to an Angry Customer | growing | 6 | NET-NEW | before_after | 3 |
| 12 | Compare Two Documents Side by Side | beginner | 14 | NET-NEW | mini_project | 2-3 |
| 13 | Decode the Jargon in Any Document | beginner | 15 | NET-NEW | try_it_live | 2-3 |
| 14 | Break a Big Task Into a Timeline | growing | 18, 19 | NET-NEW | mini_project | 3 |
| 15 | Learn New Software or a New Concept Fast | beginner | 30, 31, 32, 34 | NET-NEW | try_it_live | 2-3 |

### Module 4 — Creation (`creation`, growing) — 10 lessons

| # | title | level | problems | source | blocks | target |
|---|---|---|---|---|---|---|
| 1 | Structural Editing: Rewrite Without Losing Voice | growing | 102 | DEEPEN | mini_project | 3-4 |
| 2 | The Brainstorming Loop: Getting Past Version 1 | growing | 101 | DEEPEN | mini_project | 3-4 |
| 3 | Make a Great Image From a Sentence | growing | 25 | DEEPEN | mini_project | 3-4 |
| 4 | Synthesizing Research: 30 PDFs Into 1 Page | growing | 27 | DEEPEN | mini_project | 3-4 |
| 5 | The Outline Method for Long-Form Content | growing | 26 | DEEPEN | mini_project | 3-4 |
| 6 | Writing First Drafts | growing | 29 | DEEPEN | try_it_live | 3-4 |
| 7 | Matching Your Voice | growing | 105 | DEEPEN | before_after | 3-4 |
| 8 | Repurposing Content | growing | 106 | DEEPEN | mini_project | 3-4 |
| 9 | Creating Presentations | growing | 24 | DEEPEN | multiple_choice | 3-4 |
| 10 | Cut the Padding: Fixing Bloat and Format Drift | growing | 103 | NET-NEW | before_after | 3 |

### Module 5 — Business Workflows (`business-workflows`, growing) — 10 lessons

| # | title | level | problems | source | blocks | target |
|---|---|---|---|---|---|---|
| 1 | Automating Lead Research | growing | 45 | DEEPEN | mini_project | 3-4 |
| 2 | Turn a Screen Recording Into a Step-by-Step Guide | growing | 46 | DEEPEN | mini_project | 3-4 |
| 3 | Data Cleaning for the Spreadsheet-Phobic | growing | 38 | DEEPEN (folds 37, 39) | mini_project | 3-4 |
| 4 | Build Your Own AI Helper That Knows Your Company | growing | 108, 109 | DEEPEN | mini_project | 3-4 |
| 5 | Building Simple Workflows | growing | 47 | DEEPEN | before_after | 3-4 |
| 6 | AI for Team Communication | growing | 48 | DEEPEN | mini_project | 3-4 |
| 7 | Competitive Research | growing | 114, 49 | DEEPEN / MERGE (absorbs competitor-tracking-on-autopilot) | reading, try_it_live | 3-4 |
| 8 | Automating Repetitive Tasks | growing | 50 | DEEPEN | fill_blank | 3-4 |
| 9 | Find the Themes Hiding in Your Feedback | growing | 36, 35 | NET-NEW | mini_project | 3 |
| 10 | AI as a Decision Sounding Board | growing | 40, 41, 42, 22 | NET-NEW | try_it_live | 3-4 |

### Module 6 — Working Well with AI (`working-well-with-ai`, NEW, growing→confident) — 14 lessons

| # | title | level | problems | source | blocks | target |
|---|---|---|---|---|---|---|
| 1 | Fact-Checking AI Output | growing | 79, 80, 118 | DEEPEN / RECLASSIFY | try_it_live | 3-4 |
| 2 | AI and Your Privacy | growing | 86, 4I-40, 4I-41 | DEEPEN / RECLASSIFY | multiple_choice | 3-4 |
| 3 | Trust Calibration: When to Believe AI | growing | 78, 81, 82, 83 | NET-NEW | multiple_choice | 3 |
| 4 | Catching the Subtle Errors | confident | 107, 117, 61 | NET-NEW | before_after | 3-4 |
| 5 | Verifying at Scale Without Burning Out | confident | 115, 116, 4G-28 | NET-NEW | mini_project | 3-4 |
| 6 | Is This a Fireable Offense? AI Policy at Work | growing | 87, 88 | NET-NEW | multiple_choice | 3 |
| 7 | Making AI Stick in Your Real Workflow | growing | 4F-23, 4F-24, 4F-25, 112 | NET-NEW | mini_project | 3 |
| 8 | Keeping a Team Consistent With AI | confident | 119, 120, 121, 4G-29 | NET-NEW | mini_project | 3-4 |
| 9 | Teaching Skeptics and Bringing Your Team Along | confident | 122, 123 | NET-NEW | before_after | 3 |
| 10 | Authentic, Not Lazy: Using AI With Integrity | growing | 4A-1, 4A-2, 4A-5 | NET-NEW | before_after | 3 |
| 11 | Keeping Your Message Sounding Human | growing | 4A-2, 4A-4 | NET-NEW | before_after | 3 |
| 12 | Wrongly Flagged as AI: What to Do | growing | 4B-6, 4B-7, 4B-8, 4B-9 | NET-NEW | before_after | 3 |
| 13 | Depth, Not Surface: Going Beyond the Obvious Answer | confident | 104, 101 | NET-NEW | try_it_live | 3-4 |
| 14 | Edit, Don't Paste Raw | growing | 75, 101, 113 | NET-NEW | before_after | 3 |

### Module 7 — Industry Deep Dives (`industry-deep-dives`, Health + Legal ONLY, cert-track) — 14 lessons

Re-tiered per D3. **Every lesson 4-5 blocks (NON-NEGOTIABLE).**

| # | title | level (D3) | problems | source | target |
|---|---|---|---|---|---|
| 1 | AI-Assisted Patient Handoffs: The SBAR Method | growing | 128 | DEEPEN | 4-5 |
| 2 | Turn Rough Encounter Notes Into Clean Documentation | growing | 128 | DEEPEN | 4-5 |
| 3 | Summarize a Long Patient Chart Before You Walk In | growing | 128 | DEEPEN | 4-5 |
| 4 | Explain It in Plain Language: Patient Communication | beginner | 128 | DEEPEN | 4-5 |
| 5 | Build a Shift-Change Briefing in Five Minutes | growing | 128 | DEEPEN | 4-5 |
| 6 | The Accuracy & Privacy Guardrail for Clinical AI | confident | 128 | DEEPEN | 4-5 |
| 7 | Protecting Your Clinical Judgment | confident | 4H-36, 128, 124 | NET-NEW | 4-5 |
| 8 | Keeping the Human Connection in Care | growing | 4H-37, 128 | NET-NEW | 4-5 |
| 9 | AI in Legal Work: Limits | beginner | 129 | DEEPEN | 4-5 |
| 10 | Contract Summaries With AI | growing | 129 | DEEPEN | 4-5 |
| 11 | Legal Research First Passes | growing | 129 | DEEPEN | 4-5 |
| 12 | Client Communication (Legal) | beginner | 129 | DEEPEN | 4-5 |
| 13 | Document Review Prep | growing | 129 | DEEPEN | 4-5 |
| 14 | Confidentiality and AI (Legal) | confident | 129 | DEEPEN | 4-5 |

### Module 8 — Building with AI (`building-with-ai`, confident) — 8 lessons

| # | title | level | problems | source | blocks | target |
|---|---|---|---|---|---|---|
| 1 | Connect AI to Your Other Tools (No Code) | confident | 144 | DEEPEN | mini_project | 3-4 |
| 2 | Chain AI Steps to Finish a Whole Task | confident | 110, 143 | DEEPEN / MERGE (absorbs prompt-chaining) | mini_project | 3-4 |
| 3 | Pull Data From Any Website Without Code | confident | 144 | DEEPEN | mini_project | 3-4 |
| 4 | Find Anything You've Ever Saved, Instantly | confident | 144 | DEEPEN | try_it_live | 3 |
| 5 | The Autonomous Workday: What's Next (Keeping Current) | confident | 140, 141, 4C-10, 4C-11, 4C-12, 4C-13, 4C-14 | DEEPEN | reading, before_after | 3-4 |
| 6 | Building Your AI Toolkit (Your Prompt Library) | confident | 94, 111, 137, 4J-42, 4J-43 | DEEPEN | mini_project | 3-4 |
| 7 | AI Templates Your Team Will Actually Use | confident | 143 | DEEPEN | try_it_live | 3 |
| 8 | Measuring the Time You Actually Saved | confident | 145, 138 | NET-NEW | mini_project | 3-4 |

### Module 9 — Responsibility & Judgment (`responsibility-and-judgment`, NEW, confident) — 6 lessons

| # | title | level | problems | source | blocks | target |
|---|---|---|---|---|---|---|
| 1 | When AI Just Agrees With You (Sycophancy) | confident | 4D-15, 4D-16, 142 | NET-NEW | before_after | 3-4 |
| 2 | Don't Outsource Your Thinking: Avoiding Skill Atrophy | confident | 124, 125 | NET-NEW | before_after | 3 |
| 3 | Support Your Decisions, Don't Dodge Them | confident | 126, 127 | NET-NEW | mini_project | 3 |
| 4 | Disclosing When You Used AI | confident | 146, 4A-3, 147 | NET-NEW | multiple_choice | 3 |
| 5 | Owning the Errors | confident | 148, 4D-17 | NET-NEW | before_after | 3 |
| 6 | Set Your Personal Limits and Spot Bias | confident | 139, 149, 150 | NET-NEW | multiple_choice | 3 |

### Module totals (honest — Change 4)

| Module | tier | lesson count |
|---|---|---|
| Foundations | beginner | 6 |
| First Steps | beginner | 11 |
| Everyday Work | growing | 15 |
| Creation | growing | 10 |
| Business Workflows | growing | 10 |
| Working Well with AI | growing→confident | 14 |
| Industry Deep Dives (Health + Legal) | cert-track | 14 |
| Building with AI | confident | 8 |
| Responsibility & Judgment | confident | 6 |
| **TOTAL** | | **94** |

No module was padded to a target. The total landed at **94** (v1 was 100): Foundations 12→6 (−6), `calendar-audits` CUT (−1), paste-safety added (+1). The reduction is small by design — the count was never the lever. The real change is depth: 41 lessons move from 2 blocks to 3-5 (thin→deep), which is where the work and the value are. Every lesson cites ≥1 problem — there are zero `—` placeholders.

---

## Section 5 — Coverage Check (promoted & folded problems)

### PROMOTED (must appear in build) — all mapped ✓

| Promoted set | problems | where covered |
|---|---|---|
| 4E onboarding (highest priority) | 4E-18 … 4E-22 | First Steps #1 (89,91,20,18,21) + #2 (90,19); 18-22 map through the First Steps onboarding cluster |
| 4A authenticity | 4A-1, 4A-2, 4A-3, 4A-4, 4A-5 | Working Well #10 (1,2,5), #11 (2,4); Responsibility #4 (4A-3) |
| 4B detection false-positives | 4B-6, 4B-7, 4B-8, 4B-9 | Working Well #12 |
| 4D sycophancy | 4D-15, 4D-16, 4D-17 | Responsibility #1 (15,16), #5 (17) |
| 4H profession (Health + Legal only) | 4H-36, 4H-37 | Industry #7 (36), #8 (37); Legal lessons Module 7 #9-14 |

### FOLDED (no standalone lesson) — all absorbed ✓

| Folded set | problems | folded into |
|---|---|---|
| 4C model instability | 4C-10 … 4C-14 | Building with AI #5 (Autonomous Workday / keeping current) |
| 4F Copilot/workflow-fit | 4F-23, 4F-24, 4F-25 | Working Well #7 (Making AI Stick) |
| 4G verification fatigue | 4G-28, 4G-29 | Working Well #5 (verify at scale, 28), #8 (team consistency, 29) |
| 4I shadow-AI | 4I-40, 4I-41 | Working Well #2 (privacy) |
| 4J prompt-loss | 4J-42, 4J-43 | Building with AI #6 (AI toolkit / prompt library) |

### CUT — handled ✓

| item | decision | handling |
|---|---|---|
| `calendar-audits-where-did-your-week-go` | **CUT as standalone** | time-audit task, not an AI-output task; no validated-problem map. Not carried into v2 master. |
| 28 (naming) | CUT | concept touched in First Steps Jargon Glossary if needed |
| 66 (opinions/feelings) | CUT standalone | folded into Foundations #2 (What AI Actually Is) |
| 149, 150 (bias / limits) | CUT standalone | folded into Responsibility #6 (Set Limits / Spot Bias) |
| 37, 39 (data items) | CUT standalone | folded into Business Workflows #3 (Data Cleaning, DEEPEN) |
| competitor-tracking-on-autopilot | MERGE | → Business Workflows #7 (Competitive Research) |
| prompt-chaining | MERGE | → Building with AI #2 (Chain AI Steps) |

### Unmapped promoted problems: **NONE.** ✓

All blueprint-promoted Bucket-4 themes and all folded themes have an explicit home. Every lesson in Section 4 cites ≥1 problem. No PROMOTED problem is left uncovered.

---

## Section 6 — Appendix: Roadmap-Only Industry Tracks (NOT built)

These are listed for the roadmap only. **Do not build in this phase.** They are future per-profession certification tracks, gated behind the core 9-module curriculum.

### Reclassified out of the live build (the 5 generic confident industry lessons)

Pulled from the active Industry Deep Dives module (now Health + Legal only) and parked as seeds of future generic-professional tracks:

| existing slug | future track |
|---|---|
| ai-in-product-management-spec-writing | Product Management track |
| ai-in-marketing-campaign-drafting | Marketing track |
| ai-in-design-copy-fitting-and-ux-writing | Design / UX track |
| ai-in-operations-process-mapping | Operations track |
| ai-in-finance-quick-p-l-analysis | Finance track |

### Future certification tracks (net-new, roadmap)

| track | seed problems |
|---|---|
| Education | 130 |
| Finance | 131, 4H-34, 4H-35 |
| HR | 133, 4H-32, 4H-33 |
| Customer Service | 4H-30, 4H-31 |

---

## Cert-slug impact note (for sync with systems-reconciliation.md — do NOT edit that file)

This revision was deliberately designed so that **no Beginner-cert-pinned slug was merged, renamed, or destroyed.** The Foundations merges touched only NON-cert-pinned mental-model / attitude lessons.

| change in this spec | slug effect | systems-spec reference that pins it | sync flag |
|---|---|---|---|
| Foundations 12→6 merge | only non-cert-pinned slugs merged | none | no impact |
| `is-this-safe-to-paste` added to First Steps | NEW slug now exists | systems-spec Beginner cert APPROVED-10 lists it (⚠ was net-new) | **resolved** — slug now planned |
| `inbox-triage` dropped from Beginner cert | slug unchanged (remains a lesson) | systems-spec D2 swap | already reflected in systems-spec |
| `protect-clinical-judgment` net-new | NEW slug exists (Industry #7) | systems-spec Healthcare optional net-new (⚠) | **resolved** |
| `keep-human-connection-in-care` net-new | NEW slug exists (Industry #8) | systems-spec Healthcare optional net-new (⚠) | **resolved** |
| clinical/legal lessons re-tiered (D3) | slugs unchanged; only `level` metadata moves (beginner/growing/confident) | systems-spec §2.2#2 / §2.3 anticipate D3 | metadata-only sync, no cert-pin change |
| `competitor-tracking-on-autopilot` MERGE | slug retired | NOT cert-pinned | no impact |
| `prompt-chaining` MERGE | slug retired | NOT cert-pinned | no impact |
| `calendar-audits-where-did-your-week-go` CUT | slug retired | **was pinned in live `beginner-ai-practitioner` cert** | **FLAG** — live cert pins this; the D2-approved cert composition already drops it, so re-pin the approved 10-lesson set at build. No systems-spec edit needed (D2 already records the swap). |

**One live-DB flag worth restating:** the *current* live `beginner-ai-practitioner` cert still pins `calendar-audits-where-did-your-week-go` and `inbox-triage-auto-drafting-responses`. Both are removed from the D2-approved composition. Re-pinning is low-risk (zero certs awarded), but the build step must re-curate `cert_lessons` to the approved 10-lesson set rather than inherit the live pins.

---

## Section 7 — Launch Slice (the first DB-writing build)

> **Still planning / read-only.** This section defines exactly what the first build touches. When it is approved, *this section* becomes the build prompt — the first one that writes to the DB instead of a spec file. Nothing here is built yet.

**Thesis:** the launch slice is the **beginner spine** (Foundations + First Steps) plus *exactly* the plumbing to make it walk and to sell one cert. Nothing more. The 41 DEEPENs and the 3 later new modules are real work, but they are all post-launch — they live in growing/confident/cert-track tiers, none of which the beginner spine touches.

### 7.0 Prerequisite (blocks the citation-verification half of this build)

- [ ] **Commit the audit as `docs/problem-audit.md`.** The 1-150 + Bucket 4 audit currently lives only in chat memory; it is in no repo file. Until it is committed, the inbox-triage/problem-1 double-duty (and every future citation check) cannot be resolved against a source of truth. **Open item: the audit text is not currently available to the agent** — it must be pasted in or pointed to before this file can be written. This is a content paste, not a reconstruction; do not fabricate it.

### 7.1 Content in the slice

**Module: Foundations (`foundations`, beginner) — 6 lessons**

| # | title | source | already built? |
|---|---|---|---|
| 1 | You're Not Behind (and It's Not Cheating) | NET-NEW (merge content) | ✗ author |
| 2 | What AI Actually Is (and Isn't) | NET-NEW (merge content) | ✗ author |
| 3 | Which AI Tool, and Is It Online? | NET-NEW (merge content) | ✗ author |
| 4 | When to Use ChatGPT vs Google | KEEP | ✓ live |
| 5 | Spot When AI Is Making Things Up | KEEP | ✓ live |
| 6 | What AI Cannot Do | KEEP | ✓ live |

**Module: First Steps (`first-steps`, NEW, beginner) — 11 lessons**

| # | title | source | already built? |
|---|---|---|---|
| 1 | Your First Five Minutes (and Your First Win) | NET-NEW | ✗ author |
| 2 | Free vs Paid: What You Actually Need | NET-NEW | ✗ author |
| 3 | The 3-Step Framing Technique | RECLASSIFY (from foundations) | ✓ live — moves module only |
| 4 | Stop Writing Prompts, Start Writing Briefs | RECLASSIFY (from foundations) | ✓ live — moves module only |
| 5 | What's a Good Job for AI? | NET-NEW | ✗ author |
| 6 | The Jargon Glossary | NET-NEW | ✗ author |
| 7 | Set Up AI Once So It Remembers How You Work | RECLASSIFY (from foundations) | ✓ live — moves module only |
| 8 | Paste a Document, Give It a Role, Save the Output | NET-NEW | ✗ author |
| 9 | The Iteration Loop | RECLASSIFY (from foundations) | ✓ live — moves module only |
| 10 | Ask for Less: Beating the Wall of Text | NET-NEW | ✗ author |
| 11 | Is This Safe to Paste? | NET-NEW (D2) | ✗ author |

**Authoring tally for the slice:** **9 net-new lessons** (3 Foundations + 6 First Steps) + **4 reclassify-moves** (content exists, only `module_id`/`order_index` change) + **3 KEEP-in-place** (already live). Beginner-tier means the depth standard is 2-3 blocks — **none of these need a DEEPEN.**

### 7.2 Beginner cert re-curation (`cert_lessons` re-pin)

The approved 10 (D2: paste-safety in, inbox-triage out). Re-pin `cert_lessons` for `beginner-ai-practitioner` to exactly this set, in this order:

| pos | lesson slug | home module | status |
|---|---|---|---|
| 1 | when-to-use-chatgpt-vs-google | foundations | ✓ live |
| 2 | spot-when-ai-is-making-things-up | foundations | ✓ live |
| 3 | what-ai-cannot-do | foundations | ✓ live |
| 4 | the-3-step-framing-technique | first-steps | ✓ live (reclassified) |
| 5 | stop-writing-prompts-start-writing-briefs | first-steps | ✓ live (reclassified) |
| 6 | set-up-ai-once-so-it-remembers-how-you-work | first-steps | ✓ live (reclassified) |
| 7 | the-iteration-loop | first-steps | ✓ live (reclassified) |
| 8 | **is-this-safe-to-paste** | first-steps | ✗ NET-NEW (D2 — must be authored before pin) |
| 9 | drafting-professional-emails | everyday-work | ✓ live (cert dependency; lesson already exists) |
| 10 | summarizing-long-documents | everyday-work | ✓ live (cert dependency; lesson already exists) |

- **Dropped from live pins:** `calendar-audits-where-did-your-week-go`, `inbox-triage-auto-drafting-responses`.
- **Note:** positions 9-10 pin two *already-live* Everyday Work lessons. The cert pins individual lessons, so this does NOT pull Everyday Work into the slice — those two lessons just need to remain published. No EW authoring required.
- **Reclassify safety:** positions 4-7 keep their slug → keep their uuid-v5 → the cert pin survives the module move automatically. No re-pin breakage from reclassify; the only *content* re-pin is removing the 2 dropped lessons and adding paste-safety at position 8.

### 7.3 rules_v1 changes (D1)

- [ ] **CORE_MODULES set.** Replace the single `FOUNDATIONS_MODULE = "foundations"` (recommend.ts ~line 81) with `CORE_MODULES = {"foundations", "first-steps"}` so the core/always-included segment spans both beginner modules, not just Foundations.
- [ ] **first-steps in the band-respecting spine.** Ensure the beginner band walks foundations → first-steps before everyday-work. Driven by module `order_index` (see 7.4) + the CORE_MODULES set.
- [ ] **Onboarding-band confident-skip (D1).** The confident-skip must key off `skill_level` (onboarding band), not a hardcoded slug. Confirm the skip logic references the band + CORE_MODULES, not `FOUNDATIONS_MODULE`.
- [ ] **GOAL_MODULE_WEIGHT:** first-steps is core (always included), so it needs no goal nudge. Leave GOAL_MODULE_WEIGHT untouched unless a goal should specifically bias toward first-steps.
- [ ] **Fix stale `verify-rules.ts` count** while in here: it asserts pre-slice module/lesson counts. Update expected counts to reflect the new `first-steps` module + the net-new lessons. (Cleanup the user already flagged.)

### 7.4 Module mechanics (easy to forget — breaks the dashboard if missed)

- [ ] **INSERT `modules` row:** `slug = first-steps`, title (e.g. "First Steps"), tier `beginner`, `order_index = 1`.
- [ ] **Shift existing module order_index +1** for everything currently ≥1: everyday-work 1→2, creation 2→3, business-workflows 3→4, industry-deep-dives 4→5, building-with-ai 5→6. (foundations stays 0.)
- [ ] **UPDATE the 4 reclassified lessons** (`the-3-step-framing-technique`, `stop-writing-prompts-start-writing-briefs`, `set-up-ai-once-so-it-remembers-how-you-work`, `the-iteration-loop`): set `module_id` → first-steps, set `order_index` per the 7.1 First Steps table. UUIDs unchanged (slug-stable).
- [ ] **INSERT the 9 net-new lesson rows** with correct `module_id` + `order_index` (content authored separately; rows + sections JSONB go in together at build).
- [ ] **Re-sequence Foundations** order_index for the 6 it retains (3 net-new + 3 KEEP).

**Decision A — the 2 Working-Well-bound Foundations lessons.** `fact-checking-ai-output` and `ai-and-your-privacy` are slated to RECLASSIFY into the Working Well module — which is NOT in the launch slice. At launch they have nowhere to go yet. Options:
- **(A1, recommended) Leave them in `foundations` for launch.** They are already there and already beginner-ish; defer the reclassify to the Working Well build. Foundations physically holds 8 published lessons at launch, normalizing to 6 when Working Well ships. Lowest effort, no orphan rows.
- (A2) Create the `working-well-with-ai` module shell early just to house them. More scope, pulls a post-launch module forward. Not recommended.

### 7.5 Mastery checks

- [ ] **Revise the Foundations module check.** The dynamic resolver self-heals *scope* (module → currently-published lessons), so it will auto-include the new Foundations set. But the `mastery_check_questions` *content* was written against the old lessons (some now reclassified out to First Steps). Re-author the Foundations questions to match the 6 retained lessons.
- [ ] **beginner-level-check (level scope):** auto-expands to all beginner lessons, so it picks up first-steps lessons for free (scope self-heals). Review question content for coverage, but no scope surgery needed.

**Decision B — First Steps mastery check: in-slice or fast-follow?** First Steps is a brand-new module with 11 lessons and no check. Options:
- **(B1, recommended) In-slice.** A new core module in the beginner spine without its own module check is a visible gap (the dashboard shows checks per module). Author an 8-question `first-steps` module check as part of the slice.
- (B2) Fast-follow. Ship the slice without it and add within the first week. Acceptable only if launch timing is tight; flag it as known-missing.

### 7.6 Explicitly OUT of the launch slice (hold the line)

- **No Everyday Work content build** — and nothing beyond it. (The only EW touch is that the cert pins 2 *already-live* EW lessons; no authoring.)
- **None of the 41 DEEPENs.** All live in growing/confident/cert-track tiers — all post-launch.
- **No new modules besides `first-steps`:** Working Well, Industry Deep Dives expansion, Building, Responsibility are all out.
- **No Healthcare or Legal certs.** Only `beginner-ai-practitioner` ships.
- **No reclassify of `fact-checking-ai-output` / `ai-and-your-privacy`** to Working Well (deferred — Decision A1).
- The temptation will be "just a couple more lessons." The slice is the beginner spine + the plumbing to make it walk and sell one cert. That is the whole scope.

### 7.7 Build order within the slice

1. Commit `docs/problem-audit.md` (7.0 — unblocks citation checks).
2. Create `first-steps` module + shift order_index (7.4).
3. Reclassify the 4 lessons into first-steps (7.4) — pure metadata, low risk, do early.
4. Author + insert the 9 net-new lessons incl. `is-this-safe-to-paste` (7.1).
5. Re-curate `cert_lessons` to the approved 10 (7.2) — depends on paste-safety existing (step 4).
6. rules_v1: CORE_MODULES + spine + verify-rules.ts count (7.3).
7. Mastery: revise Foundations questions + (B1) author First Steps check (7.5).
8. **Then the deferred browser test** — verify the beginner spine renders, the recommender walks foundations → first-steps, and the re-curated cert page shows the right 10 lessons.

---

## Definition of Done — self-check (v2)

| DOD item | status |
|---|---|
| Revision changelog (v2) at the very top | ✓ PASS |
| Depth-standard section added with the tier→blocks table, applied throughout | ✓ PASS |
| Reconciliation table updated with more DEEPEN (depth standard makes it mandatory) | ✓ PASS (DEEPEN 3→41) |
| Citation gate: every master-table lesson cites ≥1 problem (no `—`) | ✓ PASS |
| Unmappable lessons named as CUT candidates with reasoning | ✓ PASS (`calendar-audits-where-did-your-week-go`) |
| Foundations micro-lessons merged into 2-3 richer lessons | ✓ PASS (12→6: 3 merged + 3 KEEP) |
| Stopped optimizing for 100; honest counts reported | ✓ PASS (total = 94) |
| D2 paste-safety lesson added to First Steps; pinned to Beginner cert; inbox-triage dropped | ✓ PASS (First Steps #11; cert-slug note) |
| D3 clinical/legal re-tiered by real difficulty; no cert/lesson-tier decoupling | ✓ PASS (Module 7 levels vary; cert level unchanged) |
| Master curriculum has target-block-count column + correct tier per lesson | ✓ PASS |
| Coverage check confirms zero unmapped promoted problems | ✓ PASS |
| Cert-slug impact note listing changed slugs flagged for sync | ✓ PASS |
| Module slugs kept exactly as locked in D7 | ✓ PASS |
| Headline total internally consistent with module breakdown | ✓ PASS (94 = 6+11+15+10+10+14+14+8+6; fixed from miscounted 84) |
| Launch slice defined (content + cert + rules_v1 + module mechanics + mastery + OUT list + build order) | ✓ PASS (Section 7) |
| Audit committed to repo as source of truth | ✗ BLOCKED — audit text not in any repo and not available to the agent; must be pasted/pointed-to before `docs/problem-audit.md` can be written (Section 7.0). Will NOT fabricate. |
| Nothing written to DB | ✓ PASS (read-only) |
| No migrations / code / lesson markdown changed | ✓ PASS (only this file edited) |
| File saved at docs/curriculum-reconciliation.md | ✓ PASS |
