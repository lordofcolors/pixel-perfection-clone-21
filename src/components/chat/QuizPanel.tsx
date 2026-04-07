/**
 * =============================================================================
 * QuizPanel
 * =============================================================================
 *
 * "Who Wants to Be a Millionaire" style quiz panel. Shows a question with
 * four answer options (A/B/C/D). Cycles through questions when `questionIndex`
 * changes.
 */

import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Mock question bank
// ---------------------------------------------------------------------------

const QUESTIONS = [
  {
    question: "What is the largest planet in our solar system?",
    options: ["A. Mars", "B. Jupiter", "C. Saturn", "D. Neptune"],
    correct: 1,
  },
  {
    question: "How many bones are in the adult human body?",
    options: ["A. 186", "B. 196", "C. 206", "D. 216"],
    correct: 2,
  },
  {
    question: "What gas do plants absorb from the atmosphere?",
    options: ["A. Oxygen", "B. Nitrogen", "C. Hydrogen", "D. Carbon Dioxide"],
    correct: 3,
  },
  {
    question: "Which ocean is the deepest?",
    options: ["A. Atlantic", "B. Indian", "C. Pacific", "D. Arctic"],
    correct: 2,
  },
  {
    question: "What is the speed of light approximately?",
    options: [
      "A. 300,000 km/s",
      "B. 150,000 km/s",
      "C. 500,000 km/s",
      "D. 1,000,000 km/s",
    ],
    correct: 0,
  },
  {
    question: "Which element has the chemical symbol 'Au'?",
    options: ["A. Silver", "B. Aluminum", "C. Gold", "D. Copper"],
    correct: 2,
  },
  {
    question: "How many continents are there on Earth?",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correct: 2,
  },
  {
    question: "What is the powerhouse of the cell?",
    options: [
      "A. Nucleus",
      "B. Ribosome",
      "C. Mitochondria",
      "D. Endoplasmic Reticulum",
    ],
    correct: 2,
  },
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuizPanelProps {
  /** Index that cycles through questions. Changes trigger a new question. */
  questionIndex: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuizPanel({ questionIndex, className }: QuizPanelProps) {
  const q = QUESTIONS[questionIndex % QUESTIONS.length];
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Reset when question changes
  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [questionIndex]);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setTimeout(() => setRevealed(true), 600);
  };

  const optionColors = ["bg-blue-500/20", "bg-amber-500/20", "bg-emerald-500/20", "bg-rose-500/20"];
  const optionBorders = ["border-blue-500/40", "border-amber-500/40", "border-emerald-500/40", "border-rose-500/40"];

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center p-4 ${className || ""}`}
    >
      {/* Question number */}
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Question {(questionIndex % QUESTIONS.length) + 1} of {QUESTIONS.length}
      </div>

      {/* Question */}
      <div className="mb-6 max-w-md text-center text-base font-semibold text-foreground">
        {q.question}
      </div>

      {/* Answer grid */}
      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correct;
          const isSelected = selected === idx;

          let borderClass = optionBorders[idx];
          let bgClass = optionColors[idx];

          if (revealed) {
            if (isCorrect) {
              borderClass = "border-emerald-400";
              bgClass = "bg-emerald-500/30";
            } else if (isSelected) {
              borderClass = "border-destructive/60";
              bgClass = "bg-destructive/20";
            }
          } else if (isSelected) {
            borderClass = "border-primary";
            bgClass = "bg-primary/20";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`rounded-xl border ${borderClass} ${bgClass} px-4 py-3 text-left text-sm font-medium text-foreground transition-all hover:scale-[1.02] ${
                revealed ? "cursor-default" : "cursor-pointer"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {revealed && (
        <div className="mt-4 text-sm font-medium animate-in fade-in">
          {selected === q.correct ? (
            <span className="text-emerald-400">🎉 Correct! Great job!</span>
          ) : (
            <span className="text-rose-400">
              Not quite — the answer is {q.options[q.correct]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
