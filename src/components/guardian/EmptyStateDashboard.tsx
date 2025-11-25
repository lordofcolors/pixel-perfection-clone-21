import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, TrendingUp, Clock, ArrowRight, Target } from "lucide-react";

interface EmptyStateDashboardProps {
  guardianName: string;
  learners: { name: string }[];
  onSelectView: (view: number) => void;
}

export function EmptyStateDashboard({ guardianName, learners, onSelectView }: EmptyStateDashboardProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="h-6 w-6 text-primary" />
            Welcome to Your Parent Dashboard, {guardianName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Your family's learning journey starts here. Track progress, view lesson transcripts, and monitor engagement across all your children's accounts.
            </p>
            <div className="bg-white/50 dark:bg-background/50 rounded-lg p-4 border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                What You Can Track:
              </h4>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full"></Badge>
                  Real-time progress tracking
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full"></Badge>
                  Lesson completion analytics
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full"></Badge>
                  Session transcript access
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full"></Badge>
                  Time spent monitoring
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Empty State */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learners.length}</div>
            <p className="text-xs text-muted-foreground">Learners ready to learn</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills in Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Waiting for first skill</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Waiting for first lesson</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0m</div>
            <p className="text-xs text-muted-foreground">Time will be tracked automatically</p>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action - Children Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Children - Ready to Start Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {learners.map((learner, index) => (
              <Card 
                key={learner.name} 
                className="cursor-pointer hover:bg-muted/50 transition-all border-2 hover:border-primary/50"
                onClick={() => onSelectView(index)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{learner.name}</h3>
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-center py-4">
                        <div className="text-4xl mb-2">🎯</div>
                        <p className="text-sm text-muted-foreground">
                          Ready to start their learning journey
                        </p>
                      </div>
                    </div>
                    
                    <Button className="w-full" onClick={(e) => {
                      e.stopPropagation();
                      navigate('/learner-dashboard', { state: { firstName: learner.name } });
                    }}>
                      Switch to {learner.name}'s Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Guide */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">🚀 Getting Started Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-primary font-bold">1</div>
                  <h4 className="font-medium">Create First Skill</h4>
                  <p className="text-sm text-muted-foreground">Click the + button in the sidebar to create a custom learning skill</p>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-primary font-bold">2</div>
                  <h4 className="font-medium">Switch & Learn</h4>
                  <p className="text-sm text-muted-foreground">Switch to a child's account and complete their first lesson</p>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-primary font-bold">3</div>
                  <h4 className="font-medium">View Analytics</h4>
                  <p className="text-sm text-muted-foreground">Return to this dashboard to see progress and transcripts</p>
                </div>
              </div>
            
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Pro Tip:</strong> Start by creating a custom skill that fits your family's learning goals. Examples: "Improving Interview Skills", "Public Speaking Confidence", or "Math Problem Solving" - the choice is yours!
                </p>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}