'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import api from '@/componants/lib/axios'

interface Service {
  _id: string
  servicetitle: string
  description: string
  createdAt?: string
  updatedAt?: string
}

interface ServiceFormData {
  servicetitle: string
  description: string
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch all services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('http://localhost:4000/api/services')
      setServices(response.data.services)
      setError('')
    } catch (err) {
      console.error('Error fetching services:', err)
      setError('Failed to fetch services.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // Reset form
  const resetForm = () => {
    setFormData({
      servicetitle: '',
      description: '',
    })
    setEditingService(null)
  }

  const [formData, setFormData] = useState<ServiceFormData>({
    servicetitle: '',
    description: '',
  })

  // Open Modal
  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        servicetitle: service.servicetitle || '',
        description: service.description || '',
      })
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  // Close Modal
  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  // Submit (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        servicetitle: formData.servicetitle,
        description: formData.description,
      }

      if (editingService) {
        await api.put(
          `http://localhost:4000/api/services/${editingService._id}`,
          payload
        )
      } else {
        await api.post('http://localhost:4000/api/services', payload)
      }

      await fetchServices()
      closeModal()
    } catch (err) {
      console.error('Error saving service:', err)
      alert('Failed to save service. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete Service
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`http://localhost:4000/api/services/${id}`)
      await fetchServices()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting service:', err)
      alert('Failed to delete service. Please try again.')
    }
  }

  return (
    <div className='!p-4 sm:!p-6 lg:!p-8'>
      {/* Header */}
      <div className='!mb-6 sm:!mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Services Management
        </h1>
        <button
          onClick={() => openModal()}
          className='inline-flex items-center gap-2 !px-4 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          <FiPlus size={20} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className='!mb-4 !p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {/* Services Table */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : services.length === 0 ? (
        <div className='text-center !py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-500 !mb-4'>No services found</p>
          <button
            onClick={() => openModal()}
            className='text-blue-600 hover:text-blue-700 font-medium'
          >
            Create your first service
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
                    Description
                  </th>
                  <th className='!px-6 !py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {services.map((srv) => (
                  <tr key={srv._id} className='hover:bg-gray-50'>
                    <td className='!px-6 !py-4 text-sm font-medium text-gray-900'>
                      {srv.servicetitle}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500 truncate max-w-md'>
                      {srv.description}
                    </td>
                    <td className='!px-6 !py-4 text-right text-sm'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => openModal(srv)}
                          className='text-blue-600 hover:text-blue-900 !p-1'
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(srv._id)}
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
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center !p-4 z-50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto max-h-[90vh] transition-all duration-300'>
            <div className='!p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl'>
              <h2 className='text-xl font-semibold text-white'>
                {editingService ? 'Edit Service' : 'Create New Service'}
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
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Service Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='Enter service title'
                  value={formData.servicetitle}
                  onChange={(e) =>
                    setFormData({ ...formData, servicetitle: e.target.value })
                  }
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Description
                </label>
                <textarea
                  required
                  placeholder='Enter service description...'
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
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
                    : editingService
                    ? 'Update Service'
                    : 'Create Service'}
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
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !p-4 z-50'>
          <div className='bg-white rounded-lg max-w-md w-full !p-6'>
            <h3 className='text-lg font-semibold !mb-4'>Confirm Delete</h3>
            <p className='text-gray-600 !mb-6'>
              Are you sure you want to delete this service? This action cannot
              be undone.
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
    </div>
  )
}

export default ServicesPage
