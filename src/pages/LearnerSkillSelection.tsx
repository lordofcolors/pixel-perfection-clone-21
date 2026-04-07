import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, Image as ImageIcon } from "lucide-react";
import { getOnboardingName } from "@/lib/store";
import { categories, type SkillTile } from "@/data/skillCatalog";
import { SkillPreviewPanel } from "@/components/learner/SkillPreviewPanel";

export default function LearnerSkillSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const learnerName = ((location.state as any)?.firstName as string | undefined) || getOnboardingName();
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedTile, setSelectedTile] = useState<SkillTile | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Select a Skill - Learner Dashboard";
  }, []);

  const handleSelectTile = (tile: SkillTile) => {
    setSelectedTile(tile);
    setPreviewPrompt(tile.prompt);
    setCustomPrompt(tile.prompt);
    // Scroll to preview after a tick
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleConfirm = () => {
    console.log("Begin learning:", previewPrompt);
    // TODO: wire up to skill creation
  };

  const handleClosePreview = () => {
    setSelectedTile(null);
    setPreviewPrompt("");
  };

  const handleCustomSubmit = () => {
    if (!customPrompt.trim()) return;
    console.log("Custom skill:", customPrompt);
    // TODO: wire up to skill creation
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
                    className="min-h-[120px] pr-24 text-base resize-none bg-card border-border"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      size="sm"
                      disabled={!customPrompt.trim()}
                      onClick={handleCustomSubmit}
                      className="gap-1.5"
                    >
                      <Sparkles className="h-4 w-4" />
                      Create Skill
                    </Button>
                  </div>
                </div>
              </section>

              {/* Preview panel (shown when a tile is selected) */}
              {selectedTile && (
                <div ref={previewRef}>
                  <SkillPreviewPanel
                    tile={selectedTile}
                    prompt={previewPrompt}
                    onPromptChange={(v) => {
                      setPreviewPrompt(v);
                      setCustomPrompt(v);
                    }}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {cat.tiles.map((tile) => {
                      const Icon = tile.icon;
                      const isActive = selectedTile?.label === tile.label;
                      return (
                        <button
                          key={tile.label}
                          onClick={() => handleSelectTile(tile)}
                          className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-all hover:border-primary/50 hover:bg-muted hover:shadow-sm active:scale-[0.98] ${
                            isActive
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-card"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">{tile.label}</span>
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
