import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Sparkles, Image as ImageIcon,
  MessageSquare, Users, Hand, Mic, Presentation, BriefcaseBusiness,
  Coffee, ShowerHead, Shirt, Footprints, UtensilsCrossed, Brush,
  Monitor, Figma, FileSpreadsheet, FileText, Palette, Code,
  Calculator, BookOpen, Languages, GraduationCap, PenTool, Brain,
  Heart, Lightbulb, Shield, Clock, Star, Puzzle,
  Music, Camera, Scissors, Wrench, DollarSign, MapPin
} from "lucide-react";
import { getOnboardingName } from "@/lib/store";

interface SkillTile {
  label: string;
  icon: React.ElementType;
}

interface SkillCategory {
  title: string;
  emoji: string;
  tiles: SkillTile[];
}

const categories: SkillCategory[] = [
  {
    title: "Social Skills",
    emoji: "💬",
    tiles: [
      { label: "Greeting people", icon: Hand },
      { label: "Making friends", icon: Users },
      { label: "Starting conversations", icon: MessageSquare },
      { label: "Public speaking", icon: Mic },
      { label: "Presenting in class", icon: Presentation },
      { label: "Interview prep", icon: BriefcaseBusiness },
      { label: "Active listening", icon: Heart },
      { label: "Resolving conflicts", icon: Shield },
      { label: "Asking for help", icon: Lightbulb },
      { label: "Giving compliments", icon: Star },
      { label: "Working in teams", icon: Users },
      { label: "Phone & video calls", icon: Monitor },
    ],
  },
  {
    title: "Life Skills & Hygiene",
    emoji: "🧼",
    tiles: [
      { label: "Brushing teeth", icon: Brush },
      { label: "Tying shoes", icon: Footprints },
      { label: "Doing laundry", icon: Shirt },
      { label: "Cooking basics", icon: UtensilsCrossed },
      { label: "Personal hygiene", icon: ShowerHead },
      { label: "Table manners", icon: Coffee },
      { label: "Organizing your space", icon: Puzzle },
      { label: "Getting dressed", icon: Shirt },
      { label: "Time management", icon: Clock },
      { label: "Money basics", icon: DollarSign },
      { label: "Using public transit", icon: MapPin },
      { label: "Grocery shopping", icon: Wrench },
    ],
  },
  {
    title: "Software & Tech",
    emoji: "💻",
    tiles: [
      { label: "Learning Figma", icon: Figma },
      { label: "Microsoft Excel", icon: FileSpreadsheet },
      { label: "Microsoft Word", icon: FileText },
      { label: "Google Docs", icon: FileText },
      { label: "Adobe Photoshop", icon: Palette },
      { label: "Canva design", icon: Palette },
      { label: "PowerPoint slides", icon: Presentation },
      { label: "Typing skills", icon: PenTool },
      { label: "Internet safety", icon: Shield },
      { label: "Using email", icon: MessageSquare },
      { label: "File management", icon: Monitor },
      { label: "Basic coding", icon: Code },
    ],
  },
  {
    title: "Education & Academics",
    emoji: "📚",
    tiles: [
      { label: "Math fundamentals", icon: Calculator },
      { label: "Reading comprehension", icon: BookOpen },
      { label: "Creative writing", icon: PenTool },
      { label: "Science projects", icon: Lightbulb },
      { label: "History & geography", icon: MapPin },
      { label: "Study techniques", icon: Brain },
      { label: "Homework help", icon: GraduationCap },
      { label: "Test preparation", icon: Star },
      { label: "Note-taking", icon: FileText },
      { label: "Research skills", icon: BookOpen },
      { label: "Problem solving", icon: Puzzle },
      { label: "Critical thinking", icon: Brain },
    ],
  },
  {
    title: "Languages",
    emoji: "🌍",
    tiles: [
      { label: "Learn Spanish", icon: Languages },
      { label: "Learn French", icon: Languages },
      { label: "Learn Mandarin", icon: Languages },
      { label: "Learn Japanese", icon: Languages },
      { label: "Learn Arabic", icon: Languages },
      { label: "Learn Portuguese", icon: Languages },
      { label: "Learn German", icon: Languages },
      { label: "Learn Italian", icon: Languages },
      { label: "Learn Korean", icon: Languages },
      { label: "Learn Sign Language", icon: Hand },
      { label: "Pronunciation practice", icon: Mic },
      { label: "Vocabulary building", icon: BookOpen },
    ],
  },
  {
    title: "Soft Skills & Independence",
    emoji: "🌱",
    tiles: [
      { label: "Building confidence", icon: Star },
      { label: "Being curious", icon: Lightbulb },
      { label: "Emotional regulation", icon: Heart },
      { label: "Setting goals", icon: Sparkles },
      { label: "Making decisions", icon: Brain },
      { label: "Self-advocacy", icon: Mic },
      { label: "Patience & focus", icon: Clock },
      { label: "Following routines", icon: Shield },
      { label: "Handling frustration", icon: Heart },
      { label: "Being responsible", icon: Star },
      { label: "Showing empathy", icon: Heart },
      { label: "Staying motivated", icon: Lightbulb },
    ],
  },
  {
    title: "Creative & Fun",
    emoji: "🎨",
    tiles: [
      { label: "Drawing & sketching", icon: PenTool },
      { label: "Playing music", icon: Music },
      { label: "Photography basics", icon: Camera },
      { label: "Arts & crafts", icon: Scissors },
      { label: "Storytelling", icon: BookOpen },
      { label: "Dance moves", icon: Sparkles },
      { label: "DIY projects", icon: Wrench },
      { label: "Digital art", icon: Palette },
      { label: "Video editing", icon: Camera },
      { label: "Journaling", icon: PenTool },
      { label: "Board games strategy", icon: Puzzle },
      { label: "Cooking recipes", icon: UtensilsCrossed },
    ],
  },
];

export default function LearnerSkillSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const learnerName = ((location.state as any)?.firstName as string | undefined) || getOnboardingName();
  const [customPrompt, setCustomPrompt] = useState("");

  useEffect(() => {
    document.title = "Select a Skill - Learner Dashboard";
    const desc = "Choose from preset skills or describe your own to add to your learning journey.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const handleSelectTile = (label: string) => {
    console.log("Selected skill:", label);
    // TODO: wire up to skill creation
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
                      return (
                        <button
                          key={tile.label}
                          onClick={() => handleSelectTile(tile.label)}
                          className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 text-left text-sm font-medium transition-all hover:border-primary/50 hover:bg-muted hover:shadow-sm active:scale-[0.98]"
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
