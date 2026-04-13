"use client";

import { useAccess } from "./AccessProvider";
import { PaywallCTA } from "./PaywallCTA";
import type { ModuleMeta, AccessLevel } from "@/lib/types";

interface ContentGateProps {
  children: React.ReactNode;
  module: ModuleMeta;
  conceptId: string;
  conceptAccess?: AccessLevel;
}

export function ContentGate({
  children,
  module,
  conceptId,
  conceptAccess,
}: ContentGateProps) {
  const access = useAccess();

  // Determine if this concept is accessible
  const moduleAccess = module.access;

  // If module is fully free, always show
  if (moduleAccess.level === "free") return <>{children}</>;

  // Check user's module-level access
  const userModuleAccess = access.modules[module.slug] ?? "full";
  if (userModuleAccess === "full") return <>{children}</>;
  if (userModuleAccess === "locked") {
    return <PaywallCTA module={module} />;
  }

  // Preview mode: check concept position
  if (moduleAccess.level === "preview") {
    const conceptIndex = module.concepts.findIndex((c) => c.id === conceptId);
    if (conceptIndex < moduleAccess.previewConcepts) return <>{children}</>;
    return <PaywallCTA module={module} />;
  }

  // Per-concept access
  if (conceptAccess === "paid" && access.tier !== "paid") {
    return <PaywallCTA module={module} />;
  }

  return <>{children}</>;
}
