"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ModuleMeta } from "@/lib/types";
import { TIER_COLORS_BY_NAME } from "@/lib/tier";

interface SidebarProps {
  module: ModuleMeta;
}

export function Sidebar({ module }: SidebarProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [missingIds, setMissingIds] = useState<Set<string>>(new Set());
  const desktopRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const tierColor = TIER_COLORS_BY_NAME[module.color] ?? "var(--blue)";

  // Detect which concept IDs have no matching section in the DOM
  useEffect(() => {
    const missing = new Set<string>();
    for (const c of module.concepts) {
      if (!document.getElementById(c.id)) {
        missing.add(c.id);
      }
    }
    setMissingIds(missing);
  }, [module.concepts]);

  // Scroll spy: on each scroll, find the last section whose top is above
  // the nav + a small buffer — that's the "current" concept.
  useEffect(() => {
    const ids = module.concepts.map((c) => c.id);

    function updateActive() {
      const threshold = 88 + window.innerHeight * 0.15;
      let active = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          active = id;
        }
      }
      if (active !== "") setActiveId(active);
    }

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [module.concepts]);

  // Click handler for sidebar anchor links.
  // Uses capture phase to fire before Next.js scroll-restoration and
  // stopPropagation to prevent AnchorScrollFix from double-scrolling.
  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
    setActiveId(id);
    setMobileOpen(false);
  }, []);

  const conceptItems = module.concepts.map((concept, i) => {
    const isActive = activeId === concept.id;
    const isMissing = missingIds.has(concept.id);

    const color = isMissing
      ? "var(--red)"
      : isActive
        ? tierColor
        : "var(--text-muted)";

    const borderColor = isMissing
      ? "var(--red)"
      : isActive
        ? tierColor
        : "transparent";

    return (
      <li key={concept.id}>
        <a
          href={`#${concept.id}`}
          onClick={(e) => handleAnchorClick(e, concept.id)}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            padding: "6px 0",
            textDecoration: "none",
            color,
            fontSize: 13,
            fontWeight: isActive || isMissing ? 600 : 400,
            transition: "color .15s",
            borderLeft: `2px solid ${borderColor}`,
            paddingLeft: 12,
            marginLeft: -14,
            opacity: isMissing ? 0.85 : 1,
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color,
              flexShrink: 0,
              width: 20,
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{concept.title}</span>
          {isMissing && (
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--red)",
                background: "var(--red-dim)",
                padding: "1px 5px",
                borderRadius: 3,
                flexShrink: 0,
              }}
            >
              Missing
            </span>
          )}
          {!isMissing && concept.isNew && (
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
  });

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        ref={desktopRef}
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
        {/* Where am I */}
        <div
          style={{
            marginBottom: 16,
            paddingBottom: 14,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: tierColor,
              marginBottom: 2,
            }}
          >
            Module {String(module.number).padStart(2, "0")}
          </p>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              marginBottom: 10,
            }}
          >
            Tier {module.tier} · {module.tierName}
          </p>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text-dim)",
              lineHeight: 1.8,
              marginBottom: 2,
            }}
          >
            <span style={{ color: tierColor }}>●</span>{" "}
            <span style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {module.estimatedTime}
            </span>
            <span style={{ color: "var(--border-accent)" }}> · </span>
            <span>{module.conceptCount} concepts</span>
          </p>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text-muted)",
              lineHeight: 1.4,
            }}
          >
            {module.formatLabel}
          </p>
        </div>

        {/* Concept list with scrollspy */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {conceptItems}
        </ul>
      </aside>

      {/* Mobile sticky concept dropdown */}
      <div
        ref={mobileRef}
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
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {conceptItems}
            </ul>
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
