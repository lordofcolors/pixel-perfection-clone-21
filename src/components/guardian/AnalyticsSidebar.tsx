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
import { Button } from "@/components/ui/button";
import GoogleLogo from "@/assets/google-g-logo.png";
import { Lock } from "lucide-react";

const curriculum = [
  { title: "0: Assessment", locked: false },
  { title: "1: Leash Skills and Safety", locked: false },
  { title: "2: Meeting Other Dogs Safely", locked: false },
  { title: "3: Fun Activities for Dogs on Walks", locked: true },
  { title: "4: Handling Dog Walking Challenges", locked: true },
  { title: "Emergency Situations & First Aid Basics", locked: true },
];

export function AnalyticsSidebar({ guardianName, learners }: { guardianName: string; learners: { name: string }[] }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2">
          <SidebarInput placeholder="Search" aria-label="Search" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {learners.map((learner) => (
          <SidebarGroup key={learner.name}>
            <SidebarGroupLabel>{learner.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Master Dog Walking</SidebarMenuButton>
                  <SidebarMenuSub>
                    {curriculum.map((item, idx) => (
                      <li key={idx}>
                        <SidebarMenuSubButton asChild>
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
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback>TG</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium truncate">{guardianName}</div>
        </div>
        <div className="px-2 pb-2">
          <Button type="button" variant="google" className="w-full" aria-label="Sign out of Google">
            <img src={GoogleLogo} alt="Google logo" className="h-5 w-5" />
            <span>Sign out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

