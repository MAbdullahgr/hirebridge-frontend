'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/componants/Navbar/Navbar'
import FooterWrapper from '@/componants/Footer/FooterWrapper'
import LoadingScreen from '@/componants/common/LoadingScreen'
import api from '@/componants/lib/axios'

export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me', { withCredentials: true })
        if (res.data?.user) {
          setStatus('auth')
        } else {
          setStatus('unauth')
        }
      } catch {
        setStatus('unauth')
      }
    }

    checkAuth()
  }, [])

  // ⛔ Don’t call router.replace() directly in render
  useEffect(() => {
    if (status === 'unauth') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'loading' || status === 'unauth') {
    // ✅ Only show spinner during check or redirect
    return <LoadingScreen />
  }

  return (
    <div>
      <Navbar />
      <div className='!pt-20'>{children}</div>
      <FooterWrapper />
    </div>
  )
}
