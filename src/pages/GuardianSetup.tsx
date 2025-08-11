import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import LearnerRow from '@/components/onboarding/LearnerRow';

interface Learner {
  fullName: string;
  email: string;
}

interface GuardianForm {
  fullName: string;
  learnersCount: number;
  learners: Learner[];
}

const GuardianSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstNameFromPrev = (location.state as any)?.firstName ?? '';

  const { register, handleSubmit, control, watch, setValue } = useForm<GuardianForm>({
    defaultValues: {
      fullName: firstNameFromPrev,
      learnersCount: 1,
      learners: [{ fullName: '', email: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'learners' });
  const learnersCount = watch('learnersCount');

  useEffect(() => {
    if (typeof learnersCount !== 'number') return;
    const current = fields.length;
    const desired = Math.max(1, Math.min(10, learnersCount || 1));
    // Grow
    if (desired > current) {
      for (let i = current; i < desired; i++) append({ fullName: '', email: '' });
    }
    // Shrink
    if (desired < current) {
      for (let i = current - 1; i >= desired; i--) remove(i);
    }
  }, [learnersCount, fields.length, append, remove]);

  useEffect(() => {
    document.title = 'Guardian Setup - Learners';
    const desc = 'Add learner details and connect Google accounts to continue.';
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

  const onSubmit = (data: GuardianForm) => {
    console.log('Guardian setup form:', data);
    navigate('/');
  };

  return (
    <main className="relative min-h-screen w-full overflow-auto font-literata bg-background text-foreground">
      {/* Progress at top (2/3) */}
      <ProgressBar progress={66} />
      <h1 className="sr-only">Guardian setup - learners</h1>

      <section className="container max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your learners</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Your name</Label>
                  <Input id="fullName" placeholder="Full name" {...register('fullName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learnersCount">How many learners will you support?</Label>
                  <Input
                    id="learnersCount"
                    type="number"
                    min={1}
                    max={10}
                    {...register('learnersCount', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <LearnerRow key={field.id} index={index} register={register} setValue={setValue} />
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>Cancel</Button>
                <Button type="submit" className="ml-auto">Save</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Your data is protected. You can disconnect Google anytime.
          </CardFooter>
        </Card>
      </section>
    </main>
  );
};

export default GuardianSetup;
