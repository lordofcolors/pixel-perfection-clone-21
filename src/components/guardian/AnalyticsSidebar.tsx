import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import GoogleLogo from "@/assets/google-g-logo.png";
import { useState } from "react";

export function AnalyticsSidebar() {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2">
          <SidebarInput placeholder="Search" aria-label="Search" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Guardian</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Overview</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback>AG</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium truncate">Alex Guardian</div>
        </div>
        <div className="px-2 pb-2">
          <Button
            type="button"
            variant="google"
            className="w-full"
            onClick={() => setSignedIn((v) => !v)}
            aria-label={signedIn ? "Sign out of Google" : "Sign in with Google"}
          >
            <img src={GoogleLogo} alt="Google logo" className="h-5 w-5" />
            <span>{signedIn ? "Sign out" : "Sign in with Google"}</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
