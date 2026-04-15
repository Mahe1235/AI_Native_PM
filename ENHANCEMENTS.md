# Architecture Enhancements

Findings from a code review of the AI-Native PM Next.js project. Organized by priority.

---

## HIGH — Data Redundancy

### Duplicate module metadata (single source of truth problem)

`content/modules.json` (516 lines) contains **100% identical data** to the 8 individual `content/modules/*/meta.json` files. The app only reads `modules.json` — the individual meta.json files are never imported.

**Risk:** Any metadata change must be made in two places or data will silently diverge.

**Fix:** Delete all 8 `meta.json` files. `modules.json` is the single source of truth. If per-module files are needed later, generate them from `modules.json` at build time — don't maintain both by hand.

**Files to delete:**
- `content/modules/01-how-llms-work/meta.json`
- `content/modules/02-ai-native-mindset/meta.json`
- `content/modules/03-building-your-ai-toolkit/meta.json`
- `content/modules/04-evaluating-your-ai-work/meta.json`
- `content/modules/05-from-skills-to-agents/meta.json`
- `content/modules/06-data-and-feedback-loops/meta.json`
- `content/modules/07-ai-product-thinking/meta.json`
- `content/modules/08-shipping-ai-products/meta.json`

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

## MEDIUM — TIER_COLORS hardcoded in 5 places

The same tier color mapping is copy-pasted into:

- `src/components/layout/Nav.tsx` (lines 8-12)
- `src/components/module/Sidebar.tsx` (lines 7-12)
- `src/app/page.tsx` (lines 4-8)
- `src/app/modules/page.tsx` (lines 10-14)
- `src/components/access/PaywallCTA.tsx` (lines 3-8)

Some files also duplicate `TIER_DIMS` (dim color variants).

**Fix:** Create `src/lib/tier.ts`:

```ts
export const TIER_COLORS: Record<string, string> = {
  blue: "var(--blue)",
  green: "var(--green)",
  orange: "var(--orange)",
  purple: "var(--purple)",
};

export const TIER_DIMS: Record<string, string> = {
  blue: "var(--blue-dim)",
  green: "var(--green-dim)",
  orange: "var(--orange-dim)",
  purple: "var(--purple-dim)",
};
```

Import from this single file everywhere. Remove `getTierColor`/`getTierName` from `modules.ts` or consolidate into `tier.ts`.

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

## MEDIUM — Module 05 missing content (was 14 topics, now 12)

An earlier version of Module 05 "From Skills to Agents" had **14 concepts**. The current version has 12. Four topics from the original were dropped during restructuring and their content was **not merged** into the remaining sections.

### Completely missing (zero mentions in current content)

| Old Topic | Build Plan Reference | What it should cover |
|-----------|---------------------|----------------------|
| **Computer Use** | Line 217, 373 | Claude navigating apps, filling forms, taking screenshots. A distinct interaction model from API tool use — the model controls a visual interface. |
| **Indirect Prompt Injection** | Line 231 | Escalation of Module 01's injection concept: in agentic contexts, an injected instruction can trigger real-world actions (send email, modify data, delete records). Higher stakes than single-turn chat. Should also cover RAG poisoning in agent knowledge bases. |

### Partially covered (concept exists but key content missing)

| Old Topic | Current Location | What's missing |
|-----------|-----------------|----------------|
| **Claude API Tool Use** | C4 "Tools as the Agent's Hands" | Covers MCP/tool schemas but not the full API mechanics: define tools, make tool_use calls, parse results, return tool_result. The hands-on "how it actually works in code" is absent. |
| **The Agent Harness** | C3 "The ReAct Pattern" | Covers the think/act/observe loop but not the full harness pattern from the build plan: max_iterations ceiling, error handling, trace logger, and the harness arc that connects eval harness (M04) → agent harness (M05) → production harness (M07-08). |

### Recommended fix

**Option A — Restore to 14 concepts:** Add Computer Use and Indirect Prompt Injection as new sections (c13, c14). Expand C4 and C3 to cover the missing API mechanics and harness pattern. Update `modules.json`, `content.html`, and the hero meta badge from "12 concepts" to "14 concepts".

**Option B — Fold into existing sections:** Add Computer Use content to C7 "Claude Code" (related builder tool). Add Indirect Prompt Injection to C11 "Agent Safety" (natural home for agentic security risks). Expand C4 and C3 as above. Keep 12 concepts.

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

| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 1 | Delete redundant meta.json files | 5 min | Eliminates data drift risk |
| 2 | Delete unused access components | 5 min | Removes dead code confusion |
| 3 | Centralize TIER_COLORS into `tier.ts` | 15 min | Single source of truth for colors |
| 4 | Module 05 missing content (4 topics) | 2-4 hr | Restores curriculum completeness |
| 5 | Extract inline styles to CSS | 1-2 hr | Cleaner JSX, cacheable styles |
| 6 | Split Nav + Sidebar components | 1-2 hr | Easier to test and maintain |
| 7 | Split globals.css | 30 min | Better organization |
| 8 | Strip hidden HTML from content files | 15 min | Smaller payload |
