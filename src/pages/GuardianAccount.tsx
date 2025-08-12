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
  
  const accountMode = watch("accountMode");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // learnersCount-driven auto add/remove removed; users can add learners explicitly

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
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Your name</Label>
                        <Input id="fullName" placeholder="Full name" {...register('fullName')} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <LearnerRow key={field.id} index={index} register={register} setValue={setValue} showAccountFields={accountMode === 'separate'} />
                      ))}
                      <div className="pt-1">
                        <Button type="button" variant="outline" onClick={() => append({ fullName: '', email: '' })}>Add learner</Button>
                      </div>
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
