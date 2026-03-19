/**
 * =============================================================================
 * EmailPreview (/email)
 * =============================================================================
 *
 * Gmail-inspired inbox preview on desktop, raw email HTML on mobile.
 * Toggle between Dark and Light mode email templates.
 */

import { useState } from "react";
import { ArrowLeft, Star, Archive, Trash2, Clock, MoreVertical, ChevronLeft, ChevronRight, Reply, Forward, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { buildDarkEmailHTML } from "@/components/email/darkEmailTemplate";
import { buildLightEmailHTML } from "@/components/email/lightEmailTemplate";

const EmailPreview = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [starred, setStarred] = useState(false);
  const [mode, setMode] = useState<"dark" | "light">("dark");

  const EMAIL_HTML = mode === "dark" ? buildDarkEmailHTML() : buildLightEmailHTML();

  /* ── Toggle pill (shared) ── */
  const modeToggle = (
    <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-0.5">
      <button
        onClick={() => setMode("dark")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${mode === "dark" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
      >
        <Moon className="h-3.5 w-3.5" /> Dark
      </button>
      <button
        onClick={() => setMode("light")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${mode === "light" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
      >
        <Sun className="h-3.5 w-3.5" /> Light
      </button>
    </div>
  );

  /* ── Mobile: just the toggle + raw email ── */
  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-white">
        <div className="sticky top-0 z-10 flex items-center justify-center border-b border-gray-200 bg-white px-4 py-2">
          {modeToggle}
        </div>
        <iframe
          title="Email Preview"
          srcDoc={EMAIL_HTML}
          className="w-full flex-1 border-0"
          style={{ minHeight: "3200px" }}
          sandbox="allow-same-origin"
        />
      </div>
    );
  }

  /* ── Desktop: Gmail chrome ── */
  return (
    <div className="flex h-screen w-screen flex-col bg-[#f6f8fc]">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:text-gray-900" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><Archive className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><Trash2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><Clock className="h-4 w-4" /></Button>
        </div>
        <div className="ml-4">{modeToggle}</div>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <span>1 of 24</span>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-6">
          <div className="mb-4 flex items-start gap-3">
            <h1 className="text-xl font-normal text-gray-900">Your Weekly Update — A by Xolv</h1>
            <span className="mt-1 rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">Inbox</span>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-xolv-magenta-500 text-sm font-bold text-white">AX</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">A by Xolv</span>
                <span className="text-xs text-gray-500">&lt;digest@abyxolv.com&gt;</span>
              </div>
              <div className="text-xs text-gray-500"><span>to me</span></div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Mar 17, 2026, 8:00 AM</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setStarred(!starred)}>
                <Star className={`h-4 w-4 ${starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><Reply className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white">
            <iframe title="Email Preview" srcDoc={EMAIL_HTML} className="w-full border-0" style={{ minHeight: "3200px" }} sandbox="allow-same-origin" />
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="gap-2 text-gray-600"><Reply className="h-4 w-4" /> Reply</Button>
            <Button variant="outline" className="gap-2 text-gray-600"><Forward className="h-4 w-4" /> Forward</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EmailPreview;
