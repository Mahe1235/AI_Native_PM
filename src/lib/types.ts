export type TierColor = string;
export type AccessLevel = "free" | "paid" | "preview";

export interface ConceptMeta {
  id: string;
  title: string;
  isNew?: boolean;
  access?: AccessLevel;
}

export interface ModuleAccess {
  level: AccessLevel;
  previewConcepts: number;
  gatedFrom: string | null;
}

export interface ModuleMeta {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  tier: number;
  tierName: string;
  color: TierColor;
  estimatedTime: string;
  conceptCount: number;
  codeRequired: boolean;
  status: "complete" | "coming-soon";
  concepts: ConceptMeta[];
  access: ModuleAccess;
}

export interface ModulesIndex {
  modules: ModuleMeta[];
}

export type AccessTier = "anonymous" | "free" | "paid";

export interface AccessState {
  tier: AccessTier;
  modules: Record<string, "full" | "preview" | "locked">;
}
