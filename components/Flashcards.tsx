"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";

function Card({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className={`flip-card h-44 w-full text-left ${flipped ? "is-flipped" : ""}`}
      aria-pressed={flipped}
    >
      <div className="flip-card-inner h-full w-full">
        <div className="flip-card-face flex h-full flex-col justify-between rounded-2xl border border-hairline bg-panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-teal">Question</p>
          <p className="font-display text-base italic text-ink">{card.question}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Tap to flip</p>
        </div>
        <div className="flip-card-face flip-card-back flex h-full flex-col justify-between rounded-2xl border border-teal/40 bg-panel2 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber">Answer</p>
          <p className="text-sm leading-relaxed text-ink">{card.answer}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Tap to flip back</p>
        </div>
      </div>
    </button>
  );
}

export default function Flashcards({ cards }: { cards: Flashcard[] }) {
  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c, i) => (
        <Card key={i} card={c} />
      ))}
    </div>
  );
}
