'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { AxiosError } from 'axios'
import InternshipCard from '@/componants/Internship/InternshipCard'
import InternshipFilters from '@/componants/Internship/InternshipFilter'
import { Internship } from '@/componants/types/Internship'
import api from '../lib/axios'

// Move outside component to prevent recreating
const ITEMS_PER_PAGE = 6

const InternshipPage = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  // Filters
  const [locationFilter, setLocationFilter] = useState('')
  const [modeFilter, setModeFilter] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Memoize API params to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      location: locationFilter || undefined,
      mode: modeFilter || undefined,
      keyword: searchKeyword || undefined,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }),
    [locationFilter, modeFilter, searchKeyword, currentPage]
  )

  // Fetch function wrapped in useCallback
  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data } = await api.get('/internships', { params: apiParams })

      if (data.success && Array.isArray(data.internships)) {
        setInternships(data.internships)
        setTotalPages(data.totalPages || 1)
        setTotalCount(data.totalCount || data.count || 0)
      } else {
        setInternships([])
        setTotalPages(1)
        setTotalCount(0)
      }
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : 'Failed to fetch internships'
      setError(message)
      console.error('Error fetching internships:', err)
    } finally {
      setLoading(false)
    }
  }, [apiParams])

  useEffect(() => {
    fetchInternships()
  }, [fetchInternships])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [locationFilter, modeFilter, searchKeyword])

  // Pagination Handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Add search functionality
  const handleSearch = (value: string) => {
    setSearchKeyword(value)
  }

  return (
    <div>
      {/* Banner */}
      <div
        className='w-full h-[300px] relative !mb-8'
        style={{
          background: 'url(/images/img.jpg) no-repeat center / cover',
        }}
      >
        <div className='text-center !mb-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <h1
            className='text-4xl md:text-5xl font-bold text-[#3d5afe] !mb-4'
            data-aos='fade-down'
          >
            Explore Internships
          </h1>
          <p
            className='text-[#3d5afe] text-lg md:text-xl'
            data-aos='fade-down'
            data-aos-delay={100}
          >
            {totalCount > 0
              ? `${totalCount} opportunities available`
              : 'Discover exciting internship opportunities'}
          </p>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center bg-[#f3f3f3]'>
        <div className='bg-white w-full'>
          <h2 className='text-center text-[#5e35b1] !mb-3 text-3xl font-semibold'>
            Current Internship Openings
          </h2>

          <p className='text-center text-[#666] text-lg font-semibold'>
            {loading
              ? 'Loading internships...'
              : error
              ? 'Error loading internships'
              : totalCount > 0
              ? `Showing ${internships.length} of ${totalCount} internships`
              : 'No internships available right now.'}
          </p>
        </div>

        {/* Add Search Bar */}
        <div className='w-full max-w-4xl !mx-auto !px-8 !mt-6'>
          <input
            type='text'
            placeholder='Search internships by title, company, or skills...'
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full !px-4 !py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Main Content */}
        <div className='!p-8 w-full'>
          {/* Filters */}
          {!loading && !error && (
            <InternshipFilters
              internships={internships}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              modeFilter={modeFilter}
              setModeFilter={setModeFilter}
            />
          )}

          {/* Loading State */}
          {loading && (
            <div className='flex justify-center items-center !py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className='text-center !py-8'>
              <p className='text-red-500 !mb-4'>{error}</p>
              <button
                onClick={fetchInternships}
                className='!px-4 !py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Try Again
              </button>
            </div>
          )}

          {/* Internship Grid */}
          {!loading && !error && (
            <>
              <div className='grid md:grid-cols-2 gap-6 !mt-6'>
                {internships.length > 0 ? (
                  internships.map((intern) => (
                    <InternshipCard key={intern._id} internship={intern} />
                  ))
                ) : (
                  <div className='col-span-2 text-center !py-12'>
                    <p className='text-gray-500 text-lg !mb-4'>
                      No internships found.
                    </p>
                    <button
                      onClick={() => {
                        setLocationFilter('')
                        setModeFilter('')
                        setSearchKeyword('')
                      }}
                      className='text-blue-600 hover:underline'
                    >
                      Clear all filters
                    </button>
                  </div>
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

export default InternshipPage
