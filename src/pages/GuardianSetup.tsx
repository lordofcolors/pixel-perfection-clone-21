import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GuardianForm {
  fullName: string;
  learnersCount: number;
  childrenNames: string;
}

const GuardianSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstNameFromPrev = (location.state as any)?.firstName ?? '';

  const { register, handleSubmit } = useForm<GuardianForm>({
    defaultValues: {
      fullName: firstNameFromPrev,
      learnersCount: 1,
      childrenNames: ''
    }
  });

  useEffect(() => {
    document.title = 'Guardian Setup - Connect Google';
    const desc = 'Add learner details and connect your Google account to continue.';
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
  };

  return (
    <main className="min-h-screen w-full font-literata bg-background text-foreground">
      <header className="w-full border-b border-border py-4">
        <h1 className="text-center text-2xl">Guardian onboarding</h1>
      </header>

      <section className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your learners</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Your name</Label>
                <Input id="fullName" placeholder="Full name" {...register('fullName')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learnersCount">How many learners will you support?</Label>
                <Input id="learnersCount" type="number" min={1} {...register('learnersCount', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="childrenNames">Learner names (comma separated)</Label>
                <Textarea id="childrenNames" placeholder="Alex, Jordan, Casey" {...register('childrenNames')} />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" variant="secondary" className="gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-background text-foreground">G</span>
                      Connect Google
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Sign in with Google</DialogTitle>
                      <DialogDescription>Use your Google account to continue.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="googleEmail">Email or phone</Label>
                        <Input id="googleEmail" placeholder="you@example.com" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" type="button">Forgot email?</Button>
                        <Button type="button">Next</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This is a mock Google sign-in UI for design purposes only.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => navigate('/')}>Cancel</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

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
