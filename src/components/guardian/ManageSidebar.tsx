import { NavLink } from "react-router-dom";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lock, Home } from "lucide-react";

const curriculum = [
  { title: "0: Assessment", locked: false },
  { title: "1: Leash Skills and Safety", locked: false },
  { title: "2: Meeting Other Dogs Safely", locked: false },
  { title: "3: Fun Activities for Dogs on Walks", locked: true },
  { title: "4: Handling Dog Walking Challenges", locked: true },
  { title: "Emergency Situations & First Aid Basics", locked: true },
];

type ViewType = "guardian" | "dashboard" | number; // number = learner index

interface ManageSidebarProps {
  learners: { name: string }[];
  guardianName: string;
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
}

export function ManageSidebar({ learners, guardianName, activeView, onSelectView }: ManageSidebarProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'NA';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts[parts.length - 1]?.[0] || '';
    return (first + last).toUpperCase() || 'NA';
  };
  const showAll = activeView === "guardian" || activeView === "dashboard";
  const activeIndex = typeof activeView === "number" ? activeView : 0;
  const currentName = showAll ? guardianName : (learners[activeIndex]?.name || guardianName);

  const renderGroup = (learner: { name: string }, i: number) => (
    <SidebarGroup key={learner.name}>
      <SidebarGroupLabel>{learner.name}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <NavLink to="#">
                <span>Master Dog Walking</span>
              </NavLink>
            </SidebarMenuButton>
            <SidebarMenuSub>
              {curriculum.map((item, idx) => (
                <li key={idx}>
                  <SidebarMenuSubButton asChild isActive={false} aria-disabled={false}>
                    <a href="#" onClick={(e) => e.preventDefault()}>
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
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2">
          <SidebarInput placeholder="Search" aria-label="Search" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Family Dashboard Link */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild={false}
                  onClick={() => onSelectView("dashboard")}
                  isActive={activeView === "dashboard"}
                >
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Family Dashboard</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Learner Navigation Trees */}
        {showAll ? learners.map((l, i) => renderGroup(l, i)) : renderGroup(learners[activeIndex], activeIndex)}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{getInitials(currentName)}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium truncate">{currentName}</div>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-xs underline" aria-label="Switch viewer">
                Switch
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelectView("guardian")}>
                  {activeView === "guardian" ? "✓ " : ""}{guardianName}
                </DropdownMenuItem>
                {learners.map((l, idx) => (
                  <DropdownMenuItem key={l.name} onClick={() => onSelectView(idx)}>
                    {activeView === idx ? "✓ " : ""}{l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
