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
  label?: string;
};

export function NavGroup({ data, label }: NavGroupProps) {
  const pathname = useLocation().pathname;
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={
                pathname.startsWith(item.url)
                  ? "h-10 rounded-md bg-primary/10 py-2 font-semibold text-primary hover:bg-primary/20 hover:text-primary"
                  : "h-10 py-2"
              }
            >
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
