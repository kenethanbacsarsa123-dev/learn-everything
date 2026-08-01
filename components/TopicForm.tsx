"use client";

import { FormEvent } from "react";

const EXAMPLES = ["Quantum computing", "The French Revolution", "CRISPR", "Stoicism", "Neural networks"];

export default function TopicForm({
  value,
  onChange,
  onSubmit,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!loading && value.trim()) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-panel/80 p-3 shadow-[0_0_60px_-15px_rgba(94,234,212,0.15)] backdrop-blur sm:flex-row sm:items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type anything — quantum computing, the Silk Road, octopuses…"
          maxLength={120}
          disabled={loading}
          className="w-full flex-1 bg-transparent px-3 py-3 font-body text-lg text-ink placeholder:text-muted focus:outline-none disabled:opacity-50"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="shrink-0 rounded-xl bg-amber px-6 py-3 font-mono text-sm font-medium uppercase tracking-wide text-void transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Charting…" : "Chart it"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="font-mono uppercase tracking-wide">Try</span>
        {EXAMPLES.map((ex) => (
          <button
            type="button"
            key={ex}
            disabled={loading}
            onClick={() => onChange(ex)}
            className="rounded-full border border-hairline px-3 py-1 transition hover:border-teal hover:text-teal disabled:opacity-40"
          >
            {ex}
          </button>
        ))}
      </div>
    </form>
  );
}
