/**
 * =============================================================================
 * QuizPanel
 * =============================================================================
 *
 * "Who Wants to Be a Millionaire" style quiz carousel. Each trigger of
 * "Quiz Me" loads a batch of 3 questions the user can flip through with
 * left/right arrows (center-aligned to the panel edges) and dot indicators.
 */

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  {
    question: "What planet is known as the Red Planet?",
    options: ["A. Venus", "B. Mars", "C. Jupiter", "D. Mercury"],
    correct: 1,
  },
] as const;

const BATCH_SIZE = 3;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuizPanelProps {
  /** Incremented each time "Quiz Me" is triggered — loads a new batch. */
  questionIndex: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuizPanel({ questionIndex, className }: QuizPanelProps) {
  const getBatch = useCallback(
    (batchTrigger: number) => {
      const start = (batchTrigger * BATCH_SIZE) % QUESTIONS.length;
      const batch = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        batch.push(QUESTIONS[(start + i) % QUESTIONS.length]);
      }
      return batch;
    },
    [],
  );

  const [batch, setBatch] = useState(() => getBatch(questionIndex));
  const [activeIdx, setActiveIdx] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>([null, null, null]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    setBatch(getBatch(questionIndex));
    setActiveIdx(0);
    setSelected([null, null, null]);
    setRevealed([false, false, false]);
  }, [questionIndex, getBatch]);

  const q = batch[activeIdx];

  const handleSelect = (optIdx: number) => {
    if (revealed[activeIdx]) return;
    const newSelected = [...selected];
    newSelected[activeIdx] = optIdx;
    setSelected(newSelected);

    setTimeout(() => {
      setRevealed((prev) => {
        const next = [...prev];
        next[activeIdx] = true;
        return next;
      });
    }, 600);
  };

  const goLeft = () => setActiveIdx((i) => Math.max(0, i - 1));
  const goRight = () => setActiveIdx((i) => Math.min(BATCH_SIZE - 1, i + 1));

  const optionColors = [
    "bg-blue-500/20",
    "bg-amber-500/20",
    "bg-emerald-500/20",
    "bg-rose-500/20",
  ];
  const optionBorders = [
    "border-blue-500/40",
    "border-amber-500/40",
    "border-emerald-500/40",
    "border-rose-500/40",
  ];

  const isRevealed = revealed[activeIdx];
  const currentSelected = selected[activeIdx];

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${className || ""}`}
    >
      {/* Left arrow — vertically centered on left edge of panel */}
      <button
        onClick={goLeft}
        disabled={activeIdx === 0}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center px-14">
        {/* Question number */}
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Question {activeIdx + 1} of {BATCH_SIZE}
        </div>

        {/* Question */}
        <div className="mb-6 max-w-md text-center text-base font-semibold text-foreground">
          {q.question}
        </div>

        {/* Answer grid */}
        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correct;
            const isSelected = currentSelected === idx;

            let borderClass = optionBorders[idx];
            let bgClass = optionColors[idx];

            if (isRevealed) {
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
                  isRevealed ? "cursor-default" : "cursor-pointer"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {isRevealed && (
          <div className="mt-4 text-sm font-medium animate-in fade-in">
            {currentSelected === q.correct ? (
              <span className="text-emerald-400">🎉 Correct! Great job!</span>
            ) : (
              <span className="text-rose-400">
                Not quite — the answer is {q.options[q.correct]}
              </span>
            )}
          </div>
        )}

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: BATCH_SIZE }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === activeIdx
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right arrow — vertically centered on right edge of panel */}
      <button
        onClick={goRight}
        disabled={activeIdx === BATCH_SIZE - 1}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-30 transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
