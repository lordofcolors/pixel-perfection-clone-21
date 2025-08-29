import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GuardianDashboardSidebarProps {
  guardianName: string;
}

export function GuardianDashboardSidebar({ guardianName }: GuardianDashboardSidebarProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'TG';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts[parts.length - 1]?.[0] || '';
    return (first + last).toUpperCase() || 'TG';
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2">
          <SidebarInput placeholder="Search" aria-label="Search" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-2 py-4">
          <h2 className="text-lg font-semibold text-center">Guardian Dashboard</h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Monitor all your learners' progress and activity from this unified view.
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{getInitials(guardianName)}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium truncate">{guardianName}</div>
        </div>
        <div className="px-2 pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/guardian/account">Account</NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/guardian/billing">Billing</NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button type="button" aria-label="Sign out">Sign out</button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}