import AnalyticsPage from "@/components/pages/analytics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
});
