"use client";

import {
  Coffee,
  EllipsisVertical,
  LogOut,
  Mail,
  MessageCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth-action";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const cleanPath = pathname.replace(/^\/+/, "");
  const user = useAuthStore((state) => state.user);

  const isActive = (path: string) => cleanPath === path;
  const isActiveStartsWith = (path: string) => cleanPath.startsWith(path);
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"} asChild>
              <div className="font-semibold flex items-center gap-2">
                <div className="bg-teal-500 flex p-2 items-center justify-center rounded-md">
                  <Coffee className="size-4 text-white" />
                </div>
                My Personal Assistance
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn({
                    "!bg-teal-500 !text-white": isActive("chat"),
                  })}
                >
                  <Link
                    href="/chat"
                    className="px-4 py-3 h-auto flex items-center gap-2 w-full"
                  >
                    <Mail />
                    <span>New Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user?.chat_sessions?.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    asChild
                    className={cn({
                      "!bg-teal-500 !text-white": isActiveStartsWith(
                        `chat/${session.id}`,
                      ),
                    })}
                  >
                    <Link
                      href={`/chat/${session.id}`}
                      className="px-4 py-3 h-auto flex items-center gap-2 w-full"
                    >
                      <MessageCircle />
                      <span className="truncate">{session.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={"lg"}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`#`} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="leading-tight">
                  <h4 className="truncate font-medium capitalize">
                    {user?.name}
                  </h4>
                  <p className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </p>
                </div>

                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-2">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={`#`} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="leading-tight">
                    <h4 className="truncate font-medium capitalize">
                      {user?.name}
                    </h4>
                    <p className="text-muted-foreground truncate text-xs">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
