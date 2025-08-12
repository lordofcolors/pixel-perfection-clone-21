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
                <h2 className="text-3xl font-semibold mb-3">Your Account is Managed by a Guardian</h2>
                <p className="text-muted-foreground">Tree Guardian is managing your billing and family plan</p>
              </div>
              
              <Card className="border-primary/20 bg-primary/5 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">TG</span>
                      </div>
                      <span>Tree Guardian's Family Plan</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Pro Plan Active</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    You're part of Tree Guardian's family account with shared credits and premium features.
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Unlimited AI assistance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Premium learning experiences</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>Shared family credits</span>
                    </div>
                  </div>
                  <div className="bg-background/50 rounded p-3 border">
                    <div className="text-sm font-medium mb-1">Family Members</div>
                    <div className="text-sm text-muted-foreground">Jake, Mia, and you</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">How Family Accounts Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tree Guardian manages all billing and plan details for your family account. Credits are shared 
                    among all family members, and you get access to all premium features.
                  </p>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Need to change something?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you need to update your plan or billing, you'll need to contact Tree Guardian who manages 
                      the family account. You can also disconnect from the family plan to manage your own billing.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" className="flex-1">
                        Contact Tree Guardian
                      </Button>
                      <Button variant="ghost" className="flex-1">
                        Leave Family Plan
                      </Button>
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
