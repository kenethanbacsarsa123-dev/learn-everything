import type { GithubProject } from "@/lib/types";

export default function GithubProjects({ projects }: { projects: GithubProject[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((p) => (
        <a
          key={p.fullName}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-hairline bg-panel p-5 transition hover:border-teal/60"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="truncate font-mono text-sm text-ink">{p.fullName}</p>
            <span className="shrink-0 font-mono text-xs text-amber">★ {p.stars.toLocaleString()}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{p.description}</p>
          {p.language && (
            <span className="mt-3 inline-block rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-teal">
              {p.language}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
