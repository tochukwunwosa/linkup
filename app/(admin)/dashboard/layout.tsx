"use client"
import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { SiteHeader } from "@/components/dashboard/site-header"
import SidebarUser from "@/components/dashboard/sidebar-user"
import { mockAdmins } from "@/lib/mock-data"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = mockAdmins[0]
  const isSuperAdmin = user.role === "super_admin"

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="w-full flex min-h-screen">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent>
            <DashboardNav isSuperAdmin={isSuperAdmin} />
          </SidebarContent>
          <SidebarFooter>
            <SidebarUser isSuperAdmin={isSuperAdmin} />
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <SiteHeader />
         <main className="flex-1 overflow-auto p-4 pr-6 md:p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}