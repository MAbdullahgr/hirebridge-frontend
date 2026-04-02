'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ProjectGrid from '@/componants/projects/ProjectGrid'
import api from '@/componants/lib/axios'
import { HiSearch, HiArrowLeft, HiFilter, HiX } from 'react-icons/hi'
import {
  MdBusiness,
  MdDeveloperMode,
  MdDesignServices,
  MdCategory,
} from 'react-icons/md'
import { BiCategory } from 'react-icons/bi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Project } from '../types/projectTypes'

// Define the Project interface matching your backend
// interface Project {
//   _id: string
//   projectTitle: string
//   category: string
//   techStack: string
//   shortDescription: string
//   fileUrl: string | null
//   createdAt: string
//   updatedAt: string
// }

interface ProjectsResponse {
  success: boolean
  totalCount: number
  resultPerPage: number
  currentPage: number
  totalPages: number
  count: number
  projects: Project[]
}

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const fetchProjects = useCallback(async () => {
  setLoading(true)
  setError(null)

  try {
    const response = await api.get<ProjectsResponse>(`/projects?page=${currentPage}`)
    
    if (response.data.success) {
      setProjects(response.data.projects)
      setTotalPages(response.data.totalPages)
      setTotalCount(response.data.totalCount)
    } else {
      setError('Failed to fetch projects')
    }
  } catch (err) {
    console.error('Error fetching projects:', err)
    setError('Failed to load projects. Please try again later.')
  } finally {
    setLoading(false)
  }
}, [currentPage])

useEffect(() => {
  fetchProjects()
}, [fetchProjects])

  // Dynamically extract unique categories from projects
  const getUniqueCategories = () => {
    const uniqueCategories = [
      ...new Set(projects.map((project) => project.category)),
    ]
      .filter(Boolean)
      .sort()
    return ['all', ...uniqueCategories]
  }

  const categories = getUniqueCategories()

  // Get icon for each category - matching your backend enum values
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'all':
        return <BiCategory className='w-4 h-4' />
      case 'business':
        return <MdBusiness className='w-4 h-4' />
      case 'development':
        return <MdDeveloperMode className='w-4 h-4' />
      case 'design':
        return <MdDesignServices className='w-4 h-4' />
      default:
        return <MdCategory className='w-4 h-4' />
    }
  }

  // Get category button styles
  const getCategoryButtonStyle = (category: string, isActive: boolean) => {
    if (!isActive) {
      return 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }

    switch (category?.toLowerCase()) {
      case 'all':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg transform scale-105 border border-gray-600'
      case 'business':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105 border border-emerald-500'
      case 'development':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105 border border-blue-500'
      case 'design':
        return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105 border border-purple-500'
      default:
        return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105 border border-indigo-500'
    }
  }

  // Filter projects based on search and category
  const filteredProjects = projects.filter((project) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      searchQuery === '' ||
      project.projectTitle?.toLowerCase().includes(searchLower) ||
      project.shortDescription?.toLowerCase().includes(searchLower) ||
      project.techStack?.toLowerCase().includes(searchLower)

    // Category filter - note: backend uses capitalized categories
    const matchesCategory =
      filterCategory === 'all' || 
      project.category.toLowerCase() === filterCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Get stats for each category
  const getCategoryCount = (category: string) => {
    if (category === 'all') return projects.length
    return projects.filter((p) => 
      p.category.toLowerCase() === category.toLowerCase()
    ).length
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setFilterCategory('all')
  }

  const hasActiveFilters = searchQuery !== '' || filterCategory !== 'all'

  // Refresh projects
  const handleRefresh = () => {
    fetchProjects()
  }

  // Loading state
  if (loading && projects.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white'>
        <div className='text-center'>
          <AiOutlineLoading3Quarters className='w-12 h-12 text-indigo-600 animate-spin mx-auto !mb-4' />
          <p className='text-gray-600'>Loading projects...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && projects.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl !mb-4'>⚠️</div>
          <h3 className='text-2xl font-bold text-gray-900 !mb-2'>
            Failed to Load Projects
          </h3>
          <p className='text-gray-600 !mb-6'>{error}</p>
          <button
            onClick={handleRefresh}
            className='!px-6 !py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Hero Section */}
      <header className='relative h-[350px] md:h-[400px] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'></div>

        {/* Animated particles background */}
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
          <div className='absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
          <div className='absolute -bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
        </div>

        <div className='relative z-10 text-center !px-6 max-w-5xl mx-auto'>
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {/* Breadcrumb */}
            <nav className='flex justify-center !mb-6'>
              <ol className='flex items-center space-x-2 text-white/70'>
                <li>
                  <Link href='/' className='hover:text-white transition-colors'>
                    Home
                  </Link>
                </li>
                <li className='!mx-2'>/</li>
                <li>
                  <Link
                    href='/services'
                    className='hover:text-white transition-colors'
                  >
                    Services
                  </Link>
                </li>
                <li className='!mx-2'>/</li>
                <li className='text-white'>Projects</li>
              </ol>
            </nav>

            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white !mb-6'>
              All{' '}
              <span className='bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                Projects
              </span>
            </h1>
            <p className='text-lg md:text-xl text-gray-100 max-w-3xl mx-auto'>
              Explore our complete portfolio of {totalCount || projects.length} projects
              showcasing our expertise across various domains
            </p>

            {/* Stats */}
            <div className='!mt-10 grid grid-cols-3 gap-6 max-w-2xl mx-auto'>
              <div className='text-center group'>
                <div className='text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform'>
                  {totalCount || projects.length}
                </div>
                <div className='text-sm text-gray-200'>Total Projects</div>
              </div>
              <div className='text-center group'>
                <div className='text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform'>
                  {categories.length - 1}
                </div>
                <div className='text-sm text-gray-200'>Categories</div>
              </div>
              <div className='text-center group'>
                <div className='text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform'>
                  100%
                </div>
                <div className='text-sm text-gray-200'>Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <section className='sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 !py-6'>
        <div className='!px-15'>
          <div className='flex flex-col gap-4'>
            {/* Top Row - Search and Results */}
            <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
              {/* Search Bar */}
              <div className='relative w-full lg:w-96'>
                <input
                  type='text'
                  placeholder='Search projects by title, description, or technology...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full !pl-12 !pr-10 !py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                />
                <HiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 !p-1 hover:bg-gray-200 rounded-lg transition-colors'
                  >
                    <HiX className='w-4 h-4 text-gray-500' />
                  </button>
                )}
              </div>

              {/* Results Count and Clear Filters */}
              <div className='flex items-center gap-4'>
                <div className='text-gray-600'>
                  <span className='font-bold text-2xl text-indigo-600'>
                    {filteredProjects.length}
                  </span>{' '}
                  <span className='text-sm'>
                    {filteredProjects.length === 1 ? 'project' : 'projects'}{' '}
                    found
                  </span>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className='inline-flex items-center gap-2 !px-4 !py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors'
                  >
                    <HiX className='w-4 h-4' />
                    Clear Filters
                  </button>
                )}

                {/* Refresh button */}
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className='inline-flex items-center gap-2 !px-4 !py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50'
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters className='w-4 h-4 animate-spin' />
                  ) : (
                    '🔄'
                  )}
                  Refresh
                </button>
              </div>
            </div>

            {/* Bottom Row - Category Filters */}
            <div className='flex items-center justify-center gap-4'>
              <div className='flex items-center gap-2 text-gray-500'>
                <HiFilter className='w-5 h-5' />
                <span className='text-sm font-medium'>Filter by:</span>
              </div>

              <div className='flex flex-wrap gap-2'>
                {categories.map((category) => {
                  const isActive = filterCategory === category
                  const count = getCategoryCount(category)

                  return (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`inline-flex items-center gap-2 !px-5 !py-2.5 rounded-full font-medium transition-all duration-300 ${getCategoryButtonStyle(
                        category,
                        isActive
                      )}`}
                    >
                      {getCategoryIcon(category)}
                      <span className='capitalize'>
                        {category === 'all' ? 'All Projects' : category}
                      </span>
                      <span
                        className={`!ml-1 !px-2 !py-0.5 text-xs rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid or No Results */}
      {filteredProjects.length > 0 ? (
        <ProjectGrid projects={filteredProjects} showViewAll={false} />
      ) : (
        <div className='flex flex-col items-center justify-center !py-32'>
          <div className='text-center'>
            <HiSearch className='w-16 h-16 text-gray-300 mx-auto !mb-4' />
            <h3 className='text-2xl font-bold text-gray-900 !mb-2'>
              No projects found
            </h3>
            <p className='text-gray-600 !mb-6'>
              {projects.length === 0
                ? 'No projects available at the moment.'
                : "Try adjusting your search or filter to find what you're looking for."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='inline-flex items-center gap-2 !px-6 !py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors'
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center gap-2 !py-8'>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className='!px-4 !py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Previous
          </button>
          
          <div className='flex items-center gap-2'>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`!px-4 !py-2 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
            className='!px-4 !py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next
          </button>
        </div>
      )}

      {/* Back to Services Button */}
      <div className='text-center !pb-20'>
        <Link
          href='/services'
          className='inline-flex items-center gap-3 !px-8 !py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold text-lg rounded-full hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group'
        >
          <HiArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
          <span>Back to Services</span>
        </Link>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}