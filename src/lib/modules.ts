import fs from "fs";
import path from "path";
import type { ModuleMeta, ModulesIndex } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content/modules");
const INDEX_FILE = path.join(process.cwd(), "content/modules.json");

function readIndex(): ModulesIndex {
  const raw = fs.readFileSync(INDEX_FILE, "utf-8");
  return JSON.parse(raw) as ModulesIndex;
}

export function getAllModules(): ModuleMeta[] {
  return readIndex().modules;
}

export function getModuleMeta(slug: string): ModuleMeta | undefined {
  return readIndex().modules.find((m) => m.slug === slug);
}

export function getModuleSlugs(): string[] {
  return readIndex().modules.map((m) => m.slug);
}

export function getModuleCss(slug: string): string {
  const cssPath = path.join(CONTENT_DIR, slug, "module.css");
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, "utf-8");
  }
  return "";
}

export function getModuleContent(slug: string): string {
  // Phase B: check for MDX first
  const mdxPath = path.join(CONTENT_DIR, slug, "index.mdx");
  if (fs.existsSync(mdxPath)) {
    return fs.readFileSync(mdxPath, "utf-8");
  }
  // Phase A: fall back to extracted HTML
  const htmlPath = path.join(CONTENT_DIR, slug, "content.html");
  if (fs.existsSync(htmlPath)) {
    return fs.readFileSync(htmlPath, "utf-8");
  }
  return "";
}

export function getPrevNextModules(slug: string): {
  prev: ModuleMeta | null;
  next: ModuleMeta | null;
} {
  const modules = getAllModules();
  const idx = modules.findIndex((m) => m.slug === slug);
  return {
    prev: idx > 0 ? modules[idx - 1] : null,
    next: idx < modules.length - 1 ? modules[idx + 1] : null,
  };
}

export function getTierColor(tier: 1 | 2 | 3 | 4): string {
  return { 1: "blue", 2: "green", 3: "orange", 4: "purple" }[tier];
}

export function getTierName(tier: 1 | 2 | 3 | 4): string {
  return {
    1: "Foundations",
    2: "Build Your Workflow",
    3: "Scale Your Impact",
    4: "Lead with AI",
  }[tier];
}
