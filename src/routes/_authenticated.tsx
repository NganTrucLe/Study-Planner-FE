import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import ErrorFallback from "@/components/ErrorFallback";
import { getAuthValueFromStorage, signOut } from "@/services";
import { userKeys } from "@/hooks/react-query/useUsers";
import { getUserProfile } from "@/services/user";
import { SessionProvider } from "@/components/organisms/learning-session/SessionProvider";

const AuthenticatedPage = () => {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    try {
      if (!getAuthValueFromStorage()) {
        return redirect({ to: "/log-in" });
      }
      const user = queryClient.getQueryData(userKeys.identifier());
      if (!user) {
        const identifier = await getUserProfile();
        if (!identifier) {
          throw new Error("User not found");
        } else {
          queryClient.setQueryData(userKeys.identifier(), identifier);
        }
      }
      if (location.pathname === "/") {
        return redirect({ to: "/analytics" });
      }
      return true;
    } catch (e) {
      await signOut();
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
