"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ChevronDown, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { LogoutAlertDialog } from "@/components/logout-alert-dialog"
import { adminLogout } from "@/lib/logout/admin-logout"
import { useAdmin } from "@/components/context/AdminContext"
import { getFirstName } from "@/lib/utils"

export function SiteHeader() {
  const admin = useAdmin()
  const router = useRouter()
  const isSuperAdmin = admin.role === "super_admin"

  return (
    <header className="!sticky top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        <div className="">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="hover:bg-white hover:text-foreground">
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <span>{getFirstName(admin.name)}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isSuperAdmin &&
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push("/admin/dashboard/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/dashboard/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              }
              <DropdownMenuItem asChild>
                <LogoutAlertDialog
                  onConfirm={adminLogout}
                  trigger={
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer pl-2 text-destructive/70 hover:!text-destructive hover:!bg-transparent"
                    >
                      Log out
                    </div>
                  }
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}