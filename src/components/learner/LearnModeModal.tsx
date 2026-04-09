/**
 * LearnModeModal
 *
 * Shown when the learner clicks the "Learn" tile on the dashboard.
 * 1. Suggested next lesson (rainbow gradient card)
 * 2. Create new skill button (always visible)
 * 3. Previous lessons with timestamps (mock fallback)
 * 4. Dropdown select to pick a skill → see its lessons inline
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Plus,
  Clock,
  ArrowRight,
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

const MOCK_RECENT_LESSONS: FlatLesson[] = [
  {
    skillTitle: "Public Speaking",
    lessonTitle: "Voice and Delivery Basics",
    locked: false, isDue: false,
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    skillTitle: "Greeting People",
    lessonTitle: "Non-verbal Communication",
    locked: false, isDue: false,
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    skillTitle: "Interviewing Skills",
    lessonTitle: "Common Interview Questions",
    locked: false, isDue: false,
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    skillTitle: "Public Speaking",
    lessonTitle: "Overcoming Speaking Anxiety",
    locked: false, isDue: false,
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

const MOCK_NEXT_LESSON: FlatLesson = {
  skillTitle: "Public Speaking",
  lessonTitle: "Structuring Your Message",
  locked: false, isDue: true,
  assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
};

const MOCK_ALL_SKILLS: { name: string; lessons: FlatLesson[] }[] = [
  {
    name: "Public Speaking",
    lessons: [
      { skillTitle: "Public Speaking", lessonTitle: "Overcoming Speaking Anxiety", locked: false, isDue: false },
      { skillTitle: "Public Speaking", lessonTitle: "Voice and Delivery Basics", locked: false, isDue: false },
      { skillTitle: "Public Speaking", lessonTitle: "Structuring Your Message", locked: false, isDue: true },
    ],
  },
  {
    name: "Greeting People",
    lessons: [
      { skillTitle: "Greeting People", lessonTitle: "Confidence Building Basics", locked: false, isDue: false },
      { skillTitle: "Greeting People", lessonTitle: "Non-verbal Communication", locked: false, isDue: false },
      { skillTitle: "Greeting People", lessonTitle: "Simple Greeting Techniques", locked: false, isDue: false },
    ],
  },
  {
    name: "Interviewing Skills",
    lessons: [
      { skillTitle: "Interviewing Skills", lessonTitle: "Self-Assessment & Goals", locked: false, isDue: false },
      { skillTitle: "Interviewing Skills", lessonTitle: "Research & Preparation Basics", locked: false, isDue: false },
      { skillTitle: "Interviewing Skills", lessonTitle: "Common Interview Questions", locked: false, isDue: false },
    ],
  },
];

export function LearnModeModal({
  open,
  onOpenChange,
  learnerName,
}: LearnModeModalProps) {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  const { nextLesson, recentLessons, skillGroups } = useMemo(() => {
    const setup = getGuardianSetup();
    const skills: Skill[] = setup?.skills?.[learnerName] || [];
    const assignments = getAssignmentsForLearner(learnerName);

    // Flatten all lessons
    const flat: FlatLesson[] = [];
    const groups: { name: string; lessons: FlatLesson[] }[] = [];

    skills.forEach((skill) => {
      const skillLessons: FlatLesson[] = [];
      skill.lessons.forEach((lesson) => {
        const assignment = assignments.find(
          (a) => a.skillTitle === skill.title && a.lessonTitle === lesson.title
        );
        const isDue =
          !!assignment &&
          (assignment.status === "pending" || assignment.status === "in-progress");
        const fl: FlatLesson = {
          skillTitle: skill.title,
          lessonTitle: lesson.title,
          locked: lesson.locked,
          isDue,
          dueDate: assignment?.dueDate,
          assignedDate: assignment?.assignedDate,
        };
        flat.push(fl);
        if (!lesson.locked) skillLessons.push(fl);
      });
      if (skillLessons.length > 0) {
        groups.push({ name: skill.title, lessons: skillLessons });
      }
    });

    const due = flat.find((l) => l.isDue && !l.locked);
    const firstUnlocked = flat.find((l) => !l.locked);
    const next = due || firstUnlocked || MOCK_NEXT_LESSON;

    const realRecent = assignments
      .filter((a) => a.status !== "completed")
      .sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime())
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
    const sg = groups.length > 0 ? groups : MOCK_ALL_SKILLS;

    return { nextLesson: next, recentLessons: recent, skillGroups: sg };
  }, [learnerName, open]);

  const selectedLessons = useMemo(() => {
    if (!selectedSkill) return [];
    const group = skillGroups.find((g) => g.name === selectedSkill);
    return group?.lessons || [];
  }, [selectedSkill, skillGroups]);

  const handleStartLesson = (skillTitle: string, lessonTitle: string) => {
    onOpenChange(false);
    navigate("/chat", {
      state: { firstName: learnerName, mode: "learning", skillTitle, lessonTitle },
    });
  };

  const handleAddSkill = () => {
    onOpenChange(false);
    navigate("/learner/add-skill", { state: { firstName: learnerName } });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSelectedSkill(""); }}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-8 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-xolv-magenta-300" />
            Choose a Lesson to Begin Learning
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pick up where you left off or start something new.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="space-y-5">
            {/* ── Top action cards ── */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Next suggested lesson — rainbow gradient border */}
              <div className="rounded-xl bg-gradient-to-br from-xolv-magenta-300 via-xolv-blue-300 to-xolv-teal-300 p-[1.5px]">
                <button
                  type="button"
                  onClick={() => handleStartLesson(nextLesson.skillTitle, nextLesson.lessonTitle)}
                  className="flex w-full appearance-none flex-col gap-2 rounded-[10px] bg-card p-4 text-left outline-none ring-0 shadow-none transition-colors focus:outline-none focus:!ring-0 focus-visible:!ring-0"
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
              </div>

              {/* Create new skill */}
              <button
                type="button"
                onClick={handleAddSkill}
                className="flex appearance-none flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left outline-none transition-colors ring-0 shadow-none focus:outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:outline-none focus-visible:!ring-0"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">New Skill to Learn</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Create a custom lesson plan.</p>
                </div>
              </button>
            </div>

            {/* ── Browse Lessons by Skill (dropdown) ── */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-3 w-3" />
                Browse Lessons by Skill
              </h3>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-full appearance-none shadow-none ring-0 outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 data-[state=open]:border-input data-[state=open]:ring-0 data-[state=open]:ring-offset-0">
                  <SelectValue placeholder="Select a skill…" />
                </SelectTrigger>
                <SelectContent>
                  {skillGroups.map((group) => (
                    <SelectItem key={group.name} value={group.name}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSkill && selectedLessons.length > 0 && (
                <div className="space-y-0.5 rounded-lg border border-border bg-muted/20 p-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {selectedLessons.map((lesson, idx) => (
                    <div
                      key={`browse-${lesson.lessonTitle}-${idx}`}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60 cursor-default"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-foreground truncate">{lesson.lessonTitle}</p>
                      </div>
                      {lesson.isDue && (
                        <span className="text-[10px] font-medium text-destructive shrink-0">Due</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Previous Lessons ── */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Previous Lessons
              </h3>
              <div className="space-y-0.5">
                {recentLessons.map((lesson, idx) => (
                  <div
                    key={`recent-${lesson.skillTitle}-${lesson.lessonTitle}-${idx}`}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60 cursor-default"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{lesson.lessonTitle}</p>
                        <p className="text-xs text-muted-foreground truncate">{lesson.skillTitle}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground/70 shrink-0">{formatDate(lesson.assignedDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
