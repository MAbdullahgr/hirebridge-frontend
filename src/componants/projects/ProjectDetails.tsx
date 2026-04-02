'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/componants/lib/axios'
import { Project } from '@/componants/types/projectTypes'
import {
  BsArrowLeft,
  BsShare,
  BsLinkedin,
  BsTwitter,
  BsRocket,
} from 'react-icons/bs'
import {
  FiCode,
  FiGlobe,
  FiPackage,
  FiCpu,
  FiZap,
  FiLayers,
} from 'react-icons/fi'
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
} from 'react-icons/si'
import { HiOutlineChip, HiSparkles } from 'react-icons/hi'
import Link from 'next/link'

// Map tech stack icons
const getTechIcon = (tech: string) => {
  const t = tech.toLowerCase()
  const iconClass = 'w-5 h-5'
  if (t.includes('react')) return <SiReact className={iconClass} />
  if (t.includes('node')) return <SiNodedotjs className={iconClass} />
  if (t.includes('typescript')) return <SiTypescript className={iconClass} />
  if (t.includes('javascript')) return <SiJavascript className={iconClass} />
  return <FiCode className={iconClass} />
}

// Map category color
const getCategoryColor = (category: string) => {
  const c = category.toLowerCase()
  if (c.includes('web')) return 'from-blue-600 to-indigo-700'
  if (c.includes('mobile')) return 'from-green-600 to-teal-700'
  if (c.includes('ai') || c.includes('ml')) return 'from-purple-600 to-pink-700'
  if (c.includes('data')) return 'from-orange-600 to-red-700'
  return 'from-violet-600 to-purple-700'
}

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className='min-h-screen flex items-center justify-center bg-gray-50'>
    <svg
      className='animate-spin -ml-1 !mr-3 h-8 w-8 text-violet-600'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
    <p className='text-gray-600 font-medium'>Loading Project Details...</p>
  </div>
)

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get<{ success: boolean; project: Project }>(
          `/projects/${id}`
        )
        if (res.data.success) setProject(res.data.project)
        else setError('Project not found')
      } catch {
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProject()
    else {
      setLoading(false)
      setError('Invalid project ID')
    }
  }, [id])

  const handleShare = async () => {
    if (!project) return
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.projectTitle,
          text: project.shortDescription,
          url,
        })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <LoadingSkeleton />

  if (error || !project)
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 !p-6'>
        <div className='text-center !p-10 bg-white rounded-xl shadow-xl border border-gray-100'>
          <div className='text-5xl !mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-gray-800'>
            {error || 'Project Not Found'}
          </h2>
          <p className='text-gray-500 !mt-2 !mb-6'>
            The requested project could not be loaded.
          </p>
          <button
            onClick={() => router.push('/projects')}
            className='!px-8 !py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-semibold hover:from-violet-700 hover:to-purple-700 transition transform hover:scale-[1.02] shadow-lg'
          >
            Back to Projects
          </button>
        </div>
      </div>
    )

  const techStackArray = project.techStack
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t)

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'>
        <div className='max-w-7xl !mx-auto !px-6 !py-3 flex justify-between items-center'>
          <button
            onClick={() => router.push('/projects')}
            className='flex items-center cursor-pointer gap-2 !px-3 !py-2 text-gray-700 hover:text-violet-600 font-medium transition group rounded-lg hover:bg-gray-50'
          >
            <BsArrowLeft className='group-hover:-translate-x-1 transition-transform' />
            <span>Back to Projects</span>
          </button>
          <div className='flex gap-2 items-center'>
            <button
              onClick={handleShare}
              className='!p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-800 transition relative'
              aria-label='Share project'
            >
              <BsShare />
              {copied && (
                <span className='absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs !px-3 !py-1 rounded-lg whitespace-nowrap shadow-md'>
                  Link Copied!
                </span>
              )}
            </button>
            <div className='w-px h-6 bg-gray-200 !mx-1'></div>
            <button
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    window.location.href
                  )}`,
                  '_blank'
                )
              }
              className='!p-2.5 bg-[#0077b5] text-white rounded-xl hover:bg-[#006399] transition hover:shadow-md'
              aria-label='Share on LinkedIn'
            >
              <BsLinkedin />
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.href
                  )}&text=${encodeURIComponent(project.projectTitle)}`,
                  '_blank'
                )
              }
              className='!p-2.5 bg-[#1da1f2] text-white rounded-xl hover:bg-[#1a8cd8] transition hover:shadow-md'
              aria-label='Share on Twitter'
            >
              <BsTwitter />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className='max-w-7xl !mx-auto !px-6 !pt-10'>
        <div
          className={`bg-gradient-to-br ${getCategoryColor(
            project.category
          )} !p-10 sm:!p-14 rounded-t-3xl relative`}
        >
          <div className='absolute inset-0 bg-black/10 rounded-t-3xl backdrop-blur-[1px]'></div>
          <div className='relative z-10 text-white'>
            <div className='flex items-center gap-3 !mb-4'>
              <span className='inline-flex items-center !px-4 !py-2 rounded-full bg-white/20 text-white text-sm font-semibold backdrop-blur-sm'>
                <HiSparkles className='w-4 h-4 !mr-2' />
                {project.category}
              </span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold !mb-4 leading-tight'>
              {project.projectTitle}
            </h1>
            <p className='text-white/90 text-xl max-w-4xl'>
              {project.shortDescription}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl !mx-auto !px-6 !pb-16 space-y-12'>
        {/* Overview */}
        <section className='bg-white !p-8 sm:!p-10 border border-gray-100'>
          <h2 className='text-3xl font-bold text-gray-900 !mb-5 border-b !pb-3 border-gray-100'>
            Detailed Overview
          </h2>
          <p className='text-gray-600 text-lg leading-relaxed !mb-4'>
            {project.shortDescription}
          </p>
          <p className='text-gray-600 leading-relaxed italic'>
            &quot;This project demonstrates modern development
            practices...&quot;
          </p>
        </section>

        {/* Tech Stack */}
        <section className='bg-white !p-8 sm:!p-10 border border-gray-100'>
          <h2 className='text-2xl font-bold !mb-6 flex items-center gap-3 text-violet-700'>
            <HiOutlineChip className='w-6 h-6' /> Core Technologies
          </h2>
          <div className='flex flex-wrap gap-4'>
            {techStackArray.map((tech, i) => (
              <div
                key={i}
                className='flex items-center gap-2 !px-5 !py-2 bg-violet-50 border border-violet-200 text-violet-800 rounded-full font-medium text-sm transition hover:bg-violet-100'
              >
                {getTechIcon(tech)}
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights + Download */}
        <section className='grid grid-cols-1 md:grid-cols-2'>
          <div className='bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-bl-3xl !p-8'>
            <h2 className='text-2xl font-bold text-blue-700 !mb-5 flex items-center gap-3'>
              <BsRocket className='w-6 h-6' /> Project Highlights
            </h2>
            <div className='space-y-3 text-gray-700'>
              <div className='flex items-center gap-3'>
                <FiZap className='w-5 h-5 text-blue-600' />
                <span className='font-medium'>High Performance & Speed</span>
              </div>
              <div className='flex items-center gap-3'>
                <FiLayers className='w-5 h-5 text-blue-600' />
                <span className='font-medium'>
                  Modular Architecture (Scalable)
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <FiGlobe className='w-5 h-5 text-blue-600' />
                <span className='font-medium'>Cross-Platform Ready</span>
              </div>
              <div className='flex items-center gap-3'>
                <FiCpu className='w-5 h-5 text-blue-600' />
                <span className='font-medium'>Optimized Codebase</span>
              </div>
              <div className='flex items-center gap-3'>
                <FiPackage className='w-5 h-5 text-blue-600' />
                <span className='font-medium'>Easy Deployment Structure</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-br-3xl !p-8 flex flex-col justify-between border border-gray-100'>
            <h2 className='text-2xl font-bold text-gray-900 !mb-6'>
              Access Project Files
            </h2>
            {project.fileUrl ? (
              <Link
                href={project.fileUrl}
                target='_blank'
                className='w-full inline-flex justify-center items-center !px-8 !py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg hover:shadow-2xl transform hover:scale-[1.01]'
              >
                Live demo
              </Link>
            ) : (
              <button
                disabled
                className='w-full inline-flex justify-center items-center !px-8 !py-4 rounded-xl bg-gray-200 text-gray-500 font-bold text-lg cursor-not-allowed shadow-inner'
              >
                Live demo not working
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
