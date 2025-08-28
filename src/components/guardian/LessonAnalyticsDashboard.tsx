import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Clock, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Users,
  Target,
  Award
} from "lucide-react";

interface LessonTheme {
  category: string;
  topics: string[];
  sessionCount: number;
  avgDuration: string;
  engagementRate: number;
  flaggedSessions: number;
}

interface LearnerSummary {
  name: string;
  totalSessions: number;
  totalTime: string;
  avgEngagement: number;
  recentTopics: string[];
  completionRate: number;
  flaggedContent: number;
  lastActive: string;
}

interface RecentSession {
  id: string;
  learnerName: string;
  title: string;
  duration: string;
  timestamp: string;
  engagementScore: number;
  keyTopics: string[];
  flagged: boolean;
}

interface LessonAnalyticsDashboardProps {
  guardianName: string;
  learners: { name: string }[];
  onViewSession: (sessionId: string, learnerName: string) => void;
}

export function LessonAnalyticsDashboard({ 
  guardianName, 
  learners,
  onViewSession 
}: LessonAnalyticsDashboardProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Mock data - would come from analytics service
  const themes: LessonTheme[] = [
    {
      category: "Fashion & Style",
      topics: ["Color coordination", "Seasonal trends", "Personal style", "Wardrobe basics"],
      sessionCount: 24,
      avgDuration: "12m 30s",
      engagementRate: 87,
      flaggedSessions: 0
    },
    {
      category: "Pet Training",
      topics: ["Basic commands", "Leash training", "House training", "Social behavior"],
      sessionCount: 18,
      avgDuration: "15m 45s",
      engagementRate: 92,
      flaggedSessions: 1
    },
    {
      category: "Academic Support",
      topics: ["Math homework", "Reading comprehension", "Science projects", "Study habits"],
      sessionCount: 31,
      avgDuration: "18m 20s",
      engagementRate: 78,
      flaggedSessions: 0
    },
    {
      category: "Life Skills",
      topics: ["Time management", "Organization", "Communication", "Problem solving"],
      sessionCount: 15,
      avgDuration: "22m 10s",
      engagementRate: 85,
      flaggedSessions: 2
    }
  ];

  const learnerSummaries: LearnerSummary[] = [
    {
      name: "Jake",
      totalSessions: 45,
      totalTime: "11h 30m",
      avgEngagement: 85,
      recentTopics: ["Pet training", "Math homework", "Organization"],
      completionRate: 78,
      flaggedContent: 1,
      lastActive: "2h ago"
    },
    {
      name: "Mia",
      totalSessions: 38,
      totalTime: "9h 15m",
      avgEngagement: 92,
      recentTopics: ["Fashion & style", "Reading comprehension", "Time management"],
      completionRate: 84,
      flaggedContent: 2,
      lastActive: "1d ago"
    }
  ];

  const recentSessions: RecentSession[] = [
    {
      id: "session-1",
      learnerName: "Jake",
      title: "Basic Dog Walking",
      duration: "15m 30s",
      timestamp: "2h ago",
      engagementScore: 95,
      keyTopics: ["Leash training", "Safety", "Commands"],
      flagged: false
    },
    {
      id: "session-2",
      learnerName: "Mia",
      title: "Color Coordination Basics",
      duration: "12m 45s",
      timestamp: "1d ago",
      engagementScore: 88,
      keyTopics: ["Color theory", "Outfit planning", "Style tips"],
      flagged: false
    },
    {
      id: "session-3",
      learnerName: "Jake",
      title: "Algebra Problem Solving",
      duration: "20m 15s",
      timestamp: "2d ago",
      engagementScore: 72,
      keyTopics: ["Equations", "Variables", "Problem solving"],
      flagged: true
    }
  ];

  const totalSessions = learnerSummaries.reduce((sum, learner) => sum + learner.totalSessions, 0);
  const avgEngagement = Math.round(learnerSummaries.reduce((sum, learner) => sum + learner.avgEngagement, 0) / learnerSummaries.length);
  const totalFlagged = learnerSummaries.reduce((sum, learner) => sum + learner.flaggedContent, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">Across all learners</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagement}%</div>
            <Progress value={avgEngagement} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Themes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{themes.length}</div>
            <p className="text-xs text-muted-foreground">Active topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalFlagged}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </section>

      {/* Learning Themes Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Themes & Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {themes.map((theme) => (
              <div 
                key={theme.category}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedTheme === theme.category ? 'bg-muted border-primary' : ''
                }`}
                onClick={() => setSelectedTheme(selectedTheme === theme.category ? null : theme.category)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{theme.category}</h3>
                  <div className="flex gap-2">
                    {theme.flaggedSessions > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {theme.flaggedSessions} flagged
                      </Badge>
                    )}
                    <Badge variant="outline">{theme.sessionCount} sessions</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement:</span>
                    <span className="font-medium">{theme.engagementRate}%</span>
                  </div>
                  <Progress value={theme.engagementRate} className="h-2" />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Avg Duration: {theme.avgDuration}</span>
                    <span>{theme.topics.length} topics</span>
                  </div>
                </div>

                {selectedTheme === theme.category && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Key Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {theme.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learner Summaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Learner Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {learnerSummaries.map((learner) => (
              <div key={learner.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{learner.name}</h3>
                  <div className="flex gap-2">
                    {learner.flaggedContent > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {learner.flaggedContent} flagged
                      </Badge>
                    )}
                    <Badge variant="outline">{learner.totalSessions} sessions</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Time:</span>
                      <div className="font-medium">{learner.totalTime}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completion:</span>
                      <div className="font-medium">{learner.completionRate}%</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Engagement: </span>
                    <span className="font-medium">{learner.avgEngagement}%</span>
                    <Progress value={learner.avgEngagement} className="mt-1 h-2" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recent Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {learner.recentTopics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last active: {learner.lastActive}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Learning Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div 
                  key={session.id}
                  className={`p-4 border rounded-lg ${session.flagged ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.learnerName}</span>
                      {session.flagged && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{session.timestamp}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onViewSession(session.id, session.learnerName)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>

                  <h4 className="font-medium mb-2">{session.title}</h4>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Duration: {session.duration}
                    </span>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{session.engagementScore}% engagement</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {session.keyTopics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}