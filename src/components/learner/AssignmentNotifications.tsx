import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAssignmentsForLearner } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";

type AssignmentNotificationsProps = {
  learnerName: string;
};

export function AssignmentNotifications({ learnerName }: AssignmentNotificationsProps) {
  const [assignments, setAssignments] = useState(getAssignmentsForLearner(learnerName));
  const [seenAssignments, setSeenAssignments] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Poll for new assignments every 2 seconds
    const interval = setInterval(() => {
      const updatedAssignments = getAssignmentsForLearner(learnerName);
      setAssignments(updatedAssignments);
    }, 2000);

    return () => clearInterval(interval);
  }, [learnerName]);

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const unseenCount = pendingAssignments.filter(a => !seenAssignments.has(a.id)).length;

  const handleOpen = (open: boolean) => {
    if (open) {
      // Mark all as seen when dropdown opens
      const newSeen = new Set(seenAssignments);
      pendingAssignments.forEach(a => newSeen.add(a.id));
      setSeenAssignments(newSeen);
    }
  };

  if (assignments.length === 0) {
    return null;
  }

  return (
    <DropdownMenu onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unseenCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unseenCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Assignments</h3>
          {pendingAssignments.length > 0 && (
            <Badge variant="secondary">{pendingAssignments.length} new</Badge>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map(assignment => (
              <DropdownMenuItem key={assignment.id} className="flex-col items-start p-3 cursor-default">
                <div className="font-medium text-sm">{assignment.skillTitle}</div>
                <div className="text-xs text-muted-foreground">{assignment.lessonTitle}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Assigned {new Date(assignment.assignedDate).toLocaleDateString()}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new assignments
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
