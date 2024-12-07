import ChangePasswordPage from "@/components/pages/profile/change-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_profile/profile/change-password")({
  component: ChangePasswordPage,
});
