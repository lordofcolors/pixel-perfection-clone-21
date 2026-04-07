import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, X, Pencil } from "lucide-react";
import type { SkillTile } from "@/data/skillCatalog";

interface SkillPreviewPanelProps {
  tile: SkillTile;
  prompt: string;
  onPromptChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function SkillPreviewPanel({
  tile,
  prompt,
  onPromptChange,
  onConfirm,
  onClose,
}: SkillPreviewPanelProps) {
  const Icon = tile.icon;

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{tile.label}</h3>
            <p className="text-sm text-muted-foreground">Preview curriculum · 6 lessons</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Editable prompt */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Pencil className="h-3 w-3" />
          Your learning goal (edit to customise)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[72px]"
        />
      </div>

      {/* Lesson preview */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <BookOpen className="h-3 w-3" />
          Curriculum preview
        </p>
        <ol className="grid gap-1.5">
          {tile.lessons.map((lesson, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {idx + 1}
              </span>
              <span className="text-foreground">{lesson}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={onConfirm} className="gap-1.5">
          <Sparkles className="h-4 w-4" />
          Begin Learning
        </Button>
      </div>
    </div>
  );
}
