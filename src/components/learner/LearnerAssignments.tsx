import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAssignmentsForLearner, updateAssignmentStatus, type Assignment } from "@/lib/store";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type LearnerAssignmentsProps = {
  learnerName: string;
};

export function LearnerAssignments({ learnerName }: LearnerAssignmentsProps) {
  const assignments = getAssignmentsForLearner(learnerName);
  
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const inProgressAssignments = assignments.filter(a => a.status === 'in-progress');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

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

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => (
    <Card className="border-2">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <div className="font-semibold">{assignment.skillTitle}</div>
            <div className="text-sm text-muted-foreground">{assignment.lessonTitle}</div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Assigned {new Date(assignment.assignedDate).toLocaleDateString()}
          </div>

          {assignment.status === 'pending' && (
            <Button 
              onClick={() => handleStartLesson(assignment)}
              className="w-full gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              Start Lesson
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
      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {pendingAssignments.length} New
            </Badge>
            <h3 className="font-semibold">New Assignments</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {pendingAssignments.map(assignment => (
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
