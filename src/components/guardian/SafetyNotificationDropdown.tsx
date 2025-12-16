import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, Bell, CheckCircle2, BookOpen } from "lucide-react";

export type NotificationType = "safety" | "completion" | "progress";

export interface ParentNotification {
  id: string;
  type: NotificationType;
  learnerName: string;
  lessonTitle: string;
  message?: string;
  timestamp: string;
  sessionId?: string;
  severity?: "high" | "medium" | "low";
}

interface ParentNotificationDropdownProps {
  notifications: ParentNotification[];
  onViewSession?: (sessionId: string, learnerName: string) => void;
}

// Mock notifications for demo
export const MOCK_PARENT_NOTIFICATIONS: ParentNotification[] = [
  {
    id: "notif-1",
    type: "completion",
    learnerName: "Jake",
    lessonTitle: "Interview Practice Session",
    message: "Jake completed the Interview Practice lesson!",
    timestamp: "30 min ago",
  },
  {
    id: "notif-2",
    type: "safety",
    learnerName: "Jake",
    lessonTitle: "Confidence Building",
    timestamp: "2 hours ago",
    sessionId: "session-1",
    severity: "high"
  },
  {
    id: "notif-3",
    type: "completion",
    learnerName: "Mia",
    lessonTitle: "Public Speaking Basics",
    message: "Mia finished the Public Speaking Basics lesson with 85% completion!",
    timestamp: "3 hours ago",
  },
  {
    id: "notif-4",
    type: "safety",
    learnerName: "Mia",
    lessonTitle: "Social Skills Practice",
    timestamp: "Yesterday",
    sessionId: "session-2",
    severity: "medium"
  },
  {
    id: "notif-5",
    type: "progress",
    learnerName: "Jake",
    lessonTitle: "Greeting People",
    message: "Jake is 50% through the Greeting People lesson",
    timestamp: "Yesterday",
  },
  {
    id: "notif-6",
    type: "safety",
    learnerName: "Jake",
    lessonTitle: "Emotion Management",
    timestamp: "2 days ago",
    sessionId: "session-3",
    severity: "medium"
  }
];

export function SafetyNotificationDropdown({ 
  notifications, 
  onViewSession 
}: ParentNotificationDropdownProps) {
  const [open, setOpen] = useState(false);

  const safetyAlerts = notifications.filter(n => n.type === "safety");
  const highPriorityCount = safetyAlerts.filter(n => n.severity === "high").length;
  const hasNotifications = notifications.length > 0;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "safety":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "completion":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "progress":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationStyle = (notification: ParentNotification) => {
    if (notification.type === "safety") {
      return notification.severity === "high" 
        ? "border-destructive/50 bg-destructive/5" 
        : "border-orange-300/50 bg-orange-50/50 dark:bg-orange-950/20";
    }
    if (notification.type === "completion") {
      return "border-green-300/50 bg-green-50/50 dark:bg-green-950/20";
    }
    return "border-border bg-muted/30";
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className={`absolute top-1 right-1 h-2 w-2 rounded-full ${
              highPriorityCount > 0 ? 'bg-destructive' : 'bg-primary'
            }`} />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80"
      >
        <div className="p-3">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4" />
            Notifications
          </h3>
          
          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No notifications yet
              </p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border space-y-2 transition-colors ${getNotificationStyle(notification)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        {notification.type === "safety" ? (
                          <span className="text-sm font-medium">Safety Alert</span>
                        ) : (
                          <span className="text-sm font-medium">{notification.learnerName}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    </div>
                    
                    {notification.type === "safety" ? (
                      <>
                        <p className="text-sm">
                          A conversation for <span className="font-semibold text-primary">{notification.learnerName}</span> was flagged for safety review.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Content not shown for privacy.
                        </p>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => {
                            if (notification.sessionId && onViewSession) {
                              onViewSession(notification.sessionId, notification.learnerName);
                              setOpen(false);
                            }
                          }}
                        >
                          Review transcript
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground">
                          {notification.lessonTitle}
                        </p>
                        <p className="text-xs text-foreground">
                          {notification.message}
                        </p>
                      </>
                    )}
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
