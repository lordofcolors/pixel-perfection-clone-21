import { FileText, Sparkles } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 interface LessonEndedViewProps {
   learnerName: string;
   onStartNewSession: () => void;
  errorCode?: number;
 }
 
export function LessonEndedView({ learnerName, onStartNewSession, errorCode = 1006 }: LessonEndedViewProps) {
  const getErrorMessage = () => {
    switch (errorCode) {
      case 1006:
        return "Connection lost";
      case 1011:
      default:
        return "Something went wrong";
    }
  };

   return (
     <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-8 overflow-y-auto">
        {/* Disconnection Banner - Thin inline style */}
        <div className="w-full border border-border/50 bg-card/30 rounded-lg px-4 py-3 mb-8">
          <p className="text-sm text-muted-foreground">
            {getErrorMessage()} <span className="text-muted-foreground/70">({errorCode})</span> — select <span className="text-foreground">Continue Lesson</span> if you'd like to restart.
          </p>
        </div>

       {/* Icon */}
       <div className="w-24 h-24 rounded-full bg-xolv-blue-300/20 flex items-center justify-center mb-6">
         <FileText className="w-12 h-12 text-xolv-blue-300" />
       </div>
 
       {/* Title */}
       <h1 className="text-4xl font-semibold text-foreground mb-3">Lesson Ended</h1>
       
       {/* Subtitle */}
        <p className="text-lg text-muted-foreground mb-8">
         Chat with A - Lesson Duration: 1 second
       </p>
 
       {/* Transcript & Insights Grid */}
       <div className="w-full grid gap-4 lg:grid-cols-2 mb-6">
         {/* Lesson Transcript */}
         <div className="bg-card/30 border border-border/50 rounded-xl p-5 min-h-[180px]">
           <div className="flex items-center gap-2 mb-4">
             <FileText className="w-5 h-5 text-muted-foreground" />
             <h3 className="text-lg font-semibold">Lesson Transcript</h3>
           </div>
           <div className="text-sm text-muted-foreground">
             <span className="text-xs font-mono text-muted-foreground/70">8:59:44 PM</span>
             <div className="mt-2">
               <span className="text-xolv-blue-300">A:</span>{" "}
               <span>Hey {learnerName}! I'm A! Today we're going to learn</span>
             </div>
           </div>
         </div>
 
         {/* Insights */}
         <div className="bg-card/30 border border-border/50 rounded-xl p-5 min-h-[180px]">
           <div className="flex items-center gap-2 mb-4">
             <Sparkles className="w-5 h-5 text-muted-foreground" />
             <h3 className="text-lg font-semibold">Insights</h3>
           </div>
           <p className="text-sm text-muted-foreground leading-relaxed">
             {learnerName} is introduced to a session with the goal of learning together. The session aims to engage {learnerName} in conversation and creativity. The focus is on making learning fun and interactive.
           </p>
         </div>
       </div>
 
       {/* Stats */}
       <div className="w-full grid grid-cols-4 gap-4 mb-8">
         <div className="bg-card/30 border border-border/50 rounded-xl py-5 px-4 text-center">
           <div className="text-2xl font-semibold text-xolv-blue-300">1 second</div>
           <div className="text-sm text-muted-foreground mt-1">Lesson Duration</div>
         </div>
         <div className="bg-card/30 border border-border/50 rounded-xl py-5 px-4 text-center">
           <div className="text-2xl font-semibold text-foreground">1</div>
           <div className="text-sm text-muted-foreground mt-1">Messages Exchanged</div>
         </div>
         <div className="bg-card/30 border border-border/50 rounded-xl py-5 px-4 text-center">
           <div className="text-2xl font-semibold text-foreground">0</div>
           <div className="text-sm text-muted-foreground mt-1">Words per Message</div>
         </div>
         <div className="bg-card/30 border border-border/50 rounded-xl py-5 px-4 text-center">
           <div className="text-2xl font-semibold text-foreground">N/A</div>
           <div className="text-sm text-muted-foreground mt-1">Voice/Text Ratio</div>
         </div>
       </div>
 
       {/* Action Buttons */}
       <div className="w-full flex items-center justify-between">
         <Button 
           variant="outline" 
           onClick={onStartNewSession}
           className="border-border/50"
         >
           Continue Lesson
         </Button>
         <Button className="bg-xolv-blue-300 hover:bg-xolv-blue-400 text-background">
           Complete Lesson
         </Button>
       </div>
     </div>
   );
 }