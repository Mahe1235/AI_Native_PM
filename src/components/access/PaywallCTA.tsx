import type { ModuleMeta } from "@/lib/types";

const TIER_COLORS: Record<string, string> = {
  blue: "var(--blue)",
  green: "var(--green)",
  orange: "var(--orange)",
  purple: "var(--purple)",
};

const TIER_DIMS: Record<string, string> = {
  blue: "var(--blue-dim)",
  green: "var(--green-dim)",
  orange: "var(--orange-dim)",
  purple: "var(--purple-dim)",
};

interface PaywallCTAProps {
  module: ModuleMeta;
}

export function PaywallCTA({ module }: PaywallCTAProps) {
  const tierColor = TIER_COLORS[module.color] ?? TIER_COLORS.blue;
  const tierDim = TIER_DIMS[module.color] ?? TIER_DIMS.blue;

  return (
    <div
      style={{
        background: tierDim,
        border: `1px solid ${tierColor}30`,
        borderRadius: 12,
        padding: "40px 32px",
        textAlign: "center",
        margin: "32px 0",
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: tierColor,
          marginBottom: 12,
        }}
      >
        Premium Content
      </div>
      <h3
        style={{
          fontFamily: "var(--serif)",
          fontSize: 22,
          fontWeight: 400,
          color: "var(--text)",
          marginBottom: 12,
        }}
      >
        This content is part of the full curriculum
      </h3>
      <p
        style={{
          fontSize: 15,
          color: "var(--text-muted)",
          maxWidth: 460,
          margin: "0 auto 24px",
          lineHeight: 1.65,
        }}
      >
        Upgrade to access the complete Module {String(module.number).padStart(2, "0")}:{" "}
        {module.title} and all {module.conceptCount} concepts.
      </p>
      {/* CTA button — wired to payment flow when payments are added */}
      <button
        style={{
          display: "inline-block",
          fontFamily: "var(--mono)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "var(--bg)",
          background: tierColor,
          padding: "10px 24px",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        Unlock Full Access
      </button>
    </div>
  );
}
