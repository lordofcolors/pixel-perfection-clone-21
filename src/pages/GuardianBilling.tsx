import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GuardianBilling() {
  useEffect(() => {
    document.title = "Guardian - Billing";
    const desc = "Manage your plan and billing details.";
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
    <main className="container max-w-5xl py-8">
      <h1 className="text-2xl font-semibold mb-4">Account</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">$0</div>
            <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Up to 3 learners</li>
              <li>Basic analytics</li>
              <li>Email support</li>
            </ul>
            <Button variant="outline" className="mt-2">Current plan</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-semibold">$19.99/month</div>
            <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Up to 10 learners</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
            </ul>
            <Button className="mt-2">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
