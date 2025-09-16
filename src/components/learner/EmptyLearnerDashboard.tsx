import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Target, Award, Clock, TrendingUp } from "lucide-react";

interface EmptyLearnerDashboardProps {
  learnerName: string;
}

export function EmptyLearnerDashboard({ learnerName }: EmptyLearnerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="h-6 w-6 text-primary" />
            Welcome, {learnerName}! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              You're all set to start your learning journey! Your progress will be tracked and your parent can see how you're doing.
            </p>
            <div className="bg-white/60 dark:bg-background/60 rounded-lg p-4 border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                What's Ready for You:
              </h4>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                  Interactive lessons
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                  Progress tracking
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                  Achievement system
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                  Safe learning environment
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Stats - Empty State */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ready to start your first!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 days</div>
            <p className="text-xs text-muted-foreground">Start your streak today!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Learning</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0m</div>
            <p className="text-xs text-muted-foreground">Time starts when you do!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievement Level</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Beginner</div>
            <p className="text-xs text-muted-foreground">Ready to level up!</p>
          </CardContent>
        </Card>
      </section>

      {/* No Skills Yet - Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Ready to Start Learning?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-6">
            <div className="space-y-3">
              <div className="text-6xl">📚</div>
              <h3 className="text-xl font-semibold">No Skills Created Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your parent needs to create your first learning skill. Once they do, you'll see it here and can start learning!
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-medium mb-3">What Your Parent Can Create:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Example</Badge>
                  <span>Improving Interview Skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Example</Badge>
                  <span>Public Speaking Confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Example</Badge>
                  <span>Math Problem Solving</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Custom</Badge>
                  <span>Any skill they choose!</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Ask your parent</strong> to click the <strong>+ button</strong> in the sidebar to create your first learning skill!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">💡 Learning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="bg-blue-100 dark:bg-blue-950 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">💬</div>
              <h4 className="font-medium">Ask Questions</h4>
              <p className="text-sm text-muted-foreground">Don't hesitate to ask the AI teacher anything during lessons</p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-green-100 dark:bg-green-950 rounded-full w-8 h-8 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">🏆</div>
              <h4 className="font-medium">Take Your Time</h4>
              <p className="text-sm text-muted-foreground">Learn at your own pace - there's no rush to finish quickly</p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-purple-100 dark:bg-purple-950 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">📊</div>
              <h4 className="font-medium">Track Progress</h4>
              <p className="text-sm text-muted-foreground">Your parent can see your progress and help when needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}