"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarDays, Users, Settings, FileCheck } from "lucide-react"
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Events",
    href: "/admin/dashboard/events",
    icon: CalendarDays,
  },
  {
    title: "Submissions",
    href: "/admin/dashboard/submissions",
    icon: FileCheck,
  },
  {
    title: "Admins",
    href: "/admin/dashboard/admins",
    icon: Users,
    requiresSuperAdmin: true, // only for super admins
  },
  {
    title: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
    requiresSuperAdmin: true, // only for super admins
  },
]

export function DashboardNav({isSuperAdmin}: {isSuperAdmin: boolean}) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <>
      <SidebarHeader className="border-b border-border/40">
        <Link href="/admin/dashboard" className={cn("h-12 flex items-center gap-2", isCollapsed ? "justify-center px-0" : "px-2")}>
          <Image src={'/logo.svg'} width={32} height={72} alt='TechLinkUp logo.' priority/>
        </Link>
      </SidebarHeader>

      <div className='pt-4'>
        <SidebarMenu>
          {navItems.map((item) => (
            (!item.requiresSuperAdmin || isSuperAdmin) && (
              <SidebarMenuItem key={item.href + item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={cn(
                    "w-fit flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:[&>svg]:scale-110",
                    pathname === item.href
                      ? "text-white shadow-sm"
                      : "text-primary hover:text-foreground"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="size-5 transition-transform" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>

      </div>
    </>
  )
}
