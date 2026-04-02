'use client'
import React, { useState, useEffect, useCallback } from 'react'
import JobCard from '@/componants/jobs/JobCard'
import JobFilters from '@/componants/jobs/JobFilters'
import { Job } from '@/componants/types/Job'
import api from '@/componants/lib/axios'
import { AxiosError } from 'axios'

// Define proper types
interface JobParams {
  page?: number
  keyword?: string
  location?: string
  mode?: string
  role?: string
  type?: string
}

const JobsPage = () => {
  // State for jobs data
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)

  // Filter state
  const [locationFilter, setLocationFilter] = useState('')
  const [remoteFilter, setRemoteFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params: JobParams = {
        page: currentPage,
        keyword: searchKeyword || undefined,
        location: locationFilter || undefined,
        mode: remoteFilter || undefined,
        role: roleFilter || undefined,
      }

      const response = await api.get('/jobs', { params })
      const data = response.data

      setJobs(data.jobs || [])
      setTotalPages(data.totalPages || 1)
      setTotalJobs(data.totalCount || data.count || 0)
    } catch (err) {
      let errorMessage = 'Failed to fetch jobs'

      if (err instanceof AxiosError) {
        errorMessage =
          err.response?.data?.message || err.message || 'Failed to fetch jobs'
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, locationFilter, remoteFilter, roleFilter, searchKeyword])

  // Pagination Handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to page 1 when searching
  }

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  // Filtered jobs (already handled by backend)
  const filteredJobs = jobs

  return (
    <div className=''>
      {/* Banner */}
      <div
        className='w-full h-[300px] relative !mb-8'
        style={{
          background: ' url(/images/img.jpg) no-repeat left center / cover',
        }}
      >
        <div className='text-center !mb-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <h1
            className='text-4xl md:text-5xl font-bold text-[#3d5afe] !mb-4'
            data-aos='fade-down'
          >
            Explore Opportunities
          </h1>
          <p
            className='text-[#3d5afe] text-lg md:text-xl'
            data-aos='fade-down'
            data-aos-delay={100}
          >
            Explore available jobs and internships to find the perfect fit for
            your skills.
          </p>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center bg-[#f3f3f3]'>
        <div className='bg-white w-full'>
          <h2 className='text-center text-[#5e35b1] !mb-3 text-3xl font-semibold'>
            Current Job Openings
          </h2>

          <p className='text-center text-[#666] text-lg font-semibold'>
            {totalJobs > 0
              ? `Found ${totalJobs} job${totalJobs > 1 ? 's' : ''}`
              : 'Use the filters below to find the best fit for your skills and preferences.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className='w-full max-w-4xl mx-auto !px-8 !mt-6'>
          <form onSubmit={handleSearch}>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Search jobs by title, company, or location...'
                value={searchKeyword}
                onChange={handleSearchInputChange}
                className='flex-1 !px-4 !py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                type='submit'
                className='!px-6 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className='!p-8 w-full'>
          {!loading && (
            <JobFilters
              jobs={jobs}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              remoteFilter={remoteFilter}
              setRemoteFilter={setRemoteFilter}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
            />
          )}

          {/* Loading State */}
          {loading && (
            <div className='flex justify-center items-center py-12'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                <p className='text-gray-600'>Loading jobs...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className='text-center py-8'>
              <p className='text-red-500 mb-4'>{error}</p>
              <button
                onClick={fetchJobs}
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Try Again
              </button>
            </div>
          )}

          {/* Jobs Grid */}
          {!loading && !error && (
            <>
              <div className='grid md:grid-cols-2 gap-6 !mt-6'>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
                ) : (
                  <p className='col-span-2 text-center text-gray-500 text-lg'>
                    No jobs found. Try adjusting your filters.
                  </p>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex justify-center items-center gap-2 !mt-8'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='!px-4 !py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className='flex gap-1'>
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      const pageNum =
                        currentPage <= 3 ? idx + 1 : currentPage + idx - 2

                      if (pageNum < 1 || pageNum > totalPages) return null

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`!px-3 !py-1 rounded ${
                            pageNum === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='!px-4 !py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobsPage
