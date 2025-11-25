import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SKILL_TEMPLATES, addSkillToPerson, getGuardianSetup, type Skill, saveGuardianSetup } from "@/lib/store";
import { BookOpen, Plus, RotateCcw, Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AudioRecorder } from "@/utils/audioRecorder";
import { supabase } from "@/integrations/supabase/client";

type AssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learners: { name: string }[];
};

export function AssignmentDialog({ open, onOpenChange, learners }: AssignmentDialogProps) {
  const [selectedLearner, setSelectedLearner] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"new" | "revisit">("new");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSkillText, setCustomSkillText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recorder] = useState(() => new AudioRecorder());
  
  const setup = getGuardianSetup();
  const learnerSkills = selectedLearner ? setup?.skills?.[selectedLearner] || [] : [];

  const handleAssignNewSkill = (skillTemplateKey: string) => {
    if (!selectedLearner) {
      toast({
        title: "Select a learner",
        description: "Please select which child to assign this skill to.",
        variant: "destructive",
      });
      return;
    }

    // Check if this is the custom skill template
    if (skillTemplateKey === "I want to start a new skill") {
      setShowCustomInput(true);
      return;
    }

    addSkillToPerson(selectedLearner, skillTemplateKey);
    
    toast({
      title: "Skill assigned!",
      description: `${SKILL_TEMPLATES[skillTemplateKey as keyof typeof SKILL_TEMPLATES].title} has been assigned to ${selectedLearner}.`,
    });
    
    onOpenChange(false);
  };

  const handleCustomSkillSubmit = () => {
    if (!customSkillText.trim()) {
      toast({
        title: "Enter a skill",
        description: "Please describe the skill you want to assign.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLearner) {
      toast({
        title: "Select a learner",
        description: "Please select which child to assign this skill to.",
        variant: "destructive",
      });
      return;
    }

    // Create a custom skill
    const currentData = getGuardianSetup();
    if (!currentData) return;

    const newSkill: Skill = {
      title: customSkillText.trim(),
      lessons: [
        { title: "0: Introduction & Goal Setting", locked: false },
        { title: "1: Foundation & Basics", locked: false },
        { title: "2: Practice & Application", locked: false },
        { title: "3: Intermediate Skills", locked: true },
        { title: "4: Advanced Techniques", locked: true },
        { title: "5: Mastery & Review", locked: true },
      ]
    };

    const updatedData = {
      ...currentData,
      skills: {
        ...currentData.skills,
        [selectedLearner]: [
          ...(currentData.skills?.[selectedLearner] || []),
          newSkill
        ]
      }
    };

    saveGuardianSetup(updatedData);

    toast({
      title: "Custom skill created!",
      description: `"${customSkillText.trim()}" has been assigned to ${selectedLearner}.`,
    });

    setCustomSkillText("");
    setShowCustomInput(false);
    onOpenChange(false);
  };

  const handleStartRecording = async () => {
    try {
      await recorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak your custom skill description...",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: error instanceof Error ? error.message : "Could not start recording",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);
      
      const audioBase64 = await recorder.stop();
      
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: audioBase64 }
      });

      if (error) throw error;

      setCustomSkillText(data.text);
      setIsTranscribing(false);
      
      toast({
        title: "Transcription complete",
        description: "Your speech has been converted to text.",
      });
    } catch (error) {
      setIsTranscribing(false);
      toast({
        title: "Transcription failed",
        description: error instanceof Error ? error.message : "Could not transcribe audio",
        variant: "destructive",
      });
    }
  };

  const handleRevisitLesson = (skillTitle: string, lessonTitle: string) => {
    toast({
      title: "Lesson assigned for review",
      description: `${selectedLearner} will revisit: ${lessonTitle}`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Assign Skills & Lessons</DialogTitle>
          <DialogDescription>
            Assign new skills or have your child revisit specific lessons
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Learner Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Child</label>
            <Select value={selectedLearner} onValueChange={setSelectedLearner}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a child..." />
              </SelectTrigger>
              <SelectContent>
                {learners.map((learner) => (
                  <SelectItem key={learner.name} value={learner.name}>
                    {learner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs for New vs Revisit */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "new" | "revisit")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Skill
              </TabsTrigger>
              <TabsTrigger value="revisit" className="flex items-center gap-2" disabled={!selectedLearner || learnerSkills.length === 0}>
                <RotateCcw className="h-4 w-4" />
                Revisit Lesson
              </TabsTrigger>
            </TabsList>

            {/* New Skill Tab */}
            <TabsContent value="new" className="mt-4">
              {showCustomInput ? (
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomSkillText("");
                    }}
                    className="mb-2"
                  >
                    ← Back to templates
                  </Button>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Describe the skill</label>
                    <Textarea
                      placeholder="E.g., I want to learn how to make new friends at school"
                      value={customSkillText}
                      onChange={(e) => setCustomSkillText(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    
                    <div className="flex gap-2">
                      {!isRecording && !isTranscribing && (
                        <Button
                          variant="outline"
                          onClick={handleStartRecording}
                          className="flex-1"
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Use Voice Input
                        </Button>
                      )}
                      
                      {isRecording && (
                        <Button
                          variant="destructive"
                          onClick={handleStopRecording}
                          className="flex-1"
                        >
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                      
                      {isTranscribing && (
                        <Button variant="outline" disabled className="flex-1">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Transcribing...
                        </Button>
                      )}
                    </div>
                    
                    <Button 
                      onClick={handleCustomSkillSubmit}
                      className="w-full"
                      disabled={!customSkillText.trim()}
                    >
                      Create & Assign Skill
                    </Button>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {Object.entries(SKILL_TEMPLATES).map(([key, skill]) => (
                      <div
                        key={key}
                        className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer group"
                        onClick={() => handleAssignNewSkill(key)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                              {skill.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {key}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <BookOpen className="h-3 w-3" />
                              {skill.lessons.length} lessons
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {key === "I want to start a new skill" ? "Customize" : "Assign"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            {/* Revisit Lesson Tab */}
            <TabsContent value="revisit" className="mt-4">
              {selectedLearner && learnerSkills.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {learnerSkills.map((skill, skillIdx) => (
                      <div key={skillIdx} className="space-y-2">
                        <h4 className="font-semibold text-sm">{skill.title}</h4>
                        <div className="space-y-2">
                          {skill.lessons.map((lesson, lessonIdx) => (
                            <div
                              key={lessonIdx}
                              className="border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer group flex items-center justify-between"
                              onClick={() => handleRevisitLesson(skill.title, lesson.title)}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{lesson.title}</span>
                                {lesson.locked && (
                                  <Badge variant="secondary" className="text-xs">Locked</Badge>
                                )}
                              </div>
                              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                Assign
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  {!selectedLearner ? "Select a child to see their lessons" : "No skills assigned yet"}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
