/**
 * ModuleContent
 * Phase A: renders raw HTML body content from content.html with shared styles.
 * Phase B: will detect index.mdx and render via MDX pipeline instead.
 *
 * The `data-tier` attribute on the wrapper activates CSS tier color theming.
 */
interface ModuleContentProps {
  html: string;
  tier: 1 | 2 | 3 | 4;
  slug: string;
}

export function ModuleContent({ html, tier, slug }: ModuleContentProps) {
  return (
    <div data-tier={String(tier)} className="module-content">
      <div
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
