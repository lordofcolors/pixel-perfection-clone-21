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
  imageIndex?: number;
}

export function ImageSearchPanel({
  className,
  variant = "preview",
  imageIndex = 0,
}: ImageSearchPanelProps) {
  const getBatch = (trigger: number) => {
    const start = ((trigger <= 0 ? 0 : trigger - 1) * BATCH_SIZE) % IMAGES.length;
    const batch = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      batch.push(IMAGES[(start + i) % IMAGES.length]);
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

  // Expanded mode — image fits to height, no scrollbar
  if (variant === "expanded") {
    return (
      <div className={`relative h-full w-full flex items-center justify-center ${className || ""}`}>
        {/* Left arrow — pinned to left edge of panel */}
        <button
          onClick={goLeft}
          disabled={activeIdx === 0}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-20 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Image + dots */}
        <div className="flex flex-col items-center h-full w-full px-16">
          <div className="flex-1 min-h-0 flex items-center justify-center w-full">
            <img
              src={img.src}
              alt={img.alt}
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          </div>
          <div className="flex items-center justify-center gap-2 py-3 flex-shrink-0">
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

        {/* Right arrow — pinned to right edge of panel */}
        <button
          onClick={goRight}
          disabled={activeIdx === BATCH_SIZE - 1}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-20 transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    );
  }

  // Preview (thumbnail / gallery) mode
  return (
    <div className={`relative h-full w-full flex items-center justify-center ${className || ""}`}>
      {/* Left arrow — pinned to left edge */}
      <button
        onClick={goLeft}
        disabled={activeIdx === 0}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-20 transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center h-full w-full px-10">
        <div className="flex-1 min-h-0 flex items-center justify-center w-full overflow-hidden">
          <img
            src={img.src}
            alt={img.alt}
            className="max-h-full max-w-full object-contain"
            draggable={false}
          />
        </div>
        <div className="flex items-center justify-center gap-2 py-2 flex-shrink-0">
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
      </div>

      {/* Right arrow — pinned to right edge */}
      <button
        onClick={goRight}
        disabled={activeIdx === BATCH_SIZE - 1}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground disabled:opacity-20 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
