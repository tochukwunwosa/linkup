"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Admin } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface AdminsTableProps {
  admins: Admin[]
  onEdit: (admin: Admin) => void
  onDelete: (id: string) => void
}

export function AdminsTable({ admins, onEdit, onDelete }: AdminsTableProps) {
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={admin.role === "super_admin" ? "default" : "outline"}
                      className={admin.role === "super_admin" ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" : ""}
                    >
                      {admin.role}
                    </Badge>
                  </TableCell>
                  {/* format the date e.g 26 June 2025 at 9:06 PM */}
                  <TableCell>{admin.last_login ?
                    new Date(admin.last_login).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).replace(",", "")
                      .replace(" at", " at")
                    : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(admin)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedAdmin(admin)} className="group text-destructive/80 group-hover:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!selectedAdmin} onOpenChange={(open) => !open && setSelectedAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to delete "${selectedAdmin?.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAdmin(null)} className='cusoe-poim'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedAdmin) {
                  onDelete(selectedAdmin.id)
                  setSelectedAdmin(null)
                }
              }}
              className="ring ring-destructive bg-transparent text-destructive hover:bg-destructive hover:text-neutral-100 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}
