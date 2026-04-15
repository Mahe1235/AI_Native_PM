import Link from "next/link";
import type { Metadata } from "next";
import { getAllModules } from "@/lib/modules";
import { TIERS, getTierNumbers } from "@/lib/tier";

export async function generateMetadata(): Promise<Metadata> {
  const modules = getAllModules();
  return {
    title: "Modules — The AI-Native PM",
    description: `${modules.length} modules to take you from AI-curious to AI-native.`,
  };
}

export default function ModulesPage() {
  const modules = getAllModules();
  const tiers = getTierNumbers(modules);

  return (
    <div style={{ minHeight: "100vh", padding: "48px 0" }}>
      <div className="container">
        {/* Page header */}
        <div style={{ marginBottom: 56 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 12,
            }}
          >
            Curriculum
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            {modules.length} Modules. Real Workflows.
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-muted)", maxWidth: 560 }}>
            A self-paced curriculum for product managers ready to work with AI —
            not just use it.
          </p>
        </div>

        {/* Modules grouped by tier */}
        {tiers.map((tier) => {
          const tierModules = modules.filter((m) => m.tier === tier);
          const tierColor = TIERS[tier].color;
          const tierDim = TIERS[tier].dim;
          const tierName = tierModules[0]?.tierName ?? "";

          return (
            <section key={tier} style={{ marginBottom: 48 }}>
              {/* Tier header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                  paddingBottom: 16,
                  borderBottom: `1px solid ${tierColor}30`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: tierColor,
                    background: tierDim,
                    padding: "3px 10px",
                    borderRadius: 4,
                  }}
                >
                  Tier {tier}
                </span>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--text-dim)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {tierName}
                </span>
              </div>

              {/* Module cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 16,
                }}
              >
                {tierModules.map((module) => (
                  <Link
                    key={module.slug}
                    href={`/modules/${module.slug}`}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: "24px 28px",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all .2s",
                        height: "100%",
                      }}
                      className="module-card"
                    >
                      {/* Top accent bar */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: `linear-gradient(90deg, ${tierColor}, transparent)`,
                        }}
                      />

                      {/* Module number + tier */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 16,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "1.5px",
                            color: tierColor,
                            background: tierDim,
                            padding: "3px 8px",
                            borderRadius: 4,
                          }}
                        >
                          MODULE {String(module.number).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        style={{
                          fontFamily: "var(--serif)",
                          fontSize: 20,
                          fontWeight: 400,
                          lineHeight: 1.25,
                          color: "var(--text)",
                          marginBottom: 10,
                        }}
                      >
                        {module.title}
                      </h2>

                      {/* Subtitle */}
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--text-muted)",
                          lineHeight: 1.6,
                          marginBottom: 20,
                        }}
                      >
                        {module.subtitle}
                      </p>

                      {/* Meta row */}
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          flexWrap: "wrap",
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: "var(--text-dim)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        <span>
                          <span style={{ color: tierColor, marginRight: 4 }}>●</span>
                          {module.estimatedTime}
                        </span>
                        <span>{module.conceptCount} concepts</span>
                        {module.codeRequired && (
                          <span style={{ color: "var(--orange)" }}>Includes code</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <style>{`
        .module-card:hover {
          background: var(--surface-raised) !important;
          border-color: var(--border-accent) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
