"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Mail, Clock } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Admin } from "@/types"
import { AdminFormValues } from "@/lib/validations/admin"

interface AdminsCardViewProps {
  admins: Admin[]
  onEdit: (admin: AdminFormValues) => void
  onDelete: (id: string) => void
}

export function AdminsCardView({ admins, onEdit, onDelete }: AdminsCardViewProps) {
  return (
    <div className="grid gap-4">
      {admins.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No admins found</div>
      ) : (
        admins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{admin.name}</h3>
                <Badge
                  variant={admin.role === "super_admin" ? "default" : "outline"}
                  className={admin.role === "super_admin" ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" : ""}
                >
                  {admin.role}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-2" />
                  {admin.email}
                </div>
                {/* format the date e.g 26 June 2025 at 9:06 PM */}
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-2" />
                  {`Last login: ${admin.last_login ?
                    new Date(admin.last_login).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).replace(",", "").replace(" at", " at")
                    : "Never"}`}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(admin)} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive/70 hover:text-destructive hover:bg-transparent cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Admin</AlertDialogTitle>
                    <AlertDialogDescription>
                      {`Are you sure you want to delete "{admin.name}"? This action cannot be undone.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(admin.id)} className="cursor-pointer bg-destructive/70 hover:bg-destructive">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}
