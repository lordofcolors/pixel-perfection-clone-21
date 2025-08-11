import { NavLink, useLocation } from "react-router-dom";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lock } from "lucide-react";

const curriculum = [
  { title: "0: Assessment", locked: false },
  { title: "1: Leash Skills and Safety", locked: false },
  { title: "2: Meeting Other Dogs Safely", locked: false },
  { title: "3: Fun Activities for Dogs on Walks", locked: true },
  { title: "4: Handling Dog Walking Challenges", locked: true },
  { title: "Emergency Situations & First Aid Basics", locked: true },
];

export function AppSidebar({ learnerName }: { learnerName?: string }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="bg-sidebar">
      <SidebarHeader>
        <div className="px-2">
          <SidebarInput placeholder="Search" aria-label="Search" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Journey</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/learner")}
                  tooltip="Master Dog Walking">
                  <NavLink to="/learner" end>
                    <span>Master Dog Walking</span>
                  </NavLink>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {curriculum.map((item, idx) => (
                    <li key={idx}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={false}
                        aria-disabled={false}
                      >
                        <a href="#">
                          {item.locked ? <Lock className="opacity-70" size={14} /> : null}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </li>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium truncate">{learnerName || "Learner"}</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
