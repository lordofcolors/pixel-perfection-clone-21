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
import { Lock, Home, Sparkles, Plus } from "lucide-react";
import { getGuardianSetup } from "@/lib/store";

const defaultCurriculum = [
  { title: "0: Assessment", locked: false },
  { title: "1: Leash Skills and Safety", locked: false },
  { title: "2: Meeting Other Dogs Safely", locked: false },
  { title: "3: Fun Activities for Dogs on Walks", locked: true },
  { title: "4: Handling Dog Walking Challenges", locked: true },
  { title: "Emergency Situations & First Aid Basics", locked: true },
];

type ViewType = "guardian" | "dashboard" | "skillSelection" | number; // number = learner index

interface ManageSidebarProps {
  learners: { name: string }[];
  guardianName: string;
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  onCreateSkill: () => void;
  refreshTrigger?: number;
}

export function ManageSidebar({ learners, guardianName, activeView, onSelectView, onCreateSkill, refreshTrigger }: ManageSidebarProps) {
  const data = getGuardianSetup();
  const skills = data?.skills || {};
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

  const renderGroup = (learner: { name: string }, i: number) => {
    const personSkills = skills[learner.name] || [];
    const hasCustomSkills = personSkills.length > 0;
    
    return (
      <SidebarGroup key={learner.name}>
        <SidebarGroupLabel>{learner.name}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Custom skills */}
            {personSkills.map((skill, skillIdx) => (
              <SidebarMenuItem key={skillIdx}>
                <SidebarMenuButton asChild isActive>
                  <NavLink to="#">
                    <span>{skill.title}</span>
                  </NavLink>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {skill.lessons.map((lesson, lessonIdx) => (
                    <li key={lessonIdx}>
                      <SidebarMenuSubButton asChild isActive={false} aria-disabled={false}>
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          {lesson.locked ? <Lock className="opacity-70" size={14} /> : null}
                          <span>{lesson.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </li>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
            
            {/* Default Master Dog Walking skill */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <NavLink to="#">
                  <span>Master Dog Walking</span>
                </NavLink>
              </SidebarMenuButton>
              <SidebarMenuSub>
                {defaultCurriculum.map((item, idx) => (
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
  };

  const renderGuardianGroup = () => {
    const guardianSkills = skills[guardianName] || [];
    if (guardianSkills.length === 0) return null;
    
    return (
      <SidebarGroup key={guardianName}>
        <SidebarGroupLabel>{guardianName} (Guardian)</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {guardianSkills.map((skill, skillIdx) => (
              <SidebarMenuItem key={skillIdx}>
                <SidebarMenuButton asChild isActive>
                  <NavLink to="#">
                    <span>{skill.title}</span>
                  </NavLink>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {skill.lessons.map((lesson, lessonIdx) => (
                    <li key={lessonIdx}>
                      <SidebarMenuSubButton asChild isActive={false} aria-disabled={false}>
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          {lesson.locked ? <Lock className="opacity-70" size={14} /> : null}
                          <span>{lesson.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </li>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2 flex items-center gap-2">
          <SidebarInput placeholder="Search" aria-label="Search" className="flex-1" />
          <button 
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Add new learning session"
            onClick={onCreateSkill}
          >
            <div className="relative">
              <Plus className="h-4 w-4" />
              <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5 text-rainbow animate-pulse" style={{
                background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }} />
            </div>
          </button>
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

        {/* Guardian Skills */}
        {renderGuardianGroup()}
        
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
