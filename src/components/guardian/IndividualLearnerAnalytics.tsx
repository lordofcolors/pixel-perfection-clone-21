import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionTranscriptModal } from "./SessionTranscriptModal";
import { 
  BookOpen, 
  Clock, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Target,
  Award,
  User,
  ExternalLink
} from "lucide-react";

interface LessonTheme {
  category: string;
  topics: string[];
  sessionCount: number;
  avgDuration: string;
  engagementRate: number;
  flaggedSessions: number;
  sessions: RecentSession[];
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
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

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
          flaggedSessions: 1,
          sessions: [
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
              id: "session-7",
              title: "Teaching Sit Command",
              duration: "12m 15s",
              timestamp: "1d ago",
              engagementScore: 88,
              keyTopics: ["Basic commands", "Rewards", "Patience"],
              flagged: false
            },
            {
              id: "session-8",
              title: "House Training Tips",
              duration: "18m 45s",
              timestamp: "3d ago",
              engagementScore: 85,
              keyTopics: ["House training", "Schedule", "Consistency"],
              flagged: true
            }
          ]
        },
        {
          category: "Academic Support",
          topics: ["Math homework", "Algebra", "Problem solving", "Study habits"],
          sessionCount: 15,
          avgDuration: "18m 20s",
          engagementRate: 78,
          flaggedSessions: 0,
          sessions: [
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
              id: "session-9",
              title: "Math Homework Help",
              duration: "16m 30s",
              timestamp: "4d ago",
              engagementScore: 80,
              keyTopics: ["Math homework", "Step-by-step", "Practice"],
              flagged: false
            }
          ]
        },
        {
          category: "Life Skills",
          topics: ["Time management", "Organization", "Communication"],
          sessionCount: 12,
          avgDuration: "22m 10s",
          engagementRate: 85,
          flaggedSessions: 0,
          sessions: [
            {
              id: "session-4",
              title: "Organization Skills",
              duration: "18m 00s",
              timestamp: "3d ago",
              engagementScore: 88,
              keyTopics: ["Planning", "Time management", "Tools"],
              flagged: false
            },
            {
              id: "session-10",
              title: "Communication Practice",
              duration: "25m 20s",
              timestamp: "5d ago",
              engagementScore: 82,
              keyTopics: ["Communication", "Active listening", "Expression"],
              flagged: false
            }
          ]
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
          flaggedSessions: 0,
          sessions: [
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
              id: "session-11",
              title: "Seasonal Fashion Trends",
              duration: "14m 20s",
              timestamp: "2d ago",
              engagementScore: 92,
              keyTopics: ["Seasonal trends", "Shopping tips", "Budget"],
              flagged: false
            }
          ]
        },
        {
          category: "Academic Support",
          topics: ["Reading comprehension", "Writing skills", "Literature", "Creative writing"],
          sessionCount: 12,
          avgDuration: "16m 40s",
          engagementRate: 88,
          flaggedSessions: 1,
          sessions: [
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
              id: "session-12",
              title: "Reading Comprehension",
              duration: "18m 15s",
              timestamp: "4d ago",
              engagementScore: 85,
              keyTopics: ["Reading comprehension", "Analysis", "Discussion"],
              flagged: true
            }
          ]
        },
        {
          category: "Life Skills",
          topics: ["Social skills", "Emotional awareness", "Self-expression"],
          sessionCount: 6,
          avgDuration: "25m 15s",
          engagementRate: 90,
          flaggedSessions: 1,
          sessions: [
            {
              id: "session-6",
              title: "Emotional Expression",
              duration: "28m 15s",
              timestamp: "4d ago",
              engagementScore: 86,
              keyTopics: ["Feelings", "Communication", "Self-awareness"],
              flagged: true
            },
            {
              id: "session-13",
              title: "Social Skills Practice",
              duration: "22m 45s",
              timestamp: "6d ago",
              engagementScore: 89,
              keyTopics: ["Social skills", "Conversation", "Empathy"],
              flagged: false
            }
          ]
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

        {/* Learning Themes & Progress Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {learnerName}'s Learning Themes & Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.themes.map((theme) => (
                <div 
                  key={theme.category}
                  className={`p-6 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedTheme === theme.category ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => setSelectedTheme(selectedTheme === theme.category ? null : theme.category)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{theme.category}</h3>
                    <div className="flex gap-2">
                      {theme.flaggedSessions > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {theme.flaggedSessions} flagged
                        </Badge>
                      )}
                      <Badge variant="outline">{theme.sessionCount} sessions</Badge>
                    </div>
                  </div>

                  {/* Progress Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement Rate:</span>
                        <span className="font-medium">{theme.engagementRate}%</span>
                      </div>
                      <Progress value={theme.engagementRate} className="h-2" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{theme.avgDuration}</div>
                      <div className="text-xs text-muted-foreground">Avg Duration</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{theme.topics.length}</div>
                      <div className="text-xs text-muted-foreground">Topics Covered</div>
                    </div>
                  </div>

                  {/* Mastery Indicators */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {theme.topics.map((topic, index) => {
                        const masteryLevel = Math.floor(Math.random() * 3); // 0: learning, 1: improving, 2: mastered
                        const masteryColors = ['bg-yellow-100 text-yellow-800 border-yellow-300', 'bg-blue-100 text-blue-800 border-blue-300', 'bg-green-100 text-green-800 border-green-300'];
                        const masteryLabels = ['Learning', 'Improving', 'Mastered'];
                        
                        return (
                          <div key={topic} className={`px-2 py-1 rounded-md border text-xs ${masteryColors[masteryLevel]}`}>
                            {topic} • {masteryLabels[masteryLevel]}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedTheme === theme.category && (
                    <div className="mt-6 pt-4 border-t space-y-4">
                      {/* Related Sessions */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Sessions in {theme.category}
                        </h4>
                        <div className="grid gap-3">
                          {theme.sessions.map((session) => (
                            <div 
                              key={session.id}
                              className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => {
                                setSelectedSession({
                                  id: session.id,
                                  title: session.title,
                                  duration: session.duration,
                                  messagesCount: Math.floor(Math.random() * 20) + 10,
                                  completionRate: session.engagementScore,
                                  status: session.flagged ? "flagged" : "completed",
                                  learnerName: learnerName,
                                  completedAt: session.timestamp,
                                  transcript: [
                                    {
                                      timestamp: "14:32",
                                      speaker: "You" as const,
                                      content: `Hi! I'd like to learn about ${session.keyTopics[0]}.`
                                    },
                                    {
                                      timestamp: "14:33",
                                      speaker: "Assistant" as const,
                                      content: `Great! Let's start with the basics of ${session.keyTopics[0]}. Here's what you need to know...`
                                    },
                                    {
                                      timestamp: "14:35",
                                      speaker: "You" as const,
                                      content: "That makes sense! Can you give me an example?"
                                    },
                                    {
                                      timestamp: "14:36",
                                      speaker: "Assistant" as const,
                                      content: `Of course! Here's a practical example...`,
                                      flagged: session.flagged
                                    }
                                  ]
                                });
                                setIsSessionModalOpen(true);
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-sm">{session.title}</h5>
                                <div className="flex items-center gap-2">
                                  {session.flagged && (
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                  )}
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>{session.duration}</span>
                                <span>{session.timestamp}</span>
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
                      </div>
                      
                      {/* Detailed Analysis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-3">
                          <h4 className="font-medium text-green-700 dark:text-green-400">Strengths</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              High engagement ({theme.engagementRate}%)
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Consistent session completion
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Shows mastery in core concepts
                            </li>
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium text-amber-700 dark:text-amber-400">Growth Areas</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              Could benefit from longer sessions
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              Practice more advanced topics
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              Review foundational concepts
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Time Spent Breakdown */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Time Distribution</h4>
                        <div className="space-y-2">
                          {theme.topics.map((topic, index) => {
                            const timePercentage = Math.floor(Math.random() * 40) + 10; // Random percentage between 10-50%
                            return (
                              <div key={topic} className="flex items-center justify-between">
                                <span className="text-sm">{topic}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-muted rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full" 
                                      style={{ width: `${timePercentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-muted-foreground w-8">{timePercentage}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Recommendations</h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Continue building on {theme.category.toLowerCase()} foundation</li>
                          <li>• Consider introducing more challenging scenarios</li>
                          <li>• Schedule regular review sessions for retention</li>
                        </ul>
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
      
      <SessionTranscriptModal
        session={selectedSession}
        open={isSessionModalOpen}
        onOpenChange={setIsSessionModalOpen}
      />
    </div>
  );
}