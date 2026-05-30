# Lumio Systems Reconciliation Spec

> **Status: READ-ONLY PLANNING.** Nothing here was written to the DB. No code, migrations, seed files, or lesson files were created. The only deliverable is this markdown spec. It plans the **target state** for three systems against the 9-module restructure in `docs/curriculum-reconciliation.md`.
>
> **Curriculum-spec dependency:** that curriculum doc is still being revised (depth tiering, merges, citation fixes). So anywhere a decision depends on the *final* lesson list, this spec plans at the **module / cert-composition level** and flags the lesson-level dependency rather than hard-coding lesson UUIDs that may still move. Lesson UUIDs are deterministic uuid-v5 derived from the **slug** (`scripts/uuid.ts` → `idFor.lesson`), so a RECLASSIFY (module change only) keeps the UUID stable; only a **rename or MERGE-delete** changes/destroys a UUID.
>
> **Launch context:** pre-launch, ~2 real signups, **zero awarded certs**. Re-pinning and path regeneration are low-risk. No progress-migration design is required — we plan the target state and regenerate.

---

## Live state captured (read-only)

**Modules (6, order_index):** `foundations`(0), `everyday-work`(1), `creation`(2), `business-workflows`(3), `industry-deep-dives`(4), `building-with-ai`(5).

**Certs (2):**
| slug | name | level | industry | price_cents | base_cert_id | published |
|---|---|---|---|---|---|---|
| `beginner-ai-practitioner` | Beginner AI Practitioner | beginner | — | 4900 | null | true |
| `healthcare-ai-practitioner` | Healthcare AI Practitioner | beginner | healthcare | 4900 | → beginner-ai-practitioner | true |

**No legal cert exists** (despite 6 legal lessons live). Discrepancy vs. the task's "the legal lessons" phrasing: legal content is built, but **not** packaged as a cert.

**Mastery checks (7):** 6 module-scope (`foundations`, `everyday-work`, `creation`, `business-workflows`, `industry-deep-dives`, `building-with-ai`) + 1 level-scope (`beginner-level-check`). All `question_count = 8`, `pass_threshold = 0.8`, all have exactly 8 seeded questions.

**Discrepancy vs. task assumptions:**
- Beginner cert is **10** lessons (task said "~10" ✓); Healthcare cert is **9** lessons (task said "~9" ✓).
- Both certs pin the **same 5 Foundations lessons** as their base block (not just "Foundations + Everyday Work" generically). Three of those five are RECLASSIFY targets (see §2).

---

## Section 1 — rules_v1 Audit + Change Plan

### 1.1 Audit — how rules_v1 references module structure

Engine lives in `client/src/lib/recommend.ts` (pure, deterministic, no I/O). Wired via `generateUserPath()` → `fetchRecommenderLessons()` → `buildPathV1()` in `client/src/lib/supabase.ts`. Verified by `scripts/verify-rules.ts`.

**Every module-structure reference / assumption:**

| # | Location | What it does | Coupling to the 6-module structure |
|---|---|---|---|
| 1 | `recommend.ts:81` `FOUNDATIONS_MODULE = "foundations"` | Defines the **core** segment | **Hardcoded slug.** Core = exactly the Foundations module. |
| 2 | `recommend.ts:82` `GENERIC_INDUSTRY = "general"` | Industry sentinel | Not module-coupled. |
| 3 | `recommend.ts:85-89` `BAND` map | Spine sort key beginner→growing→confident | Band, not module. Unaffected by adding modules. |
| 4 | `recommend.ts:93` `INDUSTRY_BOOST = 100` | Band-local industry float | Not module-coupled. |
| 5 | `recommend.ts:97-102` `GOAL_MODULE_WEIGHT` | goal→module nudge map | **Hardcodes 5 module slugs:** `everyday-work`, `business-workflows`, `creation`, `building-with-ai`, `industry-deep-dives`. The 3 NEW modules are absent → weight 0. |
| 6 | `recommend.ts:145-148` | Splits pool into `foundations` vs `rest` by `module_slug === "foundations"` | **Hardcoded.** Only Foundations is "core"; everything else is "stretch." |
| 7 | `recommend.ts:154` | `core = isConfident ? [] : foundations` | Confident learners skip **only** Foundations. First Steps (also beginner) is **not** skipped — lands in their stretch. |
| 8 | `recommend.ts:190` | Confident "revisit basics" nudge = `foundations[0]` | Hardcoded to Foundations' first lesson. |
| 9 | `supabase.ts:419-447` `fetchRecommenderLessons()` | Reads `module:modules!inner(slug, order_index)` **live** per generation | **No caching** of lesson→module. Reclassify is read fresh. |
| 10 | `scripts/verify-rules.ts:20` `FOUNDATIONS` + `:171 lessons.length !== 30` | Test harness | Hardcoded foundations + a **stale count (30; live is 62)**. Non-prod, but the assertion will warn. |

**Key structural facts that limit blast radius:**
- The lesson→module relationship is **read live** (#9). Moving a lesson between modules (RECLASSIFY) requires **no rules_v1 code change** for correctness — the engine re-reads the new `module_slug` next generation.
- The **band spine is module-agnostic** (#3): a beginner lesson sorts before a growing one regardless of module. So new beginner modules slot in by band automatically.
- Ordering *within a band* falls back to `module_order` then `order_index` (`recommend.ts:132-133`). So **a new module's `order_index` (module_order) is the lever** that decides where its lessons sit within their band.
- `generator_version` is stamped `"rules_v1"` (`supabase.ts:496`); persisted `user_path_items` store stable lesson UUIDs + position.

### 1.2 Change plan — extend to 9 modules

**A. Goal→module weight table (proposed).** Add entries for the 3 new modules, consistent with the existing scheme (industry boost = 100 dominates; goal nudges are 10/20/30 within a band). The new modules are mostly beginner/growing/confident *judgment & onboarding* content, so they should be nudged for `stay_relevant` (keeping-up anxiety) and lightly for `save_time`. Proposed full table:

```
save_time:     { everyday-work: 30, business-workflows: 20, creation: 10,
                 first-steps: 25, working-well-with-ai: 15 }
stay_relevant: { building-with-ai: 30, industry-deep-dives: 20, creation: 10,
                 working-well-with-ai: 25, responsibility-and-judgment: 15,
                 first-steps: 10 }
impress_team:  { creation: 30, industry-deep-dives: 20, business-workflows: 10,
                 working-well-with-ai: 15 }
other:         {}   // unchanged — no nudge
```
Rationale: `first-steps` nudged for `save_time` (fastest "do something useful now" path) and lightly for `stay_relevant`. `working-well-with-ai` (trust, verification, integrity) nudged across all three goals since it's universally relevant. `responsibility-and-judgment` nudged only for `stay_relevant` (the "am I doing this right / will I get in trouble" driver). Weights stay ≤30 so they never out-rank a same-band industry match (100). **These weights are tunable, not load-bearing — they only reorder within a band.**

> **Dependency flag:** the new module **slugs** above (`first-steps`, `working-well-with-ai`, `responsibility-and-judgment`) are my proposed slugs; they must match whatever the curriculum build actually creates. If the build picks different slugs, the weight keys must match exactly (silent typo = weight 0).

**B. Band spine + where First Steps sits.** First Steps = beginner, Working Well = growing→confident, Responsibility = confident. The band sort handles tier placement automatically. The open lever is **module_order** within the beginner band:

- **Recommended module_order:** `foundations`(0) → `first-steps`(1) → `everyday-work`(2) → `creation`(3) → `business-workflows`(4) → `working-well-with-ai`(5) → `industry-deep-dives`(6) → `building-with-ai`(7) → `responsibility-and-judgment`(8). (Existing modules shift down to make room.)
- **First Steps sits immediately after Foundations** in the beginner band. Reasoning: Foundations is mental-model / "you're not behind" framing; First Steps is hands-on first prompts. A beginner should get *orientation then action*. Within the beginner band, ties resolve by module_order, so Foundations lessons precede First Steps lessons precede beginner Everyday-Work lessons — matching the intended learning arc.

**C. The "core"/onboarding band + confident-skip — DECIDED (D1, locked).** Today `core` = Foundations only (#6), and confident users skip *only* Foundations (#7). After the restructure, **First Steps is also beginner, foundational onboarding** — but it is NOT in `core`, so a confident user skips Foundations yet still gets First Steps ("open your first AI tool") at the front of their stretch. That's exactly the experience that bounces an experienced early adopter.

**The fix is framed as an onboarding band, not a slug list.** Generalize the single hardcoded `FOUNDATIONS_MODULE` into a **`CORE_MODULES` / beginner onboarding band** = `{foundations, first-steps}`, and gate the skip on the learner's **`skill_level`** (confident ⇒ skip the whole onboarding band), not on enumerating module slugs. This is the principled version: when a future beginner-onboarding module is added, it joins the band by membership, not by someone remembering to patch another slug into a skip list. Small, clean code change (constant → set + skill-level-driven skip). Confident users still get the band's first lesson as an optional "revisit basics" nudge in `suggestions`, exactly as Foundations works today. Add a confident-persona invariant to `verify-rules.ts` asserting the onboarding band is absent from the active path.

**D. RECLASSIFY / MERGE cache-break check.**
- **RECLASSIFY (e.g. framing-technique, briefs, set-up-once, iteration-loop → First Steps; fact-checking, privacy → Working Well):** rules_v1 reads module live → **no engine break.** Persisted `user_path_items` reference the lesson UUID, which is **unchanged** by a module move → existing path rows stay valid. The only effect is future generations place these lessons under the new module's `module_order`. ✓ Safe.
- **MERGE (prompt-chaining → chain-ai-steps; competitor-tracking → competitive-research):** if the merged-away lesson row is **deleted**, its UUID disappears. Any `user_path_items`, `cert_lessons`, or `user_progress` row pointing at it would dangle. With ~2 signups and the merge target absorbing the content, the fix is: **regenerate paths after the merge** and **re-pin certs** (§2). Flag: confirm the merge is implemented as "delete source + keep target," not "retitle."
- **`scripts/verify-rules.ts`:** update the stale `lessons.length !== 30` expectation (currently 62, will be ~100) and keep its `FOUNDATIONS` invariant — but if option (i) above is chosen, add a First-Steps-skip invariant for confident personas.

**No path data migration needed** (pre-launch). Plan: ship code changes + module_order, then **regenerate all active paths** (`generateUserPath` per user; only ~2).

---

## Section 2 — Cert Re-Pinning Plan

### 2.1 Current composition (live)

**`beginner-ai-practitioner`** (10 lessons):
| pos | lesson slug | current module | new module (per curriculum spec) |
|---|---|---|---|
| 0 | when-to-use-chatgpt-vs-google | foundations | **foundations (KEEP)** |
| 1 | spot-when-ai-is-making-things-up | foundations | **foundations (KEEP)** |
| 2 | the-3-step-framing-technique | foundations | **➡ first-steps (RECLASSIFY)** |
| 3 | stop-writing-prompts-start-writing-briefs | foundations | **➡ first-steps (RECLASSIFY)** |
| 4 | set-up-ai-once-so-it-remembers-how-you-work | foundations | **➡ first-steps (RECLASSIFY)** |
| 5 | the-5-minute-meeting-debrief-protocol | everyday-work | everyday-work (KEEP) |
| 6 | inbox-triage-auto-drafting-responses | everyday-work | everyday-work (KEEP) |
| 7 | writing-better-briefs-for-external-teams | everyday-work | everyday-work (KEEP) |
| 8 | calendar-audits-where-did-your-week-go | everyday-work | everyday-work (KEEP) |
| 9 | the-slack-summary-rule | everyday-work | everyday-work (KEEP) |

**`healthcare-ai-practitioner`** (9 lessons, base → beginner):
| pos | lesson slug | current module | new module |
|---|---|---|---|
| 0 | when-to-use-chatgpt-vs-google | foundations | foundations (KEEP) |
| 1 | spot-when-ai-is-making-things-up | foundations | foundations (KEEP) |
| 2 | the-3-step-framing-technique | foundations | **➡ first-steps** |
| 3 | stop-writing-prompts-start-writing-briefs | foundations | **➡ first-steps** |
| 4 | set-up-ai-once-so-it-remembers-how-you-work | foundations | **➡ first-steps** |
| 5 | ai-assisted-patient-handoffs-the-sbar-method | industry-deep-dives | industry-deep-dives **(re-tier to real AI difficulty: beginner/growing — see D3)** |
| 6 | turn-rough-encounter-notes-into-clean-documentation | industry-deep-dives | industry-deep-dives (beginner/growing) |
| 7 | explain-it-in-plain-language-patient-communication | industry-deep-dives | industry-deep-dives (beginner/growing) |
| 8 | the-accuracy-and-privacy-guardrail-for-clinical-ai | industry-deep-dives | industry-deep-dives (privacy guardrail may be confident) |

### 2.2 Breakage from the restructure

1. **Scrambled composition (not dangling).** Both certs' positions 2–4 are RECLASSIFY lessons that move Foundations→First Steps. UUIDs are stable, so the `cert_lessons` rows **still resolve to real lessons** — but the cert's conceptual story ("Foundations + Everyday Work") is now "Foundations + First Steps + Everyday Work" spread across 3 modules. Functionally OK today; becomes a curation problem the moment the curriculum spec **renames or merges** any of those five (then the UUID changes and the pin dangles).
2. **Tier mis-classification (healthcare) — root cause, not a labeling problem.** The curriculum spec re-tiers the clinical lessons to **confident**, which would put confident-tier lessons under a `level = beginner` cert. **Per D3, the fix is to correct the tiering, not to invent a cert-level-vs-lesson-tier decoupling.** SBAR handoffs, encounter-note cleanup, and chart summarization are **beginner-to-growing AI tasks applied to a specialized domain** — the domain is specialized, the AI skill is not. Tier them by their real AI difficulty (mostly beginner/growing; the accuracy/privacy guardrail may be confident). The cert is then naturally an accessible practitioner credential with no parallel level system. *This flows back into the curriculum-spec revision.*
3. **The "can't just be whole modules" scale problem.** Under the new structure, Foundations(12) + First Steps(10) + Everyday Work(16) = **38 lessons** — far too many for a ~10-lesson cert. Certs **must** become a **curated subset**, not "complete these modules."
4. **No merged lessons are currently pinned** — neither cert references prompt-chaining or competitor-tracking, so no MERGE dangling on the cert side today. (Still must hold as the spec finalizes.)

### 2.3 Target composition (recommendation — needs Omar's approval, §4)

Curated ~10-lesson sets. **Slugs marked ⚠ depend on the still-revising curriculum spec** (rename/merge risk) — treat as intent, re-confirm against final slugs before pinning.

**Beginner AI Practitioner — APPROVED 10 (D2), with the safety swap (curated "can actually use AI day one" spine):**
1. `when-to-use-chatgpt-vs-google` (foundations)
2. `spot-when-ai-is-making-things-up` (foundations)
3. `what-ai-cannot-do` (foundations) — *added; rounds out the mental model*
4. `the-3-step-framing-technique` (first-steps) ⚠
5. `stop-writing-prompts-start-writing-briefs` (first-steps) ⚠
6. `set-up-ai-once-so-it-remembers-how-you-work` (first-steps) ⚠
7. `the-iteration-loop` (first-steps) ⚠ — *added; core prompting skill, currently unpinned*
8. **`is-this-safe-to-paste`** (first-steps) ⚠ — ***added (D2): beginner "what's unsafe to paste into a public AI tool." Non-negotiable — see safety gap below.***
9. `drafting-professional-emails` (everyday-work) — *kept (try_it_live, capstone-relevant) over `inbox-triage`*
10. `summarizing-long-documents` (everyday-work)

Changes vs. today: **+** what-ai-cannot-do, the-iteration-loop, **is-this-safe-to-paste**; **−** calendar-audits, the-slack-summary-rule, writing-better-briefs, the-5-minute-meeting-debrief, **and `inbox-triage-auto-drafting-responses`** (it overlaps `drafting-professional-emails` — both are "process an email"; one is enough in a 10-lesson cert). The five existing pinned fundamentals are **retained** (now spanning Foundations + First Steps).

> **⚠ Safety gap (D2) — the reason for the swap.** The originally-curated 10 had **zero safety content**: all mental-model + prompting + applied writing. A "Beginner AI Practitioner" credential that never teaches *what's unsafe to paste into a public AI tool* is incomplete — and **worse than incomplete because the Healthcare cert inherits this base via `base_cert_id`**, where pasting PHI is a live HIPAA problem. The cert must teach paste-safety in its base block.
>
> **Curriculum-revision side note (flows into the curriculum spec):** a beginner "is this safe to paste?" lesson belongs in **First Steps**, not buried in Working Well — "what's safe to paste" is **day-one** knowledge, not growing-tier. Leave the **deeper** policy / shadow-AI / "is this a fireable offense" content in Working Well; pull the basic paste-safety lesson down to First Steps so the beginner spine (and this cert) can carry it. Slug `is-this-safe-to-paste` is proposed/⚠ pending that revision.

**Healthcare AI Practitioner — proposed 9 (base → beginner cert):**
- Keep the base-cert relationship (inherits the beginner spine — **including the new paste-safety lesson, which matters most here**).
- Healthcare block (4–6 lessons): `ai-assisted-patient-handoffs-the-sbar-method`, `turn-rough-encounter-notes-into-clean-documentation`, `explain-it-in-plain-language-patient-communication`, `the-accuracy-and-privacy-guardrail-for-clinical-ai`, optionally `+ protect-clinical-judgment` ⚠ and `+ keep-human-connection-in-care` ⚠ (the 2 net-new healthcare lessons).
- **Tiering resolved (D3):** tier the clinical lessons by their **real AI difficulty** (mostly beginner/growing; the privacy guardrail may be confident) — **no cert-level/lesson-tier decoupling.** The cert stays an accessible practitioner credential at `level=beginner`. *This fix flows back into the curriculum-spec revision.*

**Legal AI Practitioner — CREATE, do not feature (D4).** 6 legal lessons are live (`ai-in-legal-work-limits`, `contract-summaries-with-ai`, `legal-research-first-passes`, `client-communication-legal`, `document-review-prep`, `confidentiality-and-ai-legal`) with no cert. Stand up `legal-ai-practitioner` (base → beginner, industry=legal, mirroring healthcare) — it's nearly free since the lessons exist. **But it is NOT a launch peer of Beginner.** Beginner AI Practitioner is the flagship we validate first; Healthcare and Legal are segments created cheaply and **held in reserve**, not optimized or featured before a single sale. Creating ≠ featuring. Pricing default 4900 to match; pin ~all 6 legal lessons atop the beginner base block.

**Output is the target mapping above — no SQL.** Re-pinning = rewrite each cert's `cert_lessons` rows to the approved slug set (after curriculum slugs finalize).

---

## Section 3 — Mastery Check Plan

### 3.1 Audit — current checks + how they resolve

`user_mastered_lessons(p_user)` and `submit_mastery_check` resolve a passed check **dynamically** (`20260529120000_gamification_schema.sql:452-477`, `:699-701`):
- `module` scope → **all currently-published lessons in that module_id**
- `level` scope → **all currently-published lessons at that level**
- `lesson` scope → that one lesson

**Critical implication:** module/level checks **auto-track composition** — when a lesson moves modules, the resolver self-heals (no dangling lesson refs, no migration needed for the *mapping*). The risk is **not** broken references; it is **question relevance**: each check's 8 seeded questions were authored against the module's *old* content.

Checks: `foundations`, `everyday-work`, `creation`, `business-workflows`, `industry-deep-dives`, `building-with-ai` (module) + `beginner-level-check` (level). All 8q / 0.8.

### 3.2 New module checks needed

Three new modules have no check. Add (8 questions, 0.8 threshold, following the existing seed pattern):
1. **`first-steps-module-check`** — module scope → first-steps module.
2. **`working-well-with-ai-module-check`** — module scope → working-well-with-ai module.
3. **`responsibility-and-judgment-module-check`** — module scope → responsibility-and-judgment module.

> **Dependency flag:** a module check can only be authored once that module's **lessons exist and are published** (questions must sample real lesson content). These three are **blocked on content build** of their modules.

### 3.3 Existing checks needing question revision (composition shifted)

| check | why it needs revision |
|---|---|
| **`foundations-module-check`** | Foundations **loses** framing-technique, briefs, set-up-once, iteration-loop → First Steps, and **gains** ~9 net-new mental-model lessons (you're-not-behind, what-AI-is, memory, etc.). Its current questions likely test prompting mechanics that **left the module**. **Re-author** to test the new Foundations (mental models / orientation), not prompting mechanics. |
| **`industry-deep-dives-module-check`** | Module is **gutted**: the 5 generic lessons (PM, marketing, design, ops, finance) move to the roadmap appendix; module becomes **Health + Legal only, confident tier**, plus 2 net-new healthcare lessons. Questions authored against generic content are now off-module. **Re-author** around Health + Legal. |
| **`building-with-ai-module-check`** | Absorbs the prompt-chaining MERGE and DEEPENs autonomous-workday + ai-toolkit. Lower risk (same module, similar topics), but **review** so questions still map to surviving/merged lessons. |
| `everyday-work`, `creation`, `business-workflows` checks | Mostly KEEP + additive net-new lessons; existing questions stay valid. **No re-author required**, optional top-up if you want coverage of the new lessons. |

### 3.4 Level check scope under the new beginner band

`beginner-level-check` (level scope) on pass marks **every published beginner lesson** mastered. Today that's largely Foundations (+ beginner lessons in Everyday Work and the beginner-tiered Industry lessons). After the restructure the beginner band = **Foundations + First Steps + beginner Everyday-Work** (Industry shifts to confident, removing it from the beginner level set).

- **Resolver scope is already correct/dynamic** — no schema change needed; "test out of beginner" will automatically include First Steps once those lessons are published as `beginner`.
- **But the 8 questions must be re-balanced.** They were authored when beginner ≈ Foundations. Now beginner spans two foundational modules (orientation + first prompts). **Recommendation: keep level scope = `beginner` (unchanged), re-author the 8 questions to sample BOTH Foundations (mental models) and First Steps (first-prompts mechanics)**, since passing tests out of both. Do **not** narrow it to Foundations-only; that would let a learner skip First Steps content they never demonstrated.

**Plan only — no questions written, no migrations.** Net mastery work: **+3 new module checks**, **re-author 2** (`foundations`, `industry-deep-dives`) **+ the level check**, **review 1** (`building-with-ai`).

### 3.5 Related coupling flagged (gamification badges — adjacent to mastery)

Two seeded badges (`20260529120001_seed_gamification.sql`) are module-structure-coupled:
- **`foundations-cleared`** (`module_completed`, `{"module_slug":"foundations"}`) — still resolves, but now means a **smaller/different** Foundations. No equivalent badge exists for First Steps. Consider whether the "you have the base" framing still fits, and whether First Steps deserves its own badge.
- **`polymath`** (`lessons_in_distinct_modules`, `{"count":6}`, copy says "all six modules") — with **9** modules, count=6 is no longer "all modules" and the description is **stale**. Decide: bump to 9 (true "all modules") or keep 6 as a "breadth" badge and fix the wording.

These are out of the three named systems but are a direct consequence of the restructure — surfaced for awareness, not silently changed.

---

## Section 4 — Decisions (RESOLVED by Omar)

All seven decided. Recorded here as the binding calls for the build.

**D1 — Confident-user skip = the beginner onboarding band. ✅ APPROVED / LOCKED.**
Generalize the hardcoded `FOUNDATIONS_MODULE` into a `CORE_MODULES` / **beginner onboarding band** = `{foundations, first-steps}`, and gate the skip on the learner's **`skill_level`** (confident ⇒ skip the whole band), **not** on enumerating module slugs. Future onboarding modules join the band by membership, not by patching a skip list. (See §1.2-C.)

**D2 — Beginner cert composition + safety lesson. ✅ APPROVED (structure) WITH SWAP.**
Approve the curated 10, but the all-writing/no-safety gap is real and dangerous (the Healthcare cert inherits this base, where pasting PHI is a live HIPAA problem). **Drop `inbox-triage-auto-drafting-responses`** (overlaps `drafting-professional-emails`) and **add a beginner `is-this-safe-to-paste` lesson.** Final slugs re-checked after the curriculum spec settles. *Side note routed to the curriculum revision: the basic paste-safety lesson belongs in **First Steps** (day-one knowledge), not Working Well — Working Well keeps the deeper policy/shadow-AI content.* (See §2.3.)

**D3 — Healthcare tiering: fix the tiering, do NOT decouple. ✅ DECIDED (overrides prior recommendation).**
Don't invent a two-axis "cert level ≠ lesson tier" system to paper over a tiering error. The clinical lessons are **beginner-to-growing AI tasks applied to a specialized domain** — tier them by their real AI difficulty (mostly beginner/growing; the privacy guardrail maybe confident). The cert is then naturally an accessible practitioner credential, no decoupling, matching the locked entry-cert positioning. *Flows into the curriculum-spec revision.* (See §2.2 #2, §2.3.)

**D4 — Legal cert: create, do not feature. ✅ APPROVED (create only).**
Stand up `legal-ai-practitioner` (base → beginner, industry=legal, price 4900) — nearly free, lessons exist. **It is not a launch peer of Beginner.** Beginner AI Practitioner is the flagship validated first; Healthcare and Legal are cheap reserve segments, not featured or optimized before the first sale. Creating ≠ featuring. (See §2.3.)

**D5 — Certs may pin First Steps lessons. ✅ APPROVED.**
The prompting fundamentals moved to First Steps and the cert outcomes promise them, so certs span First Steps. No issue.

**D6 — Badge reconciliation. ✅ APPROVED, DEFERRED.**
Fix `polymath`'s stale "six" wording (now 9 modules; keep it as a breadth badge, not "all modules"); add `first-steps-cleared` to mirror `foundations-cleared`. Low priority — rides along with content; don't spend time now.

**D7 — New module slugs. ✅ APPROVED / LOCKED NOW.**
`first-steps`, `working-well-with-ai`, `responsibility-and-judgment` (kebab-case). These become load-bearing the moment rules_v1 weights and mastery checks key off them — this **is** the "lock slugs first" build-order step. No slug changes after this lock.

---

## Section 5 — Build-Order Dependencies

What must be true **before** content build / launch, so we don't ship a broken recommender or scrambled certs. Ordered.

> **Launch-minimum (orientation — read this before reading the dependency chain).** The launch target is **not** "build all ~100 lessons + 3 certs + full rules_v1 + all mastery checks, then launch." The shippable minimum is much smaller:
> 1. the **deepened beginner spine** — Foundations + First Steps (incl. the D2 paste-safety lesson);
> 2. the **rules_v1 fix** (D1 onboarding-band skip + 9-module weights/order) so paths work;
> 3. **one working cert** — Beginner AI Practitioner.
>
> That's a launchable product. The other ~60 lessons, Healthcare/Legal certs, the 3 new module checks, and the Working/Responsibility modules are **post-launch expansion against real user signal** — not pre-launch gates. Two specs deep in planning, the risk is that "plan the target state" quietly becomes "boil the ocean before launch." It shouldn't. Build the spine, ship the flagship cert, see if anyone pays $49.

1. **Lock module identity first.** Finalize the 9 module **slugs** (D7) and the **module_order** (§1.2-B). Everything downstream keys off these. → *Gate for steps 2, 3, 6, 7.*

2. **rules_v1 code + data (can run in parallel with content authoring once slugs are locked):**
   - Add the 3 new modules to `GOAL_MODULE_WEIGHT` (§1.2-A).
   - Decide + implement D1 (core set: Foundations-only vs. {Foundations, First Steps}).
   - Update `scripts/verify-rules.ts` stale count + add confident-skip invariant if D1=yes.
   - *Does not require lessons to exist yet — only slugs.*

3. **Content build** (the curriculum spec) must **publish** the new-module lessons **before**:
   - authoring the **3 new module checks** (§3.2) — questions need real lessons;
   - **re-pinning certs** to final slugs (§2.3) — pins need final, non-dangling UUIDs;
   - regenerating paths (so new modules appear).

4. **Resolve MERGE mechanics before re-pin/regenerate** (§1.2-D): confirm merged-away lessons (prompt-chaining, competitor-tracking) are deleted-with-content-absorbed, and that **no cert or path points at a deleted UUID**. (Currently no cert does; re-verify after spec finalizes.)

5. **Mastery re-authoring after content settles:** re-author `foundations-module-check`, `industry-deep-dives-module-check`, and `beginner-level-check`; review `building-with-ai-module-check` (§3.3–3.4). Blocked on final module composition.

6. **Cert re-pinning after D2/D3/D4 approved** and curriculum slugs final: rewrite `cert_lessons` for beginner + healthcare; create legal cert if approved.

7. **Last: regenerate the ~2 active user paths** (`generateUserPath`) once code (step 2), module_order, and content (step 3) are live — so learners get a path over the full 9-module structure. Pre-launch + zero certs awarded → safe, no migration.

**Hard ordering:** 1 → (2 ∥ 3) → 4 → 5 → 6 → 7. Steps 5, 6, 7 are all **downstream of content publish**; step 2 is the only piece that can proceed immediately after slugs lock.

---

## Definition of Done — self-check

| DOD item | status |
|---|---|
| rules_v1 audited; every module reference + assumption documented | ✅ PASS (§1.1, 10-row table) |
| rules_v1 9-module change plan written, with proposed weight table | ✅ PASS (§1.2-A) |
| certs + cert_lessons dumped; current composition documented | ✅ PASS (§2.1) |
| cert breakage identified (moved/merged/reclassified lessons) | ✅ PASS (§2.2) |
| per-cert target composition recommended (curated subsets) | ✅ PASS (§2.3, beginner/healthcare/legal) |
| mastery_checks dumped; new checks + revisions identified | ✅ PASS (§3.1–3.4) |
| "Decisions needed" section with clear questions + recommendations | ✅ PASS (§4, D1–D7) |
| build-order dependencies listed | ✅ PASS (§5) |
| nothing written to DB; no code/lesson/migration files; only spec file | ✅ PASS (read-only queries; only this file written) |
| file saved at docs/systems-reconciliation.md | ✅ PASS |

**Live-state discrepancies reported (not silently adapted):** (1) only **2** certs exist and **no legal cert** despite 6 legal lessons; (2) both certs pin the **same 5 Foundations lessons**, 3 of which are RECLASSIFY targets; (3) `scripts/verify-rules.ts` carries a **stale expected count of 30** (live is 62); (4) two gamification **badges** (`foundations-cleared`, `polymath`) are module-structure-coupled and were flagged though outside the three named systems.
