import { Button } from "@/components/ui/button";
import acircleLogo from "@/assets/acircle-logo.png";

interface EmptyLearnerDashboardProps {
  learnerName: string;
}

export function EmptyLearnerDashboard({ learnerName }: EmptyLearnerDashboardProps) {
  return (
    <div className="flex flex-col items-start justify-start pt-24">
      <div className="flex flex-col items-center text-center space-y-16 w-full">
        {/* A Circle Logo */}
        <div className="relative">
          <img 
            src={acircleLogo} 
            alt="A Assistant" 
            className="w-40 h-40 object-contain"
          />
        </div>

        {/* Call to Action */}
        <Button size="lg" className="text-lg h-14 px-12">
          Start
        </Button>
      </div>
    </div>
  );
}