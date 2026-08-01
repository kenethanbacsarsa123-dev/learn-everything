"use client";

import { useState } from "react";
import StarfieldBackground from "@/components/StarfieldBackground";
import TopicForm from "@/components/TopicForm";
import SectionHeading from "@/components/SectionHeading";
import ConstellationMap from "@/components/ConstellationMap";
import Timeline from "@/components/Timeline";
import Flashcards from "@/components/Flashcards";
import Quiz from "@/components/Quiz";
import WikipediaSummaryCard from "@/components/WikipediaSummaryCard";
import YouTubeGrid from "@/components/YouTubeGrid";
import GithubProjects from "@/components/GithubProjects";
import type { LearnResponse } from "@/lib/types";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LearnResponse | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setData(json as LearnResponse);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen">
      <StarfieldBackground />

      {/* Hero */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-teal">🧠 Learn Anything</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl italic leading-tight text-ink sm:text-6xl">
          Type a topic. Chart the whole sky of it.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted sm:text-base">
          One page, one search — a mind map, a timeline, flashcards, a quiz, videos, code, and a summary,
          all built for whatever you're curious about.
        </p>
        <div className="mt-10 w-full flex justify-center">
          <TopicForm value={topic} onChange={setTopic} onSubmit={handleSubmit} loading={loading} />
        </div>
        {error && (
          <p className="mt-4 rounded-lg border border-rose/40 bg-rose/10 px-4 py-2 font-mono text-sm text-rose">
            {error}
          </p>
        )}
        {loading && (
          <p className="mt-6 animate-pulse font-mono text-xs uppercase tracking-widest text-muted">
            Plotting coordinates for &ldquo;{topic}&rdquo;…
          </p>
        )}
      </section>

      {/* Results */}
      {data && (
        <div className="mx-auto max-w-5xl space-y-20 px-6 pb-32">
          {data.warnings.length > 0 && (
            <div className="rounded-xl border border-amber/30 bg-amber/5 px-4 py-3 font-mono text-xs text-amber">
              {data.warnings.join(" ")}
            </div>
          )}

          {data.wikipedia && (
            <section>
              <SectionHeading coordinate="01 · Overview" title="Wikipedia summary" />
              <WikipediaSummaryCard summary={data.wikipedia} />
            </section>
          )}

          {data.mindMap && data.mindMap.nodes.length > 0 && (
            <section>
              <SectionHeading
                coordinate="02 · Structure"
                title="Mind map"
                description="The topic's core ideas, charted as a constellation — hover a star for its full label."
              />
              <ConstellationMap mindMap={data.mindMap} />
            </section>
          )}

          {data.timeline.length > 0 && (
            <section>
              <SectionHeading coordinate="03 · Sequence" title="Timeline" />
              <Timeline events={data.timeline} />
            </section>
          )}

          {data.flashcards.length > 0 && (
            <section>
              <SectionHeading
                coordinate="04 · Recall"
                title="Flashcards"
                description="Tap a card to flip it."
              />
              <Flashcards cards={data.flashcards} />
            </section>
          )}

          {data.quiz.length > 0 && (
            <section>
              <SectionHeading coordinate="05 · Test" title="Quiz" />
              <Quiz questions={data.quiz} />
            </section>
          )}

          {data.youtube.length > 0 && (
            <section>
              <SectionHeading coordinate="06 · Watch" title="YouTube videos" />
              <YouTubeGrid videos={data.youtube} />
            </section>
          )}

          {data.github.length > 0 && (
            <section>
              <SectionHeading coordinate="07 · Build" title="GitHub projects" />
              <GithubProjects projects={data.github} />
            </section>
          )}
        </div>
      )}

      <footer className="border-t border-hairline px-6 py-8 text-center font-mono text-xs text-muted">
        Learn Anything — built with Gemini, Wikipedia, GitHub &amp; YouTube.
      </footer>
    </main>
  );
}
