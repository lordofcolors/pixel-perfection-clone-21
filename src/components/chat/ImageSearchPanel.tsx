import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import jumpRopeImg from "@/assets/jump-rope-infographic.jpg";
import solarSystemImg from "@/assets/infographic-solar-system.jpg";
import waterCycleImg from "@/assets/infographic-water-cycle.jpg";
import humanBodyImg from "@/assets/infographic-human-body.jpg";

const IMAGES = [
  { src: jumpRopeImg, alt: "Jump Rope Skills Infographic" },
  { src: solarSystemImg, alt: "Solar System Infographic" },
  { src: waterCycleImg, alt: "Water Cycle Infographic" },
  { src: humanBodyImg, alt: "Human Body Infographic" },
];

const BATCH_SIZE = 3;

interface ImageSearchPanelProps {
  className?: string;
  variant?: "preview" | "expanded";
  /** Incremented each time "Find Image" is triggered — loads a new batch. */
  imageIndex?: number;
}

export function ImageSearchPanel({
  className,
  variant = "preview",
  imageIndex = 0,
}: ImageSearchPanelProps) {
  const getBatch = (trigger: number) => {
    const start = ((trigger - 1) * BATCH_SIZE) % IMAGES.length;
    const batch = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      batch.push(IMAGES[((start < 0 ? 0 : start) + i) % IMAGES.length]);
    }
    return batch;
  };

  const [batch, setBatch] = useState(() => getBatch(imageIndex));
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setBatch(getBatch(imageIndex));
    setActiveIdx(0);
  }, [imageIndex]);

  const img = batch[activeIdx];
  const goLeft = () => setActiveIdx((i) => Math.max(0, i - 1));
  const goRight = () => setActiveIdx((i) => Math.min(BATCH_SIZE - 1, i + 1));

  if (variant === "expanded") {
    return (
      <div className={`relative flex h-full ${className || ""}`}>
        {/* Left arrow — vertically centered on left edge */}
        <button
          onClick={goLeft}
          disabled={activeIdx === 0}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Image */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto px-14">
          <img
            src={img.src}
            alt={img.alt}
            className="block w-full h-auto max-h-full object-contain"
            draggable={false}
          />
          {/* Dots */}
          <div className="flex items-center justify-center gap-2 py-3">
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

        {/* Right arrow — vertically centered on right edge */}
        <button
          onClick={goRight}
          disabled={activeIdx === BATCH_SIZE - 1}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-30 transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    );
  }

  // Preview (thumbnail / gallery) mode
  return (
    <div className={`relative flex flex-col h-full w-full ${className || ""}`}>
      {/* Left arrow */}
      <button
        onClick={goLeft}
        disabled={activeIdx === 0}
        className="absolute left-1 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex-1 flex items-center justify-center overflow-hidden px-10">
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 py-2">
        {Array.from({ length: BATCH_SIZE }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === activeIdx
                ? "bg-primary scale-125"
                : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
          />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={goRight}
        disabled={activeIdx === BATCH_SIZE - 1}
        className="absolute right-1 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-30 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
