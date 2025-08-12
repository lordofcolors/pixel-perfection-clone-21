import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import LearnerRow from '@/components/onboarding/LearnerRow';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { saveGuardianSetup } from '@/lib/store';

interface Learner {
  fullName: string;
  email: string;
}

interface GuardianForm {
  fullName: string;
  learnersCount: number;
  accountMode: 'inhouse' | 'separate';
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
      accountMode: 'separate',
      learners: [{ fullName: '', email: '' }],
    },
});


  const { fields, append, remove } = useFieldArray({ control, name: 'learners' });
  const learnersCount = watch('learnersCount');
  const accountMode = watch('accountMode');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(true);

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

  useEffect(() => {
    const update = () => {
      const el = formRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const h = el.getBoundingClientRect().height;
      setCenter(h + 64 < vh);
    };
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (ro && formRef.current) ro.observe(formRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [fields.length]);

  const onSubmit = (data: GuardianForm) => {
    console.log('Guardian setup form:', data);
    saveGuardianSetup({
      guardianName: data.fullName || 'Guardian',
      learners: (data.learners || []).map((l) => ({ name: l.fullName || 'Learner' })),
      accountMode: data.accountMode,
    });
    if (data.accountMode === 'inhouse') {
      navigate('/guardian/manage');
    } else {
      navigate('/guardian/separate');
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-auto font-literata bg-background text-foreground">
      {/* Progress at top (2/3) */}
      <ProgressBar progress={66} />
      <h1 className="sr-only">Guardian setup - learners</h1>

      <div ref={wrapperRef} className={`min-h-svh w-full flex ${center ? 'items-center' : 'items-start'}`}>
        <section className="container max-w-3xl py-10 w-full">
          <div ref={formRef}>
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
              <div className="space-y-2">
                <Label>How will learners sign in?</Label>
                <RadioGroup
                  value={accountMode}
                  onValueChange={(v) => setValue('accountMode', v as 'inhouse' | 'separate')}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <div className="flex items-center gap-2 rounded-md border border-border bg-card p-3">
                    <RadioGroupItem value="inhouse" id="mode-inhouse" />
                    <Label htmlFor="mode-inhouse">Manage in my account</Label>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-card p-3">
                    <RadioGroupItem value="separate" id="mode-separate" />
                    <Label htmlFor="mode-separate">Create separate learner accounts</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <LearnerRow key={field.id} index={index} register={register} setValue={setValue} showAccountFields={accountMode === 'separate'} />
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>Cancel</Button>
                <Button type="submit" className="ml-auto">Save</Button>
              </div>
            </form>
            <div className="pt-4">
              <div className="h-px bg-border my-2" />
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <span>Does your learner already have an account?</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" type="button" className="px-1">Link accounts</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Link existing learner account</DialogTitle>
                      <DialogDescription>Enter the email associated with your learner’s account to link it.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <Label htmlFor="link-email">Learner email</Label>
                      <Input id="link-email" type="email" placeholder="name@example.com" />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="button">Link accounts</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            </CardContent>
            </Card>
            </div>
          </section>
        </div>
    </main>
  );
};

export default GuardianSetup;
