// Simple localStorage-backed store for names and setup data
export type GuardianSetupData = {
  guardianName: string;
  learners: { name: string }[];
  accountMode?: 'inhouse' | 'separate';
};

const KEYS = {
  onboardingName: 'app_onboarding_first_name',
  guardianSetup: 'app_guardian_setup',
} as const;

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
