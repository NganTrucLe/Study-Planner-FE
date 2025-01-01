import * as React from "react";
import {
  KanbanSquare,
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
import { Typography } from "../ui";

const items = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  analytics: [
    {
      name: "My dashboard",
      url: "/analytics",
      icon: ChartPie,
    },
  ],
  planning: [
    {
      name: "Task Management",
      url: "/task-management",
      icon: KanbanSquare,
    },
    {
      name: "Focus Timer",
      url: "/focus-timer",
      icon: TimerIcon,
    },
  ],
};

const navs = [
  {
    name: "My dashboard",
    url: "/analytics",
    icon: ChartPie,
  },
  {
    name: "Task Management",
    url: "/task-management",
    icon: KanbanSquare,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading } = useUserProfile();

  return (
    <Sidebar collapsible="icon" {...props} className="!bg-neutral-900">
      <SidebarHeader className="flex flex-row gap-2 p-6 text-primary">
        <NotebookPenIcon />
        <Typography variant="h5">Study Planner</Typography>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup data={navs} />
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? <Loader2 className="mx-auto size-12 animate-spin" /> : <NavUser user={data} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
