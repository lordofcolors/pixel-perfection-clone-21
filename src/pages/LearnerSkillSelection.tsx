import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, Image as ImageIcon, BookOpen } from "lucide-react";
import { getOnboardingName } from "@/lib/store";
import { categories, type SkillTile } from "@/data/skillCatalog";
import { SkillPreviewPanel } from "@/components/learner/SkillPreviewPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LearnerSkillSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const learnerName = ((location.state as any)?.firstName as string | undefined) || getOnboardingName();

  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedTile, setSelectedTile] = useState<SkillTile | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [previewLessons, setPreviewLessons] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Select a Skill - Learner Dashboard";
  }, []);

  const generateCurriculum = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setShowPreview(true);
    setPreviewLessons([]);

    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);

    try {
      const { data, error } = await supabase.functions.invoke("generate-lessons", {
        body: { skillDescription: prompt },
      });

      if (error) throw error;

      const lessons: string[] = (data?.lessons || []).map((l: any) => {
        // Strip the "0: " prefix if present
        const title = l.title || l;
        return typeof title === "string" ? title.replace(/^\d+:\s*/, "") : String(title);
      });

      if (lessons.length === 0) throw new Error("No lessons generated");

      setPreviewLessons(lessons);
    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error(err.message || "Failed to generate curriculum. Please try again.");
      // Fallback to preset lessons if we have a tile selected
      if (selectedTile) {
        setPreviewLessons([...selectedTile.lessons]);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTile]);

  const handleSelectTile = (tile: SkillTile) => {
    setSelectedTile(tile);
    setPreviewPrompt(tile.prompt);
    setCustomPrompt(tile.prompt);
    // Show preset lessons immediately as preview
    setPreviewLessons([...tile.lessons]);
    setShowPreview(true);
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleGenerateCurriculum = () => {
    const prompt = customPrompt.trim();
    if (!prompt) return;
    setPreviewPrompt(prompt);
    generateCurriculum(prompt);
  };

  const handleLessonChange = (idx: number, value: string) => {
    setPreviewLessons((prev) => prev.map((l, i) => (i === idx ? value : l)));
  };

  const handleConfirm = () => {
    console.log("Begin learning:", previewPrompt, "Lessons:", previewLessons);
    // TODO: wire up to skill + lesson creation in DB
    toast.success("Skill created! Starting your learning journey.");
  };

  const handleClosePreview = () => {
    setSelectedTile(null);
    setPreviewPrompt("");
    setPreviewLessons([]);
    setShowPreview(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar learnerName={learnerName} />

        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/learner", { state: { firstName: learnerName } })}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg font-semibold">Add a Skill</h1>
            </div>
          </header>

          <main className="p-6 pb-20">
            <div className="max-w-5xl mx-auto space-y-10">
              {/* Hero prompt */}
              <section className="space-y-4">
                <h1 className="text-3xl font-bold">What do you want to learn?</h1>
                <p className="text-muted-foreground text-lg">
                  Describe any skill, topic, or goal — or pick from the examples below.
                </p>

                <div className="relative">
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. I want to learn how to introduce myself to new people, practice ordering food at a restaurant, learn basic Python coding…"
                    className="min-h-[120px] pr-4 pb-14 text-base resize-none bg-card border-border"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!customPrompt.trim() || isGenerating}
                      onClick={handleGenerateCurriculum}
                      className="gap-1.5"
                    >
                      <BookOpen className="h-4 w-4" />
                      Generate Curriculum
                    </Button>
                    <Button
                      size="sm"
                      disabled={!customPrompt.trim() || previewLessons.length === 0}
                      onClick={handleConfirm}
                      className="gap-1.5"
                    >
                      <Sparkles className="h-4 w-4" />
                      Begin Learning
                    </Button>
                  </div>
                </div>
              </section>

              {/* Preview panel */}
              {showPreview && (
                <div ref={previewRef}>
                  <SkillPreviewPanel
                    tile={selectedTile}
                    prompt={previewPrompt}
                    lessons={previewLessons}
                    isGenerating={isGenerating}
                    onPromptChange={(v) => {
                      setPreviewPrompt(v);
                      setCustomPrompt(v);
                    }}
                    onLessonChange={handleLessonChange}
                    onRegenerate={() => generateCurriculum(previewPrompt)}
                    onConfirm={handleConfirm}
                    onClose={handleClosePreview}
                  />
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted-foreground font-medium">or explore ideas</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Category sections */}
              {categories.map((cat) => (
                <section key={cat.title} className="space-y-3">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    {cat.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.tiles.map((tile) => {
                      const Icon = tile.icon;
                      const isActive = selectedTile?.label === tile.label;
                      return (
                        <button
                          key={tile.label}
                          onClick={() => handleSelectTile(tile)}
                          className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition-all hover:border-primary/50 hover:bg-muted hover:shadow-sm active:scale-[0.99] ${
                            isActive
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-card"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-snug">{tile.label}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tile.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* Info */}
              <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Don't see what you need?</p>
                  <p className="text-sm text-muted-foreground">
                    Use the prompt above to describe anything you'd like to learn. We'll create a personalised curriculum just for you.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
