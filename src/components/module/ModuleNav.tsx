import Link from "next/link";
import type { ModuleMeta } from "@/lib/types";

interface ModuleNavProps {
  prev: ModuleMeta | null;
  next: ModuleMeta | null;
}

export function ModuleNav({ prev, next }: ModuleNavProps) {
  return (
    <nav className="mnav">
      {prev ? (
        <Link href={`/modules/${prev.slug}`} className="nbtn">
          <span className="nba">←</span>
          <span>
            <span className="nbl">Previous</span>
            <span className="nbt">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <Link href="/modules" className="nbtn">
          <span className="nba">←</span>
          <span>
            <span className="nbl">Back to</span>
            <span className="nbt">All Modules</span>
          </span>
        </Link>
      )}

      {next ? (
        <Link href={`/modules/${next.slug}`} className="nbtn" style={{ textAlign: "right" }}>
          <span>
            <span className="nbl">Next</span>
            <span className="nbt">{next.title}</span>
          </span>
          <span className="nba">→</span>
        </Link>
      ) : (
        <Link href="/modules" className="nbtn" style={{ textAlign: "right" }}>
          <span>
            <span className="nbl">Done!</span>
            <span className="nbt">All Modules</span>
          </span>
          <span className="nba">→</span>
        </Link>
      )}
    </nav>
  );
}
