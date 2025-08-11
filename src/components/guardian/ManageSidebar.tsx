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
import { Lock } from "lucide-react";

const curriculum = [
  { title: "0: Assessment", locked: false },
  { title: "1: Leash Skills and Safety", locked: false },
  { title: "2: Meeting Other Dogs Safely", locked: false },
  { title: "3: Fun Activities for Dogs on Walks", locked: true },
  { title: "4: Handling Dog Walking Challenges", locked: true },
  { title: "Emergency Situations & First Aid Basics", locked: true },
];

type ViewType = "guardian" | number; // number = learner index

interface ManageSidebarProps {
  learners: { name: string }[];
  guardianName: string;
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
}

export function ManageSidebar({ learners, guardianName, activeView, onSelectView }: ManageSidebarProps) {
  const showAll = activeView === "guardian";
  const activeIndex = typeof activeView === "number" ? activeView : 0;

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
        {showAll ? learners.map((l, i) => renderGroup(l, i)) : renderGroup(learners[activeIndex], activeIndex)}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback>AG</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium truncate">{guardianName}</div>
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
      </SidebarFooter>
    </Sidebar>
  );
}
