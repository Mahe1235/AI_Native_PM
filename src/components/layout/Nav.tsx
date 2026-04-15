"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { ModuleMeta } from "@/lib/types";
import { TIERS, getTierNumbers } from "@/lib/tier";

interface NavProps {
  modules: ModuleMeta[];
}

export function Nav({ modules }: NavProps) {
  const pathname = usePathname();
  const [openTier, setOpenTier] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const tiers = getTierNumbers(modules).map((t) => ({
    tier: t,
    name: modules.find((m) => m.tier === t)?.tierName ?? "",
    modules: modules.filter((m) => m.tier === t),
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenTier(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenTier(null);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text)",
            textDecoration: "none",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "var(--accent)" }}>◆</span>
          The AI-Native PM
        </Link>

        {/* Desktop nav */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 4 }}
          className="nav-desktop"
        >
          <Link
            href="/modules"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              fontWeight: 500,
              color: pathname === "/modules" ? "var(--accent)" : "var(--text-muted)",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 6,
              transition: "color .15s",
            }}
          >
            All Modules
          </Link>

          {tiers.map(({ tier, name, modules: tierModules }) => {
            const isOpen = openTier === tier;
            const tierColor = TIERS[tier]?.color ?? "var(--blue)";

            return (
              <div key={tier} style={{ position: "relative" }}>
                <button
                  onClick={() => setOpenTier(isOpen ? null : tier)}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: isOpen ? tierColor : "var(--text-muted)",
                    background: isOpen ? `${tierColor}15` : "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px 12px",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all .15s",
                  }}
                >
                  <span style={{ color: tierColor, fontSize: 7 }}>●</span>
                  Tier {tier}
                  <span style={{ fontSize: 9, opacity: 0.6, marginLeft: 1 }}>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      minWidth: 280,
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                      zIndex: 100,
                      overflow: "hidden",
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
                        padding: "12px 16px 8px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      Tier {tier}: {name}
                    </div>
                    {tierModules.map((m) => (
                      <Link
                        key={m.slug}
                        href={`/modules/${m.slug}`}
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 8,
                          padding: "10px 16px",
                          textDecoration: "none",
                          color:
                            pathname === `/modules/${m.slug}`
                              ? "var(--accent)"
                              : "var(--text-muted)",
                          fontSize: 13,
                          transition: "all .15s",
                          background:
                            pathname === `/modules/${m.slug}`
                              ? "var(--surface-raised)"
                              : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            "var(--surface-raised)";
                          (e.currentTarget as HTMLElement).style.color =
                            "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            pathname === `/modules/${m.slug}`
                              ? "var(--surface-raised)"
                              : "transparent";
                          (e.currentTarget as HTMLElement).style.color =
                            pathname === `/modules/${m.slug}`
                              ? "var(--accent)"
                              : "var(--text-muted)";
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 11,
                            color: tierColor,
                            flexShrink: 0,
                          }}
                        >
                          {String(m.number).padStart(2, "0")}
                        </span>
                        {m.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: 4,
            display: "none",
          }}
          className="nav-hamburger"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <>
                <rect y="3" width="20" height="2" rx="1" />
                <rect y="9" width="20" height="2" rx="1" />
                <rect y="15" width="20" height="2" rx="1" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            padding: "16px 24px 24px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Link
            href="/modules"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              fontFamily: "var(--mono)",
              fontSize: 13,
              color: "var(--text-muted)",
              textDecoration: "none",
              padding: "10px 0",
              borderBottom: "1px solid var(--border)",
              marginBottom: 16,
            }}
          >
            All Modules
          </Link>
          {tiers.map(({ tier, name, modules: tierModules }) => (
            <div key={tier} style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: TIERS[tier]?.color ?? "var(--blue)",
                  marginBottom: 8,
                }}
              >
                Tier {tier}: {name}
              </div>
              {tierModules.map((m) => (
                <Link
                  key={m.slug}
                  href={`/modules/${m.slug}`}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    fontSize: 14,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: TIERS[tier]?.color ?? "var(--blue)",
                      marginRight: 8,
                    }}
                  >
                    {String(m.number).padStart(2, "0")}
                  </span>
                  {m.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
