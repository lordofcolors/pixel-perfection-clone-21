/**
 * LearnModeModal
 *
 * Shown when the learner clicks the "Learn" tile on the dashboard.
 * Contains:
 * 1. Suggested next lesson (rainbow gradient card)
 * 2. Create new skill button
 * 3. Recent lessons list with timestamps
 * 4. Search / view-all for browsing every lesson
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
  Sparkles,
  Plus,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  ChevronRight,
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

export function LearnModeModal({
  open,
  onOpenChange,
  learnerName,
}: LearnModeModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

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

    // Next lesson = first due lesson, or first unlocked lesson
    const due = flat.find((l) => l.isDue && !l.locked);
    const firstUnlocked = flat.find((l) => !l.locked);
    const next = due || firstUnlocked || null;

    // Recent = assigned lessons sorted by date descending (last 5)
    const recent = assignments
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

    return { nextLesson: next, recentLessons: recent, allLessons: flat };
  }, [learnerName, open]);

  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return allLessons.filter((l) => !l.locked);
    const q = searchQuery.toLowerCase();
    return allLessons.filter(
      (l) =>
        !l.locked &&
        (l.lessonTitle.toLowerCase().includes(q) ||
          l.skillTitle.toLowerCase().includes(q))
    );
  }, [allLessons, searchQuery]);

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
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <div className="space-y-6">
            {/* ── Top action cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Next suggested lesson */}
              {nextLesson && (
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
              )}

              {/* Create new skill */}
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

            {/* ── Recent lessons ── */}
            {recentLessons.length > 0 && !showAll && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Recent
                  </h3>
                </div>
                <div className="space-y-1">
                  {recentLessons.map((lesson, idx) => (
                    <button
                      key={`${lesson.skillTitle}-${lesson.lessonTitle}-${idx}`}
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
                            {lesson.assignedDate && (
                              <span className="ml-2 opacity-60">
                                · {formatDate(lesson.assignedDate)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── View All / Search ── */}
            <div className="space-y-3">
              {!showAll ? (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowAll(true)}
                >
                  <Search className="h-4 w-4" />
                  Browse All Lessons
                </Button>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAll(false);
                        setSearchQuery("");
                      }}
                      className="text-xs"
                    >
                      ← Back
                    </Button>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      All Lessons
                    </h3>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search lessons or skills…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1 max-h-[40vh]">
                    {filteredLessons.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No lessons found.
                      </p>
                    ) : (
                      filteredLessons.map((lesson, idx) => (
                        <button
                          key={`${lesson.skillTitle}-${lesson.lessonTitle}-${idx}`}
                          onClick={() =>
                            handleStartLesson(
                              lesson.skillTitle,
                              lesson.lessonTitle
                            )
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
                                {lesson.isDue && (
                                  <span className="ml-2 text-destructive font-medium">
                                    · Due
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
