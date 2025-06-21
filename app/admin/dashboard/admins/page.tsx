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
import { UpdateAdminFormValues } from "@/lib/validations/admin"
import { Admin } from "@/types"
import { getAllActiveAdmin } from "@/app/actions/admin/getAllActiveAdmin"
import { toast } from "sonner"

export default function AdminsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingAdmin, setEditingAdmin] = useState<UpdateAdminFormValues | null>(null)
  const isMobile = useIsMobile()
  const [admins, setAdmins] = useState<Admin[]>([])

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
    fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = admins.filter(
    (admin: Admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateAdmin = () => {
    setEditingAdmin(null)
    setIsDrawerOpen(true)
  }

  const handleEditAdmin = (admin: UpdateAdminFormValues) => {
    setEditingAdmin(admin)
    setIsDrawerOpen(true)
  }

  const handleDeleteAdmin = (id: string) => {
    // In a real app, this would call an API to delete the admin
    console.log(`Delete admin with ID: ${id}`)
  }

  // const handleAdminSubmit = async (data: CreateAdminFormValues) => {
  //   try {
  //     if (data.id) {
  //       // Update existing admin
  //       const { error } = await updateAdmin(data); // You need to define this function

  //       if (error) {
  //         toast.error(error);
  //       } else {
  //         toast.success("Admin updated successfully!");
  //         setIsDrawerOpen(false);
  //         // Optionally: refetch
  //       }
  //     } else {
  //       // Create new admin
  //       const res = await createSuperAdmin(data); // This calls supabase.auth.admin.createUser

  //       if (res?.error) {
  //         toast.error(res.error);
  //       } else {
  //         toast.success("Admin created successfully!");
  //         setIsDrawerOpen(false);
  //         // Optionally: refetch
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //     toast.error("An error occurred while saving admin");
  //   }
  // };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Admins</h1>
        <Button onClick={handleCreateAdmin} className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader>
            <DrawerTitle>{editingAdmin ? "Edit Admin" : "Add New Admin"}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto">
            <AdminForm
              initialData={editingAdmin}
              onSubmit={() => setIsDrawerOpen(false)}
              onCancel={() => setIsDrawerOpen(false)}
            />
          </div>
          <DrawerFooter className="pt-2">{/* Footer content if needed */}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
