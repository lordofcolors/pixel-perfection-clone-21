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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AnalyticsSidebarProps {
  guardianName: string;
  learners: { name: string }[];
  activeView: "guardian" | number;
  onSelectView: (view: "guardian" | number) => void;
}

export function AnalyticsSidebar({ guardianName, learners, activeView, onSelectView }: AnalyticsSidebarProps) {
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
