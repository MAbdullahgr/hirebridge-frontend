'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavbarLinks from './NavbarLinks'
import { useRouter } from 'next/navigation'
import {
  MdDashboard,
  MdLogout,
  MdMenu,
  MdClose,
  MdWork,
  MdSchool,
  MdFolder,
  MdBusiness,
  MdContactMail,
  MdInfo,
} from 'react-icons/md'
import { FaUser, FaChevronRight } from 'react-icons/fa'
import { HiUserCircle } from 'react-icons/hi'
import { IoMdPulse } from 'react-icons/io'
import api from '@/componants/lib/axios'
import { toast } from 'react-hot-toast'

const Navbar = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    { name: 'About', icon: MdInfo, path: '/about' },
    { name: 'Jobs', icon: MdWork, path: '/jobs' },
    { name: 'Internship', icon: MdSchool, path: '/internship' },
    { name: 'Projects', icon: MdFolder, path: '/projects' },
    { name: 'Services', icon: MdBusiness, path: '/services' },
    { name: 'Contact', icon: MdContactMail, path: '/contact' },
  ]

  // Logout function
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (err: unknown) {
      // Type guard to safely access response
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Logout failed')
      }
    }
  }

  const [user, setUser] = useState<null | {
    username: string
    email: string
    role: string
    avatar?: {
      url: string
    }
  }>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me') // your backend route
        setUser(data.user)
      } catch (err) {
        console.error('Failed to fetch user', err)
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  if (!user) {
    return null // or show a spinner if you like
  }

  return (
    <>
      <nav className='w-full h-16 md:h-20 shadow-sm fixed top-0 left-0 z-[1000] bg-white/90 backdrop-blur-xl border-b border-gray-200/50'>
        <div className='!px-4 sm:!px-6 lg:!px-8 h-full'>
          <div className='flex justify-between items-center h-full'>
            {/* Logo */}
            <Link href='/' className='flex items-center group'>
              <div className='relative'>
                <Image
                  src='/images/navlgo.png'
                  alt='Logo'
                  width={155}
                  height={50}
                  priority
                  className='w-28 xs:w-32 sm:w-36 md:w-40 lg:w-44 xl:w-[155px] h-auto object-contain transition-all duration-500 ease-out group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-r from-[#322370]/0 to-[#4a3580]/0 group-hover:from-[#322370]/10 group-hover:to-[#4a3580]/10 rounded-lg transition-all duration-500 -z-10 scale-110 blur-xl'></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center gap-6 xl:gap-8'>
              <NavbarLinks />

              <div className='flex items-center gap-3'>
                {/* <Link
                  href='/login'
                  className='relative overflow-hidden bg-gradient-to-r from-[#322370] to-[#4a3580] text-white font-medium rounded-full !px-5 xl:!px-6 !py-2 xl:!py-2.5 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:from-[#4a3580] hover:to-[#5a4590] group'
                >
                  <span className='relative z-10 flex items-center gap-2 text-sm xl:text-base'>
                    Login
                    <HiSparkles className='w-4 h-4 animate-pulse' />
                  </span>
                  <div className='absolute inset-0 bg-gradient-to-r from-[#5a4590] to-[#6a55a0] opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                </Link> */}

                {/* Profile Dropdown */}
                <div
                  className='relative'
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button className='relative group/profile cursor-pointer'>
                    <div className='relative w-10 h-10 xl:w-11 xl:h-11 rounded-full overflow-hidden ring-2 ring-[#322370]/20 ring-offset-2 ring-offset-white transition-all duration-500 hover:ring-[#322370]/40 hover:ring-offset-3 hover:scale-110'>
                      {user.avatar ? (
                        <Image
                          src={user.avatar.url}
                          alt={user.username}
                          width={44}
                          height={44}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-gradient-to-br from-[#322370] to-[#4a3580] flex items-center justify-center'>
                          <HiUserCircle className='w-7 h-7 xl:w-8 xl:h-8 text-white' />
                        </div>
                      )}
                    </div>
                    <span className='absolute -bottom-0.5 -right-0.5 flex h-3 w-3'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white'></span>
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-14 right-0 transition-all duration-500 ease-out transform ${
                      isProfileOpen
                        ? 'visible opacity-100 translate-y-0'
                        : 'invisible opacity-0 -translate-y-4'
                    }`}
                  >
                    <div className='absolute -top-2 right-4 w-4 h-4 bg-white/95 backdrop-blur-xl transform rotate-45 border-l border-t border-gray-200/50'></div>
                    <div className='bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl w-72 !mt-2 border border-gray-200/50 overflow-hidden'>
                      {/* User Header */}
                      <div className='relative !px-6 !py-5 border-b border-gray-200/50 bg-gradient-to-br from-[#322370]/5 via-purple-50 to-transparent'>
                        <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#322370]/10 to-transparent rounded-full blur-2xl'></div>
                        <div className='absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#4a3580]/10 to-transparent rounded-full blur-xl'></div>

                        <div className='relative flex items-center gap-4'>
                          <div className='relative'>
                            <div className='w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#322370]/20 ring-offset-2 shadow-lg'>
                              {user.avatar ? (
                                <Image
                                  src={user.avatar.url}
                                  alt={user.username}
                                  width={56}
                                  height={56}
                                  className='w-full h-full object-cover'
                                />
                              ) : (
                                <div className='w-full h-full bg-gradient-to-br from-[#322370] to-[#4a3580] flex items-center justify-center'>
                                  <span className='text-white text-xl font-bold'>
                                    {user.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className='absolute -bottom-1 -right-1 flex h-4 w-4'>
                              <IoMdPulse className='absolute inline-flex h-full w-full text-green-500 animate-ping' />
                              <span className='relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white'></span>
                            </span>
                          </div>

                          <div className='flex-1'>
                            <p className='text-base font-bold text-gray-900'>
                              {user.username}
                            </p>
                            <span className='inline-flex items-center gap-1 !mt-2 !px-2 !py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#322370]/10 to-[#4a3580]/10 text-[#322370]'>
                              <span className='w-1.5 h-1.5 bg-[#322370] rounded-full'></span>
                              {user.role === 'admin' ? 'Administrator' : 'User'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className='!py-2'>
                        {user.role === 'admin' && (
                          <Link
                            href='/admin'
                            className='flex items-center justify-between !px-6 !py-3.5 hover:bg-gradient-to-r hover:from-[#322370]/5 hover:to-transparent transition-all duration-300 text-gray-700 hover:text-[#322370] group/item'
                          >
                            <div className='flex items-center gap-3'>
                              <div className='!p-2 rounded-lg bg-gradient-to-br from-[#322370]/10 to-[#4a3580]/10 group-hover/item:from-[#322370]/20 group-hover/item:to-[#4a3580]/20 transition-all duration-300'>
                                <MdDashboard className='w-4 h-4 text-[#322370]' />
                              </div>
                              <span className='font-medium'>
                                Admin Dashboard
                              </span>
                            </div>
                            <FaChevronRight className='w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300' />
                          </Link>
                        )}

                        <Link
                          href='/me'
                          className='flex items-center justify-between !px-6 !py-3.5 hover:bg-gradient-to-r hover:from-[#322370]/5 hover:to-transparent transition-all duration-300 text-gray-700 hover:text-[#322370] group/item'
                        >
                          <div className='flex items-center gap-3'>
                            <div className='!p-2 rounded-lg bg-gradient-to-br from-[#322370]/10 to-[#4a3580]/10 group-hover/item:from-[#322370]/20 group-hover/item:to-[#4a3580]/20 transition-all duration-300'>
                              <FaUser className='w-3.5 h-3.5 text-[#322370]' />
                            </div>
                            <span className='font-medium'>My Profile</span>
                          </div>
                          <FaChevronRight className='w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300' />
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className='relative !p-1'>
                        <div className='absolute inset-0 bg-gradient-to-r from-red-200 via-red-100 to-red-200 opacity-50'></div>
                        <button
                          onClick={handleLogout}
                          className='relative flex items-center justify-between w-full !px-6 !py-3.5 bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all duration-300 text-gray-700 hover:text-red-600 group/item'
                        >
                          <div className='flex items-center gap-3'>
                            <div className='!p-2 rounded-lg bg-red-50 group-hover/item:bg-red-100 transition-all duration-300'>
                              <MdLogout className='w-4 h-4 text-red-500' />
                            </div>
                            <span className='font-medium'>Sign Out</span>
                          </div>
                          <FaChevronRight className='w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className='lg:hidden flex items-center gap-2 sm:gap-3'>
              <button
                className='relative hover:scale-105 transition-transform duration-300'
                onClick={() => alert('Profile clicked')}
              >
                <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-[#322370]/20 ring-offset-1'>
                  {user.avatar ? (
                    <Image
                      src={user.avatar.url}
                      alt={user.username}
                      width={36}
                      height={36}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-gradient-to-br from-[#322370] to-[#4a3580] flex items-center justify-center'>
                      <HiUserCircle className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
                    </div>
                  )}
                </div>
                <span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white'></span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-300'
                aria-label='Toggle menu'
              >
                {isMobileMenuOpen ? (
                  <MdClose className='w-6 h-6 text-gray-700' />
                ) : (
                  <MdMenu className='w-6 h-6 text-gray-700' />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[999] transition-all duration-500 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-full xs:w-80 sm:w-96 bg-white/98 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='flex flex-col h-full'>
            {/* User Info */}
            <div className='relative !px-5 sm:!px-6 !py-5 sm:!py-6 border-b border-gray-200/50 bg-gradient-to-br from-[#322370]/10 via-purple-50 to-transparent'>
              <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#322370]/10 to-transparent rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#4a3580]/10 to-transparent rounded-full blur-2xl'></div>

              <div className='relative flex items-center gap-3 sm:gap-4'>
                <div className='relative'>
                  <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-[#322370]/20 ring-offset-2 shadow-xl'>
                    {user.avatar ? (
                      <Image
                        src={user.avatar.url}
                        alt={user.username}
                        width={64}
                        height={64}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full bg-gradient-to-br from-[#322370] to-[#4a3580] flex items-center justify-center'>
                        <span className='text-white text-xl sm:text-2xl font-bold'>
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className='absolute -bottom-1 -right-1 flex h-4 w-4'>
                    <IoMdPulse className='absolute inline-flex h-full w-full text-green-500 animate-ping' />
                    <span className='relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white'></span>
                  </span>
                </div>

                <div className='flex-1 min-w-0'>
                  <p className='text-base sm:text-lg font-bold text-gray-900 truncate'>
                    {user.username}
                  </p>
                  <span className='inline-flex items-center gap-1 !mt-2 !px-2 sm:!px-3 !py-0.5 sm:!py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#322370]/10 to-[#4a3580]/10 text-[#322370]'>
                    <span className='w-1.5 h-1.5 bg-[#322370] rounded-full animate-pulse'></span>
                    {user.role === 'admin' ? 'Administrator' : 'User Account'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className='flex-1 overflow-y-auto !py-4 sm:!py-6'>
              <nav className='!px-3 sm:!px-4 space-y-1'>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className='flex items-center justify-between !px-3 sm:!px-4 !py-3.5 sm:!py-4 rounded-xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-[#322370]/10 hover:to-transparent hover:text-[#322370] active:from-[#322370]/15 transition-all duration-300 group/nav'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='!p-1.5 sm:!p-2 rounded-lg bg-gradient-to-br from-[#322370]/10 to-[#4a3580]/10 group-hover/nav:from-[#322370]/20 group-hover/nav:to-[#4a3580]/20 transition-all duration-300'>
                          <Icon className='w-4 h-4 sm:w-5 sm:h-5 text-[#322370]' />
                        </div>
                        <span className='text-sm sm:text-base'>
                          {item.name}
                        </span>
                      </div>
                      <FaChevronRight className='w-3 h-3 opacity-0 -translate-x-2 group-hover/nav:opacity-100 group-hover/nav:translate-x-0 transition-all duration-300' />
                    </Link>
                  )
                })}

                <div className='!my-3 sm:!my-4 border-t border-gray-200/50'></div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className='flex items-center justify-center gap-2 sm:gap-3 w-full !px-4 sm:!px-5 !py-3 sm:!py-3.5 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 text-red-600 font-medium hover:from-red-100 hover:to-red-100 active:scale-[0.98] transition-all duration-300 group'
                >
                  <MdLogout className='w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500' />
                  <span className='text-sm sm:text-base'>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
