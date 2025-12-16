import { useState, useEffect } from "react";
import { Bell, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getAssignmentsForLearner, type Assignment } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";

type AssignmentNotificationsProps = {
  learnerName: string;
};

export function AssignmentNotifications({ learnerName }: AssignmentNotificationsProps) {
  const [assignments, setAssignments] = useState(getAssignmentsForLearner(learnerName));
  const [seenAssignments, setSeenAssignments] = useState<Set<string>>(new Set());
  
  const isOverdue = (assignment: Assignment) => {
    if (!assignment.dueDate) return false;
    return new Date(assignment.dueDate) < new Date() && assignment.status !== 'completed';
  };

  useEffect(() => {
    // Load seen assignments from localStorage
    const saved = localStorage.getItem(`seen_assignments_${learnerName}`);
    if (saved) {
      setSeenAssignments(new Set(JSON.parse(saved)));
    }

    // Poll for new assignments every 2 seconds
    const interval = setInterval(() => {
      const updatedAssignments = getAssignmentsForLearner(learnerName);
      setAssignments(updatedAssignments);
    }, 2000);

    return () => clearInterval(interval);
  }, [learnerName]);

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const overdueAssignments = assignments.filter(isOverdue);
  const unseenCount = pendingAssignments.filter(a => !seenAssignments.has(a.id)).length;
  const totalNotifications = unseenCount + overdueAssignments.length;

  const handleOpen = (open: boolean) => {
    if (open) {
      // Mark all pending as seen when dropdown opens
      const newSeen = new Set(seenAssignments);
      pendingAssignments.forEach(a => newSeen.add(a.id));
      setSeenAssignments(newSeen);
      localStorage.setItem(`seen_assignments_${learnerName}`, JSON.stringify([...newSeen]));
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={`h-5 w-5 ${overdueAssignments.length > 0 ? 'text-destructive animate-pulse' : ''}`} />
          {totalNotifications > 0 && (
            <Badge 
              variant={overdueAssignments.length > 0 ? "destructive" : "default"}
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalNotifications}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3">
          <h3 className="font-semibold mb-3">Notifications</h3>
          <ScrollArea className="h-[350px]">
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No notifications yet
              </p>
            ) : (
              <div className="space-y-3">
                {/* Overdue Section */}
                {overdueAssignments.length > 0 && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                        <span className="text-sm font-semibold text-destructive">Overdue - Complete These First!</span>
                      </div>
                      <div className="space-y-2">
                        {overdueAssignments.map(assignment => (
                          <div 
                            key={assignment.id}
                            className="p-3 rounded-lg border-2 border-destructive/50 bg-destructive/5 space-y-1"
                          >
                            <div className="text-xs text-muted-foreground mb-1">
                              Your parent has assigned you:
                            </div>
                            <div className="font-medium text-sm">{assignment.skillTitle}</div>
                            <div className="text-xs text-muted-foreground">{assignment.lessonTitle}</div>
                            {assignment.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-destructive font-medium">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {pendingAssignments.filter(a => !isOverdue(a)).length > 0 && (
                      <Separator />
                    )}
                  </>
                )}

                {/* New Assignments Section */}
                {pendingAssignments.filter(a => !isOverdue(a)).length > 0 && (
                  <div>
                    <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      New Assignments
                    </div>
                    <div className="space-y-2">
                      {pendingAssignments.filter(a => !isOverdue(a)).map(assignment => (
                        <div 
                          key={assignment.id}
                          className="p-3 rounded-lg border-2 border-primary/30 bg-primary/5 space-y-1"
                        >
                          <div className="text-xs text-muted-foreground mb-1">
                            Your parent has assigned you:
                          </div>
                          <div className="font-medium text-sm">{assignment.skillTitle}</div>
                          <div className="text-xs text-muted-foreground">{assignment.lessonTitle}</div>
                          <div className="text-xs text-muted-foreground">
                            Assigned {new Date(assignment.assignedDate).toLocaleDateString()}
                          </div>
                          {assignment.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-primary font-medium">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
