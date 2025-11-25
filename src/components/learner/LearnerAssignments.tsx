import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAssignmentsForLearner, updateAssignmentStatus, type Assignment } from "@/lib/store";
import { CheckCircle2, Clock, PlayCircle, AlertCircle, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type LearnerAssignmentsProps = {
  learnerName: string;
};

export function LearnerAssignments({ learnerName }: LearnerAssignmentsProps) {
  const assignments = getAssignmentsForLearner(learnerName);
  
  const isOverdue = (assignment: Assignment) => {
    if (!assignment.dueDate) return false;
    return new Date(assignment.dueDate) < new Date() && assignment.status !== 'completed';
  };
  
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const inProgressAssignments = assignments.filter(a => a.status === 'in-progress');
  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const overdueAssignments = assignments.filter(isOverdue);

  const handleStartLesson = (assignment: Assignment) => {
    updateAssignmentStatus(assignment.id, 'in-progress');
    toast({
      title: "Lesson started!",
      description: `You're now working on: ${assignment.lessonTitle}`,
    });
  };

  const handleCompleteLesson = (assignment: Assignment) => {
    updateAssignmentStatus(assignment.id, 'completed');
    toast({
      title: "Great job!",
      description: `You completed: ${assignment.lessonTitle}`,
    });
  };

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
    const isLessonOverdue = isOverdue(assignment);
    
    return (
      <Card className={`border-2 ${isLessonOverdue ? 'border-destructive/50 bg-destructive/5' : 'border-primary/30 bg-primary/5'}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {isLessonOverdue && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                OVERDUE!
              </Badge>
            )}
            
            <div>
              <div className="font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {assignment.skillTitle}
              </div>
              <div className="text-sm text-muted-foreground">{assignment.lessonTitle}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Assigned {new Date(assignment.assignedDate).toLocaleDateString()}
              </div>
              
              {assignment.dueDate && (
                <div className={`flex items-center gap-2 text-xs font-medium ${isLessonOverdue ? 'text-destructive' : 'text-primary'}`}>
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {assignment.status === 'pending' && (
              <Button 
                onClick={() => handleStartLesson(assignment)}
                className="w-full gap-2"
                variant={isLessonOverdue ? "destructive" : "default"}
              >
                <PlayCircle className="h-4 w-4" />
                {isLessonOverdue ? 'Start Now!' : 'Start Lesson'}
              </Button>
            )}

            {assignment.status === 'in-progress' && (
              <Button 
                onClick={() => handleCompleteLesson(assignment)}
                className="w-full gap-2"
                variant="secondary"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <div className="text-6xl">📚</div>
            <h3 className="text-lg font-semibold">No Assignments Yet</h3>
            <p className="text-muted-foreground">
              Your parent will assign lessons for you to work on here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overdue Assignments - Priority */}
      {overdueAssignments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <AlertCircle className="h-3 w-3" />
              {overdueAssignments.length} Overdue
            </Badge>
            <h3 className="font-semibold text-destructive">Overdue - Complete These First!</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {overdueAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Pending Assignments */}
      {pendingAssignments.filter(a => !isOverdue(a)).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {pendingAssignments.filter(a => !isOverdue(a)).length} New
            </Badge>
            <h3 className="font-semibold">New Assignments from Your Parent</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {pendingAssignments.filter(a => !isOverdue(a)).map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* In Progress Assignments */}
      {inProgressAssignments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {inProgressAssignments.length} In Progress
            </Badge>
            <h3 className="font-semibold">Continue Learning</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {inProgressAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Assignments */}
      {completedAssignments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {completedAssignments.length} Completed
            </Badge>
            <h3 className="font-semibold">Completed Lessons</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {completedAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
