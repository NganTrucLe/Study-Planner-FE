import * as React from "react";
import {
  KanbanSquare,
  Calendar,
  TimerIcon,
  ChartNoAxesCombined,
  ChartPie,
  ClipboardPen,
  Loader2,
  NotebookPenIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { useUserProfile } from "@/hooks/react-query/useUsers";

const items = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  planning: [
    {
      name: "Task Management",
      url: "/task-management",
      icon: KanbanSquare,
    },
    {
      name: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      name: "Focus Timer",
      url: "/focus-timer",
      icon: TimerIcon,
    },
  ],
  analytics: [
    {
      name: "Progress",
      url: "/progress",
      icon: ChartNoAxesCombined,
    },
    {
      name: "Analytics",
      url: "/analytics",
      icon: ChartPie,
    },
    {
      name: "Report",
      url: "/report",
      icon: ClipboardPen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading } = useUserProfile();

  return (
    <>
      {isLoading ? (
        <Loader2 className="mx-auto size-12 animate-spin" />
      ) : (
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader className="flex flex-row gap-2">
            <NotebookPenIcon />
            <span>Study Planner</span>
          </SidebarHeader>
          <SidebarContent>
            <NavGroup data={items.planning} label="Planning" />
            <NavGroup data={items.analytics} label="Analytics" />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      )}
    </>
  );
}
