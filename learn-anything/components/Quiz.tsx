"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/types";

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const score = useMemo(
    () =>
      Object.entries(answers).filter(([qi, choice]) => questions[Number(qi)]?.correctIndex === choice)
        .length,
    [answers, questions]
  );
  const answeredCount = Object.keys(answers).length;

  if (questions.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isAnswered = chosen !== undefined;
          return (
            <div key={qi} className="rounded-2xl border border-hairline bg-panel p-5">
              <p className="font-mono text-xs text-muted">
                {String(qi + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
              </p>
              <p className="mt-2 font-display text-lg italic text-ink">{q.question}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctIndex;
                  const isChosen = oi === chosen;
                  let style = "border-hairline hover:border-teal/60";
                  if (isAnswered && isCorrect) style = "border-teal bg-teal/10 text-teal";
                  else if (isAnswered && isChosen && !isCorrect) style = "border-rose bg-rose/10 text-rose";

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition disabled:cursor-default ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 mx-auto w-fit rounded-full border border-hairline bg-panel/90 px-5 py-2 font-mono text-xs uppercase tracking-wide text-ink backdrop-blur">
        Score: <span className="text-amber">{score}</span> / {questions.length}
        {answeredCount < questions.length && <span className="text-muted"> · {questions.length - answeredCount} left</span>}
      </div>
    </div>
  );
}
