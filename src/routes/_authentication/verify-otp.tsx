import { createFileRoute } from "@tanstack/react-router";

import VerifyOtpPage from "@/components/pages/verify-otp";

export const Route = createFileRoute("/_authentication/verify-otp")({
  component: VerifyOtpPage,
});
