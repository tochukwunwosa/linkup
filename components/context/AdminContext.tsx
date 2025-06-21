'use client'

import { Admin } from '@/types'
import { createContext, useContext } from 'react'

const AdminContext = createContext<Admin | null>(null)

export function useAdmin() {
  const admin = useContext(AdminContext)
  if (!admin) throw new Error("useAdmin must be used within <AdminProvider>")
  return admin
}

export function AdminProvider({
  admin,
  children,
}: {
  admin: Admin
  children: React.ReactNode
}) {
  return <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
}
