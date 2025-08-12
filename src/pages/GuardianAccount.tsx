import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AnalyticsSidebar } from "@/components/guardian/AnalyticsSidebar";
import LearnerRow from "@/components/onboarding/LearnerRow";
import { toast } from "sonner";
import { getGuardianSetup } from "@/lib/store";

interface Learner { fullName: string; email: string }
interface GuardianForm {
  fullName: string;
  learnersCount: number;
  accountMode: "inhouse" | "separate";
  learners: Learner[];
}

export default function GuardianAccount() {
  const setup = getGuardianSetup();
  const { register, handleSubmit, control, watch, setValue } = useForm<GuardianForm>({
    defaultValues: {
      fullName: setup?.guardianName || "Tree Guardian",
      learnersCount: setup?.learners?.length || 2,
      accountMode: setup?.accountMode || "separate",
      learners: (setup?.learners || [ { name: "Jake" }, { name: "Mia" }]).map(l => ({ fullName: l.name, email: "" })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "learners" });
  const learnersCount = watch("learnersCount");
  const accountMode = watch("accountMode");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof learnersCount !== "number") return;
    const current = fields.length;
    const desired = Math.max(1, Math.min(10, learnersCount || 1));
    if (desired > current) {
      for (let i = current; i < desired; i++) append({ fullName: "", email: "" });
    }
    if (desired < current) {
      for (let i = current - 1; i >= desired; i--) remove(i);
    }
  }, [learnersCount, fields.length, append, remove]);

  useEffect(() => {
    document.title = "Guardian - Account Settings";
    const desc = "Edit learners, account mode, and access preferences.";
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
    console.log("Guardian account save:", data);
    // persist changes
    const learnersOut = (data.learners || []).map((l) => ({ name: l.fullName || 'Learner' }));
    const { saveGuardianSetup } = require("@/lib/store");
    saveGuardianSetup({ guardianName: data.fullName || 'Guardian', learners: learnersOut, accountMode: data.accountMode });
    toast.success("Account settings saved");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AnalyticsSidebar guardianName="Tree Guardian" learners={[{ name: "Jake" }, { name: "Mia" }]} />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Account settings</h1>
          </header>
          <main className="p-6">
            <section className="container max-w-5xl">
              <Card>
                <CardHeader>
              <CardTitle>Manage learners & access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6" ref={formRef}>
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setConfirmOpen(true); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Your name</Label>
                        <Input id="fullName" placeholder="Full name" {...register('fullName')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="learnersCount">Number of learners</Label>
                        <Input id="learnersCount" type="number" min={1} max={10} {...register('learnersCount', { valueAsNumber: true })} />
                        <p className="text-xs text-muted-foreground">Between 1 and 10 learners.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Account mode</Label>
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
                          <Label htmlFor="mode-separate">Separate learner accounts</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <LearnerRow key={field.id} index={index} register={register} setValue={setValue} showAccountFields={accountMode === 'separate'} />
                      ))}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button" onClick={() => history.back()}>Cancel</Button>
                      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <AlertDialogTrigger asChild>
                          <Button type="submit">Save changes</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Override existing settings?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Saving will overwrite your current learner and account settings. Do you want to continue?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { handleSubmit(onSubmit)(); setConfirmOpen(false); }}>Confirm & Save</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </form>

                  <div className="h-px bg-border" />
                  <div className="text-sm text-muted-foreground">
                    Does your learner already have an account? <span className="underline">Link accounts</span>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
