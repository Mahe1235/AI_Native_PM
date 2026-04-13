"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ConceptMeta, ModuleMeta } from "@/lib/types";

const TIER_COLORS: Record<string, string> = {
  blue: "var(--blue)",
  green: "var(--green)",
  orange: "var(--orange)",
  purple: "var(--purple)",
};

interface SidebarProps {
  module: ModuleMeta;
  prev: ModuleMeta | null;
  next: ModuleMeta | null;
}

export function Sidebar({ module, prev, next }: SidebarProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const tierColor = TIER_COLORS[module.color] ?? TIER_COLORS.blue;

  useEffect(() => {
    const ids = module.concepts.map((c) => c.id);
    const observers: IntersectionObserver[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    observers.push(observer);
    return () => observers.forEach((o) => o.disconnect());
  }, [module.concepts]);

  const ConceptList = () => (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {module.concepts.map((concept, i) => {
        const isActive = activeId === concept.id;
        return (
          <li key={concept.id}>
            <a
              href={`#${concept.id}`}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                padding: "6px 0",
                textDecoration: "none",
                color: isActive ? tierColor : "var(--text-dim)",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                transition: "color .15s",
                borderLeft: `2px solid ${isActive ? tierColor : "transparent"}`,
                paddingLeft: 12,
                marginLeft: -14,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: isActive ? tierColor : "var(--text-dim)",
                  flexShrink: 0,
                  width: 20,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{concept.title}</span>
              {concept.isNew && (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "var(--teal)",
                    background: "var(--teal-dim)",
                    padding: "1px 5px",
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                >
                  New
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar — is the flex item in the module-layout */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          position: "sticky",
          top: 80,
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          paddingBottom: 24,
          paddingTop: 8,
        }}
        className="sidebar-desktop"
      >
        {/* Module meta */}
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-dim)",
            marginBottom: 20,
            padding: "0 0 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ marginBottom: 4 }}>
            <span style={{ color: tierColor }}>●</span>{" "}
            <span style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {module.estimatedTime}
            </span>
          </div>
          <div>{module.conceptCount} concepts</div>
          {module.codeRequired && (
            <div style={{ color: "var(--orange)", marginTop: 4 }}>
              Includes code
            </div>
          )}
        </div>

        {/* Concept list with scrollspy */}
        <ConceptList />

        {/* Prev/Next in sidebar */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {prev && (
            <Link
              href={`/modules/${prev.slug}`}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text-dim)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>←</span> {prev.title}
            </Link>
          )}
          {next && (
            <Link
              href={`/modules/${next.slug}`}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text-dim)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>→</span> {next.title}
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile sticky concept dropdown */}
      <div
        className="sidebar-mobile"
        style={{
          position: "sticky",
          top: 56,
          zIndex: 40,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          display: "none",
        }}
      >
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 18px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          <span>
            {activeId
              ? module.concepts.find((c) => c.id === activeId)?.title ?? "Concepts"
              : "Jump to concept"}
          </span>
          <span>{mobileOpen ? "▲" : "▼"}</span>
        </button>
        {mobileOpen && (
          <div
            style={{
              background: "var(--surface)",
              borderTop: "1px solid var(--border)",
              padding: "12px 18px",
            }}
          >
            <ConceptList />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile { display: block !important; }
        }
      `}</style>
    </>
  );
}
