# Manus Prompt — Lumio Landing Page Transformation Brief

> Paste this entire document into Manus (or any AI website builder) as a single
> brief. It bakes in the findings from a 10-reviewer audit so the output
> isn't generic AI-template landing page.

---

## The product

**Lumio** is a 5-minute daily AI literacy course delivered by email + a web app, for
knowledge workers (PMs, marketers, ops, designers, founders, ICs) who feel quietly
behind on AI. The product ships one short lesson per workday — 30 lessons total
across 6 modules.

**Live product**: <https://lumio-ai-learning-pl-fdup.bolt.host/signup>
**Stack**: React + Vite + Tailwind v4 + Framer Motion 12 + Supabase. Hosting on Vercel.
**Built by**: one solo founder, pre-revenue, pre-launch.

## The audience (real psychographic, not "professionals")

A 30–45-year-old knowledge worker who:

- Sits next to a coworker who casually uses ChatGPT in meetings and pretends to know what they mean.
- Has tried "10 amazing prompts" lists and a YouTube video. Forgot all of it by Friday.
- Doesn't want a CS course. Wants to write better emails, summarize meetings, and look less behind.
- Won't pay for a "course platform." Will subscribe to a daily email habit.
- Is allergic to: emoji, gamification mascots, fake testimonials, generic SaaS-template aesthetics.

## The single sharpest line on the page

> *"While you're Googling 'best ChatGPT prompts,' the person next to you just automated their entire Monday."*

Italicize "*the person next to you*" — that's the threat, not the brag.

## What's been audited and converged on

10 independent design reviewers (UI/UX Pro Max, Naval, Rubin, Hormozi, design-taste-frontend, high-end-visual-design, impeccable, design-motion-principles, copywriting, LLM Council) all reviewed the v1 page. They converge on:

### What MUST be killed (do NOT include any of these)

- ❌ Fake testimonials. (No "Sarah K., PM said…" unless you have a real Sarah K.)
- ❌ Avatar clusters with fake colored initials (S/M/P/K/A). They scream "no users."
- ❌ Symmetric 3-column "How it works" with numbered orange circles. Notion template.
- ❌ 6-card module grid with pastel colored icon squares. Coursera/Udemy template.
- ❌ Pastel "Beginner/Intermediate/Advanced" pills. Bootcamp signal.
- ❌ Generic "+50 XP" gamification badges or progress bars. Treats adults like children.
- ❌ Blurred amber/gradient blob backgrounds on the final CTA. AI-slop signal #1.
- ❌ Hover-lift `whileHover={{ y: -4 }}` on every card. Becomes noise.
- ❌ `transition-all duration-300` with implicit `ease-in-out`. Animates layout, no intent.
- ❌ Single shadow stack repeated on every card. `shadow-[0_4px_20px_rgb(28,25,23,0.04)]`.
- ❌ Centered `max-w-2xl mx-auto` stack of identical h2 + grid + button sections.
- ❌ Emojis used as icons (🌱💼🎨⚙️🏭🚀). Lucide or custom only.
- ❌ Em dashes anywhere on the page. Founder rule.
- ❌ Boilerplate indie-hacker line "Built by one person. Pre-launch. You'd be among the first hundred." It's been written by every solo founder. Use a real number or burn it.

### What MUST be kept

- ✅ Editorial-warm color foundation: warm off-white background, warm charcoal ink, single amber CTA, surgical forest green for "with Lumio" / success states.
- ✅ Type pairing: Fraunces (serif, variable opsz/wght/SOFT axes) + DM Sans (sans).
- ✅ The interactive PromptRunner — visitor pastes a real prompt, Groq-powered rewrite comes back in ~1s. **This is the page's most unique asset. Promote it. Make it the page's headline proof.**
- ✅ The honest founder voice: "Reply and tell me what's confusing. I'll rewrite the lesson and send it back to you. / Omar, building this solo."
- ✅ Risk reversal: "Free. No credit card. One lesson a day. Skip any one, unsubscribe in one click."

## The design direction (consensus from 4-of-5 design reviewers)

**Editorial daily dispatch.** Lumio is a *publication*, not a course. The page reads like a New Yorker / NYT Magazine feature about catching up on AI, with the live PromptRunner as the headline demo. Reference set: **Are.na, Read.cv, Pitchfork Reviews, Aesop product pages, Cron's old microsite, NYT Cooking, Stripe's docs**. Anti-references: Coursera, Udemy, Webflow templates, Substack 2024 cream-and-amber, Vercel-clone gradient hero blobs.

### Brand tokens (use these exact values)

```css
/* Paper + ink (warm) */
--bg-paper:    #F1EEE6;   /* newsprint background */
--bg-paper-hi: #FAF7F0;   /* card header strips */
--ink:         #0E0D0B;   /* true black ink */
--ink-warm:    #3D2C1E;   /* espresso — warm headline ink */
--ink-body:    #52443A;   /* umber — passes WCAG on cream */

/* One signal orange (NOT #F97316 which fails WCAG) */
--orange:      #E85D04;
--orange-paper:#F7D9B5;   /* amber tint for soft highlights */

/* Surgical green — live state dot only, "with Lumio" indicator */
--forest:      #0B3D2E;

/* Hairline (use as box-shadow inset, not border) */
--hairline:    0 0 0 1px rgba(14, 13, 11, 0.08);
```

**Banned**: pure black (#000), pure neutral grey (#6B7280), red anywhere, blue anywhere, generic teal anywhere, more than one orange tint.

### Typography rules

1. **Fraunces is used surgically**, not as the default headline.
   - Hero H1 only: `opsz 144, wght 420, SOFT 30, tracking -0.028em`. Light Fraunces is editorial. Semibold Fraunces is AI-default — banned.
   - Section H2: `opsz 144, wght 380, leading 1.0`. Italic emphasis allowed once per section.
   - Italic phrase in the H1 ("the person next to you"): `opsz 144, wght 360`, colored in `--orange`.
2. **DM Sans is the workhorse body face**. `text-[15px], leading-1.55, tracking -0.005em`.
3. **JetBrains Mono is the third voice** — date stamps, terminal blocks, lesson numbers, marginalia. Never for body. `text-[10–14px], uppercase, tracking 0.22em` for eyebrows.
4. **No more than 3 eyebrows on the page**. Current site has 7+. Cap is 3.
5. **One serif used surgically** > Fraunces on every headline.

### Layout system

- **Asymmetric 12-col grid**, `max-w-[1440px]` outer container, content lives in cols 3-10, marginalia (date stamps, page numbers, lesson counts) lives in cols 11-12 in mono.
- **Reading column max-width: 760px**. The page is meant to be *read*.
- **No `text-center max-w-2xl mx-auto` on every section.** Vary layout per section.
- **Vertical rhythm**: `py-32 md:py-48` between sections (more breathing room than typical SaaS).
- **No two adjacent sections share a layout pattern.** Hero asymmetric. Demo dark band. Curriculum table. Final CTA architectural typography. Each one a different visual move.

### Shadows + surfaces

- **Multi-layer warm shadows** with amber-tinted bottom:
  ```css
  box-shadow:
    0 1px 0 rgba(255,255,255,0.9) inset,    /* top highlight */
    0 1px 2px rgba(60,44,30,0.04),          /* contact */
    0 8px 24px -12px rgba(60,44,30,0.08),   /* near */
    0 24px 48px -24px rgba(212,90,26,0.10); /* warm distant */
  ```
- **Hairlines instead of borders**: `box-shadow: 0 0 0 1px rgba(14,13,11,0.06) + inset 0 1px 0 rgba(255,255,255,0.8)`. Borders look CSS-y; layered hairlines look milled.
- **A 4% SVG film-grain overlay** on the body, fixed, `mix-blend-overlay`. The single biggest "made by a human" upgrade in one CSS rule.

## The required sections (in this order, with this treatment)

### 1. Masthead (fixed nav)

A real newspaper-style masthead, not a generic nav:

> `LUMIO · Vol. I · No. 047 · TUE 27 MAY 2026 · ● 1,284 inboxes`

The date is live (today's date). The dispatch number = days since launch. The subscriber count ticks up slowly (anchor to a Supabase count from the `waitlist_signups` table + a base offset). On the right: a single underlined "Subscribe" link in espresso ink with amber underline.

Reframes Lumio from "another AI course" to "a daily publication you subscribe to."

### 2. Hero

- **Eyebrow** (mono, uppercase, tracking 0.22em): `THE DISPATCH`
- **H1**: the headline above (with italic on "the person next to you" warmed to orange). Use a **word-by-word mask reveal** with 40ms stagger and 820ms duration; the italic phrase delays last.
- **Subhead** (max-w-560px): "Catch up in 5 minutes a day. 30 lessons, one per workday. By lesson 10 you'll save an hour a week. By lesson 30 you'll be the person your team asks."
- **CTAs**: ONE primary "Try Lesson 1, free" (dark `#0E0D0B` bg, paper text, no rounded-full — square corners or barely rounded). ONE soft text-link underneath: "or see the full curriculum →".
- **Below a hairline divider**: a single email input + button form, with: "Or get Lesson 1 in your inbox: *When to use ChatGPT vs. Google.*" Plus the founder voice: "Reply and tell me what's confusing. I'll rewrite the lesson and send it back. / Omar, building this solo."

### 3. Live Prompt Runner ⭐ (the proof — promote to high-priority)

This is the page's hero proof. Render in a **dark `#0E0D0B` band** stretching edge-to-edge so it reads as "the terminal moment of the page." No card chrome, no border. The textarea is the headline.

- Eyebrow (mono): `LESSON 04 · LIVE · RUNNING ON GROQ / LLAMA 3.3 70B`
- A blinking amber cursor in the textarea when empty
- Example chips below in mono: `TRY: write me a quarterly review email | summarize this meeting transcript | help me with my onboarding deck`
- On submit: prompt sends to `${SUPABASE_URL}/functions/v1/prompt-runner` which returns `{improved_prompt, why_better}`
- On result: 12-col grid, your prompt on the left (strike-through styling, faded), Lumio rewrite on the right (full opacity), why-better italic line below. Single CTA: "Get all 30 lessons →" in orange.

### 4. The curriculum index (replaces a 6-card module grid)

A **typographic table-of-contents**. 30 lessons in 6 modules. Each row:

```
01    When to use ChatGPT vs. Google             5 min    BEG
02    Reading a model's hallucination            5 min    BEG
03    The 3-step framing technique               7 min    BEG
...
```

Mono lesson number left, Fraunces title middle, mono minutes + level right. Module titles in Fraunces italic (`I. Foundations`, `II. Everyday work`, etc). Use hairlines between rows. **This replaces the colored-icon-square card grid completely.** The TOC IS the proof of depth.

### 5. Final CTA

- Background `#F1EEE6` paper.
- An **oversized Fraunces italic "5"** (clamp 280px to 580px) bleeding off the right edge of the screen, in `#F7D9B5` at 45% opacity. Architectural typography, not gradient blobs.
- Single H2 left-aligned in espresso: "Five minutes a day. *Three Mondays from now* you're the one being asked." Italic on "Three Mondays from now" in orange.
- One CTA: dark filled button: "Start tomorrow morning →"

### 6. Footer

Two-column footer in mono, all uppercase, tracking 0.22em:

> Left: `LUMIO. A daily dispatch on AI for knowledge workers.`
> Right: `© 2026`

That's it. No social icons. No "links" list. Less is the move.

## Motion system

Don't reach for the Framer Motion defaults. Use this token system:

```ts
export const ease = {
  ink:    [0.22, 1, 0.36, 1],    // serif text reveals
  glass:  [0.32, 0.72, 0, 1],    // card / surface entrances
  haptic: [0.4, 0, 0.2, 1],      // buttons (snappy)
  inOut:  [0.65, 0, 0.35, 1],    // bidirectional swaps
};
export const dur = {
  micro: 0.12, fast: 0.22, base: 0.34, beat: 0.56, narrative: 0.82,
};
export const stagger = { tight: 0.04, base: 0.06, loose: 0.12 };
```

### 3 signature motion moments (all other motion should be invisible)

1. **Hero word-mask reveal** — each word fades + un-blurs in sequence, 40ms apart. The italic phrase "the person next to you" delays last and color-warms to orange.
2. **PromptRunner rewrite scrub** — when the user hits submit, their prompt visibly strikes through phrase-by-phrase as the rewrite reveals via clip-path wipe from the left.
3. **Curriculum row hover** — only the row's mono number subtly slides 4px right on hover, nothing else moves. Restraint.

### Motion to NOT include

- No `whileHover={{ y: -4 }}` on cards. Period.
- No `staggerChildren` on every section. Stagger is theatre when it's everywhere.
- No `transition-all`. Use specific properties only.
- No bounce, no spring physics, no scale-pop badges. This is editorial, not Duolingo.

### Reduced motion

Respect `prefers-reduced-motion: reduce`. All transforms collapse to instant opacity 0→1 in ≤10ms. The breathing variable-Fraunces (if used) disables to a single static state. Hover micro-motions (sub-200ms, user-initiated) stay.

## Backend wiring

The Supabase project is already provisioned. You have:

- `https://gqdazzlqayejqatwxhlz.supabase.co` (env: `VITE_SUPABASE_URL`)
- Anon key in env: `VITE_SUPABASE_ANON_KEY`
- Existing tables: `profiles`, `modules`, `lessons` (30 of them in `lessons` with full `sections` JSONB), `user_progress`, `achievements`, `friendships`
- New tables to create if not yet present:
  - `waitlist_signups (id, email, source, ip_hash, user_agent, created_at)` — anon insert via RLS
  - `prompt_runner_logs (id, ip_hash, user_prompt, improved_prompt, why_better, model, tokens_in, tokens_out, duration_ms, status, error_message, created_at)` — written by Edge Function only
- Edge Function to create: `prompt-runner` — calls Groq's free tier (Llama 3.3 70B), rate limits to 5/hour and 20/day per IP, runs jailbreak filter, returns `{improved_prompt, why_better}` JSON

Wire the hero email form to insert into `waitlist_signups`. Wire the interactive PromptRunner to POST to `${SUPABASE_URL}/functions/v1/prompt-runner`.

## What "done" looks like

- Zero of the killed patterns above present
- All required sections present in the required treatment
- Hero word-reveal animation works smoothly
- PromptRunner makes a real Groq call and shows a real rewrite
- Email capture writes to Supabase and shows the "tomorrow morning, Lesson 1 lands" success state
- Page passes WCAG AA on every text/background pair
- Page works at 375px (mobile), 768px (tablet), 1440px (desktop)
- `prefers-reduced-motion: reduce` is respected
- No em dashes anywhere on the page (founder rule)
- Total weight under 200KB JS gzipped, page loads in under 2s on Fast 3G
- The page should NOT feel like an AI-generated landing page. A designer at Pentagram or Collins or &Walsh, glancing at it, should think "interesting."

## One bonus radical move (optional but encouraged)

The hero H1 uses Fraunces with animated variable-font axes — `opsz` 144→120→144, `SOFT` 30→100→30, `wght` 420→380→420 over a 6-second loop. The headline subtly **breathes**. Imperceptible at first glance, hypnotic by the third second. No landing page on the internet does this. It's the kind of detail that ends up on Sidebar or Typewolf the day it ships.

---

End of brief. Generate the full landing page in one shot. React + TypeScript + Tailwind v4 + Framer Motion 12 + Supabase, ready to deploy to Vercel.
