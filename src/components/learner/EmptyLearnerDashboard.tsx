/**
 * =============================================================================
 * EmptyLearnerDashboard → Mode Selection Home
 * =============================================================================
 *
 * The default learner landing page. Presents four learning modes as
 * selectable tiles:
 *
 * 1. **Daily Chat** — Quick warm-up conversation with A, then transitions
 *    into skill building on the next assigned lesson.
 * 2. **Companion Mode** — Open-ended chat with A about anything.
 * 3. **Study Mode** — Focused homework/activity breakdown.
 * 4. **Skill Building** — Jump straight to any lesson in the sidebar.
 */

import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  GraduationCap,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface EmptyLearnerDashboardProps {
  learnerName: string;
}

const MODES = [
  {
    id: "daily-chat",
    title: "Daily Chat",
    description:
      "Start with a quick chat with A, then move into your next assigned lesson.",
    icon: MessageCircle,
    recommended: true,
    color: "from-xolv-teal-300/20 to-xolv-teal-300/5",
    borderColor: "border-xolv-teal-300/40",
    iconColor: "text-xolv-teal-300",
  },
  {
    id: "companion",
    title: "Companion Mode",
    description:
      "Have an open conversation with A about anything on your mind — no lessons, just vibes.",
    icon: Sparkles,
    recommended: false,
    color: "from-xolv-magenta-300/20 to-xolv-magenta-300/5",
    borderColor: "border-xolv-magenta-300/40",
    iconColor: "text-xolv-magenta-300",
  },
  {
    id: "study",
    title: "Study Mode",
    description:
      "Focus on your school homework or activities. A will help you break it down step by step.",
    icon: BookOpen,
    recommended: false,
    color: "from-xolv-blue-300/20 to-xolv-blue-300/5",
    borderColor: "border-xolv-blue-300/40",
    iconColor: "text-xolv-blue-300",
  },
  {
    id: "skill-building",
    title: "Skill Building",
    description:
      "Jump straight into any skill or lesson from your curriculum — learn at your own pace.",
    icon: GraduationCap,
    recommended: false,
    color: "from-amber-400/20 to-amber-400/5",
    borderColor: "border-amber-400/40",
    iconColor: "text-amber-400",
  },
] as const;

export function EmptyLearnerDashboard({
  learnerName,
}: EmptyLearnerDashboardProps) {
  const navigate = useNavigate();

  const handleSelect = (modeId: string) => {
    // For now all modes navigate to /chat with a mode flag
    navigate("/chat", {
      state: { firstName: learnerName, mode: modeId },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full max-w-3xl mx-auto px-4">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          What would you like to do today?
        </h2>
        <p className="text-sm text-muted-foreground">
          Pick a mode to get started, {learnerName}.
        </p>
      </div>

      {/* Mode tiles */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleSelect(mode.id)}
            className={`group relative flex flex-col items-start gap-3 rounded-2xl border bg-gradient-to-br p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${mode.color} ${mode.borderColor}`}
          >
            {/* Recommended badge */}
            {mode.recommended && (
              <span className="absolute right-3 top-3 rounded-full bg-xolv-teal-300/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-xolv-teal-300">
                Recommended
              </span>
            )}

            {/* Icon */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-background/50 ${mode.iconColor}`}
            >
              <mode.icon className="h-5 w-5" />
            </div>

            {/* Text */}
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {mode.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {mode.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
