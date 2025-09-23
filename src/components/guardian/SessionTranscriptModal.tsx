import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MessageCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface TranscriptMessage {
  timestamp: string;
  speaker: "Assistant" | "You";
  content: string;
  flagged?: boolean;
}

interface SessionData {
  id: string;
  title: string;
  duration: string;
  messagesCount: number;
  completionRate: number;
  status: "completed" | "in-progress" | "flagged";
  transcript: TranscriptMessage[];
  learnerName: string;
  completedAt: string;
}

interface SessionTranscriptModalProps {
  session: SessionData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionTranscriptModal({ session, open, onOpenChange }: SessionTranscriptModalProps) {
  if (!session) return null;

  const getStatusIcon = () => {
    switch (session.status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case "completed":
        return <Badge variant="outline" className="text-green-700 border-green-300">Completed</Badge>;
      case "flagged":
        return <Badge variant="destructive">Flagged</Badge>;
      default:
        return <Badge variant="outline" className="text-blue-700 border-blue-300">In Progress</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {getStatusIcon()}
                Session Complete
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {session.title} - Session Duration: {session.duration}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-4">
          {/* Session Transcript */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <h3 className="font-semibold">Session Transcript</h3>
            </div>
            
            <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
              <div className="space-y-4">
                {session.transcript.map((message, index) => (
                  <div key={index} className={`flex flex-col gap-1 ${message.flagged ? 'bg-red-50 dark:bg-red-950 p-2 rounded' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      <span className="text-sm font-medium">
                        {message.speaker}:
                      </span>
                      {message.flagged && (
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm ml-4 text-slate-700 dark:text-slate-300">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{session.duration}</div>
              <div className="text-sm text-muted-foreground">Session Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{session.messagesCount}</div>
              <div className="text-sm text-muted-foreground">Messages Exchanged</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}