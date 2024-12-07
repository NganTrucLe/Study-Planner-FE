import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import ErrorFallback from "@/components/ErrorFallback";
import { getAuthValueFromStorage } from "@/services";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/app-sidebar";

const AuthenticatedPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  );
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    try {
      if (!getAuthValueFromStorage()) {
        return redirect({ to: "/log-in" });
      }
      if (location.pathname === "/log-in" || location.pathname === "/sign-up") {
        return redirect({ to: "/" });
      }
      return true;
    } catch (e) {
      console.error(e);
      return redirect({ to: "/log-in" });
    }
  },
  pendingComponent: () => {
    return <span>Loading Protected</span>;
  },
  errorComponent: (error) => {
    console.error(error);
    return <ErrorFallback />;
  },
  component: AuthenticatedPage,
});
