import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, X, Pencil, Loader2, RotateCcw } from "lucide-react";
import type { SkillTile } from "@/data/skillCatalog";

interface SkillPreviewPanelProps {
  tile: SkillTile | null;
  prompt: string;
  lessons: string[];
  isGenerating: boolean;
  onPromptChange: (v: string) => void;
  onLessonChange: (idx: number, value: string) => void;
  onRegenerate: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function SkillPreviewPanel({
  tile,
  prompt,
  lessons,
  isGenerating,
  onPromptChange,
  onLessonChange,
  onRegenerate,
  onConfirm,
  onClose,
}: SkillPreviewPanelProps) {
  const Icon = tile?.icon;
  const title = tile?.label || "Custom Skill";

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {isGenerating ? "Generating curriculum…" : `${lessons.length} lessons`}
            </p>
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

      {/* Lessons */}
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Creating your personalised curriculum…</p>
        </div>
      ) : lessons.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" />
              Curriculum preview — click any lesson to edit
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="h-7 gap-1 text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Regenerate
            </Button>
          </div>
          <ol className="grid gap-1.5">
            {lessons.map((lesson, idx) => (
              <li
                key={idx}
                className="group flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 hover:border-primary/40 hover:bg-muted/50 transition-colors cursor-text focus-within:border-primary focus-within:bg-muted/50 focus-within:ring-1 focus-within:ring-primary/30"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={lesson}
                  onChange={(e) => onLessonChange(idx, e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none caret-primary placeholder:text-muted-foreground"
                  placeholder="Enter lesson title…"
                />
                <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground group-focus-within:text-primary transition-colors" />
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onConfirm}
          disabled={isGenerating || lessons.length === 0}
          className="gap-1.5"
        >
          <Sparkles className="h-4 w-4" />
          Begin Learning
        </Button>
      </div>
    </div>
  );
}
