"use client";

import { useEffect } from "react";

/**
 * Fixes in-page anchor scrolling after Next.js client-side navigation.
 * After a Next.js route transition, native <a href="#id"> clicks update
 * the hash but don't scroll. This intercepts all such clicks globally
 * and manually scrolls with the correct nav offset.
 */
export function AnchorScrollFix() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      // scrollIntoView respects the CSS scroll-margin-top on the target element
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", href);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
