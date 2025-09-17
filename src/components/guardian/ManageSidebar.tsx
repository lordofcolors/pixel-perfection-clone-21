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
import { Button } from "@/components/ui/button";
import { Lock, Home, Plus } from "lucide-react";
import { getGuardianSetup } from "@/lib/store";
import circlePlusIcon from "@/assets/circle-plus.svg";

// Removed default curriculum - children start with empty skills

type ViewType = "guardian" | "dashboard" | "skillSelection" | number; // number = learner index

interface ManageSidebarProps {
  learners: { name: string }[];
  guardianName: string;
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  onCreateSkill: (targetIndex?: number) => void;
  refreshTrigger?: number;
  createForIndex?: number;
}

export function ManageSidebar({ learners, guardianName, activeView, onSelectView, onCreateSkill, refreshTrigger, createForIndex }: ManageSidebarProps) {
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
  const isLearnerView = typeof activeView === "number" || activeView === "skillSelection";
  const activeIndex = typeof activeView === "number" 
    ? activeView 
    : (activeView === "skillSelection" && typeof createForIndex === "number" ? createForIndex : 0);
  const currentName = showAll ? guardianName : (learners[activeIndex]?.name || guardianName);

  const renderGroup = (learner: { name: string }, i: number) => {
    const personSkills = skills[learner.name] || [];
    const hasCustomSkills = personSkills.length > 0;
    
    return (
      <SidebarGroup key={learner.name} className="pt-2">
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
            
            {/* Create First Skill button when no skills exist */}
            {!hasCustomSkills && (
              <SidebarMenuItem>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-xs font-normal"
                  onClick={() => {
                    onCreateSkill(i);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Create First Skill
                </Button>
              </SidebarMenuItem>
            )}
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
        <SidebarGroupLabel>Me ({guardianName})</SidebarGroupLabel>
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
        <div className="px-2 flex items-center justify-between gap-2">
          <SidebarInput placeholder="Search" aria-label="Search" className="flex-1" />
          <button 
            className="p-1 rounded-md hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Add new learning session"
            onClick={() => onCreateSkill(isLearnerView ? activeIndex : undefined)}
          >
            <img src={circlePlusIcon} alt="Add" className="h-6 w-6" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Guardian Skills - Me section first - only show for guardian view */}
        {!isLearnerView && renderGuardianGroup()}
        
        {/* Family Dashboard Link - only show for guardian view */}
        {!isLearnerView && (
          <SidebarGroup className="pb-2">
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
        )}
        
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
