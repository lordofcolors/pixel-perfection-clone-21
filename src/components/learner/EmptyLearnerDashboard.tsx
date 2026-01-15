import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import acircleLogo from "@/assets/acircle-logo.png";

interface EmptyLearnerDashboardProps {
  learnerName: string;
}

export function EmptyLearnerDashboard({ learnerName }: EmptyLearnerDashboardProps) {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

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
        <Button 
          size="lg" 
          className="text-lg h-14 px-12"
          onClick={() => setIsWelcomeOpen(true)}
        >
          Start
        </Button>
      </div>

      {/* Welcome Modal */}
      <Dialog open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl italic font-normal">
              Welcome, {learnerName}!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-muted-foreground">
            <p>Hi {learnerName}. I'm A.</p>
            
            <p>
              I'm here to be your learning buddy. Before we jump into lessons, 
              let's do a quick hello chat so we can get to know each other and 
              make learning feel easier.
            </p>
            
            <p>
              Think of it like a warm-up. Just a fun little chat before we start 
              learning. Ready to begin?
            </p>
          </div>

          <Button 
            className="w-full mt-4 text-foreground font-medium"
            style={{ backgroundColor: '#94DFE9' }}
            onClick={() => setIsWelcomeOpen(false)}
          >
            Let's meet A
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
