'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BsGenderAmbiguous, BsShieldX } from 'react-icons/bs'
import { HiOutlineCake, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { MdVerified, MdWorkOutline, MdDateRange } from 'react-icons/md'
import { FiEdit3 } from 'react-icons/fi'
import api from '@/componants/lib/axios'
import { toast } from 'react-hot-toast'
import { isAxiosError } from '../lib/utils'
import { useAuthRedirect } from '../hook/useAuthRedirect'

interface Avatar {
  url: string
  public_id: string
}

interface User {
  _id: string
  avatar?: Avatar
  username: string
  email: string
  phone?: string
  dob?: string
  gender?: string
  role: string
  isVerified: boolean
  createdAt: string
}

interface EditFormData {
  username: string
  phone: string
  dob: string
  gender: string
  avatar: File | null
}

const UserProfile: React.FC = () => {
  useAuthRedirect()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [formData, setFormData] = useState<EditFormData>({
    username: '',
    phone: '',
    dob: '',
    gender: '',
    avatar: null,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me', { withCredentials: true })
        setUser(res.data.user)
      } catch (err: unknown) {
        if (isAxiosError(err))
          toast.error(err.response?.data?.message || 'Something went wrong')
        else if (err instanceof Error) toast.error(err.message)
        else toast.error('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // ✅ Update profile
  const updateUserProfile = async (data: EditFormData) => {
    try {
      setUpdating(true)

      const formDataToSend = new FormData()
      formDataToSend.append('username', data.username)
      if (data.phone) formDataToSend.append('phone', data.phone)
      if (data.dob) formDataToSend.append('dob', data.dob)
      if (data.gender) formDataToSend.append('gender', data.gender)
      if (data.avatar) formDataToSend.append('avatar', data.avatar)

      const res = await api.put('/auth/updateprofile', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUser(res.data.user)
      toast.success('Profile updated successfully!')
      setIsEditOpen(false)
    } catch (err: unknown) {
      if (isAxiosError(err))
        toast.error(err.response?.data?.message || 'Update failed')
      else if (err instanceof Error) toast.error(err.message)
      else toast.error('Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getAge = (dob?: string): string => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    )
      age--
    return `${age} years`
  }

  const getInitials = (name: string): string =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  if (loading)
    return (
      <div className='flex justify-center items-center !h-screen text-lg font-semibold text-gray-700'>
        Loading profile...
      </div>
    )

  if (!user)
    return (
      <div className='flex justify-center items-center !h-screen text-lg font-semibold text-gray-700'>
        Failed to load user profile.
      </div>
    )

  return (
    <>
      {isEditOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-3xl w-full max-w-md !p-6 relative shadow-2xl'>
            <h2 className='text-2xl font-bold !mb-6 text-center text-gray-800'>
              Edit Profile
            </h2>

            <button
              className='absolute top-3 right-3 text-2xl text-red-500 hover:text-red-800 transition'
              onClick={() => setIsEditOpen(false)}
            >
              ✕
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateUserProfile(formData)
              }}
              className='flex flex-col gap-4'
            >
              <input
                type='text'
                placeholder='Username'
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className='border rounded-lg !p-3 w-full focus:ring-2 focus:ring-indigo-400 transition'
                required
              />

              <input
                type='tel'
                placeholder='Phone'
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='border rounded-lg !p-3 w-full focus:ring-2 focus:ring-indigo-400 transition'
              />

              <input
                type='date'
                placeholder='Date of Birth'
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className='border rounded-lg !p-3 w-full focus:ring-2 focus:ring-indigo-400 transition cursor-pointer'
              />

              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className='border rounded-lg !p-3 w-full focus:ring-2 focus:ring-indigo-400 transition cursor-pointer'
              >
                <option value=''>Select Gender</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>

              <input
                type='file'
                accept='image/*'
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avatar: e.target.files ? e.target.files[0] : null,
                  })
                }
                className='border rounded-lg !p-2 w-full cursor-pointer'
              />

              <button
                type='submit'
                disabled={updating}
                className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white !py-3 rounded-lg hover:scale-105 transform transition-all shadow-md cursor-pointer'
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className='min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex justify-center items-center !py-12 !px-4'>
        <div className='relative max-w-4xl w-full bg-white/80 backdrop-blur-lg rounded-3xl border border-indigo-100 shadow-2xl transition-all duration-300 hover:shadow-indigo-300/50 hover:-translate-y-1 !p-10'>
          <div className='absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl' />

          <div className='absolute top-5 right-5 text-white/80 hover:text-white transition-all cursor-pointer'>
            <FiEdit3
              size={22}
              onClick={() => {
                setFormData({
                  username: user.username || '',
                  phone: user.phone || '',
                  dob: user.dob ? user.dob.split('T')[0] : '',
                  gender: user.gender || '',
                  avatar: null,
                })
                setIsEditOpen(true)
              }}
            />
          </div>

          <div className='relative flex flex-col items-center mt-28'>
            <div className='relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl'>
              {user.avatar?.url && !imageError ? (
                <Image
                  src={user.avatar.url}
                  alt={user.username}
                  fill
                  className='object-cover'
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className='w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center'>
                  <span className='text-5xl font-bold text-white'>
                    {getInitials(user.username)}
                  </span>
                </div>
              )}
            </div>

            <h2 className='!mt-6 text-3xl font-bold text-gray-800 flex items-center gap-2'>
              {user.username}
              {user.isVerified ? (
                <MdVerified className='text-blue-500 text-2xl' />
              ) : (
                <BsShieldX className='text-red-500 text-lg' />
              )}
            </h2>

            <p className='text-sm text-gray-500 capitalize tracking-wide'>
              {user.role}
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 !mt-12 text-gray-700'>
            {[
              {
                icon: <HiOutlineMail className='text-indigo-500' size={20} />,
                label: 'Email',
                value: user.email,
              },
              {
                icon: <HiOutlinePhone className='text-indigo-500' size={20} />,
                label: 'Phone',
                value: user.phone || 'N/A',
              },
              {
                icon: (
                  <BsGenderAmbiguous className='text-indigo-500' size={20} />
                ),
                label: 'Gender',
                value: user.gender || 'N/A',
              },
              {
                icon: <HiOutlineCake className='text-indigo-500' size={20} />,
                label: 'Date of Birth',
                value: formatDate(user.dob),
              },
              {
                icon: <MdWorkOutline className='text-indigo-500' size={20} />,
                label: 'Role',
                value: user.role,
              },
              {
                icon: <MdDateRange className='text-indigo-500' size={20} />,
                label: 'Member Since',
                value: formatDate(user.createdAt),
              },
            ].map((item, index) => (
              <div
                key={index}
                className='flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl !p-4 border border-indigo-100 hover:bg-indigo-50/70 hover:shadow-md transition-all duration-200'
              >
                {item.icon}
                <div>
                  <p className='text-sm text-gray-500'>{item.label}</p>
                  <p className='font-medium text-gray-800'>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {user.dob && (
            <div className='!mt-10 text-center text-gray-600'>
              🎂 You are{' '}
              <span className='font-semibold text-indigo-600'>
                {getAge(user.dob)}
              </span>{' '}
              old.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfile
