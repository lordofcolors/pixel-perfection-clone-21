interface ImageSearchPanelProps {
  className?: string;
}

export function ImageSearchPanel({ className }: ImageSearchPanelProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <div className="flex flex-col h-full p-5 overflow-auto">
        <h3 className="text-sm font-semibold text-foreground mb-4">Snowboarding Equipment Guide</h3>

        {/* Infographic-style content */}
        <div className="space-y-4 flex-1">
          {/* Header stat bar */}
          <div className="flex gap-3">
            {[
              { label: "Board Types", value: "4" },
              { label: "Skill Level", value: "Beginner" },
              { label: "Gear Items", value: "12" },
            ].map((s) => (
              <div key={s.label} className="flex-1 rounded-lg bg-secondary/10 p-3 text-center">
                <div className="text-lg font-bold text-secondary">{s.value}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Visual breakdown */}
          <div className="rounded-lg bg-muted/30 p-4">
            <div className="text-xs font-medium text-foreground mb-3">Equipment Breakdown</div>
            <div className="space-y-2.5">
              {[
                { name: "Snowboard", pct: 85, color: "bg-secondary" },
                { name: "Bindings", pct: 70, color: "bg-primary" },
                { name: "Boots", pct: 90, color: "bg-chart-2" },
                { name: "Helmet", pct: 95, color: "bg-chart-3" },
                { name: "Goggles", pct: 60, color: "bg-chart-4" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground font-medium">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/50">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key facts */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "🏔️", title: "Terrain", desc: "Groomed runs ideal for beginners" },
              { icon: "🎿", title: "Stance", desc: "Regular or goofy — find your lead foot" },
              { icon: "❄️", title: "Conditions", desc: "Powder vs packed snow techniques" },
              { icon: "⚡", title: "Safety", desc: "Always wear helmet and wrist guards" },
            ].map((fact) => (
              <div key={fact.title} className="rounded-lg bg-muted/20 p-3">
                <div className="text-base mb-1">{fact.icon}</div>
                <div className="text-xs font-medium text-foreground">{fact.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{fact.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
