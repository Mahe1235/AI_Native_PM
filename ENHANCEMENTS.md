# Architecture Enhancements

Findings from a code review of the AI-Native PM Next.js project. Organized by priority.

---

## ~~HIGH — Data Redundancy~~ RESOLVED

### ~~Duplicate module metadata (single source of truth problem)~~

All 8 `meta.json` files have been deleted. `content/modules.json` is the single source of truth.

---

## HIGH — UI Bugs

### ModuleNav (prev/next) is completely hidden on every module page

The React `<ModuleNav>` component (`src/components/module/ModuleNav.tsx`) renders `<nav className="mnav">`, but `globals.css:236` has a global rule:

```css
.mnav { display: none !important; }
```

This was intended to hide the duplicate `.mnav` inside content HTML, but it is **too broad** — it also hides the React component, which lives outside `.module-content` in `[slug]/page.tsx:59`.

The scoped rule already in `[slug]/page.tsx` (`.module-content .mnav { display: none !important; }`) handles the content HTML duplicate correctly. The global rule is the one causing the bug.

**Impact:** Users have no bottom prev/next navigation on any module page. The only way to move between modules is via the sidebar (desktop) or the top nav dropdown.

**Fix:** In `globals.css:236`, change `.mnav { display: none !important; }` to `.module-content .mnav { display: none !important; }` — or simply remove the line, since the scoped rule in `[slug]/page.tsx` already covers it.

### Breadcrumb links are dead (`href="#"`) on all 8 modules

Every `content.html` has a breadcrumb (`.bc`) where both links point to `href="#"`:
- "The AI-Native PM" → should link to `/`
- "Tier X: ..." → should link to `/modules`

These links are visible and clickable but navigate nowhere. Confirmed across all 8 modules.

**Fix:** Either replace `href="#"` with actual routes in the 8 `content.html` files, or hide the content HTML breadcrumb via CSS and render a React breadcrumb component with working `<Link>` elements.

---

## HIGH — Redundant Information on Module Pages (Desktop)

On desktop, the module detail page shows the **same information in multiple places simultaneously visible above the fold**.

### Module number + tier shown 3 times

1. **Breadcrumb** (`.bc`): "The AI-Native PM → Tier 1 · Foundations → Module 01"
2. **Hero badge** (`.mod-badge`): "MODULE 01 TIER 1 · FOUNDATIONS"
3. **Nav dropdown** highlights the current module by tier

All three are visible at the same time.

**Recommendation:** Remove the hero badge — the breadcrumb already establishes context. Or remove the breadcrumb (its links are dead anyway) and keep just the badge.

### Time estimate + concept count shown twice

1. **Sidebar meta**: "4-5 HOURS", "12 concepts"
2. **Hero meta** (`.hero-meta`): "4-5 HOURS · NO CODE REQUIRED · 12 CONCEPTS"

Only "NO CODE REQUIRED" / "INCLUDES CODE" / "BUILDER TRACK GOES DEEPEST" is unique to the hero meta. Time and concept count duplicate the sidebar.

**Recommendation:** Remove time and concept count from the hero meta. Keep only the unique distinguishing badge (code required, builder track, etc.).

### Two footers stacked at page bottom

1. **Content HTML footer**: "The AI-Native PM · Module 01 of 08 · Updated April 2026" (inside each `content.html`)
2. **React Footer component**: "The AI-Native PM · 8 modules · Built for product managers"

Both are visible, stacked directly on top of each other on every module page.

**Fix:** Strip the `<footer>` from all 8 `content.html` files. Optionally fold the unique "Module X of 08 · Updated April 2026" info into the React Footer.

---

## MEDIUM — Missing Hover States on CTA Buttons

The primary and secondary CTA buttons on the homepage have `transition` set in inline styles but **no `:hover` pseudo-class rules**. No visual feedback on hover.

**Affected elements:**
- Homepage hero: "Start Module 01 →" (primary gold button)
- Homepage hero: "View All Modules" (secondary outline button)
- Homepage bottom CTA: "Start Module 01: How LLMs Actually Work →" (gold button)

Module cards (`.tier-module-card`, `.module-card`) have working hover states, so the missing CTA hover is inconsistent.

**Fix:** Add hover rules — e.g., `opacity: 0.9` for gold buttons, `background: var(--surface-raised)` for the outline button.

---

## MEDIUM — Dead Code

### Unused access/payment components

Three components in `src/components/access/` are never imported or rendered anywhere:

| File | Purpose | Status |
|------|---------|--------|
| `AccessProvider.tsx` | React context for tier-based access | Hardcoded to free tier, never used |
| `ContentGate.tsx` | Conditional renderer for gated content | Never imported |
| `PaywallCTA.tsx` | Upgrade prompt with payment button | Button has no onClick handler, never imported |

**Fix:** Delete `src/components/access/` entirely. Resurrect from git history when payment integration is ready. Keeping dead code signals to future contributors that these components are active.

### Unused exports in `src/lib/modules.ts`

`getTierColor(tier)` and `getTierName(tier)` are exported but never called anywhere. Meanwhile, the same mappings are hardcoded in 5 separate files (see next section).

---

## ~~MEDIUM — TIER_COLORS hardcoded in 5 places~~ RESOLVED

This was fixed in commit `728623a`. Tier metadata is now centralized in `src/lib/tier.ts` with `TIERS`, `TIER_COLORS_BY_NAME`, `TIER_DIMS_BY_NAME`, and `getTierNumbers()`. All page/component files import from `tier.ts`.

---

## MEDIUM — Heavy inline styles on pages

`src/app/page.tsx` (491 lines) and `src/app/modules/page.tsx` (241 lines) have ~100+ inline `style={{}}` objects. This makes the JSX hard to read, impossible to search by class name, and bypasses CSS caching.

**Example (page.tsx lines 31-51):** The hero section alone has 20+ inline style objects for layout, typography, and colors that could be CSS classes.

**Fix:** Extract page-level styles into `globals.css` or a co-located CSS module. Use semantic class names (`.home-hero`, `.home-tier-card`, `.modules-grid-card`) that match the existing pattern in globals.css.

---

## MEDIUM — Large components with mixed concerns

### Nav.tsx (343 lines)

Handles desktop tier dropdown, mobile hamburger menu, route-change cleanup, click-outside detection, and all styling — all in one component.

**Fix:** Split into:
- `DesktopNav.tsx` — tier dropdowns and module links
- `MobileNav.tsx` — hamburger menu with expandable tier sections
- `useClickOutside.ts` hook — reusable click-outside logic

### Sidebar.tsx (322 lines)

Handles scrollspy, missing section detection, desktop sticky sidebar, mobile dropdown, prev/next links, and concept rendering.

**Fix:** Split into:
- `useScrollSpy.ts` hook — scroll-based active section tracking (reusable)
- `ConceptList.tsx` — renders the concept items with active/missing states
- `MobileSidebar.tsx` — sticky dropdown variant for mobile

---

## ~~MEDIUM — Module 05 missing content (was 14 topics, now 12)~~ PARTIALLY RESOLVED

**Resolved (May 2026, Wave 1):** Module 05 is back to **14 concepts**. Two new concepts were added via the curriculum enhancement plan:
- **C13 — Managed Agents:** Infrastructure tax framing, brain/hands separation, Notion/Asana/Sentry production deployments, May 2026 orchestration/Outcomes/Dreaming capability layer, when-to-use decision table.
- **C14 — The Advisor Strategy:** Executor/advisor pattern, Anthropic benchmark numbers (Haiku + Opus = 2× quality at 85% cheaper than Sonnet solo), fit/not-fit table, escalation trigger as the core design decision.

**Still open:** The four topics from the original build plan remain unaddressed. These were a different set of gaps than what Wave 1 filled.

| Old Topic | Status | What's still missing |
|-----------|--------|----------------------|
| **Computer Use** | ❌ Not covered | Claude navigating apps, filling forms, taking screenshots. Distinct interaction model from API tool use. |
| **Indirect Prompt Injection** | ❌ Not covered | In agentic contexts, injected instructions trigger real-world actions — higher stakes than single-turn chat. RAG poisoning in agent knowledge bases. |
| **Claude API Tool Use** | ⚠️ Partial | C4 covers MCP/tool schemas but not full API mechanics: define tools, make tool_use calls, parse results, return tool_result. |
| **The Agent Harness** | ⚠️ Partial | C3 covers ReAct loop but not the full harness pattern: max_iterations ceiling, error handling, trace logger, harness arc M04→M05→M07-08. |

These remain candidates for a future editing pass, separate from the Wave 2/3 curriculum enhancements.

---

## LOW — CSS organization

### globals.css doing too much (255 lines)

Mixes design tokens, base styles, and every shared component class (`.bc`, `.hero`, `.cnav`, `.cp`, `.callout`, `.proj`, `.mnav`, `.nbtn`, etc.) in one file.

**Fix (optional):** Split into:
- `tokens.css` — `:root` variables and tier overrides
- `base.css` — html/body/selection resets
- `components.css` — shared component classes
- Import all from `globals.css`

### Inline `<style>` blocks in pages

`modules/[slug]/page.tsx` has layout CSS in an inline `<style>` tag (`.module-layout`, `.module-main`, responsive breakpoints). This works but is inconsistent with the globals.css pattern.

**Fix:** Move `.module-layout` and `.module-main` styles into `globals.css` alongside other layout classes.

---

## LOW — Content HTML still contains hidden duplicate elements

The duplicate navs (`.cnav` concept pills and `.mnav` prev/next) are hidden via CSS but still present in the HTML content files. They add ~20-40 lines of dead markup per module that gets shipped to the client.

**Fix (when convenient):** Strip `.cnav` and `.mnav` blocks from the 8 `content.html` files. This is a one-time cleanup — no ongoing maintenance cost.

---

## Summary

| # | Issue | Severity | Effort | Impact |
|---|-------|----------|--------|--------|
| 1 | Fix ModuleNav hidden by global `.mnav` CSS | HIGH | 5 min | Restores prev/next navigation on all modules |
| 2 | Fix dead breadcrumb `href="#"` links | HIGH | 15 min | Breadcrumbs become functional navigation |
| 3 | De-duplicate module number/tier (shown 3x) | HIGH | 30 min | Cleaner above-the-fold on module pages |
| 4 | De-duplicate time/concept count (shown 2x) | HIGH | 15 min | Remove redundant sidebar ↔ hero meta |
| 5 | Remove stacked double footer on modules | HIGH | 15 min | Eliminates double-footer at page bottom |
| 6 | ~~Delete redundant meta.json files~~ | ~~HIGH~~ | ~~5 min~~ | RESOLVED — already deleted |
| 7 | Add hover states to homepage CTA buttons | MEDIUM | 10 min | Consistent interactive feedback |
| 8 | Delete unused access components | MEDIUM | 5 min | Removes dead code confusion |
| 9 | ~~Centralize TIER_COLORS into `tier.ts`~~ | ~~MEDIUM~~ | ~~15 min~~ | RESOLVED in `728623a` |
| 10 | ~~Module 05 missing content (was 12 concepts)~~ → 14 concepts restored (Wave 1), 4 original topics still open | MEDIUM | — | See detail above |
| 11 | Extract inline styles to CSS | MEDIUM | 1-2 hr | Cleaner JSX, cacheable styles |
| 12 | Split Nav + Sidebar components | MEDIUM | 1-2 hr | Easier to test and maintain |
| 13 | Strip hidden `.cnav`/`.mnav` from content HTML | LOW | 15 min | Smaller payload, less dead DOM |
| 14 | Split globals.css | LOW | 30 min | Better organization |
