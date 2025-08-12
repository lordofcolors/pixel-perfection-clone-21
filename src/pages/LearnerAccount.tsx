import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getOnboardingName } from "@/lib/store";

export default function LearnerAccount() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const learnerName = getOnboardingName() || "Learner";

  useEffect(() => {
    document.title = "Learner - Account";
    const desc = "Link your account to a parent or guardian.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar learnerName={learnerName} />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Account</h1>
          </header>
          <main className="p-6">
            <section className="container max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle>Link parent or guardian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-contact">Parent email or phone</Label>
                    <Input id="parent-contact" type="text" placeholder="name@example.com or +15551234567" />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setInviteOpen(true)}>Send invite</Button>
                  </div>
                </CardContent>
              </Card>
            </section>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite sent</DialogTitle>
                  <DialogDescription>
                    We sent an invite to the contact provided. They can link to your account from the message.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setInviteOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
