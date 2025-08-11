import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import GoogleLogo from '@/assets/google-g-logo.png';

interface LearnerRowProps {
  index: number;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
}

const LearnerRow: React.FC<LearnerRowProps> = ({ index, register, setValue }) => {
  const [open, setOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');

  const handleGoogleNext = () => {
    if (googleEmail) {
      setValue(`learners.${index}.email`, googleEmail);
    }
    setOpen(false);
  };

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-5 space-y-2">
          <Label htmlFor={`learner-name-${index}`}>Learner full name</Label>
          <Input id={`learner-name-${index}`} placeholder="Full name" {...register(`learners.${index}.fullName`)} />
        </div>
        <div className="md:col-span-5 space-y-2">
          <Label htmlFor={`learner-email-${index}`}>Email (optional)</Label>
          <Input id={`learner-email-${index}`} placeholder="name@example.com" type="email" {...register(`learners.${index}.email`)} />
        </div>
        <div className="md:col-span-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="google" className="w-full" aria-label="Sign in with Google">
                <img src={GoogleLogo} alt="Google G logo" className="h-5 w-5" />
                <span>Sign in with Google</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Sign in with Google</DialogTitle>
                <DialogDescription>Use your Google account to continue for this learner.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`google-email-${index}`}>Email or phone</Label>
                  <Input
                    id={`google-email-${index}`}
                    placeholder="you@example.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" type="button">Forgot email?</Button>
                  <Button type="button" onClick={handleGoogleNext}>Next</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is a mock Google sign-in UI for design purposes only.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default LearnerRow;
