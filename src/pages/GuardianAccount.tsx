import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AnalyticsSidebar } from "@/components/guardian/AnalyticsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Bell, ChevronUp, Home, Settings, Users } from "lucide-react";
import { getGuardianSetup } from "@/lib/store";
import { useNavigate } from "react-router-dom";

const REMINDER_OPTIONS = [
  "1 day",
  "2 days",
  "3 days",
  "1 week",
  "2 weeks",
  "1 month",
];

export default function GuardianAccount() {
  const setup = getGuardianSetup();
  const guardianName = setup?.guardianName || "Tree Guardian";
  const learners = setup?.learners || [{ name: "Jake" }, { name: "Mia" }];
  const familyName = `${guardianName.split(" ")[0]} Family`;
  const navigate = useNavigate();

  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [safetyAlerts, setSafetyAlerts] = useState(true);
  const [selectedLearner, setSelectedLearner] = useState(0);
  const [nudgeEnabled, setNudgeEnabled] = useState<Record<number, boolean>>(
    () => Object.fromEntries(learners.map((_, i) => [i, true]))
  );
  const [nudgeFrequency, setNudgeFrequency] = useState<Record<number, string>>(
    () => Object.fromEntries(learners.map((_, i) => [i, "Biweekly"]))
  );
  const [nudgeOpen, setNudgeOpen] = useState(true);

  useEffect(() => {
    document.title = "Guardian - Account Settings";
    const desc = "Manage your family information and account settings.";
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
        <AnalyticsSidebar guardianName={guardianName} learners={learners} />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Account Settings</h1>
          </header>
          <main className="p-6 space-y-6">
            <section className="container max-w-3xl space-y-6">

              {/* Profile Header */}
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-muted text-lg font-semibold">
                      {getInitials(guardianName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{guardianName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">Parent</Badge>
                      <span className="text-sm text-muted-foreground">parent@example.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Family Overview */}
              <Card>
                <CardHeader className="flex flex-row items-start justify-between pb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">Family Overview</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage your family information and account settings</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/guardian/account")}>
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-6">
                      <Home className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Family</span>
                      <span className="text-sm font-semibold">{familyName}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-6">
                      <Users className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Members</span>
                      <span className="text-sm font-semibold">{learners.length} members</span>
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
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <div>
                      <p className="text-sm font-semibold">Parent Weekly Digest</p>
                      <p className="text-xs text-muted-foreground">Receive a weekly email summarizing your learners' learning activity.</p>
                    </div>
                    <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <div>
                      <p className="text-sm font-semibold">Safety Flagging Alerts</p>
                      <p className="text-xs text-muted-foreground">Get an email alert when a conversation raises a safety flag.</p>
                    </div>
                    <Switch checked={safetyAlerts} onCheckedChange={setSafetyAlerts} />
                  </div>
                </CardContent>
              </Card>

              {/* Learner Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">Learner Notifications</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage notification preferences for each learner.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Segmented control (button group pattern) */}
                  <div className="inline-flex items-center rounded-lg border border-border bg-muted/50 p-1">
                    {learners.map((learner, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedLearner(i)}
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                          selectedLearner === i
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold ${
                          selectedLearner === i
                            ? "bg-muted text-foreground"
                            : "bg-muted-foreground/20 text-muted-foreground"
                        }`}>
                          {getInitials(learner.name)}
                        </span>
                        {learner.name}
                      </button>
                    ))}
                  </div>

                  {/* Nudge settings for selected child */}
                  <Collapsible open={nudgeOpen} onOpenChange={setNudgeOpen}>
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">Learning Reminders</p>
                          <CollapsibleTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground">
                              <ChevronUp className={`h-4 w-4 transition-transform ${nudgeOpen ? "" : "rotate-180"}`} />
                            </button>
                          </CollapsibleTrigger>
                        </div>
                        <Switch
                          checked={nudgeEnabled[selectedLearner] ?? true}
                          onCheckedChange={(val) => setNudgeEnabled(prev => ({ ...prev, [selectedLearner]: val }))}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Send a friendly email reminder if they haven't practiced in a while.</p>
                      <CollapsibleContent>
                        {nudgeEnabled[selectedLearner] && (
                          <div className="flex items-center justify-between mt-4 rounded-lg border border-border bg-background/50 p-3">
                            <span className="text-sm">Remind after</span>
                            <Select
                              value={nudgeFrequency[selectedLearner] ?? "Biweekly"}
                              onValueChange={(val) => setNudgeFrequency(prev => ({ ...prev, [selectedLearner]: val }))}
                            >
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
