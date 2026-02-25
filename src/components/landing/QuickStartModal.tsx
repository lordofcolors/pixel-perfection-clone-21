import { useState, useEffect, useCallback } from "react";
import { X, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleCard } from "@/components/onboarding/RoleCard";

interface QuickStartModalProps {
  open: boolean;
  onClose: () => void;
  onStart: (name: string, role: "learner" | "guardian") => void;
}

const roleCards = [
  {
    role: "learner" as const,
    title: "Learner",
    description: "For students and job seekers building career skills",
    bulletPoints: [
      "You manage your own monthly subscription",
      "Learn independently at your own pace",
      "Full control over your learning journey",
    ],
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/9107901cbfe710c4b3a731604ada2cac0d28a37a?width=240",
    imageAlt: "learner",
    backgroundColor: "#3FBDD1",
    titleColorClass: "text-xolv-teal-300",
    imageClassName: "w-[120px] h-[87px] left-[63px] top-[35px]",
  },
  {
    role: "guardian" as const,
    title: "Parent/Guardian",
    description: "For parents and caregivers supporting a learner",
    bulletPoints: [
      "You manage subscription on learner's behalf",
      "Track activity and learning progress",
      "Assign skills and lessons with due dates",
    ],
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/8d59003dfe2826aab8d09c5daa647bf58f9895e6?width=270",
    imageAlt: "guardian",
    backgroundColor: "#CA7FCD",
    titleColorClass: "text-xolv-magenta-300",
    imageClassName: "w-[135px] h-[125px] left-[22px] -top-1.5",
  },
];

type MicStatus = "prompt" | "granted" | "denied" | "unknown";

export function QuickStartModal({ open, onClose, onStart }: QuickStartModalProps) {
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"learner" | "guardian" | null>(null);
  const [micStatus, setMicStatus] = useState<MicStatus>("unknown");

  const checkMicPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
      setMicStatus(result.state as MicStatus);
      result.onchange = () => setMicStatus(result.state as MicStatus);
    } catch {
      setMicStatus("unknown");
    }
  }, []);

  useEffect(() => {
    if (open) checkMicPermission();
  }, [open, checkMicPermission]);

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicStatus("granted");
    } catch {
      setMicStatus("denied");
    }
  };

  const canStart = name.trim().length >= 2 && selectedRole && micStatus === "granted";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 max-h-[95vh] overflow-y-auto rounded-2xl border border-border bg-card p-8 md:p-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl text-foreground font-semibold mb-2">
            Welcome!
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto">
            Before you meet A for the first time, let's get your profile set up. Fill in your details below so we can personalise your experience.
          </p>
        </div>

        {/* Name input */}
        <div className="mb-8">
          <label htmlFor="quickstart-name" className="block text-sm font-medium text-foreground mb-2">
            What's your first name?
          </label>
          <Input
            id="quickstart-name"
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Role selection */}
        <div className="mb-8">
          <p className="text-sm font-medium text-foreground mb-4">
            Pick the role that fits you best:
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {roleCards.map((card) => (
              <RoleCard
                key={card.role}
                {...card}
                isSelected={selectedRole === card.role}
                onSelect={() => setSelectedRole(card.role)}
              />
            ))}
          </div>
        </div>

        {/* Microphone permission */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3">
            {micStatus === "granted" ? (
              <div className="flex items-center gap-2 text-sm text-xolv-teal-400">
                <Mic className="w-4 h-4" />
                Microphone enabled
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={requestMic}
                className="gap-2"
              >
                {micStatus === "denied" ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                {micStatus === "denied" ? "Microphone blocked — check browser settings" : "Enable Microphone"}
              </Button>
            )}
          </div>
        </div>

        {/* Start CTA */}
        <div className="flex flex-col items-center gap-3">
          <Button
            disabled={!canStart}
            onClick={() => canStart && onStart(name.trim(), selectedRole!)}
            className="w-full max-w-sm h-12 bg-gradient-to-r dark:from-xolv-magenta-300 dark:via-xolv-blue-300 dark:to-xolv-teal-300 from-xolv-magenta-700 via-xolv-blue-600 to-xolv-teal-500 text-black font-medium text-base"
          >
            Start Chatting
          </Button>
          <p className="text-[11px] text-muted-foreground/70 text-center max-w-sm leading-relaxed">
            A is a voice-first experience. Please allow microphone access so you can speak with A directly.
          </p>
        </div>
      </div>
    </div>
  );
}
