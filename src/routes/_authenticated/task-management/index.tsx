import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/task-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  navigate({ to: "/task-management/calendar-view" });
  return <></>;
}
