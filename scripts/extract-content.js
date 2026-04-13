#!/usr/bin/env node
/**
 * extract-content.js
 * Parses all 8 source HTML modules and generates:
 *   - content/modules/{slug}/content.html  (body content, no CSS/boilerplate)
 *   - content/modules/{slug}/meta.json     (structured metadata + paywall config)
 *   - content/modules.json                  (master index of all modules)
 */

const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, "../source-html");
const CONTENT_DIR = path.join(__dirname, "../content/modules");
const INDEX_FILE = path.join(__dirname, "../content/modules.json");

// Module configuration — maps filename to structured data
const MODULE_CONFIG = [
  {
    file: "module-01-how-llms-work.html",
    slug: "01-how-llms-work",
    number: 1,
    title: "How LLMs Actually Work",
    subtitle: "The mental models that change how you use AI — not ML theory, just what you need to get better results, spot limitations, build safer products, and stop being surprised by the weird stuff.",
    tier: 1,
    tierName: "Foundations",
    color: "blue",
    estimatedTime: "4–5 hours",
    conceptCount: 12,
    codeRequired: false,
    concepts: [
      { id: "tokens", title: "Tokens, Not Words" },
      { id: "context-windows", title: "Context Windows" },
      { id: "temperature", title: "Temperature & Sampling" },
      { id: "few-shot", title: "Few-Shot Learning" },
      { id: "extended-thinking", title: "Extended Thinking", isNew: true },
      { id: "hallucination", title: "Hallucination" },
      { id: "structured-outputs", title: "Structured Outputs" },
      { id: "prompt-caching", title: "Prompt Caching", isNew: true },
      { id: "prompt-injection", title: "Prompt Injection" },
      { id: "knowledge-cutoffs", title: "Knowledge Cutoffs" },
      { id: "model-selection", title: "Model Selection" },
      { id: "four-levers", title: "Four Levers" },
    ],
  },
  {
    file: "module-02-ai-native-mindset.html",
    slug: "02-ai-native-mindset",
    number: 2,
    title: "The AI-Native Mindset",
    subtitle: "How to think about AI as a PM — not as a tool to use occasionally, but as infrastructure to build your work around.",
    tier: 1,
    tierName: "Foundations",
    color: "blue",
    estimatedTime: "3–4 hours",
    conceptCount: 8,
    codeRequired: false,
    concepts: [
      { id: "pm-work-audit", title: "PM Work Audit" },
      { id: "leverage-spectrum", title: "Leverage Spectrum" },
      { id: "ai-native-vs-assisted", title: "AI-Native vs AI-Assisted" },
      { id: "review-over-create", title: "Review Over Create" },
      { id: "where-ai-fails", title: "Where AI Fails" },
      { id: "roi-curve", title: "ROI Curve" },
      { id: "team-adoption", title: "Team Adoption" },
      { id: "audit-to-action", title: "Audit to Action" },
    ],
  },
  {
    file: "module-03-building-your-ai-toolkit.html",
    slug: "03-building-your-ai-toolkit",
    number: 3,
    title: "Building Your AI Toolkit",
    subtitle: "Skills, system prompts, MCP connectors, and the building blocks of a real AI workflow.",
    tier: 2,
    tierName: "Build Your Workflow",
    color: "green",
    estimatedTime: "6–8 hours",
    conceptCount: 12,
    codeRequired: false,
    concepts: [
      { id: "context-engineering", title: "Context Engineering" },
      { id: "system-prompts", title: "System Prompts" },
      { id: "claude-4x-needs", title: "What Claude 4.x Needs", isNew: true },
      { id: "projects-as-skills", title: "Projects as Skills" },
      { id: "mcp-integration", title: "MCP Integration", isNew: true },
      { id: "few-shot-examples", title: "Few-Shot Examples" },
      { id: "mcp-workflows", title: "MCP Workflows", isNew: true },
      { id: "prompt-chaining", title: "Prompt Chaining" },
      { id: "claude-skills", title: "Claude Skills", isNew: true },
      { id: "mcp-apps", title: "MCP Apps", isNew: true },
      { id: "structured-outputs", title: "Structured Outputs" },
      { id: "mcp-product-thinking", title: "MCP Product Thinking", isNew: true },
    ],
  },
  {
    file: "module-04-evaluating-your-ai-work.html",
    slug: "04-evaluating-your-ai-work",
    number: 4,
    title: "Evaluating Your AI Work",
    subtitle: "How to know if your AI outputs are actually good — and build the infrastructure to measure it systematically.",
    tier: 2,
    tierName: "Build Your Workflow",
    color: "green",
    estimatedTime: "5–6 hours",
    conceptCount: 8,
    codeRequired: false,
    concepts: [
      { id: "eval-mindset", title: "The Eval Mindset" },
      { id: "binary-pass-fail", title: "Binary Pass/Fail" },
      { id: "error-analysis", title: "4-Step Error Analysis" },
      { id: "test-dataset", title: "Build Your Test Dataset" },
      { id: "open-coding", title: "Open Coding" },
      { id: "axial-coding", title: "Axial Coding" },
      { id: "fix-re-eval", title: "Fix & Re-Eval" },
      { id: "eval-harness", title: "The Eval Harness" },
    ],
  },
  {
    file: "module-05-from-skills-to-agents.html",
    slug: "05-from-skills-to-agents",
    number: 5,
    title: "From Skills to Agents",
    subtitle: "When a skill isn't enough — how to add tools, chain decisions, and build agents that act in the world.",
    tier: 3,
    tierName: "Scale Your Impact",
    color: "orange",
    estimatedTime: "6–7 hours",
    conceptCount: 14,
    codeRequired: true,
    concepts: [
      { id: "agency-spectrum", title: "The Agency Spectrum" },
      { id: "tools-tool-use", title: "Tools & Tool Use" },
      { id: "react-pattern", title: "The ReAct Pattern" },
      { id: "when-agent-beats-skill", title: "When Agent Beats Skill" },
      { id: "claude-api-tool-use", title: "Claude API Tool Use" },
      { id: "claude-code", title: "Claude Code" },
      { id: "computer-use", title: "Computer Use", isNew: true },
      { id: "hooks", title: "Hooks", isNew: true },
      { id: "agent-harness", title: "The Agent Harness" },
      { id: "agent-teams", title: "Agent Teams", isNew: true },
      { id: "subagents", title: "Subagents", isNew: true },
      { id: "agent-evaluation", title: "Agent Evaluation" },
      { id: "agent-safety", title: "Agent Safety" },
      { id: "indirect-prompt-injection", title: "Indirect Prompt Injection" },
    ],
  },
  {
    file: "module-06-data-and-feedback-loops.html",
    slug: "06-data-and-feedback-loops",
    number: 6,
    title: "Data & Feedback Loops",
    subtitle: "How to build systems that improve over time — prompt versioning, automated logging, and the compounding effect.",
    tier: 3,
    tierName: "Scale Your Impact",
    color: "orange",
    estimatedTime: "3–4 hours",
    conceptCount: 8,
    codeRequired: true,
    concepts: [
      { id: "eval-dataset-as-asset", title: "Eval Dataset as Asset" },
      { id: "prompt-versioning", title: "Prompt Versioning" },
      { id: "skill-splitting", title: "Skill Splitting" },
      { id: "feedback-in-workflow", title: "Building Feedback In" },
      { id: "hooks-logging", title: "Hooks for Automated Logging" },
      { id: "prompt-caching-evals", title: "Prompt Caching for Evals" },
      { id: "context-compaction", title: "Context Compaction" },
      { id: "compounding-effect", title: "The Compounding Effect" },
    ],
  },
  {
    file: "module-07-ai-product-thinking.html",
    slug: "07-ai-product-thinking",
    number: 7,
    title: "AI Product Thinking",
    subtitle: "How to spec, measure, and ship AI features — the product decisions that separate good AI products from great ones.",
    tier: 4,
    tierName: "Lead with AI",
    color: "purple",
    estimatedTime: "5–6 hours",
    conceptCount: 7,
    codeRequired: false,
    concepts: [
      { id: "should-this-use-ai", title: "Should This Feature Use AI?" },
      { id: "ai-ux-patterns", title: "AI UX Patterns" },
      { id: "speccing-nondeterministic", title: "Speccing Non-Deterministic Features" },
      { id: "measuring-ai-features", title: "Measuring AI Features" },
      { id: "build-buy-wrap", title: "Build vs Buy vs Wrap" },
      { id: "mcp-server-strategy", title: "MCP Server Strategy", isNew: true },
      { id: "production-harness", title: "The Production Harness" },
    ],
  },
  {
    file: "module-08-shipping-ai-products.html",
    slug: "08-shipping-ai-products",
    number: 8,
    title: "Shipping AI Products",
    subtitle: "Guardrails, trust, feedback loops, and responsible AI — what it takes to ship AI features that users actually trust.",
    tier: 4,
    tierName: "Lead with AI",
    color: "purple",
    estimatedTime: "5–6 hours",
    conceptCount: 10,
    codeRequired: false,
    concepts: [
      { id: "infinite-edge-cases", title: "Infinite Edge Cases" },
      { id: "guardrails-vs-evaluators", title: "Guardrails vs Evaluators" },
      { id: "building-user-trust", title: "Building User Trust" },
      { id: "feedback-loops-signals", title: "Feedback Loops as Signals" },
      { id: "responsible-ai", title: "Responsible AI as Product Quality" },
      { id: "autonomy-roadmap", title: "Autonomy Roadmap" },
      { id: "data-privacy", title: "Data Retention & Privacy" },
      { id: "launch-strategy", title: "Launch Strategy" },
      { id: "monitoring-observability", title: "Monitoring & Observability" },
      { id: "capstone", title: "Capstone Project" },
    ],
  },
];

function extractBodyContent(html) {
  // Extract content between <body> and </body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) throw new Error("No body tag found");

  let body = bodyMatch[1];

  // Remove outer container div wrapper
  body = body.replace(/^\s*<div class="container">/i, "").replace(/<\/div>\s*$/i, "");

  return body.trim();
}

function extractModuleCss(html) {
  // Extract the <style> block
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return "";

  let css = styleMatch[1];

  // Remove the shared :root variables (already in globals.css)
  css = css.replace(/:root\s*\{[^}]*\}/g, "");

  // Remove shared base styles we've already put in globals.css:
  // * reset, html, body, ::selection, .container, .bc, .hero, .cnav, .cp, .cs, .ct, .ctitle,
  // .csub, h3, h4, p, ul/ol/li, .callout*, .cl, .insight-*, .tw-wrap, table, th, td, tr,
  // pre, code, .utag, .ntag, .proj, .mnav, footer
  // We keep only module-specific visualization CSS

  // Strip :root, * reset, html, body, ::selection, .container
  css = css.replace(/\*\s*\{[^}]*\}/g, "");
  css = css.replace(/html\s*\{[^}]*\}/g, "");
  css = css.replace(/body\s*\{[^}]*\}/g, "");
  css = css.replace(/::selection\s*\{[^}]*\}/g, "");
  css = css.replace(/\.container\s*\{[^}]*\}/g, "");

  // Strip breadcrumb, hero, concept nav, sections, typography, callouts, tables, code, tags, project, nav, footer, media queries
  const sharedSelectors = [
    "\\.bc", "\\.bc a", "\\.bc a:hover", "\\.bc .sep", "\\.bc .cur",
    "\\.hero", "\\.hero::before", "\\.mod-badge", "\\.mod-num", "\\.mod-tier",
    "\\.hero h1", "\\.hero h1 em", "\\.hero-sub", "\\.hero-meta", "\\.hero-mi", "\\.hero-mi .dot",
    "\\.cnav", "\\.cp", "\\.cp:hover", "\\.cp\\.new", "\\.cp\\.new:hover",
    "\\.cs", "\\.ct", "\\.ctitle", "\\.csub",
    "h3", "h4", "p", "p strong,li strong", "p strong", "li strong",
    "ul,ol", "ul", "ol", "li", "li::marker",
    "\\.callout", "\\.callout-insight", "\\.callout-insight .cl", "\\.callout-warning", "\\.callout-warning .cl",
    "\\.callout-tip", "\\.callout-tip .cl", "\\.callout-context", "\\.callout-context .cl",
    "\\.callout-watch", "\\.callout-watch .cl", "\\.callout-security", "\\.callout-security .cl",
    "\\.cl", "\\.callout p:last-child",
    "\\.tw-wrap", "table", "th", "td", "tr:last-child td", "tr:hover td",
    "pre", "code", "pre code",
    "\\.utag", "\\.ntag",
    "\\.proj", "\\.proj::before", "\\.plbl", "\\.proj h4", "\\.proj p", "\\.proj .steps", "\\.proj .steps li",
    "\\.proj .steps li::before", "\\.proj .steps li:last-child", "\\.deliv",
    "\\.mnav", "\\.nbtn", "\\.nbtn:hover", "\\.nbl", "\\.nbt", "\\.nba",
    "footer",
    "@media\\(max-width:640px\\)",
  ];

  // Remove shared class blocks (rough approach — strip blocks matching shared selectors exactly)
  // This is best-effort; any residual duplicates are harmless
  sharedSelectors.forEach((sel) => {
    const re = new RegExp(`${sel}\\s*\\{[^}]*\\}`, "g");
    css = css.replace(re, "");
  });

  // Fix module 07 purple accent override — use data-tier attribute instead
  css = css.replace(/--accent:#A78BFA[^;]*;/g, "");

  return css.trim();
}

function normalizeHtml(html, slug) {
  return html;
}

function processModule(config) {
  const srcFile = path.join(SOURCE_DIR, config.file);

  if (!fs.existsSync(srcFile)) {
    console.warn(`⚠️  Source file not found: ${config.file} — skipping`);
    return null;
  }

  const html = fs.readFileSync(srcFile, "utf-8");
  let bodyContent = extractBodyContent(html);
  bodyContent = normalizeHtml(bodyContent, config.slug);

  // Write content.html
  const moduleDir = path.join(CONTENT_DIR, config.slug);
  fs.mkdirSync(moduleDir, { recursive: true });
  fs.writeFileSync(path.join(moduleDir, "content.html"), bodyContent, "utf-8");

  // Write module-specific CSS (visualizations unique to this module)
  const moduleCss = extractModuleCss(html);
  fs.writeFileSync(path.join(moduleDir, "module.css"), moduleCss, "utf-8");

  // Build meta.json
  const meta = {
    number: config.number,
    slug: config.slug,
    title: config.title,
    subtitle: config.subtitle,
    tier: config.tier,
    tierName: config.tierName,
    color: config.color,
    estimatedTime: config.estimatedTime,
    conceptCount: config.conceptCount,
    codeRequired: config.codeRequired,
    status: "complete",
    concepts: config.concepts,
    access: {
      level: "free",
      previewConcepts: 3,
      gatedFrom: null,
    },
  };

  fs.writeFileSync(
    path.join(moduleDir, "meta.json"),
    JSON.stringify(meta, null, 2),
    "utf-8"
  );

  console.log(`✓ ${config.slug}`);
  return meta;
}

// Run extraction
console.log("Extracting module content...\n");

const metas = MODULE_CONFIG.map(processModule).filter(Boolean);

// Write master index
fs.writeFileSync(
  INDEX_FILE,
  JSON.stringify({ modules: metas }, null, 2),
  "utf-8"
);

console.log(`\n✓ modules.json written with ${metas.length} modules`);
console.log("Done!");
