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
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-semibold mb-3">Connect with a Parent/Guardian</h2>
                <p className="text-muted-foreground">Let a parent or guardian manage your billing and get access to family plan benefits</p>
              </div>
              
              <Card className="border-primary/20 bg-primary/5 mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">Why Connect with a Parent/Guardian?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Access to unlimited AI assistance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Premium learning experiences</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Shared family credits - no individual billing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Family learning progress tracking</span>
                    </div>
                  </div>
                  
                  <div className="bg-background/50 rounded p-3 border mt-4">
                    <div className="text-sm font-medium mb-2">Your 14-day trial expires soon</div>
                    <div className="text-sm text-muted-foreground">
                      Connect with a parent/guardian to continue using premium features after your trial ends.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Connect with Parent/Guardian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask your parent or guardian to add you to their family plan. They can either create a new account 
                    or add you to an existing family plan.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1">
                      Send Connection Request
                    </Button>
                    <Button variant="outline" className="flex-1">
                      I'll Pay Myself
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">1</span>
                      </div>
                      <span>Send a connection request to your parent/guardian's email</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">2</span>
                      </div>
                      <span>They'll receive an invitation to add you to their family plan</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">3</span>
                      </div>
                      <span>Once connected, you'll have access to all family plan benefits</span>
                    </div>
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
