"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfilePicture } from "@/components/admin/profile/profile-picture"
import { SecuritySettings } from "@/components/admin/profile/security-settings"
import { ProfileForm } from "@/components/admin/profile/profile-form"
import { mockAdmins } from "@/lib/mock-data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function ProfilePage() {
  const user = mockAdmins[1] // Simulating the logged-in user

  const isSuperAdmin = user.role === "super_admin"

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader title="Profile" description="Manage your account information" />

      <div className="grid gap-6 md:grid-cols-7">
        {/* Profile Sidebar */}
        <Card className="md:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ProfilePicture user={user} />
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                  {user.role}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <div className="md:col-span-5">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-6">
              {/* general information */}
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm user={user} isSuperAdmin={isSuperAdmin} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="mt-6">
              {/* security settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your security preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <SecuritySettings user={user} isSuperAdmin={isSuperAdmin} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="mt-6">
              {/* preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your dashboard experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure how you receive notifications and updates
                      </p>
                      <p className="text-sm text-muted-foreground italic">Coming soon...</p>
                    </div>
                  </div>
                </CardContent>
                {/* preferences footer */}
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Preferences are automatically saved when you make changes.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
