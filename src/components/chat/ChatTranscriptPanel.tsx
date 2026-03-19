import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile } from "lucide-react";
import { useState } from "react";

interface ChatTranscriptPanelProps {
  firstName?: string;
  onClose: () => void;
}

export function ChatTranscriptPanel({ firstName, onClose }: ChatTranscriptPanelProps) {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full bg-card/30 border-l border-border/50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Chat</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-secondary">A</span>
          </div>
          <div className="bg-muted/50 rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
            <p className="text-sm text-foreground">
              Hi{firstName ? `, ${firstName}` : ""}! I'm A! It's nice to meet you!
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2 rounded-xl border border-border/50 p-1.5">
          <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 text-amber-400">
            <Smile className="w-4 h-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type something here..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
          />
          <Button size="icon" className="flex-shrink-0 h-8 w-8 bg-primary hover:bg-primary/90">
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
