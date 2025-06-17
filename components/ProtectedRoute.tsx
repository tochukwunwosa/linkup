// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { createClient } from '@/lib/supabase'
// import { isAdmin } from '@/lib/auth'

// interface ProtectedRouteProps {
//   children: React.ReactNode
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const router = useRouter()
//   const supabase = createClient()

//   useEffect(() => {
//     const checkAuth = async () => {
//       const { data: { session } } = await supabase.auth.getSession()
      
//       if (!session) {
//         router.push('/auth/signin')
//         return
//       }

//       const hasAdminAccess = await isAdmin()
//       if (!hasAdminAccess) {
//         router.push('/')
//       }
//     }

//     checkAuth()
//   }, [])

//   return <>{children}</>
// }