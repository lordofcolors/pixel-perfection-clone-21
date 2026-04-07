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
  const img = IMAGES[imageIndex % IMAGES.length];

  if (variant === "expanded") {
    return (
      <div className={className}>
        <img
          src={img.src}
          alt={img.alt}
          className="block w-full h-auto"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <div className="flex items-center justify-center h-full w-full overflow-hidden">
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
