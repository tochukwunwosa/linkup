'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminSchema } from '@/lib/validations/admin'



export default async function createAdmin(formData: FormData) {
  const supabase = createServerComponentClient({ cookies })
  const user = (await supabase.auth.getUser()).data.user

  // 1. Check if current user is super-admin
  const { data: profile } = await supabase
    .from('admins')
    .select('role')
    .eq('id', user?.id)
    .single()

  if (profile?.role !== 'super-admin') {
    throw new Error('Only super admins can create other admins.')
  }

  // 2. Parse and validate input
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    created_at: formData.get('created_at')
  }

  const parsed = createAdminSchema.safeParse(raw)

  if (!parsed.success) {
    throw new Error('Invalid form data')
  }

  const { name, email, role } = parsed.data

  // 3. Insert into Supabase
  const { error } = await supabase.from('admins').insert({
    name,
    email,
    role,

    invited_by: user?.email,
  })

  if (error) {
    console.error(error)
    throw new Error('Failed to create admin.')
  }

  redirect('/admin/dashboard')
}
