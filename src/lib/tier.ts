export interface TierMeta {
  name: string;
  color: string;
  dim: string;
  week: string;
  colorName: string;
}

export const TIERS: Record<number, TierMeta> = {
  1: { name: "Foundations",         color: "var(--blue)",   dim: "var(--blue-dim)",   week: "Week 1", colorName: "blue" },
  2: { name: "Build Your Workflow", color: "var(--green)",  dim: "var(--green-dim)",  week: "Week 2", colorName: "green" },
  3: { name: "Scale Your Impact",   color: "var(--orange)", dim: "var(--orange-dim)", week: "Week 3", colorName: "orange" },
  4: { name: "Lead with AI",        color: "var(--purple)", dim: "var(--purple-dim)", week: "Week 4", colorName: "purple" },
};

// Lookup by color name (for Sidebar and PaywallCTA which receive module.color as string)
export const TIER_COLORS_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.values(TIERS).map((t) => [t.colorName, t.color])
);
export const TIER_DIMS_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.values(TIERS).map((t) => [t.colorName, t.dim])
);

// Derive tier list dynamically from module data — replaces all hardcoded [1,2,3,4] loops
export function getTierNumbers(modules: { tier: number }[]): number[] {
  return [...new Set(modules.map((m) => m.tier))].sort((a, b) => a - b);
}
