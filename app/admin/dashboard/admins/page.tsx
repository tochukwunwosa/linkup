"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { AdminForm } from "@/components/admin/admin-form"
import { Search, UserPlus } from "lucide-react"
import { AdminsTable } from "@/components/admin/admins-table"
import { AdminsCardView } from "@/components/admin/admins-card-view"
import { useIsMobile } from "@/hooks/use-mobile"
import { AdminFormValues } from "@/lib/validations/admin"
import { Admin } from "@/types"
import { getAllActiveAdmin } from "@/app/actions/admin/getAllActiveAdmin"
import { toast } from "sonner"
import { useAdmin } from "@/components/context/AdminContext"
import { useDebounce } from "@/hooks/use-debounce"
import { useRouter } from "next/navigation"
import { PermissionAlert } from "@/components/permission-alert"

export default function AdminsPage() {
  const user = useAdmin()
  const isSuperAdmin = user?.role === "super_admin"
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [editingAdmin, setEditingAdmin] = useState<AdminFormValues | null>(null)
  const isMobile = useIsMobile()
  const [admins, setAdmins] = useState<Admin[]>([])
  const router = useRouter()

  const fetchAdmins = useCallback(async () => {
    try {
      const data = await getAllActiveAdmin();
      setAdmins(data)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }, [])

  useEffect(() => {
    if (!isSuperAdmin) return;
    fetchAdmins();
  }, [fetchAdmins, isSuperAdmin, router]);

  const filteredAdmins = admins?.filter((admin) =>
    `${admin.name} ${admin.email}`.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleCreateAdmin = () => {
    setEditingAdmin(null)
    setIsDrawerOpen(true)
  }

  const handleEditAdmin = (admin: AdminFormValues) => {
    setEditingAdmin(admin)
    setIsDrawerOpen(true)
  }

  const handleDeleteAdmin = (id: string) => {
    console.log(`Delete admin with ID: ${id}`)
  }

  const handleFormSubmit = () => {
    setIsDrawerOpen(false)
    fetchAdmins()
  }

  return (
    <div>
      {isSuperAdmin ? <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Admins</h1>
          <Button onClick={handleCreateAdmin} className="bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative ">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search admins..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isMobile ? (
          <AdminsCardView admins={filteredAdmins} onEdit={handleEditAdmin} onDelete={handleDeleteAdmin} />
        ) : (
          <AdminsTable admins={filteredAdmins} onEdit={handleEditAdmin} onDelete={handleDeleteAdmin} />
        )}

        <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="">
            <DrawerHeader>
              <DrawerTitle>{editingAdmin ? "Edit Admin" : "Add New Admin"}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 overflow-y-auto">
              <AdminForm
                initialData={editingAdmin}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsDrawerOpen(false)}
              />
            </div>
            <DrawerFooter className="pt-2">{/* Footer content if needed */}</DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
        : <PermissionAlert onBack={() => router.push("/admin/dashboard") } />
      }
    </div>

  )
}
