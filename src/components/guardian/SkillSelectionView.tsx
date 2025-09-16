import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addSkillToPerson } from "@/lib/store";
import acircleLogo from "@/assets/acircle-logo.png";

interface SkillSelectionViewProps {
  guardianName: string;
  learners: { name: string }[];
  onBack: () => void;
  onSkillCreated: () => void;
}

const skillOptions = [
  "I want to improve my interviewing skills",
  "I want to practice greeting people in public settings", 
  "I want to improve my public speaking skills",
  "I want to start a new skill"
];

export function SkillSelectionView({ guardianName, learners, onBack, onSkillCreated }: SkillSelectionViewProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>("");

  const handleSkillSelect = (skill: string) => {
    if (!selectedPerson) {
      return;
    }
    
    addSkillToPerson(selectedPerson, skill);
    onSkillCreated();
    onBack();
  };

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center space-y-8 p-8">
      {/* Avatar */}
      <div className="relative">
        <img 
          src={acircleLogo} 
          alt="Acircle Logo" 
          className="h-24 w-24 rounded-full"
        />
      </div>

      {/* Main heading */}
      <h1 className="text-3xl font-semibold text-center text-foreground">
        What skill would you like to learn today?
      </h1>

      {/* Person selector */}
      <div className="w-full max-w-md space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Assign this skill to:
        </label>
        <Select value={selectedPerson} onValueChange={setSelectedPerson}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a person" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={guardianName}>Me ({guardianName})</SelectItem>
            {learners.map((learner) => (
              <SelectItem key={learner.name} value={learner.name}>
                {learner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skill options */}
      <div className="w-full max-w-md space-y-3">
        {skillOptions.map((skill, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full h-auto p-4 text-left justify-start bg-card hover:bg-muted border-border"
            onClick={() => handleSkillSelect(skill)}
            disabled={!selectedPerson}
          >
            <span className="text-wrap">{skill}</span>
          </Button>
        ))}
      </div>

      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mt-8"
      >
        ← Back to Dashboard
      </Button>
    </div>
  );
}