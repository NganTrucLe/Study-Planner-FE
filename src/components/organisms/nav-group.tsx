import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";

type NavGroupProps = {
  data: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  label: string;
};

export function NavGroup({ data, label }: NavGroupProps) {
  const pathname = useLocation().pathname;
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className={pathname.startsWith(item.url) ? "rounded-md bg-primary/10 text-primary" : ""}
          >
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
