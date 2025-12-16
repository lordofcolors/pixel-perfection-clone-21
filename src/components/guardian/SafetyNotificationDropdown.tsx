import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, Bell, ExternalLink } from "lucide-react";

export interface SafetyIssue {
  id: string;
  learnerName: string;
  lessonTitle: string;
  flaggedContent: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  sessionId: string;
}

interface SafetyNotificationDropdownProps {
  issues: SafetyIssue[];
  onViewSession: (sessionId: string, learnerName: string) => void;
}

// Mock safety alerts for demo
export const MOCK_SAFETY_ALERTS: SafetyIssue[] = [
  {
    id: "alert-1",
    learnerName: "Jake",
    lessonTitle: "Interview Practice Session",
    flaggedContent: "I've been feeling really down lately and sometimes I don't want to do anything...",
    severity: "high",
    timestamp: "2 hours ago",
    sessionId: "session-1"
  },
  {
    id: "alert-2",
    learnerName: "Mia",
    lessonTitle: "Public Speaking Exercise",
    flaggedContent: "Nobody at school likes me and I feel like I'm all alone...",
    severity: "medium",
    timestamp: "Yesterday",
    sessionId: "session-2"
  },
  {
    id: "alert-3",
    learnerName: "Jake",
    lessonTitle: "Confidence Building",
    flaggedContent: "Sometimes I get so angry I just want to break things...",
    severity: "medium",
    timestamp: "2 days ago",
    sessionId: "session-3"
  }
];

export function SafetyNotificationDropdown({ 
  issues, 
  onViewSession 
}: SafetyNotificationDropdownProps) {
  const [open, setOpen] = useState(false);

  const highPriorityCount = issues.filter(issue => issue.severity === "high").length;
  const hasAlerts = issues.length > 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {highPriorityCount > 0 ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {hasAlerts && (
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80"
      >
        <div className="p-3">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Safety Alerts
          </h3>
          
          <ScrollArea className="h-[350px]">
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No safety alerts
              </p>
            ) : (
              <div className="space-y-2">
                {issues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={`p-3 rounded-lg border space-y-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                      issue.severity === "high" 
                        ? "border-destructive/50 bg-destructive/5" 
                        : "border-border bg-muted/30"
                    }`}
                    onClick={() => {
                      onViewSession(issue.sessionId, issue.learnerName);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {issue.severity === "high" && (
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        )}
                        <span className="text-sm font-medium">{issue.learnerName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{issue.timestamp}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {issue.lessonTitle}
                    </p>
                    
                    <p className="text-xs text-destructive line-clamp-2">
                      "{issue.flaggedContent}"
                    </p>
                    
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <ExternalLink className="h-3 w-3" />
                      View transcript
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
