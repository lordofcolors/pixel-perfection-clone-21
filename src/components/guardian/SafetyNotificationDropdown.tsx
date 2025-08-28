import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, Bell, Eye, X } from "lucide-react";

interface SafetyIssue {
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
  onDismiss: (issueId: string) => void;
}

export function SafetyNotificationDropdown({ 
  issues, 
  onViewSession, 
  onDismiss 
}: SafetyNotificationDropdownProps) {
  const [open, setOpen] = useState(false);

  if (issues.length === 0) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "outline";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high":
        return "HIGH";
      case "medium":
        return "MED";
      case "low":
        return "LOW";
      default:
        return "?";
    }
  };

  const highPriorityCount = issues.filter(issue => issue.severity === "high").length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={highPriorityCount > 0 ? "destructive" : "outline"} 
          size="sm" 
          className="relative"
        >
          {highPriorityCount > 0 ? (
            <AlertTriangle className="h-4 w-4 mr-2" />
          ) : (
            <Bell className="h-4 w-4 mr-2" />
          )}
          Safety Alerts
          {issues.length > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {issues.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-[480px] max-h-[600px] bg-background border shadow-lg z-50"
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Safety Alerts ({issues.length})
          </h3>
        </div>
        
        <ScrollArea className="h-[520px]">
          <div className="p-4 space-y-3">
            {issues.map((issue) => (
              <div 
                key={issue.id} 
                className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(issue.severity) as any} className="text-xs">
                      {getSeverityText(issue.severity)}
                    </Badge>
                    <span className="text-sm font-medium">{issue.learnerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{issue.timestamp}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        onDismiss(issue.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {issue.lessonTitle}
                </p>
                
                <p className="text-sm bg-destructive/10 border border-destructive/20 p-3 rounded text-destructive-foreground mb-3">
                  "{issue.flaggedContent}"
                </p>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    onViewSession(issue.sessionId, issue.learnerName);
                    setOpen(false);
                  }}
                  className="w-full"
                >
                  <Eye className="h-3 w-3 mr-2" />
                  View Full Session
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}