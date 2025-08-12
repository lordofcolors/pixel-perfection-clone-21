import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AnalyticsSidebar } from "@/components/guardian/AnalyticsSidebar";

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AnalyticsSidebar guardianName="Tree Guardian" learners={[{ name: "Jake" }, { name: "Mia" }]} />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Billing</h1>
          </header>
          <main className="p-6">
            <section className="container max-w-4xl">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-semibold mb-3">Choose Your Plan</h2>
                <p className="text-muted-foreground">Start with a 14-day Pro trial, then continue with the plan that works for your family</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-muted">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Free Family Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-4xl font-semibold">$0</div>
                    <div className="text-sm text-muted-foreground">Perfect for getting started</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>Shared credits for the family</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>Basic analytics</span>
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
                      Pro Family Plan
                      <span className="text-lg font-normal">$19.99<span className="text-sm text-muted-foreground">/month</span></span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-muted-foreground text-sm">Unlimited learning potential for your family</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Shared credits for the family</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Advanced analytics</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>Priority support</span>
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
                  <p className="text-sm text-muted-foreground">
                    You're currently enjoying your Pro Family trial with unlimited learning potential for up to 5 learners. 
                    After 14 days, you'll automatically return to the Free Family plan. No credit card required, no automatic billing.
                  </p>
                  <div className="text-xs text-muted-foreground mt-4 p-3 bg-background rounded border">
                    <strong>Family Account Benefits:</strong> Credits are shared amongst all family members under your guardian account. 
                    All billing is managed centrally through your account.
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
