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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Plus } from "lucide-react";

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
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/guardian/separate" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Family Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Learning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="#" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Start Learning Session</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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