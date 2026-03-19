import jumpRopeImg from "@/assets/jump-rope-infographic.jpg";

interface ImageSearchPanelProps {
  className?: string;
  variant?: "preview" | "expanded";
}

export function ImageSearchPanel({
  className,
  variant = "preview",
}: ImageSearchPanelProps) {
  if (variant === "expanded") {
    return (
      <div className={className}>
        <img
          src={jumpRopeImg}
          alt="Jump Rope Skills Infographic"
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
          src={jumpRopeImg}
          alt="Jump Rope Skills Infographic"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
