// Simple localStorage-backed store for names and setup data

export type Lesson = {
  title: string;
  locked: boolean;
};

export type Skill = {
  title: string;
  lessons: Lesson[];
};

export type PersonSkills = {
  [personName: string]: Skill[];
};

export type Assignment = {
  id: string;
  learnerName: string;
  skillTitle: string;
  lessonTitle: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedDate: string;
  dueDate?: string;
};

export type GuardianSetupData = {
  guardianName: string;
  learners: { name: string }[];
  accountMode?: 'inhouse' | 'separate';
  skills?: PersonSkills;
  assignments?: Assignment[];
};

const KEYS = {
  onboardingName: 'app_onboarding_first_name',
  guardianSetup: 'app_guardian_setup',
} as const;

// Skill templates
export const SKILL_TEMPLATES = {
  "I want to improve my interviewing skills": {
    title: "Improving Interviewing Skills",
    lessons: [
      { title: "0: Self-Assessment & Goals", locked: false },
      { title: "1: Research & Preparation Basics", locked: false },
      { title: "2: Common Interview Questions", locked: false },
      { title: "3: Behavioral Interview Techniques", locked: true },
      { title: "4: Mock Interview Practice", locked: true },
      { title: "5: Post-Interview Follow-up", locked: true },
    ]
  },
  "I want to practice greeting people in public settings": {
    title: "Practicing Greeting People", 
    lessons: [
      { title: "0: Confidence Building Basics", locked: false },
      { title: "1: Non-verbal Communication", locked: false },
      { title: "2: Simple Greeting Techniques", locked: false },
      { title: "3: Starting Conversations", locked: true },
      { title: "4: Handling Different Social Situations", locked: true },
      { title: "5: Building Lasting Connections", locked: true },
    ]
  },
  "I want to improve my public speaking skills": {
    title: "Improving Public Speaking",
    lessons: [
      { title: "0: Overcoming Speaking Anxiety", locked: false },
      { title: "1: Voice and Delivery Basics", locked: false },
      { title: "2: Structuring Your Message", locked: false },
      { title: "3: Engaging Your Audience", locked: true },
      { title: "4: Using Visual Aids Effectively", locked: true },
      { title: "5: Advanced Presentation Techniques", locked: true },
    ]
  },
  "I want to start a new skill": {
    title: "Custom Skill",
    lessons: [
      { title: "0: Goal Setting & Planning", locked: false },
      { title: "1: Foundation Building", locked: false },
      { title: "2: Practice & Application", locked: false },
      { title: "3: Intermediate Techniques", locked: true },
      { title: "4: Advanced Applications", locked: true },
      { title: "5: Mastery & Teaching Others", locked: true },
    ]
  }
};

export function saveOnboardingName(name: string) {
  try { localStorage.setItem(KEYS.onboardingName, name); } catch {}
}

export function getOnboardingName(): string | undefined {
  try { return localStorage.getItem(KEYS.onboardingName) || undefined; } catch { return undefined; }
}

export function saveGuardianSetup(data: GuardianSetupData) {
  try { localStorage.setItem(KEYS.guardianSetup, JSON.stringify(data)); } catch {}
}

export function getGuardianSetup(): GuardianSetupData | undefined {
  try {
    const raw = localStorage.getItem(KEYS.guardianSetup);
    if (!raw) return undefined;
    return JSON.parse(raw) as GuardianSetupData;
  } catch { return undefined; }
}

export function addSkillToPerson(personName: string, skillTemplate: string) {
  const currentData = getGuardianSetup();
  if (!currentData) return;

  const skillData = SKILL_TEMPLATES[skillTemplate as keyof typeof SKILL_TEMPLATES];
  if (!skillData) return;

  const newSkill: Skill = {
    title: skillData.title,
    lessons: skillData.lessons.map(lesson => ({ ...lesson }))
  };

  const updatedData = {
    ...currentData,
    skills: {
      ...currentData.skills,
      [personName]: [
        newSkill, // Add new skills at the top
        ...(currentData.skills?.[personName] || [])
      ]
    }
  };

  saveGuardianSetup(updatedData);
}

export function assignLessonToPerson(
  learnerName: string,
  skillTitle: string,
  lessonTitle: string,
  dueDate?: string
) {
  const currentData = getGuardianSetup();
  if (!currentData) return;

  const newAssignment: Assignment = {
    id: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    learnerName,
    skillTitle,
    lessonTitle,
    status: 'pending',
    assignedDate: new Date().toISOString(),
    dueDate,
  };

  const updatedData = {
    ...currentData,
    assignments: [
      ...(currentData.assignments || []),
      newAssignment
    ]
  };

  saveGuardianSetup(updatedData);
}

export function getAssignmentsForLearner(learnerName: string): Assignment[] {
  const data = getGuardianSetup();
  if (!data?.assignments) return [];
  return data.assignments.filter(a => a.learnerName === learnerName);
}

export function updateAssignmentStatus(assignmentId: string, status: Assignment['status']) {
  const currentData = getGuardianSetup();
  if (!currentData?.assignments) return;

  const updatedData = {
    ...currentData,
    assignments: currentData.assignments.map(a =>
      a.id === assignmentId ? { ...a, status } : a
    )
  };

  saveGuardianSetup(updatedData);
}
