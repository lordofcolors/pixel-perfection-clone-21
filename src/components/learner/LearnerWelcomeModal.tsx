import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import aCircleLogo from "@/assets/acircle-logo.png";

type LearnerWelcomeModalProps = {
  open: boolean;
  onClose: () => void;
  learnerName: string;
};

export function LearnerWelcomeModal({ open, onClose, learnerName }: LearnerWelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-literata">
            Welcome, {learnerName}!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <img 
            src={aCircleLogo} 
            alt="A - Your Learning Buddy" 
            className="w-32 h-32 mb-4"
          />
        </div>

        <div className="space-y-4 font-literata">
          <p className="text-foreground">
            Hi {learnerName}. I'm A.
          </p>
          <p className="text-muted-foreground">
            I'm here to be your learning buddy. Before we jump into lessons, let's do a quick hello chat so we can get to know each other and make learning feel easier.
          </p>
          <p className="text-muted-foreground">
            Think of it like a warm-up. Just a fun little chat before we start learning. Ready to begin?
          </p>
        </div>

        <div className="pt-4">
          <Button 
            onClick={onClose}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-xolv-magenta-300 via-xolv-blue-300 to-xolv-teal-300 text-black hover:opacity-90"
          >
            Let's meet A
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
