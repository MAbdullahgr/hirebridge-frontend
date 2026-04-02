'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FiEye, FiTrash2, FiX } from 'react-icons/fi'
import api from '@/componants/lib/axios'

interface InternshipApplication {
  _id: string
  fullName: string | { _id: string; username: string }
  email: string
  phone: string
  fieldOfStudy: string
  university: string
  cgpa: number
  semester: string
  reason: string
  resumeFile: {
    url: string
  }
  status: 'pending' | 'under review' | 'accepted' | 'rejected'
  applyfor?: {
    _id: string
    title: string
  }
  createdAt: string
}

const InternshipApplicationsPage = () => {
  const [applications, setApplications] = useState<InternshipApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<InternshipApplication | null>(
    null
  )

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Fetch internship applications
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/internships/applications', {
        params: { page: currentPage, limit: 15 },
      })
      const data = response.data
      setApplications(data.applications || [])
      setTotalPages(data.totalPages || 1)
      setError('')
    } catch (err) {
      console.error('Error fetching internship applications:', err)
      setError('Failed to fetch internship applications.')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // Delete application
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/internships/applications/${id}`)
      await fetchApplications()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting application:', err)
      alert('Failed to delete application. Please try again.')
    }
  }

  // Update application status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id)
      await api.put(`/internships/applications/${id}/status`, {
        status: newStatus,
      })
      await fetchApplications()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update internship application status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className='!p-4 sm:!p-6 lg:!p-8'>
      <div className='!mb-6 sm:!mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Internship Applications
        </h1>
      </div>

      {error && (
        <div className='!mb-4 !p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : applications.length === 0 ? (
        <div className='text-center !py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-500'>No internship applications found.</p>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='hidden lg:block overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Applicant
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Field of Study
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    University
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    CGPA
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Status
                  </th>
                  <th className='!px-6 !py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200'>
                {applications.map((app) => {
                  const fullName =
                    typeof app.fullName === 'object'
                      ? app.fullName.username
                      : app.fullName

                  return (
                    <tr key={app._id} className='hover:bg-gray-50'>
                      <td className='!px-6 !py-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {fullName || 'N/A'}
                        </div>
                        <div className='text-sm text-gray-500'>{app.email}</div>
                      </td>
                      <td className='!px-6 !py-4 text-sm text-gray-700'>
                        {app.fieldOfStudy}
                      </td>
                      <td className='!px-6 !py-4 text-sm text-gray-700'>
                        {app.university}
                      </td>
                      <td className='!px-6 !py-4 text-sm text-gray-700'>
                        {app.cgpa}
                      </td>

                      {/* Status Dropdown */}
                      <td className='!px-6 !py-4 whitespace-nowrap'>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app._id, e.target.value)
                          }
                          disabled={updatingId === app._id}
                          className={`text-xs font-medium rounded-full border !px-2 !py-1 focus:outline-none cursor-pointer
                            ${
                              app.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : app.status === 'accepted'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                        >
                          <option value='pending'>Pending</option>
                          <option value='under review'>Under Review</option>
                          <option value='accepted'>Accepted</option>
                          <option value='rejected'>Rejected</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className='!px-6 !py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className='text-blue-600 hover:text-blue-800 !p-1'
                            title='View Details'
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(app._id)}
                            className='text-red-600 hover:text-red-900 !p-1'
                            title='Delete Application'
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !p-4 z-50'>
          <div className='bg-white rounded-lg max-w-md w-full !p-6'>
            <h3 className='text-lg font-semibold !mb-4'>Confirm Delete</h3>
            <p className='text-gray-600 !mb-6'>
              Are you sure you want to delete this application? This action
              cannot be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className='flex-1 !px-4 !py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 !px-4 !py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedApp && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !p-4'>
          <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full relative !p-6 overflow-y-auto max-h-[90vh]'>
            <button
              onClick={() => setSelectedApp(null)}
              className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
            >
              <FiX size={22} />
            </button>

            <h2 className='text-2xl font-semibold text-gray-800 !mb-4'>
              Internship Application Details
            </h2>

            <div className='space-y-4'>
              <div>
                <p className='text-sm text-gray-500'>Full Name</p>
                <p className='font-medium text-gray-800'>
                  {typeof selectedApp.fullName === 'object'
                    ? selectedApp.fullName.username
                    : selectedApp.fullName}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Email</p>
                <p className='font-medium text-gray-800'>{selectedApp.email}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Phone</p>
                <p className='font-medium text-gray-800'>{selectedApp.phone}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>University</p>
                <p className='font-medium text-gray-800'>
                  {selectedApp.university}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Field of Study</p>
                <p className='font-medium text-gray-800'>
                  {selectedApp.fieldOfStudy}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Semester</p>
                <p className='font-medium text-gray-800'>
                  {selectedApp.semester}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>CGPA</p>
                <p className='font-medium text-gray-800'>{selectedApp.cgpa}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Reason for Applying</p>
                <p className='text-gray-700 whitespace-pre-line bg-gray-50 border border-gray-200 rounded-lg !p-3 !mt-1'>
                  {selectedApp.reason}
                </p>
              </div>
              {/* <div className='!mt-4'>
                {selectedApp.resumeFile?.url ? (
                  <a
                    href={
                      selectedApp.resumeFile?.url?.endsWith('.pdf')
                        ? selectedApp.resumeFile.url
                        : `${selectedApp.resumeFile?.url}.pdf`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg !px-4 !py-2 transition-colors'
                  >
                    View Resume
                  </a>
                ) : (
                  <p className='text-gray-500'>No resume uploaded</p>
                )}
              </div> */}
            </div>
          </div>
        </div>
      )}

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
          <div className='flex gap-1'>
            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              const pageNum = currentPage <= 3 ? idx + 1 : currentPage + idx - 2
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
    </div>
  )
}

export default InternshipApplicationsPage
