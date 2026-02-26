import { X, Sparkles, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ContinueLearningModalProps {
  open: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: "Save your progress and transcripts",
    description:
      "Keep everything you've learned in one place and continue right where you left off.",
  },
  {
    icon: Shield,
    title: "Secure and private by design",
    description:
      "Your learning history is safely stored and accessible only to you.",
  },
  {
    icon: ArrowRight,
    title: "Learning that adapts to you",
    description:
      "Get lesson recommendations based on your goals and what you've already mastered.",
  },
];

export function ContinueLearningModal({ open, onClose }: ContinueLearningModalProps) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-card border border-border/50 rounded-2xl p-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Continue Your Learning Journey
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          You've just taken your first lesson. Great work! Create a free account
          to save your transcript, track your progress, and unlock your next set
          of lessons.
        </p>

        {/* Features */}
        <div className="flex flex-col gap-6 mb-10">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <f.icon className="w-5 h-5 text-xolv-blue-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/onboarding")}
            className="w-full h-12 font-medium text-base bg-gradient-to-r dark:from-xolv-magenta-300 dark:via-xolv-blue-300 dark:to-xolv-teal-300 from-xolv-magenta-700 via-xolv-blue-600 to-xolv-teal-500 text-black"
          >
            Signup to Continue Learning
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full h-12 font-medium text-sm border-border/50"
          >
            Restart as a different persona
          </Button>
        </div>
      </div>
    </div>
  );
}
