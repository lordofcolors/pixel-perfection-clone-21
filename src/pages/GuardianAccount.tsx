import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function GuardianAccount() {
  useEffect(() => {
    document.title = "Guardian - Account Settings";
    const desc = "Manage learners and account preferences.";
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

  return (
    <main className="container max-w-3xl py-8">
      <h1 className="text-2xl font-semibold mb-4">Account settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Learners & access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="learnersCount">Number of learners</Label>
              <Input id="learnersCount" type="number" min={1} max={10} defaultValue={2} />
              <p className="text-xs text-muted-foreground">Between 1 and 10 learners.</p>
            </div>
            <div className="space-y-2">
              <Label>Account mode</Label>
              <RadioGroup defaultValue="inhouse" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => history.back()}>Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
