import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProgressBar } from './ProgressBar';
import { NameInput } from './NameInput';
import { RoleCard } from './RoleCard';

interface OnboardingFormData {
  firstName: string;
  role: 'learner' | 'guardian' | null;
}

export const OnboardingLayout: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'learner' | 'guardian' | null>(null);
  
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

  const firstName = watch('firstName');
  const canSubmit = firstName && firstName.length >= 2 && selectedRole && isValid;

  const onSubmit = (data: OnboardingFormData) => {
    const formData = { ...data, role: selectedRole };
    console.log('Onboarding data:', formData);
    // Handle form submission here
  };

  const roleCards = [
    {
      role: 'learner' as const,
      title: 'Learner',
      description: 'For students and job seekers building career skills',
      imageUrl: 'https://api.builder.io/api/v1/image/assets/TEMP/9107901cbfe710c4b3a731604ada2cac0d28a37a?width=240',
      imageAlt: 'learner',
      backgroundColor: '#3FBDD1',
      imageClassName: 'w-[120px] h-[87px] left-[63px] top-[35px]'
    },
    {
      role: 'guardian' as const,
      title: 'Guardian',
      description: 'For parents and caregivers supporting a learner',
      imageUrl: 'https://api.builder.io/api/v1/image/assets/TEMP/8d59003dfe2826aab8d09c5daa647bf58f9895e6?width=270',
      imageAlt: 'guardian',
      backgroundColor: '#CA7FCD',
      imageClassName: 'w-[135px] h-[125px] left-[22px] -top-1.5'
    }
  ];

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-[#040816] max-md:p-5 max-sm:p-4">
      <ProgressBar progress={25} />
      
      <div className="absolute -translate-x-2/4 w-[213px] h-[212px] left-2/4 top-[102px] max-md:w-[180px] max-md:h-[180px] max-md:top-20 max-sm:w-[150px] max-sm:h-[150px] max-sm:top-[60px]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/93a27a18bc8d04a44cda6817cf59746f14d5582d?width=426"
          alt="Welcome illustration"
          className="w-[213px] h-[212px] shrink-0 max-md:w-[180px] max-md:h-[180px] max-sm:w-[150px] max-sm:h-[150px]"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1 className="w-[421px] h-[99px] shrink-0 text-[#EED4F0] text-center text-2xl font-normal leading-[30px] absolute -translate-x-2/4 left-2/4 top-[340px] max-md:text-xl max-md:w-[350px] max-md:top-[280px] max-sm:text-lg max-sm:w-[300px] max-sm:left-2/4 max-sm:top-[230px]">
          Hello there, what's your name?
        </h1>

        <NameInput
          register={register}
          errors={errors}
          className="absolute -translate-x-2/4 left-2/4 top-[399px] max-md:top-[330px] max-sm:top-[280px]"
        />

        <h2 className="w-[421px] h-[99px] shrink-0 text-[#EED4F0] text-center text-2xl font-normal leading-[30px] absolute -translate-x-2/4 left-2/4 top-[512px] max-md:text-xl max-md:w-[350px] max-md:top-[420px] max-sm:text-lg max-sm:w-[300px] max-sm:top-[350px]">
          Pick the role that fits you best:
        </h2>

        <fieldset className="flex gap-4 absolute -translate-x-2/4 left-2/4 top-[585px] max-md:flex-col max-md:items-center max-md:gap-5 max-md:top-[480px] max-sm:top-[400px]">
          <legend className="sr-only">Choose your role</legend>
          {roleCards.map((card) => (
            <RoleCard
              key={card.role}
              role={card.role}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              imageAlt={card.imageAlt}
              isSelected={selectedRole === card.role}
              onSelect={() => setSelectedRole(card.role)}
              backgroundColor={card.backgroundColor}
              imageClassName={card.imageClassName}
            />
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`inline-flex h-11 justify-center items-center gap-2 shrink-0 absolute -translate-x-2/4 w-[100px] px-8 py-2 rounded-lg left-2/4 top-[879px] max-md:top-[780px] max-sm:w-[120px] max-sm:top-[680px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#EED4F0] focus:ring-offset-2 focus:ring-offset-slate-900 ${
            canSubmit
              ? 'cursor-pointer bg-[#EED4F0] hover:bg-[#E5C7E7] active:bg-[#DDB8E0]'
              : 'cursor-not-allowed bg-slate-600 opacity-50'
          }`}
          aria-label="Complete onboarding process"
        >
          <span className={`text-sm font-medium leading-5 relative ${
            canSubmit ? 'text-slate-700' : 'text-slate-400'
          }`}>
            Done
          </span>
        </button>
      </form>
    </main>
  );
};
