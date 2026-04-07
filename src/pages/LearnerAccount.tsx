import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Bell, ChevronUp } from "lucide-react";
import { getOnboardingName } from "@/lib/store";

const NUDGE_OPTIONS = [
  "Daily",
  "Every other day",
  "Every 3 days",
  "Weekly",
  "Biweekly",
  "Monthly",
];

export default function LearnerAccount() {
  const learnerName = getOnboardingName() || "Learner";

  const [nudgeEnabled, setNudgeEnabled] = useState(true);
  const [nudgeFrequency, setNudgeFrequency] = useState("Biweekly");
  const [nudgeOpen, setNudgeOpen] = useState(true);

  useEffect(() => {
    document.title = "Learner - Account";
    const desc = "Manage your notification preferences.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 1).toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar learnerName={learnerName} />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Account</h1>
          </header>
          <main className="p-6 space-y-6">
            <section className="container max-w-3xl space-y-6">

              {/* Profile Header */}
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-muted text-lg font-semibold">
                      {getInitials(learnerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{learnerName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">Learner</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">Notifications</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage how and when you receive updates.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Collapsible open={nudgeOpen} onOpenChange={setNudgeOpen}>
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">Re-engagement Nudge</p>
                          <CollapsibleTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground">
                              <ChevronUp className={`h-4 w-4 transition-transform ${nudgeOpen ? "" : "rotate-180"}`} />
                            </button>
                          </CollapsibleTrigger>
                        </div>
                        <Switch checked={nudgeEnabled} onCheckedChange={setNudgeEnabled} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Email reminders sent after periods of inactivity.</p>
                      <CollapsibleContent>
                        {nudgeEnabled && (
                          <div className="flex items-center justify-between mt-4 rounded-lg border border-border bg-background/50 p-3">
                            <span className="text-sm">Remind</span>
                            <Select value={nudgeFrequency} onValueChange={setNudgeFrequency}>
                              <SelectTrigger className="w-[160px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {NUDGE_OPTIONS.map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                </CardContent>
              </Card>

            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
