import ProfilePage from "@/components/pages/profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_profile/profile/")({
  component: ProfilePage,
});
