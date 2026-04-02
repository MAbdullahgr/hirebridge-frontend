'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Job } from '@/componants/types/Job'
import { useParams, useRouter } from 'next/navigation'
import api from '@/componants/lib/axios'
import {
  BsClockHistory,
  BsCalendarCheck,
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
  FiDownload,
  FiExternalLink,
  FiMail,
} from 'react-icons/fi'
import { RiUserStarLine } from 'react-icons/ri'
import { HiOutlineSparkles } from 'react-icons/hi'
import Link from 'next/link'
import { AxiosError } from 'axios'

export default function JobDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

const fetchJob = useCallback(async () => {
  if (!id) return

  try {
    setLoading(true)
    setError(null)

    const response = await api.get<{ success: boolean; job?: Job }>(`/jobs/${id}`)
    const data = response.data

    if (data.success && data.job) {
      setJob(data.job)
    } else {
      setJob(null)
      setError('Job not found')
    }
  } catch (err) {
    let errorMessage = 'Failed to fetch job'
    if (err instanceof AxiosError) {
      errorMessage = err.response?.data?.message || err.message || errorMessage
    } else if (err instanceof Error) {
      errorMessage = err.message
    }
    console.error('Error fetching job:', err)
    setError(errorMessage)
    setJob(null)
  } finally {
    setLoading(false)
  }
}, [id]) // ✅ only changes when id changes

useEffect(() => {
  fetchJob()
}, [fetchJob])

  const handleShare = async () => {
    if (!job) return
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this ${job.title} position at ${job.company}`,
          url,
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
    const url = window.location.href
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      '_blank'
    )
  }

  const shareOnTwitter = () => {
    const url = window.location.href
    const text = `Check out this ${job?.title} position at ${job?.company}`
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Loading job...</p>
      </div>
    )
  }

  if (!job || error) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center text-center px-4'>
        <BsXCircle className='w-16 h-16 text-red-500 mb-4' />
        <h2 className='text-2xl font-bold mb-2'>Job Not Found</h2>
        <p className='text-gray-600 mb-6'>{error || 'This job does not exist.'}</p>
        <button
          onClick={() => router.push('/jobs')}
          className='inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition'
        >
          <BsArrowLeft />
          Back to Jobs
        </button>
      </div>
    )
  }

  const daysLeft = getDaysUntilDeadline(job.deadline)

  return (
    <div className='min-h-screen  bg-gradient-to-br from-slate-50 via-white to-indigo-50'>
      {/* Header Navigation */}
      <nav className='sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100'>
        <div className='max-w-6xl !mx-auto !px-4 sm:!px-6 lg:!px-8'>
          <div className='flex items-center justify-between !py-4'>
            <button
              onClick={() => router.push('/jobs')}
              className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors'
            >
              <BsArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline cursor-pointer'>
                Back to Jobs
              </span>
            </button>

            <div className='flex items-center gap-2'>
              <button
                onClick={handleShare}
                className='!p-2.5 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group relative cursor-pointer'
              >
                <BsShare className='w-5 h-5 text-gray-600 group-hover:text-indigo-600' />
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
      <main className='max-w-6xl  !mx-auto !px-4 sm:!px-6 lg:!px-8 !py-8'>
        {/* Hero Section */}
        <div className='bg-white rounded-3xl shadow-xl overflow-hidden !mb-8'>
          {/* Gradient Header */}
          <div className='relative h-48 sm:h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 !p-8 sm:!p-12'>
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
                  <span className='text-xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                    {job.company.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className='text-white font-semibold text-lg'>
                    {job.company}
                  </h3>
                  <p className='text-white/80 text-sm'>{job.role}</p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className='absolute top-8 right-8'>
              <span
                className={`inline-flex items-center gap-2 !px-4 !py-2 rounded-full text-sm font-medium ${
                  job.status === 'Active'
                    ? 'bg-green-500/20 text-white backdrop-blur-sm border border-green-400/30'
                    : 'bg-gray-500/20 text-white backdrop-blur-sm border border-gray-400/30'
                }`}
              >
                {job.status === 'Active' ? <BsCheckCircle /> : <BsXCircle />}
                {job.status || 'Active'}
              </span>
            </div>
          </div>

          {/* Job Details Content */}
          <div className='!p-8 sm:!p-12'>
            {/* Title and Deadline */}
            <div className='!mb-8'>
              <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 !mb-4'>
                {job.title}
              </h1>

              {/* Deadline Alert */}
              <div
                className={`inline-flex items-center gap-2 !px-4 !py-2 rounded-xl text-sm font-medium ${
                  daysLeft <= 7
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : daysLeft <= 30
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                <BsCalendarCheck className='w-4 h-4' />
                {daysLeft > 0 ? (
                  <span>
                    Applications close in {daysLeft} days •{' '}
                    {formatDate(job.deadline)}
                  </span>
                ) : (
                  <span>Applications closed</span>
                )}
              </div>
            </div>

            {/* Key Information Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 !mb-8'>
              <div className='flex items-center gap-3 !p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center'>
                  <FiMapPin className='w-5 h-5 text-indigo-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 font-medium'>Location</p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {job.location}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 !p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600'>
                  {getModeIcon(job.mode)}
                </div>
                <div>
                  <p className='text-xs text-gray-500 font-medium'>Work Mode</p>
                  <p className='text-sm font-semibold text-gray-900 capitalize'>
                    {job.mode}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 !p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                  <BsClockHistory className='w-5 h-5 text-green-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 font-medium'>
                    Employment
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {job.type}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 !p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center'>
                  <RiUserStarLine className='w-5 h-5 text-amber-600' />
                </div>
                <div>
                  <p className='text-xs text-gray-500 font-medium'>
                    Experience
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {job.experience}
                  </p>
                </div>
              </div>
            </div>

            {/* Salary */}
            {job.salary && (
              <div className='flex items-center gap-3 !p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl !mb-8'>
                <FiDollarSign className='w-6 h-6 text-emerald-600' />
                <div>
                  <p className='text-sm text-gray-600'>Salary Range</p>
                  <p className='text-lg font-bold text-gray-900'>
                    {job.salary}
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className='!mb-8'>
                <h3 className='text-sm font-medium text-gray-500 !mb-3'>
                  Required Skills
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-1 !px-4 !py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full hover:bg-indigo-100 transition-colors cursor-default'
                    >
                      <HiOutlineSparkles className='w-4 h-4' />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div className='!mb-10'>
              <div className='flex items-center gap-3 !mb-4'>
                <div className='w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full'></div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Job Description
                </h2>
              </div>
              <div className='prose prose-gray max-w-none'>
                {job.description.split('\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className='text-gray-600 leading-relaxed !mb-4'
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements Section */}
            <div className='!mb-10'>
              <div className='flex items-center gap-3 !mb-4'>
                <div className='w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full'></div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Requirements
                </h2>
              </div>
              <div className='space-y-3'>
                {job.requirements.split('\n').map((req, index) => (
                  <div key={index} className='flex items-start gap-3 group'>
                    <div className='flex-shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center !mt-0.5 group-hover:scale-110 transition-transform'>
                      <svg
                        className='w-3 h-3 text-white'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='text-gray-600 leading-relaxed'>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply Section */}
            <div className='!mb-10'>
              <div className='flex items-center gap-3 !mb-4'>
                <div className='w-1 h-8 bg-gradient-to-b from-pink-600 to-rose-600 rounded-full'></div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  How to Apply
                </h2>
              </div>
              <div className='!p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100'>
                <div className='flex items-start gap-3'>
                  <FiMail className='w-6 h-6 text-indigo-600 flex-shrink-0 !mt-1' />
                  <div className='text-gray-600 leading-relaxed'>
                    {job.application.split('\n').map((text, index) => (
                      <p key={index} className='!mb-2'>
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                href={`/jobs/${job._id}/apply`}
                className='inline-flex items-center justify-center gap-2 !px-8 !py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                <FiExternalLink className='w-5 h-5' />
                Apply Now
              </Link>

              {job.sampleResume && (
                <Link
                  href={job.sampleResume}
                  target='_blank'
                  className='inline-flex items-center justify-center gap-2 !px-8 !py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transform hover:scale-105 transition-all duration-200'
                >
                  <FiDownload className='w-5 h-5' />
                  Download Sample Resume
                </Link>
              )}
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

            {/* Footer Info */}
            {job.createdAt && (
              <div className='!mt-6 text-center'>
                <p className='text-sm text-gray-400'>
                  Posted on {formatDate(job.createdAt)}
                  {job.updatedAt &&
                    job.updatedAt !== job.createdAt &&
                    ` • Updated on ${formatDate(job.updatedAt)}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
