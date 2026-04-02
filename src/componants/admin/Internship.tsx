'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import api from '@/componants/lib/axios' // adjust path as needed

export interface Internship {
  _id: string
  title: string
  companyName: string
  location: string
  mode: 'onsite' | 'remote' | 'hybrid'
  durationWeeks: number
  description: string
  createdAt?: string
  updatedAt?: string
}

interface InternshipFormData {
  title: string
  companyName: string
  location: string
  mode: 'onsite' | 'remote' | 'hybrid'
  durationWeeks: number
  description: string
}

const InternshipsPage = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingInternship, setEditingInternship] = useState<Internship | null>(
    null
  )
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const [formData, setFormData] = useState<InternshipFormData>({
    title: '',
    companyName: '',
    location: '',
    mode: 'onsite',
    durationWeeks: 4,
    description: '',
  })

  // Fetch internships
  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/internships', {
        params: { page: currentPage, limit: 10 },
      })
      setInternships(response.data.internships || response.data)
      setTotalPages(response.data.totalPages || 1)
      setError('')
    } catch (err) {
      console.error('Error fetching internships:', err)
      setError('Failed to fetch internships')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchInternships()
  }, [currentPage, fetchInternships])

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      companyName: '',
      location: '',
      mode: 'onsite',
      durationWeeks: 4,
      description: '',
    })
    setEditingInternship(null)
  }

  // Open modal
  const openModal = (internship?: Internship) => {
    if (internship) {
      setEditingInternship(internship)
      setFormData({
        title: internship.title || '',
        companyName: internship.companyName || '',
        location: internship.location || '',
        mode: internship.mode || 'onsite',
        durationWeeks: internship.durationWeeks || 4,
        description: internship.description || '',
      })
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  // Submit form (multipart/form-data)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('companyName', formData.companyName)
      data.append('location', formData.location)
      data.append('mode', formData.mode)
      data.append('durationWeeks', formData.durationWeeks.toString())
      data.append('description', formData.description)

      if (editingInternship) {
        await api.put(`/internships/${editingInternship._id}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
      } else {
        await api.post('/internships', data, {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      await fetchInternships()
      closeModal()
    } catch (err) {
      console.error('Error saving internship:', err)
      alert('Failed to save internship. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete internship
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/internships/${id}`)
      await fetchInternships()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting internship:', err)
      alert('Failed to delete internship. Please try again.')
    }
  }

  return (
    <div className='!p-4 sm:!p-6 lg:!p-8'>
      {/* Header */}
      <div className='!mb-6 sm:!mb-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Internship Management
          </h1>
          <button
            onClick={() => openModal()}
            className='inline-flex items-center gap-2 !px-4 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <FiPlus size={20} />
            <span>Add New Internship</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='!mb-4 !p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {/* Internships Table */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : internships.length === 0 ? (
        <div className='text-center !py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-500 !mb-4'>No internships found</p>
          <button
            onClick={() => openModal()}
            className='text-blue-600 hover:text-blue-700 font-medium'
          >
            Create your first internship
          </button>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='hidden lg:block overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Title
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Company
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Mode
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Duration
                  </th>
                  <th className='!px-6 !py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {internships.map((intern) => (
                  <tr key={intern._id} className='hover:bg-gray-50'>
                    <td className='!px-6 !py-4 text-sm font-medium text-gray-900'>
                      {intern.title}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500'>
                      {intern.companyName}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500 capitalize'>
                      {intern.mode}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500'>
                      {intern.durationWeeks} weeks
                    </td>
                    <td className='!px-6 !py-4 text-right text-sm'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => openModal(intern)}
                          className='text-blue-600 hover:text-blue-900 !p-1'
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(intern._id)}
                          className='text-red-600 hover:text-red-900 !p-1'
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className='lg:hidden'>
            {internships.map((intern) => (
              <div key={intern._id} className='!p-4 border-b hover:bg-gray-50'>
                <h3 className='font-semibold text-gray-800 !mb-1'>
                  {intern.title}
                </h3>
                <p className='text-sm text-gray-600 !mb-1'>
                  {intern.companyName}
                </p>
                <p className='text-sm text-gray-500 !mb-2'>
                  {intern.durationWeeks} weeks • {intern.mode}
                </p>
                <div className='flex justify-end gap-3'>
                  <button
                    onClick={() => openModal(intern)}
                    className='text-blue-600 hover:text-blue-900'
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(intern._id)}
                    className='text-red-600 hover:text-red-900'
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center !p-4 z-50'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto max-h-[90vh] h-full'>
            <div className='!p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl'>
              <h2 className='text-xl font-semibold text-white'>
                {editingInternship ? 'Edit Internship' : 'Create Internship'}
              </h2>
              <button
                onClick={closeModal}
                className='text-white/80 hover:text-white transition-colors'
              >
                <FiX size={26} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className='!p-6 space-y-5 bg-gray-50 rounded-b-2xl'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Title
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Company Name
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Location
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mode: e.target.value as Internship['mode'],
                      })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white'
                  >
                    <option value='onsite'>Onsite</option>
                    <option value='remote'>Remote</option>
                    <option value='hybrid'>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Duration (weeks)
                  </label>
                  <input
                    type='number'
                    min={1}
                    required
                    value={formData.durationWeeks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationWeeks: Number(e.target.value),
                      })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none'
                />
              </div>

              <div className='flex gap-3 pt-2'>
                <button
                  type='submit'
                  disabled={submitting}
                  className={`flex-1 !px-5 !py-2.5 rounded-lg font-medium shadow transition-all duration-200 ${
                    submitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {submitting
                    ? 'Saving...'
                    : editingInternship
                    ? 'Update Internship'
                    : 'Create Internship'}
                </button>

                <button
                  type='button'
                  onClick={closeModal}
                  className='flex-1 !px-5 !py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-all shadow-sm'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center !p-4 z-50'>
          <div className='bg-white rounded-lg max-w-md w-full !p-6'>
            <h3 className='text-lg font-semibold !mb-4'>Confirm Delete</h3>
            <p className='text-gray-600 !mb-6'>
              Are you sure you want to delete this internship? This action
              cannot be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className='flex-1 !px-4 !py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 !px-4 !py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
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

          {/* Page Numbers (show up to 5 pages around current) */}
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

export default InternshipsPage
