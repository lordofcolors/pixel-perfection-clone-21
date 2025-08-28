import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Target,
  Award,
  User
} from "lucide-react";

interface LessonTheme {
  category: string;
  topics: string[];
  sessionCount: number;
  avgDuration: string;
  engagementRate: number;
  flaggedSessions: number;
}

interface LearnerData {
  name: string;
  totalSessions: number;
  totalTime: string;
  avgEngagement: number;
  completionRate: number;
  flaggedContent: number;
  lastActive: string;
  themes: LessonTheme[];
  recentSessions: RecentSession[];
}

interface RecentSession {
  id: string;
  title: string;
  duration: string;
  timestamp: string;
  engagementScore: number;
  keyTopics: string[];
  flagged: boolean;
}

interface IndividualLearnerAnalyticsProps {
  learners: { name: string }[];
  onViewSession: (sessionId: string, learnerName: string) => void;
  activeView: "guardian" | number;
  onSelectView: (view: "guardian" | number) => void;
  showOnlyIndividual?: boolean;
  learnerName?: string;
}

export function IndividualLearnerAnalytics({ 
  learners,
  onViewSession,
  activeView,
  onSelectView,
  showOnlyIndividual = false,
  learnerName
}: IndividualLearnerAnalyticsProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Mock data for each learner
  const learnerData: Record<string, LearnerData> = {
    Jake: {
      name: "Jake",
      totalSessions: 45,
      totalTime: "11h 30m",
      avgEngagement: 85,
      completionRate: 78,
      flaggedContent: 1,
      lastActive: "2h ago",
      themes: [
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
          topics: ["Math homework", "Algebra", "Problem solving", "Study habits"],
          sessionCount: 15,
          avgDuration: "18m 20s",
          engagementRate: 78,
          flaggedSessions: 0
        },
        {
          category: "Life Skills",
          topics: ["Time management", "Organization", "Communication"],
          sessionCount: 12,
          avgDuration: "22m 10s",
          engagementRate: 85,
          flaggedSessions: 0
        }
      ],
      recentSessions: [
        {
          id: "session-1",
          title: "Basic Dog Walking",
          duration: "15m 30s",
          timestamp: "2h ago",
          engagementScore: 95,
          keyTopics: ["Leash training", "Safety", "Commands"],
          flagged: false
        },
        {
          id: "session-3",
          title: "Algebra Problem Solving",
          duration: "20m 15s",
          timestamp: "2d ago",
          engagementScore: 72,
          keyTopics: ["Equations", "Variables", "Problem solving"],
          flagged: true
        },
        {
          id: "session-4",
          title: "Organization Skills",
          duration: "18m 00s",
          timestamp: "3d ago",
          engagementScore: 88,
          keyTopics: ["Planning", "Time management", "Tools"],
          flagged: false
        }
      ]
    },
    Mia: {
      name: "Mia",
      totalSessions: 38,
      totalTime: "9h 15m",
      avgEngagement: 92,
      completionRate: 84,
      flaggedContent: 2,
      lastActive: "1d ago",
      themes: [
        {
          category: "Fashion & Style",
          topics: ["Color coordination", "Seasonal trends", "Personal style", "Wardrobe basics"],
          sessionCount: 20,
          avgDuration: "12m 30s",
          engagementRate: 95,
          flaggedSessions: 0
        },
        {
          category: "Academic Support",
          topics: ["Reading comprehension", "Writing skills", "Literature", "Creative writing"],
          sessionCount: 12,
          avgDuration: "16m 40s",
          engagementRate: 88,
          flaggedSessions: 1
        },
        {
          category: "Life Skills",
          topics: ["Social skills", "Emotional awareness", "Self-expression"],
          sessionCount: 6,
          avgDuration: "25m 15s",
          engagementRate: 90,
          flaggedSessions: 1
        }
      ],
      recentSessions: [
        {
          id: "session-2",
          title: "Color Coordination Basics",
          duration: "12m 45s",
          timestamp: "1d ago",
          engagementScore: 88,
          keyTopics: ["Color theory", "Outfit planning", "Style tips"],
          flagged: false
        },
        {
          id: "session-5",
          title: "Creative Writing Workshop",
          duration: "22m 30s",
          timestamp: "2d ago",
          engagementScore: 94,
          keyTopics: ["Storytelling", "Character development", "Plot"],
          flagged: false
        },
        {
          id: "session-6",
          title: "Emotional Expression",
          duration: "28m 15s",
          timestamp: "4d ago",
          engagementScore: 86,
          keyTopics: ["Feelings", "Communication", "Self-awareness"],
          flagged: true
        }
      ]
    }
  };

  // Aggregate stats across all learners
  const totalSessions = Object.values(learnerData).reduce((sum, learner) => sum + learner.totalSessions, 0);
  const avgEngagement = Math.round(Object.values(learnerData).reduce((sum, learner) => sum + learner.avgEngagement, 0) / Object.values(learnerData).length);
  const totalFlagged = Object.values(learnerData).reduce((sum, learner) => sum + learner.flaggedContent, 0);
  const allThemes = Array.from(new Set(Object.values(learnerData).flatMap(learner => learner.themes.map(theme => theme.category))));

  const renderOverallStats = () => (
    <div className="space-y-6">
      {/* Aggregate Overview */}
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
            <div className="text-2xl font-bold">{allThemes.length}</div>
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

      {/* Learner Quick Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Learner Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {learners.map((learner, index) => {
              const data = learnerData[learner.name];
              return (
                <div 
                  key={learner.name}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectView(index)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{learner.name}</h3>
                    <div className="flex gap-2">
                      {data.flaggedContent > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {data.flaggedContent} flagged
                        </Badge>
                      )}
                      <Badge variant="outline">{data.totalSessions} sessions</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement:</span>
                      <span className="font-medium">{data.avgEngagement}%</span>
                    </div>
                    <Progress value={data.avgEngagement} className="h-2" />
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Total Time: {data.totalTime}</span>
                      <span>Last: {data.lastActive}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLearnerAnalytics = (learnerName: string) => {
    const data = learnerData[learnerName];
    if (!data) return null;

    return (
      <div className="space-y-6">
        {/* Individual Learner Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalSessions}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.avgEngagement}%</div>
              <Progress value={data.avgEngagement} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalTime}</div>
              <p className="text-xs text-muted-foreground">Total time spent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{data.flaggedContent}</div>
              <p className="text-xs text-muted-foreground">Flagged sessions</p>
            </CardContent>
          </Card>
        </section>

        {/* Learning Themes for this learner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {learnerName}'s Learning Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.themes.map((theme) => (
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

        {/* Recent Sessions for this learner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {learnerName}'s Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {data.recentSessions.map((session) => (
                  <div 
                    key={session.id}
                    className={`p-4 border rounded-lg ${session.flagged ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{session.title}</span>
                        {session.flagged && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{session.timestamp}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onViewSession(session.id, learnerName)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                    
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
  };

  // If showing only individual analytics (from tabs), just render that learner's data
  if (showOnlyIndividual && learnerName) {
    return renderLearnerAnalytics(learnerName);
  }

  if (activeView === "guardian") {
    return renderOverallStats();
  }

  const selectedLearner = learners[activeView];
  if (!selectedLearner) return null;

  return (
    <div className="space-y-6">
      {/* Navigation back to overview */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onSelectView("guardian")}
        >
          ← Back to Overview
        </Button>
        <h2 className="text-lg font-semibold">{selectedLearner.name}'s Analytics</h2>
      </div>
      
      {renderLearnerAnalytics(selectedLearner.name)}
    </div>
  );
}