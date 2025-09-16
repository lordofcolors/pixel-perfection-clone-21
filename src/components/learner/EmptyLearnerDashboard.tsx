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

      {/* Available Curriculum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Learning Path: Master Dog Walking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">0% Complete</span>
              </div>
              <Progress value={0} className="h-3" />
              <p className="text-xs text-muted-foreground">Complete lessons to see your progress grow!</p>
            </div>

            {/* Lesson Categories */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-dashed hover:border-solid hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">1: Basic Safety & Equipment</h4>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Learn about leash safety, proper equipment, and basic preparation for dog walking.
                    </p>
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary font-medium">Start Here</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed opacity-60">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">2: Dog Behavior & Communication</h4>
                      <Badge variant="secondary">Locked</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Understanding dog body language, signals, and how to communicate effectively.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Complete lesson 1 to unlock</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed opacity-60">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">3: Handling Challenges</h4>
                      <Badge variant="secondary">Locked</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      What to do when dogs pull, get distracted, or encounter other dogs.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Complete lesson 2 to unlock</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed opacity-60">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">4: Advanced Techniques</h4>
                      <Badge variant="secondary">Locked</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Professional tips, multiple dog handling, and emergency situations.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Complete lesson 3 to unlock</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <div className="space-y-3">
                <div className="text-4xl">🐕</div>
                <h3 className="text-lg font-semibold">Ready to Start Learning?</h3>
                <p className="text-muted-foreground">
                  Click on "1: Basic Safety & Equipment" in the sidebar to begin your first lesson!
                </p>
                <div className="pt-2">
                  <Button className="w-full sm:w-auto">
                    <Play className="h-4 w-4 mr-2" />
                    Go to First Lesson
                  </Button>
                </div>
              </div>
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