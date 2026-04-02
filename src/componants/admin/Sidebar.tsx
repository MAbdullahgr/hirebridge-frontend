'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { FiMenu, FiX, FiChevronLeft } from 'react-icons/fi'
import api from '@/componants/lib/axios'

interface SidebarLink {
  label: string
  href: string
}

interface SidebarProps {
  title?: string
  links: SidebarLink[]
  onLogout?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  title = 'Admin Panel',
  links,
  onLogout,
}) => {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false) // mobile drawer
  const [collapsed, setCollapsed] = useState(false) // md+ rail collapse
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Focus first link when drawer opens (accessibility)
  useEffect(() => {
    if (drawerOpen && firstLinkRef.current) {
      const t = setTimeout(() => firstLinkRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [drawerOpen])

  // ESC to close mobile drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  // Prevent body scroll when drawer open (mobile)
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  // Logout
  const handleLogout = async () => {
    if (isLoggingOut) return
    try {
      setIsLoggingOut(true)
      await api.post('/auth/logout')
      onLogout?.()
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Logout failed. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Helpers
  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Floating menu button (mobile only) */}
      <button
        type='button'
        className='md:hidden fixed top-3 left-3 z-[60] rounded-md bg-[#141313] text-white shadow-md hover:bg-[#2a2a2a] transition-colors !p-2'
        onClick={() => setDrawerOpen(true)}
        aria-label='Open sidebar'
      >
        <FiMenu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={[
          'group bg-[#141313] text-white shadow-xl transition-all duration-300 ease-in-out',
          'fixed md:sticky md:top-0 h-[100dvh] w-[85%] max-w-[320px] z-50',
          drawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          collapsed ? 'md:w-20 lg:w-20 xl:w-24' : 'md:w-64 lg:w-72 xl:w-72',
          'flex flex-col justify-between',
        ].join(' ')}
        role='navigation'
        aria-label='Admin navigation'
      >
        {/* Top brand and controls */}
        <div className='border-b border-[#2a2a2a] flex items-center justify-between !px-4 !py-4'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold uppercase'>
              {(title || 'A').charAt(0)}
            </div>
            {/* Title hidden when collapsed on md+ */}
            <h2
              className={[
                'text-lg font-bold truncate',
                collapsed ? 'hidden md:hidden' : '',
              ].join(' ')}
              title={title}
            >
              {title}
            </h2>
          </div>

          <div className='flex items-center gap-2'>
            {/* Collapse toggle (md+) */}
            <button
              type='button'
              className='hidden md:inline-flex items-center justify-center rounded-md hover:bg-[#2a2a2a] transition-colors !p-2'
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <FiChevronLeft
                size={18}
                className={`transition-transform ${
                  collapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
            {/* Close (mobile only) */}
            <button
              type='button'
              className='md:hidden inline-flex items-center justify-center rounded-md hover:bg-[#2a2a2a] transition-colors !p-2'
              onClick={() => setDrawerOpen(false)}
              aria-label='Close sidebar'
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Links */}
        <nav className='flex-1 overflow-y-auto !px-3 !py-4'>
          <ul className='flex flex-col gap-1'>
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  ref={index === 0 ? firstLinkRef : null}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  title={collapsed ? link.label : undefined}
                  className={[
                    'flex items-center gap-3 rounded-md font-medium transition-all duration-200',
                    '!px-3 !py-2.5',
                    isActive(link.href)
                      ? 'bg-[#575b7b] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white',
                    'focus:outline-none focus:ring-2 focus:ring-[#575b7b] focus:ring-offset-2 focus:ring-offset-[#141313]',
                  ].join(' ')}
                >
                  {/* Monogram icon (since links have no dedicated icons) */}
                  <span className='h-8 w-8 rounded-md bg-white/10 flex items-center justify-center text-xs font-semibold uppercase'>
                    {link.label.charAt(0)}
                  </span>
                  {/* Label hidden when collapsed on md+ */}
                  <span className={collapsed ? 'hidden md:hidden' : ''}>
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className='border-t border-[#2a2a2a] !px-4 !py-4'>
          <button
            type='button'
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={[
              'w-full rounded-md transition-all duration-200 font-medium',
              '!px-4 !py-2.5',
              'focus:outline-none focus:ring-2 focus:ring-[#c0392b] focus:ring-offset-2 focus:ring-offset-[#141313]',
              isLoggingOut
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-[#e74c3c] text-white hover:bg-[#c0392b] cursor-pointer',
            ].join(' ')}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-[1px] z-40 md:hidden'
          onClick={() => setDrawerOpen(false)}
          aria-hidden='true'
        />
      )}
    </>
  )
}

export default Sidebar
