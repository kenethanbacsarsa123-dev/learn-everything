import type { TimelineEvent } from "@/lib/types";

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null;

  return (
    <div className="relative pl-8">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber via-hairline to-transparent" />
      <ul className="space-y-8">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-amber bg-void" />
            <p className="font-mono text-xs uppercase tracking-wide text-amber">{e.date}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{e.event}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
