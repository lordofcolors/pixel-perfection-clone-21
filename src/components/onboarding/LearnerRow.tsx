import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
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
} from '@/components/ui/dialog';
import type { UseFormRegister, UseFormSetValue } from 'react-hook-form';


interface LearnerRowProps {
  index: number;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  showAccountFields?: boolean;
}

const LearnerRow: React.FC<LearnerRowProps> = ({ index, register, setValue, showAccountFields = true }) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState('');


  const statuses = ['Invite sent', 'Invitation opened', 'Invite accepted', 'Added user', 'Confirmed'];
  const [inviteStatus, setInviteStatus] = useState<string>(statuses[index % statuses.length]);

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className={showAccountFields ? "md:col-span-3 space-y-1" : "md:col-span-12 space-y-1"}>
          <Label htmlFor={`learner-name-${index}`}>Learner name</Label>
          <Input id={`learner-name-${index}`} placeholder="e.g., Sam Lee" {...register(`learners.${index}.fullName`)} />
        </div>
        {showAccountFields && (
          <>
            <div className="md:col-span-5 space-y-1">
              <Label htmlFor={`learner-email-${index}`}>Contact (email or phone)</Label>
              <Input id={`learner-email-${index}`} placeholder="name@example.com or +15551234567" type="text" {...register(`learners.${index}.email`)} />
            </div>
            <div className="md:col-span-3 pt-6">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`learner-email-${index}`) as HTMLInputElement | null;
                    const val = el?.value?.trim() || '';
                    setInviteTarget(val);
                    setInviteOpen(true);
                  }}
                  aria-label="Send invite to learner"
                >
                  Invite
                </Button>
                <span className="text-sm text-muted-foreground whitespace-nowrap">{inviteStatus}</span>
              </div>
            </div>
            <div className="md:col-span-1 pt-6 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Cycle invite status"
                title="Cycle status"
                onClick={() => {
                  const i = statuses.indexOf(inviteStatus);
                  const next = statuses[(i + 1) % statuses.length];
                  setInviteStatus(next);
                }}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite status</DialogTitle>
                  <DialogDescription>
                    Current status: {inviteStatus}. We sent an invite to {inviteTarget || 'the provided contact'}. Ask them to check their inbox or messages to proceed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" onClick={() => setInviteOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default LearnerRow;
