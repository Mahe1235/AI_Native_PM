"use client";

import { createContext, useContext } from "react";
import type { AccessState } from "@/lib/types";

// Default: everyone gets full access to everything.
// When auth/payments are added, swap this implementation to read from session/JWT.
const DEFAULT_ACCESS: AccessState = {
  tier: "free",
  modules: {},
};

const AccessContext = createContext<AccessState>(DEFAULT_ACCESS);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  // TODO: Replace with real access state from auth session when payments are added.
  // The interface is stable — downstream components won't need changes.
  const access: AccessState = DEFAULT_ACCESS;

  return (
    <AccessContext.Provider value={access}>{children}</AccessContext.Provider>
  );
}

export function useAccess(): AccessState {
  return useContext(AccessContext);
}
