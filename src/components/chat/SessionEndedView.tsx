import { FileText, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionEndedViewProps {
  learnerName: string;
  onBackToHome: () => void;
  onStartNewSession: () => void;
}

export function SessionEndedView({ learnerName, onBackToHome, onStartNewSession }: SessionEndedViewProps) {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-muted-foreground">
        <button onClick={onBackToHome} className="hover:text-foreground transition-colors">
          ← Back
        </button>
        <span className="text-border">|</span>
        <span>A by Xolv Companion</span>
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-8 flex-1">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-xolv-blue-300/20 flex items-center justify-center mb-4">
          <MessageCircle className="w-10 h-10 text-xolv-blue-300" />
        </div>

        <h1 className="text-3xl font-semibold text-foreground mb-8">Session Ended</h1>

        {/* Transcript & Insights Grid */}
        <div className="w-full grid gap-4 lg:grid-cols-2 mb-6">
          <div className="bg-card/30 border border-border/50 rounded-xl p-5 min-h-[180px] max-h-[300px] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Session Transcript</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-3">
              <div>
                <span className="text-xs font-mono text-muted-foreground/70">—</span>
                <div className="mt-1">
                  <span className="text-xolv-blue-300 font-medium">A:</span>{" "}
                  <span>Hi{learnerName ? `, ${learnerName}` : ""}! I'm A! It's nice to meet you!</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/30 border border-border/50 rounded-xl p-5 min-h-[180px] max-h-[300px] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {learnerName || "The learner"} was introduced to A for the first time. The session focused on making a friendly first connection.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { value: "< 1 min", label: "Session Duration" },
            { value: "1", label: "Messages Exchanged" },
            { value: "—", label: "Words per Message" },
            { value: "N/A", label: "Voice/Text Ratio" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card/30 border border-border/50 rounded-xl py-5 px-4 text-center">
              <div className="text-xl font-semibold text-xolv-blue-300">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="w-full flex items-center justify-between">
          <Button variant="outline" onClick={onBackToHome} className="border-border/50">
            Back to Home
          </Button>
          <Button
            onClick={onStartNewSession}
            className="bg-xolv-blue-300 hover:bg-xolv-blue-400 text-background"
          >
            Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
}
