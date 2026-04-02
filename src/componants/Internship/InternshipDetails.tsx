'use client'
import React, { useState, useEffect } from 'react'
import { Internship } from '@/componants/types/Internship'
import {
  BsClockHistory,
  BsArrowLeft,
  BsShare,
  BsLinkedin,
  BsTwitter,
  BsLink45Deg,
  BsCheckCircle,
  BsXCircle,
} from 'react-icons/bs'
import {
  FiMapPin,
  FiMonitor,
  FiUsers,
  FiHome,
  FiDollarSign,
  FiExternalLink,
} from 'react-icons/fi'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import { MdWorkspacePremium } from 'react-icons/md'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import api from '../lib/axios'

async function getInternshipById(id: string): Promise<Internship | null> {
  try {
    const res = await api.get(`/internships/${id}`)
    const d = res.data

    if (!d) return null

    if (d.internship && typeof d.internship === 'object') return d.internship
    if (d.data && d.data.internship) return d.data.internship
    if (d.success && d.internship) return d.internship

    if (d.data && (d.data._id || d.data.id)) return d.data as Internship

    if (Array.isArray(d.internships)) {
      const found = d.internships.find(
        (it: { _id?: string; id?: string }) =>
          it._id === id || it.id === id || String(it._id) === String(id)
      )
      if (found) return found
      if (d.internships.length === 1) return d.internships[0]
    }

    if (d._id || d.id) return d as Internship

    try {
      const listRes = await api.get(`/internships`)
      const list = listRes.data?.internships || listRes.data
      if (Array.isArray(list)) {
        const found = list.find(
          (it: { _id?: string; id?: string }) =>
            it._id === id || it.id === id || String(it._id) === String(id)
        )
        if (found) return found
      }
    } catch (e) {
      console.debug('fallback list fetch failed', e)
    }

    console.warn(
      'getInternshipById: Could not normalize response to internship object'
    )
    return null
  } catch (error) {
    console.error('Error fetching internship:', error)
    return null
  }
}

export default function InternshipDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true

    const fetchInternship = async () => {
      setLoading(true)
      const data = await getInternshipById(id as string)
      if (!mounted) return
      setInternship(data)
      setLoading(false)
    }

    fetchInternship()
    const interval = setInterval(fetchInternship, 10000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [id])

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try {
        await navigator.share({
          title: internship?.title || 'Internship opportunity',
          text: `Check out this ${internship?.title || 'internship'} at ${
            internship?.companyName || ''
          }`,
          url: url,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareOnLinkedIn = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      '_blank'
    )
  }

  const shareOnTwitter = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `Check out this ${internship?.title || 'internship'} at ${
      internship?.companyName || ''
    }`
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'remote':
        return <FiMonitor className='w-5 h-5' />
      case 'hybrid':
        return <FiUsers className='w-5 h-5' />
      case 'onsite':
        return <FiHome className='w-5 h-5' />
      default:
        return <FiHome className='w-5 h-5' />
    }
  }

  const formatDuration = (weeks: number) => {
    if (!weeks && weeks !== 0) return ''
    if (weeks < 4) {
      return `${weeks} weeks`
    } else if (weeks < 52) {
      const months = Math.floor(weeks / 4)
      return months === 1 ? '1 month' : `${months} months`
    } else {
      const years = Math.floor(weeks / 52)
      return years === 1 ? '1 year' : `${years} years`
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50'>
        <div className='max-w-6xl mx-auto !px-4 sm:!px-6 lg:!px-8 !py-8'>
          <div className='animate-pulse'>
            <div className='bg-white rounded-3xl shadow-xl overflow-hidden'>
              <div className='h-64 bg-gradient-to-r from-gray-200 to-gray-300'></div>
              <div className='!p-8 space-y-4'>
                <div className='h-8 bg-gray-200 rounded w-3/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                <div className='grid grid-cols-2 gap-4 !mt-6'>
                  <div className='h-10 bg-gray-200 rounded'></div>
                  <div className='h-10 bg-gray-200 rounded'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Not found state
  if (!internship) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center'>
        <div className='text-center !p-12'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full !mb-6'>
            <BsXCircle className='w-10 h-10 text-red-500' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 !mb-2'>
            Internship Not Found
          </h2>
          <p className='text-gray-600 !mb-6'>
            The internship you’re looking for doesn’t exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/internship')}
            className='inline-flex items-center gap-2 !px-6 !py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all duration-200'
          >
            <BsArrowLeft />
            Back to Internships
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50'>
      {/* Header Navigation */}
      <nav className='sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100'>
        <div className='max-w-6xl !mx-auto !px-4 sm:!px-6 lg:!px-8'>
          <div className='flex items-center justify-between !py-4'>
            <button
              onClick={() => router.push('/internship')}
              className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors'
            >
              <BsArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline cursor-pointer'>
                Back to Internships
              </span>
            </button>

            <div className='flex items-center gap-2'>
              <button
                onClick={handleShare}
                className='!p-2.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group relative cursor-pointer'
              >
                <BsShare className='w-5 h-5 text-gray-600 group-hover:text-emerald-600' />
                {copied && (
                  <span className='absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs !px-2 !py-1 rounded whitespace-nowrap'>
                    Link copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-6xl !mx-auto !px-4 sm:!px-6 lg:!px-8 !py-8'>
        {/* Hero Section */}
        <div className='bg-white rounded-3xl shadow-xl overflow-hidden !mb-8'>
          {/* Gradient Header */}
          <div className='relative h-48 sm:h-56 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 !p-8 sm:!p-12'>
            <div className='absolute inset-0 bg-black/10'></div>
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

            {/* Pattern Overlay */}
            <div className='absolute inset-0 opacity-20'>
              <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                  <pattern
                    id='grid'
                    width='40'
                    height='40'
                    patternUnits='userSpaceOnUse'
                  >
                    <circle cx='20' cy='20' r='1' fill='white' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#grid)' />
              </svg>
            </div>

            {/* Company Logo/Initial */}
            <div className='relative z-10'>
              <div className='inline-flex items-center gap-4 bg-white/10 backdrop-blur-md !px-5 !py-3 rounded-2xl'>
                <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center'>
                  <span className='text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                    {internship.companyName?.charAt(0)?.toUpperCase() ||
                      internship.companyName?.[0] ||
                      'I'}
                  </span>
                </div>
                <div>
                  <h3 className='text-white font-semibold text-lg'>
                    {internship.companyName}
                  </h3>
                  <p className='text-white/80 text-sm'>
                    Internship Opportunity
                  </p>
                </div>
              </div>
            </div>

            {/* Internship Badge */}
            <div className='absolute top-8 right-8'>
              <span className='inline-flex items-center gap-2 !px-4 !py-2 rounded-full text-sm font-medium bg-amber-500/20 text-white backdrop-blur-sm border border-amber-400/30'>
                <HiOutlineAcademicCap className='w-4 h-4' />
                Internship
              </span>
            </div>
          </div>

          {/* Internship Details Content */}
          <div className='!p-8 sm:!p-12'>
            <h1 className='text-center text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent !mb-6'>
              {internship.title}
            </h1>

            {/* Key Information Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 !mb-8'>
              <div className='flex items-center gap-3 !p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center'>
                  <FiMapPin className='w-5 h-5 text-emerald-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 font-medium'>Location</p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {internship.location}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 !p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600'>
                  {getModeIcon(internship.mode)}
                </div>
                <div>
                  <p className='text-xs text-gray-500 font-medium'>Work Mode</p>
                  <p className='text-sm font-semibold text-gray-900 capitalize'>
                    {internship.mode}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 !p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center'>
                  <BsClockHistory className='w-5 h-5 text-cyan-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 font-medium'>Duration</p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {formatDuration(internship.durationWeeks)}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 !p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center'>
                  <MdWorkspacePremium className='w-5 h-5 text-amber-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 font-medium'>Type</p>
                  <p className='text-sm font-semibold text-gray-900'>
                    Internship
                  </p>
                </div>
              </div>
            </div>

            {/* Stipend */}
            {internship.stipend && (
              <div className='flex items-center gap-3 !p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl !mb-8'>
                <FiDollarSign className='w-6 h-6 text-emerald-600' />
                <div>
                  <p className='text-sm text-gray-600'>Stipend</p>
                  <p className='text-lg font-bold text-gray-900'>
                    {internship.stipend}
                  </p>
                </div>
              </div>
            )}

            {/* Internship Benefits */}
            <div className='!mb-8 !p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl'>
              <h3 className='text-sm font-medium text-gray-700 !mb-3'>
                What you&apos;ll gain
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='flex items-center gap-2'>
                  <BsCheckCircle className='w-4 h-4 text-emerald-600 flex-shrink-0' />
                  <span className='text-sm text-gray-700'>
                    Hands-on Experience
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <BsCheckCircle className='w-4 h-4 text-emerald-600 flex-shrink-0' />
                  <span className='text-sm text-gray-700'>
                    Certificate of Completion
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <BsCheckCircle className='w-4 h-4 text-emerald-600 flex-shrink-0' />
                  <span className='text-sm text-gray-700'>
                    Letter of Recommendation
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <BsCheckCircle className='w-4 h-4 text-emerald-600 flex-shrink-0' />
                  <span className='text-sm text-gray-700'>
                    Industry Mentorship
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className='!mb-10'>
              <div className='flex items-center gap-3 !mb-4'>
                <div className='w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full'></div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  About the Internship
                </h2>
              </div>
              <div className='prose prose-gray max-w-none'>
                {internship.description ? (
                  internship.description.split('\n').map((paragraph, index) => (
                    <p
                      key={index}
                      className='text-gray-600 leading-relaxed !mb-4'
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className='text-gray-500 italic'>
                    No description provided.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                href={`/internship/${internship._id}/apply`}
                className='inline-flex items-center justify-center gap-2 !px-8 !py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                <FiExternalLink className='w-5 h-5' />
                Apply for Internship
              </Link>
            </div>

            {/* Share Section */}
            <div className='!mt-12 !pt-8 border-t border-gray-200'>
              <p className='text-sm text-gray-500 !mb-4'>
                Share this opportunity
              </p>
              <div className='flex gap-3'>
                <button
                  onClick={shareOnLinkedIn}
                  className='!p-3 bg-[#0077b5] text-white cursor-pointer rounded-xl hover:bg-[#006399] transition-colors'
                  aria-label='Share on LinkedIn'
                >
                  <BsLinkedin className='w-5 h-5' />
                </button>
                <button
                  onClick={shareOnTwitter}
                  className='!p-3 bg-[#1da1f2] text-white cursor-pointer rounded-xl hover:bg-[#1a8cd8] transition-colors'
                  aria-label='Share on Twitter'
                >
                  <BsTwitter className='w-5 h-5' />
                </button>
                <button
                  onClick={handleShare}
                  className='!p-3 bg-gray-200 text-gray-700 cursor-pointer rounded-xl hover:bg-gray-300 transition-colors'
                  aria-label='Copy link'
                >
                  <BsLink45Deg className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
