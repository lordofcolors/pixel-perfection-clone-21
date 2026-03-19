interface ImageSearchPanelProps {
  className?: string;
}

export function ImageSearchPanel({ className }: ImageSearchPanelProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/20 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Image Search</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            A is searching for relevant images to help illustrate the lesson content…
          </p>
        </div>
        {/* Mock image results grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
          {[
            "Snowboarding basics",
            "Board equipment",
            "Safety gear",
            "Mountain terrain",
          ].map((label) => (
            <div
              key={label}
              className="aspect-video rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center"
            >
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs text-muted-foreground">Image</span>
        </div>
      </div>
    </div>
  );
}
