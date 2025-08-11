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
  showAccountFields?: boolean;
}

const LearnerRow: React.FC<LearnerRowProps> = ({ index, register, setValue, showAccountFields = true }) => {
  const [open, setOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');

  const handleGoogleNext = () => {
    if (googleEmail) {
      setValue(`learners.${index}.email`, googleEmail);
    }
    setOpen(false);
  };

  const mockAccounts = [
    { name: 'Primary Account', email: 'primary@example.com', status: '' },
    { name: 'Learner A', email: 'learner.a@example.com', status: '' },
    { name: 'Learner B', email: 'learner.b@example.com', status: 'Session expired' },
  ];

  const selectAccount = (email: string) => {
    setGoogleEmail(email);
    setValue(`learners.${index}.email`, email);
    setOpen(false);
  };

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className={showAccountFields ? "md:col-span-4 space-y-2" : "md:col-span-12 space-y-2"}>
          <Label htmlFor={`learner-name-${index}`}>Learner full name</Label>
          <Input id={`learner-name-${index}`} placeholder="Full name" {...register(`learners.${index}.fullName`)} />
        </div>
        {showAccountFields && (
          <>
            <div className="md:col-span-5 space-y-2">
              <Label htmlFor={`learner-email-${index}`}>Email (optional)</Label>
              <Input id={`learner-email-${index}`} placeholder="name@example.com" type="email" {...register(`learners.${index}.email`)} />
            </div>
            <div className="md:col-span-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="google" size="lg" className="w-full" aria-label="Sign in with Google">
                    <img src={GoogleLogo} alt="Google G logo" className="h-5 w-5" />
                    <span>Sign in</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
                  <DialogHeader className="px-6 pt-5 pb-3 text-left">
                    <DialogTitle className="text-base">Choose an account</DialogTitle>
                    <DialogDescription>to continue</DialogDescription>
                  </DialogHeader>
                  <div className="px-2 pb-2">
                    <div className="space-y-1">
                      <button type="button" onClick={() => selectAccount(mockAccounts[0].email)} className="w-full rounded-md px-4 py-3 text-left hover:bg-accent">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{mockAccounts[0].name}</p>
                            <p className="text-xs text-muted-foreground">{mockAccounts[0].email}</p>
                          </div>
                        </div>
                      </button>
                      <button type="button" onClick={() => selectAccount(mockAccounts[1].email)} className="w-full rounded-md px-4 py-3 text-left hover:bg-accent">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{mockAccounts[1].name}</p>
                            <p className="text-xs text-muted-foreground">{mockAccounts[1].email}</p>
                          </div>
                        </div>
                      </button>
                      <button type="button" onClick={() => selectAccount(mockAccounts[2].email)} className="w-full rounded-md px-4 py-3 text-left hover:bg-accent">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{mockAccounts[2].name}</p>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{mockAccounts[2].status}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{mockAccounts[2].email}</p>
                          </div>
                        </div>
                      </button>
                    </div>
                    <div className="border-t border-border mt-2 pt-2 space-y-1">
                      <button type="button" className="w-full rounded-md px-4 py-3 text-left hover:bg-accent">Add another account</button>
                      <button type="button" className="w-full rounded-md px-4 py-3 text-left hover:bg-accent">Sign out of all accounts</button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-4">
                      <span>Privacy Policy</span>
                      <span>•</span>
                      <span>Terms of Service</span>
                    </div>
                  </div>
                  <DialogFooter className="hidden" />
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LearnerRow;
