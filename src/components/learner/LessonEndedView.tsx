 import { useState } from "react";
 import { FileText, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
 import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
 } from "@/components/ui/collapsible";
 
 interface LessonEndedViewProps {
   learnerName: string;
   onStartNewSession: () => void;
 }
 
 export function LessonEndedView({ learnerName, onStartNewSession }: LessonEndedViewProps) {
   const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
 
   return (
     <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full max-w-3xl mx-auto px-4">
       {/* Icon */}
       <div className="w-20 h-20 rounded-full bg-xolv-blue-300/20 flex items-center justify-center mb-6">
         <FileText className="w-10 h-10 text-xolv-blue-300" />
       </div>
 
       {/* Title */}
       <h1 className="text-3xl font-semibold text-foreground mb-2">Lesson Ended</h1>
       
       {/* Subtitle */}
       <p className="text-muted-foreground mb-8">
         Chat with A - Lesson Duration: 1 second
       </p>
 
       {/* Disconnection Alert Banner */}
       <Alert className="w-full max-w-xl border-border/50 bg-card/50 mb-6">
         <div className="flex items-start justify-between gap-4">
           <div className="flex-1">
             <AlertTitle className="text-base font-medium mb-1">You were disconnected</AlertTitle>
             <AlertDescription className="text-sm text-muted-foreground">
               It looks like the connection dropped, so we had to end this session. You can start a new one anytime.
             </AlertDescription>
           </div>
           <Collapsible open={showTechnicalDetails} onOpenChange={setShowTechnicalDetails}>
             <CollapsibleTrigger asChild>
               <Button 
                 variant="ghost" 
                 size="sm" 
                 className="text-xs text-muted-foreground hover:text-foreground shrink-0 h-auto py-1 px-2"
               >
                 {showTechnicalDetails ? (
                   <>
                     <ChevronUp className="h-3 w-3 mr-1" />
                     Hide details
                   </>
                 ) : (
                   <>
                     <ChevronDown className="h-3 w-3 mr-1" />
                     View technical details
                   </>
                 )}
               </Button>
             </CollapsibleTrigger>
           </Collapsible>
         </div>
         
         <Collapsible open={showTechnicalDetails} onOpenChange={setShowTechnicalDetails}>
           <CollapsibleContent>
             <div className="mt-4 p-3 rounded-md bg-muted/30 border border-border/30">
               <code className="text-xs text-muted-foreground font-mono">
                 Connection closed (1006):
               </code>
             </div>
           </CollapsibleContent>
         </Collapsible>
       </Alert>
 
       {/* Transcript Section */}
       <div className="w-full max-w-xl grid gap-4 lg:grid-cols-2 mb-6">
         {/* Lesson Transcript */}
         <div className="bg-card/50 border border-border/50 rounded-xl p-4">
           <div className="flex items-center gap-2 mb-3">
             <FileText className="w-4 h-4 text-muted-foreground" />
             <h3 className="font-medium">Lesson Transcript</h3>
           </div>
           <div className="text-sm text-muted-foreground">
             <span className="text-xs font-mono text-muted-foreground/70">8:59:44 PM</span>
             <div className="mt-1">
               <span className="text-xolv-blue-300">A:</span>{" "}
               <span>Hey {learnerName}! I'm A! Today we're going to learn</span>
             </div>
           </div>
         </div>
 
         {/* Insights */}
         <div className="bg-card/50 border border-border/50 rounded-xl p-4">
           <div className="flex items-center gap-2 mb-3">
             <Sparkles className="w-4 h-4 text-muted-foreground" />
             <h3 className="font-medium">Insights</h3>
           </div>
           <p className="text-sm text-muted-foreground">
             {learnerName} started a session with A. The session was brief due to a connection issue.
           </p>
         </div>
       </div>
 
       {/* Stats */}
       <div className="w-full max-w-xl grid grid-cols-4 gap-3 mb-8">
         <div className="bg-card/50 border border-border/50 rounded-xl p-4 text-center">
           <div className="text-xl font-semibold text-xolv-blue-300">1 second</div>
           <div className="text-xs text-muted-foreground mt-1">Lesson Duration</div>
         </div>
         <div className="bg-card/50 border border-border/50 rounded-xl p-4 text-center">
           <div className="text-xl font-semibold text-foreground">1</div>
           <div className="text-xs text-muted-foreground mt-1">Messages Exchanged</div>
         </div>
         <div className="bg-card/50 border border-border/50 rounded-xl p-4 text-center">
           <div className="text-xl font-semibold text-foreground">0</div>
           <div className="text-xs text-muted-foreground mt-1">Words per Message</div>
         </div>
         <div className="bg-card/50 border border-border/50 rounded-xl p-4 text-center">
           <div className="text-xl font-semibold text-foreground">N/A</div>
           <div className="text-xs text-muted-foreground mt-1">Voice/Text Ratio</div>
         </div>
       </div>
 
       {/* Action Buttons */}
       <div className="flex items-center gap-4">
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