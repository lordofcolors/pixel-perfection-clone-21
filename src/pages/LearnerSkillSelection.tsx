import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, MessageSquare, Code, Calculator, ArrowLeft } from "lucide-react";
import { getOnboardingName } from "@/lib/store";

const presetSkills = [
  {
    id: "interview",
    title: "Interview Skills",
    icon: Target,
    description: "Master the art of interviewing with confidence",
    color: "from-blue-500/10 to-blue-600/10",
    iconColor: "text-blue-600",
    lessons: [
      "Introduction to Effective Interviewing",
      "Common Interview Questions & Answers",
      "Body Language & First Impressions",
      "Behavioral Interview Techniques",
      "Mock Interview Practice"
    ]
  },
  {
    id: "public-speaking",
    title: "Public Speaking",
    icon: MessageSquare,
    description: "Build confidence in public speaking and presentations",
    color: "from-purple-500/10 to-purple-600/10",
    iconColor: "text-purple-600",
    lessons: [
      "Overcoming Stage Fright",
      "Voice Projection & Clarity",
      "Engaging Your Audience",
      "Structuring Your Speech",
      "Handling Q&A Sessions"
    ]
  },
  {
    id: "coding",
    title: "Coding Fundamentals",
    icon: Code,
    description: "Learn programming basics and problem-solving",
    color: "from-green-500/10 to-green-600/10",
    iconColor: "text-green-600",
    lessons: [
      "Introduction to Programming",
      "Variables & Data Types",
      "Control Flow & Loops",
      "Functions & Methods",
      "Building Your First Project"
    ]
  },
  {
    id: "math",
    title: "Math Problem Solving",
    icon: Calculator,
    description: "Strengthen mathematical thinking and problem-solving",
    color: "from-orange-500/10 to-orange-600/10",
    iconColor: "text-orange-600",
    lessons: [
      "Problem-Solving Strategies",
      "Algebra Fundamentals",
      "Geometry Basics",
      "Word Problems Mastery",
      "Advanced Techniques"
    ]
  }
];

export default function LearnerSkillSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const learnerName = ((location.state as any)?.firstName as string | undefined) || getOnboardingName();

  useEffect(() => {
    document.title = "Select a Skill - Learner Dashboard";
    const desc = "Choose from preset skills to add to your learning journey.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, []);

  const handleSelectSkill = (skillId: string) => {
    // TODO: Implement adding the skill to the learner's journey
    console.log("Selected skill:", skillId);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar learnerName={learnerName} />

        <SidebarInset>
          <header className="h-16 flex items-center justify-between border-b px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/learner', { state: { firstName: learnerName } })}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg font-semibold">Add a Skill</h1>
            </div>
          </header>

          <main className="p-6">
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Choose Your Learning Path</h1>
                <p className="text-muted-foreground text-lg">
                  Select a skill to add to your learning journey. Each skill comes with a structured curriculum.
                </p>
              </div>

              {/* Preset Skills Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {presetSkills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <Card 
                      key={skill.id}
                      className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50"
                      onClick={() => handleSelectSkill(skill.id)}
                    >
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4`}>
                          <Icon className={`h-6 w-6 ${skill.iconColor}`} />
                        </div>
                        <CardTitle className="text-xl">{skill.title}</CardTitle>
                        <CardDescription className="text-base">{skill.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{skill.lessons.length} Lessons</Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Curriculum Preview:</p>
                            <ul className="space-y-1.5">
                              {skill.lessons.slice(0, 3).map((lesson, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{lesson}</span>
                                </li>
                              ))}
                              {skill.lessons.length > 3 && (
                                <li className="text-sm text-muted-foreground">
                                  +{skill.lessons.length - 3} more lessons...
                                </li>
                              )}
                            </ul>
                          </div>

                          <Button className="w-full mt-4">
                            Add to My Journey
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Info Card */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div className="space-y-1">
                      <p className="font-medium">Sequential Learning</p>
                      <p className="text-sm text-muted-foreground">
                        Each skill starts with the first lesson unlocked. Complete lessons in order to unlock the next ones and build your knowledge step by step.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
