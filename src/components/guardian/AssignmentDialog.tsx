import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGuardianSetup, type Skill, saveGuardianSetup, assignLessonToPerson } from "@/lib/store";
import { Plus, Mic, MicOff, Loader2, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AudioRecorder } from "@/utils/audioRecorder";
import { supabase } from "@/integrations/supabase/client";

type AssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learnerName: string;
};

export function AssignmentDialog({ open, onOpenChange, learnerName }: AssignmentDialogProps) {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [customSkillText, setCustomSkillText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recorder] = useState(() => new AudioRecorder());
  const [selectedLessons, setSelectedLessons] = useState<{[key: string]: string[]}>({});
  const [dueDate, setDueDate] = useState("");
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [createdSkillTitle, setCreatedSkillTitle] = useState("");
  const [adjustmentPrompt, setAdjustmentPrompt] = useState("");
  
  const setup = getGuardianSetup();
  const learnerSkills = setup?.skills?.[learnerName] || [];

  const toggleLessonSelection = (skillTitle: string, lessonTitle: string, allLessons: string[]) => {
    setSelectedLessons(prev => {
      const skillLessons = prev[skillTitle] || [];
      const lessonIndex = allLessons.indexOf(lessonTitle);
      const isSelected = skillLessons.includes(lessonTitle);
      
      if (isSelected) {
        // Uncheck this and all following lessons
        return {
          ...prev,
          [skillTitle]: skillLessons.filter(l => allLessons.indexOf(l) < lessonIndex)
        };
      } else {
        // Check this and all preceding lessons
        const newLessons = allLessons.slice(0, lessonIndex + 1);
        return {
          ...prev,
          [skillTitle]: newLessons
        };
      }
    });
  };

  const handleAssignSelectedLessons = () => {
    let assignedCount = 0;
    
    Object.entries(selectedLessons).forEach(([skillTitle, lessons]) => {
      lessons.forEach(lessonTitle => {
        assignLessonToPerson(learnerName, skillTitle, lessonTitle, dueDate || undefined);
        assignedCount++;
      });
    });

    if (assignedCount === 0) {
      toast({
        title: "No lessons selected",
        description: "Please select at least one lesson to assign.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Lessons assigned!",
      description: `${assignedCount} lesson${assignedCount > 1 ? 's' : ''} assigned to ${learnerName}${dueDate ? ` (Due: ${new Date(dueDate).toLocaleDateString()})` : ''}.`,
    });

    setSelectedLessons({});
    setDueDate("");
    onOpenChange(false);
  };

  const handleCustomSkillSubmit = () => {
    if (!customSkillText.trim()) {
      toast({
        title: "Enter a skill",
        description: "Please describe the skill you want to create.",
        variant: "destructive",
      });
      return;
    }

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
        [learnerName]: [
          ...(currentData.skills?.[learnerName] || []),
          newSkill
        ]
      }
    };

    saveGuardianSetup(updatedData);

    setCreatedSkillTitle(customSkillText.trim());
    setCustomSkillText("");
    setShowAdjustDialog(true);
  };

  const handleAdjustSkill = async () => {
    if (!adjustmentPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter what you'd like to adjust",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Adjusting skill...",
      description: "This feature will use AI to refine the skill structure soon!",
    });

    setAdjustmentPrompt("");
    setShowAdjustDialog(false);
    setActiveTab("existing");
  };

  const handleSkipAdjustment = () => {
    toast({
      title: "Skill created!",
      description: `"${createdSkillTitle}" has been added to ${learnerName}'s skills. You can now assign lessons.`,
    });
    setShowAdjustDialog(false);
    setActiveTab("existing");
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

  return (
    <>
      <Dialog open={open && !showAdjustDialog} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Assign to {learnerName}</DialogTitle>
            <DialogDescription>
              Assign lessons from existing skills or create a new custom skill
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "existing" | "new")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">
                  Assign Lessons
                </TabsTrigger>
                <TabsTrigger value="new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Skill
                </TabsTrigger>
              </TabsList>

              {/* Assign Lessons from Existing Skills Tab */}
              <TabsContent value="existing" className="mt-4">
                {learnerSkills.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="dueDate" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Due Date (Optional)
                        </Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <ScrollArea className="h-[350px] pr-4 mb-4">
                      <div className="space-y-4">
                        {learnerSkills.map((skill, skillIdx) => (
                          <div key={skillIdx} className="space-y-2 border rounded-lg p-4">
                            <h4 className="font-semibold">{skill.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              Select lessons in order - checking a lesson will assign all previous lessons too
                            </p>
                            <div className="space-y-2">
                              {skill.lessons.map((lesson, lessonIdx) => {
                                const isSelected = selectedLessons[skill.title]?.includes(lesson.title);
                                return (
                                  <div
                                    key={lessonIdx}
                                    className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                                    onClick={() => toggleLessonSelection(skill.title, lesson.title, skill.lessons.map(l => l.title))}
                                  >
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => toggleLessonSelection(skill.title, lesson.title, skill.lessons.map(l => l.title))}
                                    />
                                    <span className="text-sm flex-1">{lesson.title}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Button 
                      onClick={handleAssignSelectedLessons}
                      className="w-full"
                      size="lg"
                      disabled={Object.values(selectedLessons).every(lessons => lessons.length === 0)}
                    >
                      Assign Selected Lessons ({Object.values(selectedLessons).reduce((sum, lessons) => sum + lessons.length, 0)})
                    </Button>
                  </>
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
                    <div className="text-4xl">📚</div>
                    <div>
                      <p className="font-medium">No skills available yet</p>
                      <p className="text-sm">Create a new custom skill first!</p>
                    </div>
                    <Button onClick={() => setActiveTab("new")} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Skill
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* New Skill Tab - Direct Custom Form */}
              <TabsContent value="new" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="customSkill">Describe the skill you want to create</Label>
                    <p className="text-sm text-muted-foreground">
                      We'll generate a lesson structure for this skill. You can adjust it after creation.
                    </p>
                    <Textarea
                      id="customSkill"
                      placeholder="E.g., 'Learn to write persuasive essays' or 'Master multiplication tables'..."
                      value={customSkillText}
                      onChange={(e) => setCustomSkillText(e.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                    
                    <div className="flex gap-2">
                      {!isRecording && !isTranscribing && (
                        <Button
                          variant="outline"
                          onClick={handleStartRecording}
                          className="flex-1"
                          size="lg"
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
                          size="lg"
                        >
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                      
                      {isTranscribing && (
                        <Button variant="outline" disabled className="flex-1" size="lg">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Transcribing...
                        </Button>
                      )}
                    </div>
                    
                    <Button 
                      onClick={handleCustomSkillSubmit}
                      className="w-full"
                      size="lg"
                      disabled={!customSkillText.trim()}
                    >
                      Create Skill
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjustment Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Skill Structure?</DialogTitle>
            <DialogDescription>
              We've created "{createdSkillTitle}" with a default lesson structure. Would you like to adjust it?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adjustment">What would you like to adjust?</Label>
              <Textarea
                id="adjustment"
                placeholder="E.g., 'Make the lessons more beginner-friendly' or 'Add more practice exercises' or 'Focus on practical applications'..."
                value={adjustmentPrompt}
                onChange={(e) => setAdjustmentPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSkipAdjustment}
                variant="outline"
                className="flex-1"
              >
                Looks Good
              </Button>
              <Button
                onClick={handleAdjustSkill}
                disabled={!adjustmentPrompt.trim()}
                className="flex-1"
              >
                Adjust Skill
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
