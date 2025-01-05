import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { CalendarIcon, ListIcon } from "lucide-react";

const TAB_BAR = [
  {
    href: "/task-management/calendar-view",
    label: "Calendar view",
    icon: CalendarIcon,
  },
  {
    href: "/task-management/list-view",
    label: "List view",
    icon: ListIcon,
  },
];
export default function TabBar() {
  const pathname = useLocation().pathname;
  return (
    <div className="flex w-full flex-row gap-2 border-b bg-white px-8">
      {TAB_BAR.map((tab, index) => (
        <Link
          key={index}
          to={tab.href}
          className={cn(
            "inline-flex flex-row items-center justify-center gap-2 bg-white p-3 font-semibold text-neutral-500",
            pathname.startsWith(tab.href) ? "border-b-2 border-primary text-primary" : ""
          )}
        >
          <tab.icon size={16} />
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
