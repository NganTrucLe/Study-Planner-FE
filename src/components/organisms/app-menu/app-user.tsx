import { LogOut, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/react-query/useAuth";
import { useNavigate } from "@tanstack/react-router";

export function AppUser({ user }: { user: any }) {
  const navigate = useNavigate();
  const signOutMutation = useSignOut();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="w-60 px-3 py-2">
        <Avatar className="mr-3 size-7 rounded-lg">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback className="rounded-lg bg-primary/10 text-xs uppercase">
            {(user.username as string).slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{user.username}</span>
          <span className="max-w-40 truncate text-xs text-muted-foreground">{user.email}</span>
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex gap-2" onClick={() => navigate({ to: "/profile" })}>
              <UserIcon size={20} />
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2"
            disabled={signOutMutation.isPending}
            onClick={() => {
              signOutMutation.mutate();
            }}
          >
            <LogOut size={20} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
