import CalendarPage from "@/components/pages/calendar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/calendar")({
  component: CalendarPage,
});
