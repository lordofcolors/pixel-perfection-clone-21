import { useState, useEffect, useCallback } from "react";
import { X, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface QuickStartModalProps {
  open: boolean;
  onClose: () => void;
  onStart: (name: string, role: "learner" | "guardian") => void;
}

const roles = [
  {
    role: "learner" as const,
    title: "Learner",
    description: "For students and job seekers building career, social, and daily skills",
    titleColorClass: "text-xolv-teal-300",
    borderClass: "ring-xolv-teal-400",
  },
  {
    role: "guardian" as const,
    title: "Parent/Guardian",
    description: "For parents and caregivers supporting a learner",
    titleColorClass: "text-xolv-magenta-300",
    borderClass: "ring-xolv-magenta-400",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-10"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-lg mx-4 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-foreground font-semibold mb-3">
            Welcome!
          </h2>
          <p className="text-xolv-magenta-300 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            Before you meet A for the first time, let's get your profile set up.
          </p>
        </div>

        {/* Name input */}
        <div className="w-full mb-8">
          <label htmlFor="quickstart-name" className="block text-sm font-medium text-foreground mb-2">
            What's your first name?
          </label>
          <Input
            id="quickstart-name"
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Role selection */}
        <div className="w-full mb-10">
          <p className="text-sm font-medium text-foreground mb-4">
            Pick the role that fits you best:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {roles.map((r) => (
              <Card
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className={`cursor-pointer p-5 transition-all duration-200 hover:scale-[1.02] ${
                  selectedRole === r.role
                    ? `ring-2 ${r.borderClass} border-transparent`
                    : "border-border"
                }`}
                role="button"
                tabIndex={0}
                aria-pressed={selectedRole === r.role}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedRole(r.role);
                  }
                }}
              >
                <div className={`text-sm font-bold mb-1 ${r.titleColorClass}`}>
                  {r.title}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {r.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Mic + Start CTA — same width */}
        <div className="w-full flex flex-col items-center gap-3">
          {/* Microphone button */}
          {micStatus === "granted" ? (
            <div className="w-full h-12 rounded-lg border border-xolv-teal-400/30 bg-xolv-teal-400/10 flex items-center justify-center gap-2 text-sm text-xolv-teal-400">
              <Mic className="w-4 h-4" />
              Microphone enabled
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={requestMic}
              className="w-full h-12 gap-2 text-sm"
            >
              {micStatus === "denied" ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
              {micStatus === "denied"
                ? "Microphone blocked — check browser settings"
                : "Enable Microphone"}
            </Button>
          )}

          {/* Start Chatting */}
          <Button
            disabled={!canStart}
            onClick={() => canStart && onStart(name.trim(), selectedRole!)}
            className={`w-full h-12 font-medium text-base transition-all ${
              canStart
                ? "bg-gradient-to-r dark:from-xolv-magenta-300 dark:via-xolv-blue-300 dark:to-xolv-teal-300 from-xolv-magenta-700 via-xolv-blue-600 to-xolv-teal-500 text-black"
                : "bg-muted/40 text-muted-foreground/30 border border-border/50 cursor-not-allowed"
            }`}
          >
            Start Chatting
          </Button>

          <p className="text-[11px] text-muted-foreground/50 text-center leading-relaxed mt-1">
            A is a voice-first experience. Allow microphone access to speak with A directly.
          </p>
        </div>
      </div>
    </div>
  );
}
