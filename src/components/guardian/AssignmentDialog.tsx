import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SKILL_TEMPLATES, addSkillToPerson, getGuardianSetup, type Skill } from "@/lib/store";
import { BookOpen, Plus, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type AssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learners: { name: string }[];
};

export function AssignmentDialog({ open, onOpenChange, learners }: AssignmentDialogProps) {
  const [selectedLearner, setSelectedLearner] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"new" | "revisit">("new");
  
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

    addSkillToPerson(selectedLearner, skillTemplateKey);
    
    toast({
      title: "Skill assigned!",
      description: `${SKILL_TEMPLATES[skillTemplateKey as keyof typeof SKILL_TEMPLATES].title} has been assigned to ${selectedLearner}.`,
    });
    
    onOpenChange(false);
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
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
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
