import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { getGuardianSetup, type Skill, type Lesson, saveGuardianSetup, assignLessonToPerson } from "@/lib/store";
import { Plus, Mic, MicOff, Loader2, Calendar, RefreshCw, Sparkles, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AudioRecorder } from "@/utils/audioRecorder";
import { supabase } from "@/integrations/supabase/client";
import { ParentPinFlow } from "./ParentPinFlow";

type AssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learnerName: string;
};

export function AssignmentDialog({ open, onOpenChange, learnerName }: AssignmentDialogProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [customSkillText, setCustomSkillText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recorder] = useState(() => new AudioRecorder());
  const [selectedLessons, setSelectedLessons] = useState<{[key: string]: string[]}>({});
  const [dueDate, setDueDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewLessons, setPreviewLessons] = useState<Lesson[]>([]);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [adjustmentPrompt, setAdjustmentPrompt] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ title: string; lessonCount: number }>({ title: "", lessonCount: 0 });
  const [showPinFlow, setShowPinFlow] = useState(false);
  
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

    // Show success modal instead of toast
    setSuccessMessage({ title: "Lessons", lessonCount: assignedCount });
    setShowSuccessModal(true);

    setSelectedLessons({});
    setDueDate("");
    onOpenChange(false);
  };

  const handleSwitchToLearner = () => {
    setShowSuccessModal(false);
    // Open PIN flow instead of navigating directly
    setShowPinFlow(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const generateLessons = async (adjusting = false) => {
    if (!customSkillText.trim()) {
      toast({
        title: "Enter a skill",
        description: "Please describe the skill you want to create.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-lessons', {
        body: { 
          skillDescription: customSkillText,
          adjustmentPrompt: adjusting ? adjustmentPrompt : undefined
        }
      });

      if (error) throw error;

      setPreviewLessons(data.lessons);
      setShowPreview(true);
      
      if (adjusting) {
        setShowAdjustDialog(false);
        setAdjustmentPrompt("");
      }

      toast({
        title: "Lessons generated!",
        description: "Review the lesson structure below.",
      });
    } catch (error) {
      console.error('Failed to generate lessons:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Could not generate lessons",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveSkill = () => {
    const currentData = getGuardianSetup();
    if (!currentData) {
      toast({
        title: "Error",
        description: "Could not find guardian setup data. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const newSkill: Skill = {
      title: customSkillText.trim(),
      lessons: previewLessons
    };

    const updatedData = {
      ...currentData,
      skills: {
        ...currentData.skills,
        [learnerName]: [
          newSkill, // Add new custom skills at the top
          ...(currentData.skills?.[learnerName] || [])
        ]
      }
    };

    saveGuardianSetup(updatedData);

    // Show a toast that skill was created, then switch to existing tab for lesson selection
    toast({
      title: "Skill created!",
      description: `"${customSkillText.trim()}" has been added. Now select the lessons you want to assign.`,
    });

    // Reset preview and switch to existing tab for lesson assignment
    setCustomSkillText("");
    setPreviewLessons([]);
    setShowPreview(false);
    setActiveTab("existing");
    // Don't close dialog - let parent select lessons to assign
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

              {/* Assign Lessons Tab */}
              <TabsContent value="existing" className="mt-4">
              {learnerSkills.length > 0 ? (
                <>
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
                                const isLocked = lessonIdx > 0;
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
                                    <div className="flex-1 flex items-center gap-2">
                                      {isLocked && (
                                        <Lock className="h-3 w-3 text-muted-foreground" />
                                      )}
                                      <span className="text-sm">{lesson.title}</span>
                                    </div>
                                    {isLocked && (
                                      <span className="text-xs text-muted-foreground">Unlocks after previous</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={handleAssignSelectedLessons}
                        className="w-full"
                        size="lg"
                        disabled={Object.values(selectedLessons).every(lessons => lessons.length === 0)}
                      >
                        Assign Selected Lessons ({Object.values(selectedLessons).reduce((sum, lessons) => sum + lessons.length, 0)})
                      </Button>
                      
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

              {/* New Skill Tab */}
              <TabsContent value="new" className="mt-4">
                {!showPreview ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="customSkill">Describe the skill you want to create</Label>
                      <p className="text-sm text-muted-foreground">
                        AI will generate a personalized lesson structure for this skill.
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
                        onClick={() => generateLessons(false)}
                        className="w-full"
                        size="lg"
                        disabled={!customSkillText.trim() || isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating Lessons...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Lesson Structure
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Generated Lesson Structure</h4>
                        <p className="text-sm text-muted-foreground">
                          Review the lessons for: {customSkillText}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdjustDialog(true)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Not what you're looking for?
                      </Button>
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {previewLessons.map((lesson, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded border"
                              >
                                <div className="flex-1 flex items-center gap-2">
                                  {idx > 0 && (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <div>
                                    <div className="font-medium text-sm">{lesson.title}</div>
                                    {idx > 0 && (
                                      <div className="text-xs text-muted-foreground">Locked - Unlocks after completing previous lessons</div>
                                    )}
                                    {idx === 0 && (
                                      <div className="text-xs text-green-600">Unlocked - Available immediately</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPreview(false);
                          setPreviewLessons([]);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleApproveSkill}
                        className="flex-1"
                      >
                        Approve & Create Skill
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjustment Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Lesson Structure</DialogTitle>
            <DialogDescription>
              Tell us what you'd like to change about the lessons
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
                onClick={() => setShowAdjustDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => generateLessons(true)}
                disabled={!adjustmentPrompt.trim() || isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Regenerate Lessons
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md text-center">
          <div className="py-6 space-y-6">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold">
                Skill assigned to {learnerName}! 🎉
              </h2>
              <p className="text-muted-foreground">
                {successMessage.lessonCount} lesson{successMessage.lessonCount > 1 ? 's' : ''} {successMessage.lessonCount > 1 ? 'have' : 'has'} been assigned and {successMessage.lessonCount > 1 ? 'are' : 'is'} ready to start.
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <h3 className="font-semibold text-sm">What's next?</h3>
              <p className="text-sm text-muted-foreground">
                Switch to {learnerName}'s account to see the assignment and begin their learning journey. {learnerName} will see the new skill in their dashboard.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* Primary CTA with rainbow gradient */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-xolv-magenta-300 via-xolv-blue-300 to-xolv-teal-300 rounded-md opacity-75 group-hover:opacity-100 transition-opacity" />
                <Button
                  onClick={handleSwitchToLearner}
                  size="lg"
                  className="relative w-full bg-background hover:bg-background text-foreground border-0 gap-2"
                >
                  Switch to {learnerName}'s Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Secondary option */}
              <Button
                variant="ghost"
                onClick={handleCloseSuccessModal}
                className="w-full text-muted-foreground"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIN Flow Modal */}
      <ParentPinFlow
        open={showPinFlow}
        onOpenChange={setShowPinFlow}
        learnerName={learnerName}
        mode="setup-before-switch"
      />
    </>
  );
}
