import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllModules,
  getModuleMeta,
  getModuleContent,
  getModuleCss,
  getPrevNextModules,
} from "@/lib/modules";
import { ModuleContent } from "@/components/module/ModuleContent";
import { ModuleNav } from "@/components/module/ModuleNav";
import { Sidebar } from "@/components/module/Sidebar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const modules = getAllModules();
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const module = getModuleMeta(slug);
  if (!module) return {};
  return {
    title: `${module.title} — The AI-Native PM`,
    description: module.subtitle,
  };
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params;
  const module = getModuleMeta(slug);

  if (!module) notFound();

  const html = getModuleContent(slug);
  const moduleCss = getModuleCss(slug);
  const { prev, next } = getPrevNextModules(slug);

  return (
    <div data-tier={String(module.tier)}>
      {/* Inject module-specific CSS (visualizations unique to this module) */}
      {moduleCss && (
        <style dangerouslySetInnerHTML={{ __html: moduleCss }} />
      )}

      {/* Module layout: sidebar + content */}
      <div className="module-layout">
        {/* Sidebar handles both desktop (sticky aside) and mobile (dropdown) internally */}
        <Sidebar module={module} prev={prev} next={next} />

        {/* Main content column */}
        <main className="module-main">
          <ModuleContent html={html} tier={module.tier} slug={slug} />
          <ModuleNav prev={prev} next={next} />
        </main>
      </div>

      <style>{`
        .module-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          gap: 48px;
          align-items: flex-start;
        }
        .module-main {
          flex: 1;
          min-width: 0;
        }
        /* Hide duplicate navs from content HTML — sidebar & ModuleNav handle these */
        .module-content .cnav,
        .module-content .mnav {
          display: none !important;
        }
        @media (max-width: 900px) {
          .module-layout {
            display: block;
            padding: 0;
          }
          .module-main {
            padding: 0 18px;
          }
        }
      `}</style>
    </div>
  );
}
