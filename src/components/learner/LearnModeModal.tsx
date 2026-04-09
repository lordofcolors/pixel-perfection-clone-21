/**
 * LearnModeModal
 *
 * Shown when the learner clicks the "Learn" tile on the dashboard.
 * Contains:
 * 1. Suggested next lesson (rainbow gradient card)
 * 2. Create new skill button (always visible)
 * 3. Recent/previous lessons with timestamps (mock data as fallback)
 * 4. Collapsible "View All Lessons" dropdown with search
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sparkles,
  Plus,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getGuardianSetup,
  getAssignmentsForLearner,
  type Skill,
} from "@/lib/store";

interface LearnModeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learnerName: string;
}

type FlatLesson = {
  skillTitle: string;
  lessonTitle: string;
  locked: boolean;
  isDue: boolean;
  dueDate?: string;
  assignedDate?: string;
};

// Mock previous lessons so the modal always has content
const MOCK_RECENT_LESSONS: FlatLesson[] = [
  {
    skillTitle: "Public Speaking",
    lessonTitle: "Voice and Delivery Basics",
    locked: false,
    isDue: false,
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    skillTitle: "Greeting People",
    lessonTitle: "Non-verbal Communication",
    locked: false,
    isDue: false,
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
  },
  {
    skillTitle: "Interviewing Skills",
    lessonTitle: "Common Interview Questions",
    locked: false,
    isDue: false,
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    skillTitle: "Public Speaking",
    lessonTitle: "Overcoming Speaking Anxiety",
    locked: false,
    isDue: false,
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
];

const MOCK_NEXT_LESSON: FlatLesson = {
  skillTitle: "Public Speaking",
  lessonTitle: "Structuring Your Message",
  locked: false,
  isDue: true,
  assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
};

export function LearnModeModal({
  open,
  onOpenChange,
  learnerName,
}: LearnModeModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAllOpen, setViewAllOpen] = useState(false);

  const { nextLesson, recentLessons, allLessons } = useMemo(() => {
    const setup = getGuardianSetup();
    const skills: Skill[] = setup?.skills?.[learnerName] || [];
    const assignments = getAssignmentsForLearner(learnerName);

    // Flatten all lessons
    const flat: FlatLesson[] = [];
    skills.forEach((skill) => {
      skill.lessons.forEach((lesson) => {
        const assignment = assignments.find(
          (a) => a.skillTitle === skill.title && a.lessonTitle === lesson.title
        );
        const isDue =
          !!assignment &&
          (assignment.status === "pending" || assignment.status === "in-progress");
        flat.push({
          skillTitle: skill.title,
          lessonTitle: lesson.title,
          locked: lesson.locked,
          isDue,
          dueDate: assignment?.dueDate,
          assignedDate: assignment?.assignedDate,
        });
      });
    });

    // Next lesson = first due, or first unlocked, or mock
    const due = flat.find((l) => l.isDue && !l.locked);
    const firstUnlocked = flat.find((l) => !l.locked);
    const next = due || firstUnlocked || MOCK_NEXT_LESSON;

    // Recent = real assignments or mock data
    const realRecent = assignments
      .filter((a) => a.status !== "completed")
      .sort(
        (a, b) =>
          new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
      )
      .slice(0, 5)
      .map((a) => ({
        skillTitle: a.skillTitle,
        lessonTitle: a.lessonTitle,
        locked: false,
        isDue: a.status === "pending" || a.status === "in-progress",
        dueDate: a.dueDate,
        assignedDate: a.assignedDate,
      }));

    const recent = realRecent.length > 0 ? realRecent : MOCK_RECENT_LESSONS;

    // All lessons = real + mock fallback
    const all = flat.length > 0 ? flat : [...MOCK_RECENT_LESSONS, MOCK_NEXT_LESSON];

    return { nextLesson: next, recentLessons: recent, allLessons: all };
  }, [learnerName, open]);

  const filteredLessons = useMemo(() => {
    const unlocked = allLessons.filter((l) => !l.locked);
    if (!searchQuery.trim()) return unlocked;
    const q = searchQuery.toLowerCase();
    return unlocked.filter(
      (l) =>
        l.lessonTitle.toLowerCase().includes(q) ||
        l.skillTitle.toLowerCase().includes(q)
    );
  }, [allLessons, searchQuery]);

  // Group filtered lessons by skill for the dropdown
  const groupedLessons = useMemo(() => {
    const groups: Record<string, FlatLesson[]> = {};
    filteredLessons.forEach((l) => {
      if (!groups[l.skillTitle]) groups[l.skillTitle] = [];
      groups[l.skillTitle].push(l);
    });
    return groups;
  }, [filteredLessons]);

  const handleStartLesson = (skillTitle: string, lessonTitle: string) => {
    onOpenChange(false);
    navigate("/chat", {
      state: {
        firstName: learnerName,
        mode: "learning",
        skillTitle,
        lessonTitle,
      },
    });
  };

  const handleAddSkill = () => {
    onOpenChange(false);
    navigate("/learner/add-skill", { state: { firstName: learnerName } });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setViewAllOpen(false); setSearchQuery(""); } }}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-xolv-magenta-300" />
            Choose a Lesson
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pick up where you left off or start something new.
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-5">
            {/* ── Top action cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Next suggested lesson */}
              <button
                onClick={() =>
                  handleStartLesson(nextLesson.skillTitle, nextLesson.lessonTitle)
                }
                className="relative flex flex-col gap-2 rounded-xl p-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-xolv-magenta-300/30 via-xolv-blue-300/20 to-xolv-teal-300/30 border border-xolv-magenta-300/30"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/60">
                    <ArrowRight className="h-4 w-4 text-xolv-magenta-300" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-xolv-teal-300">
                    Up Next
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {nextLesson.lessonTitle}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {nextLesson.skillTitle}
                  </p>
                </div>
              </button>

              {/* Create new skill — always visible */}
              <button
                onClick={handleAddSkill}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:border-primary/40"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    New Skill
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create a custom lesson plan.
                  </p>
                </div>
              </button>
            </div>

            {/* ── Recent / Previous Lessons ── */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Previous Lessons
              </h3>
              <div className="space-y-0.5">
                {recentLessons.map((lesson, idx) => (
                  <button
                    key={`recent-${lesson.skillTitle}-${lesson.lessonTitle}-${idx}`}
                    onClick={() =>
                      handleStartLesson(lesson.skillTitle, lesson.lessonTitle)
                    }
                    className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {lesson.lessonTitle}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {lesson.skillTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground/70">
                        {formatDate(lesson.assignedDate)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── View All Lessons (collapsible dropdown) ── */}
            <Collapsible open={viewAllOpen} onOpenChange={setViewAllOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between gap-2"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    View All Lessons
                  </span>
                  {viewAllOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lessons or skills…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Grouped lessons by skill */}
                <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                  {Object.keys(groupedLessons).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No lessons found.
                    </p>
                  ) : (
                    Object.entries(groupedLessons).map(([skill, lessons]) => (
                      <div key={skill} className="space-y-0.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 pt-1">
                          {skill}
                        </p>
                        {lessons.map((lesson, idx) => (
                          <button
                            key={`all-${lesson.lessonTitle}-${idx}`}
                            onClick={() =>
                              handleStartLesson(lesson.skillTitle, lesson.lessonTitle)
                            }
                            className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/60"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                              <p className="text-sm text-foreground truncate">
                                {lesson.lessonTitle}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {lesson.isDue && (
                                <span className="text-[10px] font-medium text-destructive">
                                  Due
                                </span>
                              )}
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
