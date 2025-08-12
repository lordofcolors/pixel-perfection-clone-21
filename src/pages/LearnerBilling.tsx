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
                <h2 className="text-3xl font-semibold mb-3">Choose Your Plan</h2>
                <p className="text-muted-foreground">Start with a 14-day Pro trial, then continue with the plan that works for you</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-muted">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Free Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-4xl font-semibold">$0</div>
                    <div className="text-sm text-muted-foreground">Perfect for getting started</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>5 minutes of AI assistance per day</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>Basic learning features</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      14-Day Free Trial
                    </span>
                  </div>
                  <CardHeader className="pt-6">
                    <CardTitle className="flex items-center justify-between">
                      Pro Plan
                      <span className="text-lg font-normal">$9.99<span className="text-sm text-muted-foreground">/month</span></span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-muted-foreground text-sm">Unlimited learning potential</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Unlimited AI assistance</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Premium learning experiences</span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary/80 hover:bg-primary">
                      Trial Active
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      Trial ends in 14 days
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      You'll automatically return to the Free plan unless you upgrade
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">How the 14-Day Trial Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    You're currently enjoying your Pro trial with unlimited AI assistance. After 14 days, you'll 
                    automatically return to the Free plan. No credit card required, no automatic billing.
                  </p>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Want someone else to pay?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Have a guardian (parent, teacher, or mentor) manage and pay for your account. 
                      You'll be part of their family plan with shared credits.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" className="flex-1">
                        Link to Guardian Account
                      </Button>
                      <Button variant="ghost" className="flex-1">
                        Invite Someone to be Guardian
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
