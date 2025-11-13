import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { SiteHeader } from "@/components/dashboard/site-header"
import SidebarUser from "@/components/dashboard/sidebar-user"
import { AdminProvider } from "@/context/AdminContext"
import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/app/actions/admin/getCurrentAdmin"

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const admin = await getCurrentAdmin()
  if (!admin) redirect("/admin/login")

  return (
    <AdminProvider admin={admin}>
      <SidebarProvider defaultOpen={true}>
        <div className="w-full flex min-h-screen">
          {/* Sidebar */}
          <Sidebar variant="sidebar" collapsible="icon">
            <SidebarContent>
              <DashboardNav isSuperAdmin={admin.role === "super_admin"} />
            </SidebarContent>
            <SidebarFooter>
              <SidebarUser admin={admin} />
            </SidebarFooter>
          </Sidebar>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <SiteHeader />
            <main className="flex-1 overflow-y-auto p-4 pr-6 md:p-6">
              <div>{children}</div>
            </main>
          </div>

        </div>
      </SidebarProvider>
    </AdminProvider>
  )
}