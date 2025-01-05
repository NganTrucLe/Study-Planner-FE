import { ChartPie, MenuIcon, KanbanSquare, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/react-query/useUsers";
import { AppUser } from "./app-user";

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

export default function AppMenu() {
  const pathname = useLocation().pathname;
  const { data, isLoading } = useUserProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="size-12 p-1 outline-none ring-0">
          <MenuIcon size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={4} className="shadow-2xl">
        {navs.map((nav, index) => (
          <Link href={nav.url} key={index} className="block">
            <DropdownMenuItem
              className={cn(
                "px-4 py-2 text-base",
                pathname.startsWith(nav.url)
                  ? "h-10 rounded-md bg-primary/10 py-2 font-semibold text-primary hover:bg-primary/20 hover:text-primary"
                  : "h-10 py-2"
              )}
            >
              <nav.icon size={16} className="mr-2" />
              {nav.name}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        {isLoading ? <Loader2 className="mx-auto size-12 animate-spin" /> : <AppUser user={data} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
