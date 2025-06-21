"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  User
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  // AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LogoutAlertDialog } from "../logout-alert-dialog"
import { adminLogout } from "@/lib/logout/admin-logout"
import { Admin } from "@/types"
import { useRouter } from "next/navigation"
import { getFirstName, getInitials } from "@/lib/utils"

/** TODO: 
 * pass admin as prop
 */

export default function Sidebaradmin({ admin}: {admin: Admin}) {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const isSuperAdmin = admin?.role === "super_admin"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={admin.avatar} alt={admin.name} /> */}
                <AvatarFallback className="rounded-lg">
                  {getInitials(admin.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{getFirstName(admin.name)}</span>
                <span className="truncate text-xs">{admin.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={admin.avatar} alt={admin.name} /> */}
                  <AvatarFallback className="rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {getInitials(admin.name)}
                    </AvatarFallback>

                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{admin.name}</span>
                  <span className="truncate text-xs">{admin.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              
              {isSuperAdmin ? <DropdownMenuItem onClick={() => router.push('/admin/dashboard/settings')}>
                <BadgeCheck />
                Setting
              </DropdownMenuItem>: null }
              <DropdownMenuItem onClick={() => router.push('/admin/dashboard/profile')}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutAlertDialog
                onConfirm={adminLogout}
                trigger={
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-pointer flex  items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive/70 hover:!text-destructive hover:!bg-transparent"
                  >
                    <LogOut size={16} />
                    Log out
                  </div>
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
