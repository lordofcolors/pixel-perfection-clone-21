import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
          <Label className="sr-only" htmlFor={`learner-name-${index}`}>Name</Label>
          <Input id={`learner-name-${index}`} placeholder="Name" {...register(`learners.${index}.fullName`)} />
        </div>
        {showAccountFields && (
          <>
            <div className="md:col-span-4 space-y-1">
              <Label className="sr-only" htmlFor={`learner-email-${index}`}>Contact</Label>
              <Input id={`learner-email-${index}`} placeholder="name@example.com or +15551234567" type="text" {...register(`learners.${index}.email`)} />
            </div>
            <div className="md:col-span-5">
              <div className="flex gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className="min-w-[160px]">
                    <Label className="sr-only" htmlFor={`invite-status-${index}`}>Invite status</Label>
                    <Select value={inviteStatus} onValueChange={setInviteStatus}>
                      <SelectTrigger id={`invite-status-${index}`} className="h-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Badge variant="secondary">{inviteStatus}</Badge>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LearnerRow;
