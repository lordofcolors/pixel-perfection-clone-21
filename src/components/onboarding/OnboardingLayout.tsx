import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProgressBar } from './ProgressBar';
import { NameInput } from './NameInput';
import { RoleCard } from './RoleCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingName } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface OnboardingFormData {
  firstName: string;
  role: 'learner' | 'guardian' | null;
}

export const OnboardingLayout: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'learner' | 'guardian' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<OnboardingFormData>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      role: null
    }
  });

  const navigate = useNavigate();

  const firstName = watch('firstName');
  const canSubmit = firstName && firstName.length >= 2 && selectedRole && isValid;

  useEffect(() => {
    document.title = 'Onboarding - Choose Role';
    const desc = 'Onboarding: enter your first name and pick the role that fits you best.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, []);

  const handleDoneClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmRole = () => {
    setShowConfirmModal(false);
    saveOnboardingName(firstName);
    if (selectedRole === 'guardian') {
      navigate('/guardian-setup', { state: { firstName } });
    } else if (selectedRole === 'learner') {
      navigate('/learner', { state: { firstName } });
    }
  };

  const roleCards = [
    {
      role: 'learner' as const,
      title: 'Learner',
      description: 'For students and job seekers building career skills',
      bulletPoints: [
        'You manage your own monthly subscription',
        'Learn independently at your own pace',
        'Full control over your learning journey'
      ],
      imageUrl: 'https://api.builder.io/api/v1/image/assets/TEMP/9107901cbfe710c4b3a731604ada2cac0d28a37a?width=240',
      imageAlt: 'learner',
      backgroundColor: '#3FBDD1',
      titleColorClass: 'text-xolv-teal-300',
      imageClassName: 'w-[120px] h-[87px] left-[63px] top-[35px]'
    },
    {
      role: 'guardian' as const,
      title: 'Parent/Guardian',
      description: 'For parents and caregivers supporting a learner',
      bulletPoints: [
        'You manage subscription on learner\'s behalf',
        'Track activity and learning progress',
        'Assign skills and lessons with due dates'
      ],
      imageUrl: 'https://api.builder.io/api/v1/image/assets/TEMP/8d59003dfe2826aab8d09c5daa647bf58f9895e6?width=270',
      imageAlt: 'guardian',
      backgroundColor: '#CA7FCD',
      titleColorClass: 'text-xolv-magenta-300',
      imageClassName: 'w-[135px] h-[125px] left-[22px] -top-1.5'
    }
  ];

  const roleInfo = {
    learner: {
      title: 'Learner (Solo Account)',
      description: 'As a solo learner, you manage your own account and payments. This is ideal for individuals who prefer to handle their learning journey independently without a parent or guardian overseeing their activity.',
      confirmTitle: 'Continue as a Learner?',
      confirmDescription: 'You\'re about to set up a solo learner account. This means you\'ll manage your own payments and learning progress independently. If you\'d prefer to have a parent or guardian oversee your account and handle payments, please select the Parent/Guardian option instead.'
    },
    guardian: {
      title: 'Parent/Guardian Account',
      description: 'As a parent or guardian, you can add and oversee learners, track their activity and progress, and manage payments on their behalf. This is the recommended option for families.',
      confirmTitle: 'Continue as a Parent/Guardian?',
      confirmDescription: 'You\'re about to set up a parent/guardian account. You\'ll be able to add learners, monitor their progress, and manage payments for the account. This is the recommended setup for families.'
    }
  };

  return (
    <main className="w-screen min-h-screen font-literata bg-background overflow-auto">
      <ProgressBar progress={25} />
      
      <div className="flex flex-col items-center px-4 pt-24 pb-16 max-md:pt-20 max-sm:pt-16">
        {/* Welcome illustration */}
        <div className="w-[213px] h-[212px] max-md:w-[180px] max-md:h-[180px] max-sm:w-[150px] max-sm:h-[150px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/93a27a18bc8d04a44cda6817cf59746f14d5582d?width=426"
            alt="Welcome illustration"
            loading="eager"
            className="w-full h-full"
          />
        </div>

        <form onSubmit={handleDoneClick} noValidate className="flex flex-col items-center w-full">
          <h1 className="text-[#EED4F0] text-center text-2xl font-normal leading-[30px] mt-8 max-md:text-xl max-sm:text-lg">
            Hello there, what's your name?
          </h1>

          <NameInput
            register={register}
            errors={errors}
            className="mt-4"
          />

          <h2 className="text-[#EED4F0] text-center text-2xl font-normal leading-[30px] mt-12 max-md:text-xl max-sm:text-lg">
            Pick the role that fits you best:
          </h2>

          <fieldset className="flex gap-4 mt-8 max-md:flex-col max-md:items-center max-md:gap-5">
            <legend className="sr-only">Choose your role</legend>
            {roleCards.map((card) => (
            <RoleCard
              key={card.role}
              role={card.role}
              title={card.title}
              description={card.description}
              bulletPoints={card.bulletPoints}
              imageUrl={card.imageUrl}
              imageAlt={card.imageAlt}
              isSelected={selectedRole === card.role}
              onSelect={() => setSelectedRole(card.role)}
              backgroundColor={card.backgroundColor}
              titleColorClass={card.titleColorClass}
              imageClassName={card.imageClassName}
            />
            ))}
          </fieldset>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="h-11 w-[100px] px-8 py-2 rounded-lg mt-10 transition-all duration-200 font-literata max-sm:w-[120px]"
            aria-label="Proceed to next step"
          >
            Next
          </Button>
        </form>
      </div>


      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-literata font-normal">
                {selectedRole && roleInfo[selectedRole].confirmTitle}
              </DialogTitle>
              <DialogDescription className="font-literata text-muted-foreground pt-2">
                {selectedRole && roleInfo[selectedRole].confirmDescription}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-3 mt-4">
              <Button 
                className="w-full bg-gradient-to-r dark:from-xolv-magenta-300 dark:via-xolv-blue-300 dark:to-xolv-teal-300 from-xolv-magenta-700 via-xolv-blue-600 to-xolv-teal-500 text-black font-medium font-literata"
                onClick={handleConfirmRole}
              >
                Yes, continue as {selectedRole === 'guardian' ? 'Parent/Guardian' : 'Learner'}
              </Button>
              <Button 
                variant="outline"
                className="w-full font-literata"
                onClick={() => setShowConfirmModal(false)}
              >
                Go back and choose again
              </Button>
            </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};
