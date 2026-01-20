import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lock, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAssignmentsForLearner, type Assignment } from "@/lib/store";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Helper: initials from 'First Last'
const getInitials = (name?: string) => {
  if (!name) return "L";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  const initials = (first + last) || first || "L";
  return initials.toUpperCase();
};

type SkillWithAssignments = {
  skillTitle: string;
  lessons: {
    title: string;
    locked: boolean;
    isDue: boolean;
    dueDate?: string;
  }[];
  dueCount: number;
};

export function AppSidebar({ learnerName }: { learnerName?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpen } = useSidebar();
  const isActive = (path: string) => location.pathname === path;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [skillsWithAssignments, setSkillsWithAssignments] = useState<SkillWithAssignments[]>([]);
  const [openSkills, setOpenSkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Open sidebar when learner dashboard loads
    setOpen(true);
    
    // Poll for assignments
    const updateAssignments = () => {
      const learnerAssignments = getAssignmentsForLearner(learnerName || "");
      setAssignments(learnerAssignments);
      
      // Group assignments by skill
      const skillMap = new Map<string, SkillWithAssignments>();
      
      learnerAssignments.forEach(assignment => {
        if (!skillMap.has(assignment.skillTitle)) {
          skillMap.set(assignment.skillTitle, {
            skillTitle: assignment.skillTitle,
            lessons: [],
            dueCount: 0,
          });
        }
        
        const skill = skillMap.get(assignment.skillTitle)!;
        const isDue = assignment.status === 'pending' || assignment.status === 'in-progress';
        
        skill.lessons.push({
          title: assignment.lessonTitle,
          locked: false,
          isDue,
          dueDate: assignment.dueDate,
        });
        
        if (isDue) {
          skill.dueCount++;
        }
      });
      
      const skillsList = Array.from(skillMap.values());
      setSkillsWithAssignments(skillsList);
      
      // Auto-open skills that have due items
      const skillsToOpen = new Set<string>();
      skillsList.forEach(skill => {
        if (skill.dueCount > 0) {
          skillsToOpen.add(skill.skillTitle);
        }
      });
      setOpenSkills(skillsToOpen);
    };

    updateAssignments();
    const interval = setInterval(updateAssignments, 2000);
    return () => clearInterval(interval);
  }, [learnerName, setOpen]);

  const handleAddSkill = () => {
    navigate('/learner/add-skill', { state: { firstName: learnerName } });
  };

  const toggleSkill = (skillTitle: string) => {
    setOpenSkills(prev => {
      const next = new Set(prev);
      if (next.has(skillTitle)) {
        next.delete(skillTitle);
      } else {
        next.add(skillTitle);
      }
      return next;
    });
  };

  return (
    <Sidebar collapsible="icon" className="bg-sidebar">
      <SidebarHeader>
        <div className="px-2 space-y-2">
          <SidebarInput placeholder="Search skills..." aria-label="Search" />
          <Button 
            onClick={handleAddSkill} 
            className="w-full" 
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Chat with A link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/learner")} tooltip="Chat with A">
                  <NavLink to="/learner" end className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <span>Chat with A</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Skills with assignments */}
              {skillsWithAssignments.map((skill) => (
                <SidebarMenuItem key={skill.skillTitle}>
                  <Collapsible 
                    open={openSkills.has(skill.skillTitle)}
                    onOpenChange={() => toggleSkill(skill.skillTitle)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between">
                        <span className="font-medium truncate">{skill.skillTitle}</span>
                        <div className="flex items-center gap-2">
                          {skill.dueCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
                            >
                              {skill.dueCount}
                            </Badge>
                          )}
                          {openSkills.has(skill.skillTitle) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {skill.lessons.map((lesson, idx) => (
                          <li key={idx} className="flex items-center justify-between py-1">
                            <SidebarMenuSubButton
                              asChild
                              isActive={false}
                              className="flex-1"
                            >
                              <a href="#" className="flex items-center gap-2">
                                {lesson.locked && <Lock className="opacity-70 shrink-0" size={14} />}
                                <span className="truncate">{lesson.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                            {lesson.isDue && (
                              <Badge 
                                variant="outline" 
                                className="ml-2 text-destructive border-destructive bg-destructive/10 text-xs shrink-0"
                              >
                                Due
                              </Badge>
                            )}
                          </li>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md">
          <Avatar>
            <AvatarFallback>{getInitials(learnerName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate">{learnerName || "Learner"}</span>
            <span className="text-xs text-muted-foreground">Learner</span>
          </div>
        </div>
        <div className="px-2 pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/learner/account')}>
                <NavLink to="/learner/account">Account</NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/learner/billing')}>
                <NavLink to="/learner/billing">Billing</NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
