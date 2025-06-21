"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAdmin } from "@/components/context/AdminContext"

export default function SettingsPage() {
  const admin = useAdmin()
  const router = useRouter()

  const isSuperAdmin = admin.role === "super_admin"

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push("/admin/dashboard")
    }
  }, [isSuperAdmin, router])

  if (!isSuperAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4 stroke-red-500" />
        <AlertTitle className="font-medium text-red-500">Permission Required</AlertTitle>
        <AlertDescription className="text-sm">
          Only Super Admins can change passwords. Please contact a Super Admin if you need to reset your password.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader title="Settings" description="Manage your account settings and preferences" />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="LinkUp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input id="site-description" defaultValue="A curated tech events platform" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="contact@linkup.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email notifications for new events</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Event Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive reminders before events start</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact View</p>
                  <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
