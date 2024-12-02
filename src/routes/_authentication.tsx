import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getAuthValueFromStorage } from "@/services";

export const Route = createFileRoute("/_authentication")({
  beforeLoad: async () => {
    try {
      if (getAuthValueFromStorage()) {
        return redirect({ to: "/" });
      }
      return true;
    } catch (e) {
      console.error(e);
      return redirect({ to: "/log-in" });
    }
  },
  component: AuthLayout,
});

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center gap-2 overflow-auto bg-slate-50 sm:pb-16 sm:pt-10">
      <div className="z-10 flex h-fit w-full flex-col gap-2 px-2 md:w-1/2 lg:w-[30%]">
        <Outlet />
      </div>
      <img
        src="https://plus.unsplash.com/premium_photo-1685134731677-1f5021c1f764?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="logo"
        className="absolute bottom-0 right-0 z-0 h-screen w-screen object-cover opacity-70"
      />
      <div className="absolute bottom-0 right-0 z-0 h-screen w-screen bg-black/30" />
    </div>
  );
}
