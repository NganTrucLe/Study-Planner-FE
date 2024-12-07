import { createFileRoute } from "@tanstack/react-router";

import ProfileLayout from "@/components/template/profile-layout";

export const Route = createFileRoute("/_authenticated/_profile")({
  component: ProfileLayout,
});
