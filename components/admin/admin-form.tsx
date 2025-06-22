"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

import { adminFormSchema, AdminFormValues } from "@/lib/validations/admin"
import { toast } from "sonner"
import { createAdmin } from "@/app/actions/admin/createAdmin"
import { updateAdmin } from "@/app/actions/admin/updateAdmin"
import { useTransition } from "react"

interface AdminFormProps {
  initialData?: Partial<AdminFormValues> | null
  onSubmit: () => void
  onCancel: () => void
}

export function AdminForm({ initialData, onSubmit, onCancel }: AdminFormProps) {
  const [isPending, startTransition] = useTransition()
  const isEditing = !!initialData

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || "admin",
      password: "",
    },
  })

  const handleSubmit = async (data: AdminFormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          const result = await updateAdmin(initialData.id, data);
          if ("error" in result) {
            toast.error(result.error);
          } else {
            toast.success("Admin created successfully!");
            onSubmit();
          }
        } else {
          const result = await createAdmin(data);
          if ('error' in result) {
            toast.error(result.error);
          } else {
            toast.success("Admin created successfully!");
            onSubmit();
          }
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An unexpected error occurred"
        );
      }
    });
  };


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4 max-w-md mx-auto"
      >

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="super_admin" id="super-admin" />
                    <Label htmlFor="super-admin">Super Admin</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEditing ? "New Password (optional)" : "Password"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={
                    isEditing ? "Leave blank to keep current password" : "Enter password"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-secondary"
            disabled={isPending}
          >
            {isPending ? "Processing..." : (isEditing ? "Update Admin" : "Add Admin")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
