'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import api from '@/componants/lib/axios'

export const useAuthRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me', { withCredentials: true })
        if (!res.data?.user) {
          toast.error('Please log in to access your profile.')
          router.replace('/login')
        }
      } catch {
        toast.error('Please log in to access your profile.')
        router.replace('/login')
      }
    }

    checkAuth()
  }, [router])
}
