import type { YouTubeVideo } from "@/lib/types";

export default function YouTubeGrid({ videos }: { videos: YouTubeVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <a
          key={v.videoId}
          href={`https://www.youtube.com/watch?v=${v.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-2xl border border-hairline bg-panel transition hover:border-teal/60"
        >
          <div className="aspect-video w-full overflow-hidden bg-panel2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.thumbnail}
              alt={v.title}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <p className="line-clamp-2 text-sm font-medium text-ink">{v.title}</p>
            <p className="mt-1 font-mono text-xs text-muted">{v.channel}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
