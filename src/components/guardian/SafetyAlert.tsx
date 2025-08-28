import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, Eye } from "lucide-react";

interface SafetyIssue {
  id: string;
  learnerName: string;
  lessonTitle: string;
  flaggedContent: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  sessionId: string;
}

interface SafetyAlertProps {
  issues: SafetyIssue[];
  onViewSession: (sessionId: string, learnerName: string) => void;
  onDismiss: (issueId: string) => void;
}

export function SafetyAlert({ issues, onViewSession, onDismiss }: SafetyAlertProps) {
  const [collapsed, setCollapsed] = useState(false);

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
        return "HIGH PRIORITY";
      case "medium":
        return "MEDIUM";
      case "low":
        return "LOW";
      default:
        return "UNKNOWN";
    }
  };

  if (collapsed) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="shadow-lg"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {issues.length} Safety Alert{issues.length > 1 ? 's' : ''}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-h-96 overflow-y-auto">
      <Alert className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h4 className="font-semibold text-red-800 dark:text-red-200">
              Safety Alerts ({issues.length})
            </h4>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(true)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <AlertDescription className="mt-3 space-y-3">
          {issues.slice(0, 3).map((issue) => (
            <div key={issue.id} className="bg-white dark:bg-slate-800 p-3 rounded border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(issue.severity) as any}>
                    {getSeverityText(issue.severity)}
                  </Badge>
                  <span className="text-sm font-medium">{issue.learnerName}</span>
                </div>
                <span className="text-xs text-muted-foreground">{issue.timestamp}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                {issue.lessonTitle}
              </p>
              <p className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded text-red-800 dark:text-red-200 mb-3">
                "{issue.flaggedContent}"
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewSession(issue.sessionId, issue.learnerName)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Session
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismiss(issue.id)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
          {issues.length > 3 && (
            <p className="text-xs text-center text-muted-foreground">
              +{issues.length - 3} more alerts
            </p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}