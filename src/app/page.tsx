import Link from "next/link";
import { getAllModules } from "@/lib/modules";
import { TIERS, getTierNumbers } from "@/lib/tier";

export default function HomePage() {
  const modules = getAllModules();

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "96px 0 80px",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 600,
            background:
              "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 20,
            }}
          >
            A curriculum for product managers
          </div>

          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(42px, 6vw, 72px)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: "var(--text)",
              marginBottom: 24,
              maxWidth: 700,
            }}
          >
            The{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              AI-Native
            </em>{" "}
            PM
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--text-muted)",
              maxWidth: 560,
              lineHeight: 1.75,
              marginBottom: 40,
            }}
          >
            Go from &ldquo;I use Claude sometimes&rdquo; to &ldquo;AI is how I
            work.&rdquo; {modules.length} modules. Real workflows. No fluff.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/modules/01-how-llms-work"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 24px",
                background: "var(--accent)",
                color: "var(--bg)",
                borderRadius: 8,
                fontFamily: "var(--mono)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.5px",
                textDecoration: "none",
                transition: "opacity .2s",
              }}
            >
              Start Module 01 →
            </Link>
            <Link
              href="/modules"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 24px",
                background: "var(--surface)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontFamily: "var(--mono)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.5px",
                textDecoration: "none",
                transition: "all .2s",
              }}
            >
              View All Modules
            </Link>
          </div>

          {/* Quick stats */}
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: 48,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: String(modules.length), label: "Modules" },
              { value: "~28 hrs", label: "Total time" },
              { value: `${getTierNumbers(modules).length} tiers`, label: "Progressive depth" },
              { value: "0", label: "Prerequisites" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: 2,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--text-dim)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum overview — 4 tiers */}
      <section style={{ padding: "64px 0 80px" }}>
        <div className="container">
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              marginBottom: 40,
            }}
          >
            The Curriculum
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {getTierNumbers(modules).map((tier) => {
              const tierModules = modules.filter((m) => m.tier === tier);
              const tierColor = TIERS[tier].color;
              const tierDim = TIERS[tier].dim;
              const tierName = tierModules[0]?.tierName ?? "";
              const week = TIERS[tier].week;

              return (
                <div
                  key={tier}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr",
                    gap: 32,
                    padding: "36px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                  className="tier-row"
                >
                  {/* Tier label */}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: tierColor,
                        marginBottom: 6,
                      }}
                    >
                      Tier {tier} · {week}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: 18,
                        color: "var(--text)",
                        lineHeight: 1.3,
                      }}
                    >
                      {tierName}
                    </div>
                  </div>

                  {/* Modules */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {tierModules.map((m) => (
                      <Link
                        key={m.slug}
                        href={`/modules/${m.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            background: "var(--surface)",
                            border: `1px solid ${tierColor}25`,
                            borderRadius: 10,
                            padding: "16px 20px",
                            minWidth: 200,
                            maxWidth: 280,
                            transition: "all .2s",
                          }}
                          className="tier-module-card"
                        >
                          <div
                            style={{
                              fontFamily: "var(--mono)",
                              fontSize: 10,
                              fontWeight: 600,
                              letterSpacing: "1.5px",
                              color: tierColor,
                              marginBottom: 8,
                            }}
                          >
                            MODULE {String(m.number).padStart(2, "0")}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--serif)",
                              fontSize: 15,
                              color: "var(--text)",
                              lineHeight: 1.3,
                              marginBottom: 8,
                            }}
                          >
                            {m.title}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--mono)",
                              fontSize: 10,
                              color: "var(--text-dim)",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {m.estimatedTime} · {m.conceptCount} concepts
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you'll build section */}
      <section
        style={{
          padding: "64px 0 80px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "start",
            }}
            className="two-col"
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 16,
                }}
              >
                Who this is for
              </div>
              <h2
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(26px, 3vw, 36px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: 20,
                }}
              >
                PMs who want AI to be{" "}
                <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
                  infrastructure
                </em>
                , not a novelty
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.75 }}>
                You don&apos;t need a technical background. You don&apos;t need to
                know Python. You need to be curious, willing to experiment, and
                ready to rethink how you work.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  color: "var(--blue)",
                  text: "Understand how LLMs actually work — not theory, practical mental models",
                },
                {
                  color: "var(--green)",
                  text: "Build real AI workflows and evaluate them systematically",
                },
                {
                  color: "var(--orange)",
                  text: "Scale from individual skills to agents and feedback loops",
                },
                {
                  color: "var(--purple)",
                  text: "Ship AI features with proper specs, metrics, and trust architecture",
                },
              ].map(({ color, text }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: "14px 16px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      color,
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      marginTop: 1,
                      flexShrink: 0,
                    }}
                  >
                    ◆
                  </span>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          padding: "64px 0 80px",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            Ready to become{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              AI-native
            </em>
            ?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-muted)",
              marginBottom: 32,
              maxWidth: 400,
              margin: "0 auto 32px",
            }}
          >
            Start with the foundations. Everything else builds from there.
          </p>
          <Link
            href="/modules/01-how-llms-work"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              background: "var(--accent)",
              color: "var(--bg)",
              borderRadius: 8,
              fontFamily: "var(--mono)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.5px",
              textDecoration: "none",
            }}
          >
            Start Module 01: How LLMs Actually Work →
          </Link>
        </div>
      </section>

      <style>{`
        .tier-module-card:hover {
          background: var(--surface-raised) !important;
          border-color: var(--border-accent) !important;
        }
        @media (max-width: 640px) {
          .tier-row { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
