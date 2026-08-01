import type { WikipediaSummary } from "@/lib/types";

export default function WikipediaSummaryCard({ summary }: { summary: WikipediaSummary }) {
  return (
    <div className="rounded-2xl border border-hairline bg-panel p-6">
      <p className="font-display text-xl italic text-ink">{summary.title}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{summary.extract}</p>
      <a
        href={summary.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-teal hover:text-amber"
      >
        Read on Wikipedia →
      </a>
    </div>
  );
}
