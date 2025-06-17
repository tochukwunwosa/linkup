"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { AdminForm } from "@/components/admin/admin-form"
import { Search, UserPlus } from "lucide-react"
import { AdminsTable } from "@/components/admin/admins-table"
import { AdminsCardView } from "@/components/admin/admins-card-view"
import { useIsMobile } from "@/hooks/use-mobile"
import { AdminUpdate, parsedAdmins } from "@/lib/validations/admin"

export default function AdminsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingAdmin, setEditingAdmin] = useState<AdminUpdate | null>(null)
  const isMobile = useIsMobile()

  const filteredAdmins = parsedAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateAdmin = () => {
    setEditingAdmin(null)
    setIsDrawerOpen(true)
  }

  const handleEditAdmin = (admin: AdminUpdate) => {
    setEditingAdmin(admin)
    setIsDrawerOpen(true)
  }

  const handleDeleteAdmin = (id: number) => {
    // In a real app, this would call an API to delete the admin
    console.log(`Delete admin with ID: ${id}`)
  }

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
