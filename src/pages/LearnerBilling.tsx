import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOnboardingName } from "@/lib/store";

export default function LearnerBilling() {
  const learnerName = getOnboardingName() || "Learner";

  useEffect(() => {
    document.title = "Learner - Billing";
    const desc = "View your plan information.";
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
            <h1 className="text-base font-semibold">Billing</h1>
          </header>
          <main className="p-6">
            <section className="container max-w-4xl">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Choose Your Plan</h2>
                <p className="text-muted-foreground">Select an individual plan or have a guardian manage your account.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Free Individual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-3xl font-semibold">$0</div>
                    <div className="text-sm text-muted-foreground mb-2">Individual Plan</div>
                    <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Limited credits per month</li>
                      <li>Basic learning features</li>
                      <li>Email support</li>
                    </ul>
                    <Button variant="outline" className="mt-2 w-full">Current Plan</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Pro Individual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-3xl font-semibold">$9.99/month</div>
                    <div className="text-sm text-muted-foreground mb-2">Individual Plan</div>
                    <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Unlimited credits</li>
                      <li>Advanced learning features</li>
                      <li>Priority support</li>
                      <li>Detailed progress analytics</li>
                    </ul>
                    <Button className="mt-2 w-full">Upgrade to Pro</Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Want someone else to pay?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Have a guardian (parent, teacher, or mentor) manage and pay for your account. 
                    You'll be part of their family plan with shared credits and they'll handle all billing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1">
                      Link to Guardian Account
                    </Button>
                    <Button variant="ghost" className="flex-1">
                      Invite Someone to be Guardian
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground p-3 bg-background rounded border">
                    <strong>Note:</strong> Once linked to a guardian account, they will manage your billing and you'll be part of their family plan.
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
