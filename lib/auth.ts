import { supabase } from './supabase'

export type Role = 'super_admin' | 'admin'

export const checkUserRole = async (): Promise<Role | null> => {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  return profile?.role || null
}

export const isAdmin = async (): Promise<boolean> => {
  const role = await checkUserRole()
  return role === 'admin' || role === 'super_admin'
}

export const isSuperAdmin = async (): Promise<boolean> => {
  const role = await checkUserRole()
  return role === 'super_admin'
}