import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  // Derive a batch of 3 images
  const getBatch = (trigger: number) => {
    const start = (trigger * BATCH_SIZE) % IMAGES.length;
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

  if (variant === "expanded") {
    return (
      <div className={`flex flex-col h-full ${className || ""}`}>
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <img
            src={img.src}
            alt={img.alt}
            className="block w-full h-auto"
            draggable={false}
          />
        </div>
        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={goLeft}
            disabled={activeIdx === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={goRight}
            disabled={activeIdx === BATCH_SIZE - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Preview (thumbnail) mode
  return (
    <div className={`flex flex-col h-full w-full ${className || ""}`}>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
      {/* Dots + arrows */}
      <div className="flex items-center justify-center gap-3 py-2">
        <button
          onClick={goLeft}
          disabled={activeIdx === 0}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: BATCH_SIZE }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                i === activeIdx
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
        <button
          onClick={goRight}
          disabled={activeIdx === BATCH_SIZE - 1}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
