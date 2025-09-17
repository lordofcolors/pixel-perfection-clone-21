import { Card, CardContent } from "@/components/ui/card";

export function EmptyLearnerSkillsDashboard() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-lg font-semibold">Ready to Learn!</h3>
            <p className="text-muted-foreground">
              Your learning space is ready. Complete your first lesson to see your progress here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}