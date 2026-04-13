"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ModuleMeta } from "@/lib/types";

const TIER_COLORS: Record<number, string> = {
  1: "var(--blue)",
  2: "var(--green)",
  3: "var(--orange)",
  4: "var(--purple)",
};

interface NavProps {
  modules: ModuleMeta[];
}

export function Nav({ modules }: NavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const tiers = [1, 2, 3, 4].map((t) => ({
    tier: t,
    name: modules.find((m) => m.tier === t)?.tierName ?? "",
    modules: modules.filter((m) => m.tier === t),
  }));

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
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
              transition: "all .2s",
            }}
          >
            All Modules
          </Link>
          {tiers.map(({ tier, name, modules: tierModules }) => (
            <div key={tier} style={{ position: "relative" }} className="nav-dropdown-wrap">
              <button
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ color: TIER_COLORS[tier], fontSize: 8 }}>●</span>
                Tier {tier}
              </button>
              <div className="nav-dropdown">
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: TIER_COLORS[tier],
                    padding: "12px 16px 8px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {name}
                </div>
                {tierModules.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/modules/${m.slug}`}
                    style={{
                      display: "block",
                      padding: "10px 16px",
                      textDecoration: "none",
                      color: pathname === `/modules/${m.slug}` ? "var(--accent)" : "var(--text-muted)",
                      fontSize: 13,
                      transition: "all .15s",
                    }}
                    className="nav-dropdown-item"
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: TIER_COLORS[tier],
                        marginRight: 8,
                      }}
                    >
                      {String(m.number).padStart(2, "0")}
                    </span>
                    {m.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
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
            {menuOpen ? (
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
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            padding: "16px 24px 24px",
          }}
        >
          <Link
            href="/modules"
            onClick={() => setMenuOpen(false)}
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
            <div key={tier} style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: TIER_COLORS[tier],
                  marginBottom: 8,
                }}
              >
                Tier {tier}: {name}
              </div>
              {tierModules.map((m) => (
                <Link
                  key={m.slug}
                  href={`/modules/${m.slug}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    fontSize: 14,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    padding: "7px 0",
                  }}
                >
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: TIER_COLORS[tier], marginRight: 8 }}>
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
        .nav-dropdown-wrap .nav-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 260px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          z-index: 100;
          overflow: hidden;
        }
        .nav-dropdown-wrap:hover .nav-dropdown { display: block; }
        .nav-dropdown-item:hover { background: var(--surface-raised); color: var(--text) !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
