import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import acircleLogo from "@/assets/acircle-logo.png";

interface EmptyLearnerDashboardProps {
  learnerName: string;
}

export function EmptyLearnerDashboard({ learnerName }: EmptyLearnerDashboardProps) {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isReturningOpen, setIsReturningOpen] = useState(false);

  const handleLetsGoClick = () => {
    setIsWelcomeOpen(false);
    setIsReturningOpen(true);
  };

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

      {/* Welcome Modal (First time) */}
      <Dialog open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-literata font-normal">
              Welcome, {learnerName}!
            </DialogTitle>
          </DialogHeader>
          
          {/* A Logo */}
          <div className="flex justify-center py-4">
            <img 
              src={acircleLogo} 
              alt="A Assistant" 
              className="w-[7.5rem] h-[7.5rem] object-contain"
            />
          </div>
          
          <div className="space-y-4 text-muted-foreground font-literata">
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
            className="w-full mt-4 bg-gradient-to-r dark:from-xolv-magenta-300 dark:via-xolv-blue-300 dark:to-xolv-teal-300 from-xolv-magenta-700 via-xolv-blue-600 to-xolv-teal-500 text-black font-medium font-literata"
            onClick={handleLetsGoClick}
          >
            Let's meet A
          </Button>
        </DialogContent>
      </Dialog>

      {/* Returning User Modal */}
      <Dialog open={isReturningOpen} onOpenChange={setIsReturningOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-literata font-normal">
              Welcome back, {learnerName}!
            </DialogTitle>
          </DialogHeader>
          
          {/* A Logo */}
          <div className="flex justify-center py-4">
            <img 
              src={acircleLogo} 
              alt="A Assistant" 
              className="w-[7.5rem] h-[7.5rem] object-contain"
            />
          </div>
          
          <div className="space-y-4 text-muted-foreground font-literata">
            <p>Hi again. It's A.</p>
            
            <p>
              We'll start with a quick check-in chat first, then we'll jump into 
              learning. We do this at the beginning of each session so it feels 
              easier to get started, and so I can keep learning what works best for you.
            </p>
            
            <p>
              Think of it like a warm-up. Just a fun little chat before we start 
              learning. Ready to begin?
            </p>
          </div>

          <Button 
            className="w-full mt-4 bg-gradient-to-r dark:from-xolv-magenta-300 dark:via-xolv-blue-300 dark:to-xolv-teal-300 from-xolv-magenta-700 via-xolv-blue-600 to-xolv-teal-500 text-black font-medium font-literata"
            onClick={() => setIsReturningOpen(false)}
          >
            Continue with A
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
