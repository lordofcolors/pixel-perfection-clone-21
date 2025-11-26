import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import acircleLogo from "@/assets/acircle-logo.png";

interface EmptyLearnerDashboardProps {
  learnerName: string;
}

export function EmptyLearnerDashboard({ learnerName }: EmptyLearnerDashboardProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* A Circle Logo */}
            <div className="relative">
              <img 
                src={acircleLogo} 
                alt="A Assistant" 
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Welcome Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">Welcome, {learnerName}! 👋</h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Your personal AI learning assistant is ready to help you grow and learn new skills.
              </p>
            </div>

            {/* Call to Action */}
            <div className="space-y-4 w-full max-w-sm">
              <Button size="lg" className="w-full text-lg h-14">
                Start Learning
              </Button>
              <p className="text-sm text-muted-foreground">
                Click above to begin your personalized learning journey
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8 w-full max-w-lg">
              <div className="space-y-2">
                <div className="text-3xl">🎯</div>
                <p className="text-xs text-muted-foreground">Personalized lessons</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">💬</div>
                <p className="text-xs text-muted-foreground">Interactive chat</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">📈</div>
                <p className="text-xs text-muted-foreground">Track progress</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}