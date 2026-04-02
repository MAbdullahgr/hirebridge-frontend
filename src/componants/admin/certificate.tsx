'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiTrash2,
  FiPlus,
  FiX,
  // FiDownload,
  // FiExternalLink,
} from 'react-icons/fi'
import api from '@/componants/lib/axios'
import type { AxiosError } from 'axios'

type CertificateFile = {
  url: string
  public_id: string
}

interface Certificate {
  _id: string
  recipientEmail: string
  recipientName?: string
  certificateName: string
  issuedOn?: string
  certificateFile?: CertificateFile
  createdAt?: string
  updatedAt?: string
}

const ITEMS_PER_PAGE = 10

const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  // Form state
  const [recipientEmail, setRecipientEmail] = useState<string>('')
  const [recipientName, setRecipientName] = useState<string>('')
  const [certificateName, setCertificateName] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Helpers
  // const buildDownloadUrl = (url: string | undefined): string => {
  //   if (!url) return '#'
  //   if (url.includes('/upload/') && !url.includes('/fl_attachment')) {
  //     return url.replace('/upload/', '/upload/fl_attachment/')
  //   }
  //   return url
  // }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // Fetch certificates
  const fetchCertificates = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError('')

      // NOTE: Using '/certificates' (plural). Change if your backend uses another path.
      const response = await api.get('/certificate')
      const data = response.data

      const items: Certificate[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.certificates)
        ? data.certificates
        : []

      setCertificates(items)
    } catch (rawErr: unknown) {
      console.error('Error fetching certificates:', rawErr)
      let message = 'Failed to fetch certificates'
      if ((rawErr as AxiosError)?.isAxiosError) {
        const axiosErr = rawErr as AxiosError
        // @ts-expect-error safe check: axios error response typing varies
        message = axiosErr?.response?.data || axiosErr.message || message
      } else if (rawErr instanceof Error) {
        message = rawErr.message
      }
      setError(message)
      setCertificates([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  // Derived paging
  const pagedCertificates = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return certificates.slice(start, end)
  }, [certificates, currentPage])

  useEffect(() => {
    const pages = Math.max(1, Math.ceil(certificates.length / ITEMS_PER_PAGE))
    setTotalPages(pages)
    if (currentPage > pages) setCurrentPage(pages)
  }, [certificates, currentPage])

  // Modal controls
  const openModal = () => {
    setRecipientEmail('')
    setRecipientName('')
    setCertificateName('')
    setSelectedFile(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setRecipientEmail('')
    setRecipientName('')
    setCertificateName('')
    setSelectedFile(null)
  }

  // Submit form (multipart/form-data)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!recipientEmail || !certificateName || !selectedFile) {
      setError('Please provide recipient email, certificate name, and file.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const form = new FormData()
      form.append('recipientEmail', recipientEmail)
      if (recipientName) form.append('recipientName', recipientName)
      form.append('certificateName', certificateName)
      form.append('certificateFile', selectedFile)

      // keep withCredentials handled in your axios instance
      await api.post('/certificate', form)

      await fetchCertificates()
      closeModal()
    } catch (rawErr: unknown) {
      console.error('Error issuing certificate:', rawErr)
      let message = 'Failed to issue certificate. Please try again.'
      if ((rawErr as AxiosError)?.isAxiosError) {
        const axiosErr = rawErr as AxiosError
        // @ts-expect-error safe access to possible response message
        message = axiosErr?.response?.data || axiosErr.message || message
      } else if (rawErr instanceof Error) {
        message = rawErr.message
      }
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Delete certificate
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/certificate/${id}`)
      await fetchCertificates()
      setDeleteConfirm(null)
    } catch (rawErr: unknown) {
      console.error('Error deleting certificate:', rawErr)
      let message = 'Failed to delete certificate. Please try again.'
      if ((rawErr as AxiosError)?.isAxiosError) {
        const axiosErr = rawErr as AxiosError
        // @ts-expect-error safe access
        message = axiosErr?.response?.data || axiosErr.message || message
      } else if (rawErr instanceof Error) {
        message = rawErr.message
      }
      setError(message)
    }
  }

  // File input change handler
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  return (
    <div className='!p-4 sm:!p-6 lg:!p-8'>
      {/* Header */}
      <div className='!mb-6 sm:!mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Certificate Management
        </h1>
        <button
          onClick={openModal}
          className='inline-flex items-center gap-2 !px-4 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          <FiPlus size={20} />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className='!mb-4 !p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {/* Certificates Table */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : certificates.length === 0 ? (
        <div className='text-center !py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-500 !mb-4'>No certificates found</p>
          <button
            onClick={openModal}
            className='text-blue-600 hover:text-blue-700 font-medium'
          >
            Issue your first certificate
          </button>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='hidden lg:block overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Certificate
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Recipient
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Issued
                  </th>
                  <th className='!px-6 !py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {pagedCertificates.map((cert) => {
                  const timestamp =
                    cert.issuedOn ?? cert.createdAt ?? new Date().toISOString()
                  const issuedAt = new Date(timestamp).toLocaleString()
                  // const viewUrl = cert.certificateFile?.url ?? '#'
                  // const downloadUrl = buildDownloadUrl(viewUrl)
                  return (
                    <tr key={cert._id} className='hover:bg-gray-50'>
                      <td className='!px-6 !py-4 text-sm font-medium text-gray-900'>
                        {cert.certificateName}
                      </td>
                      <td className='!px-6 !py-4 text-sm text-gray-700'>
                        {cert.recipientName ?? '-'}
                      </td>
                      <td className='!px-6 !py-4 text-sm text-gray-500'>
                        {cert.recipientEmail}
                      </td>
                      <td className='!px-6 !py-4 text-sm text-gray-500'>
                        {issuedAt}
                      </td>
                      <td className='!px-6 !py-4 text-right text-sm'>
                        <div className='flex justify-end gap-2'>
                          {/* <a
                            href={downloadUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 !px-3 !py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100'
                            title='Download'
                          >
                            <FiDownload size={16} />
                            Download
                          </a>
                          <a
                            href={viewUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 !px-3 !py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100'
                            title='View Online'
                          >
                            <FiExternalLink size={16} />
                            View
                          </a> */}
                          <button
                            onClick={() => setDeleteConfirm(cert._id)}
                            className='inline-flex items-center gap-2 !px-3 !py-2 bg-red-50 text-red-700 rounded hover:bg-red-100'
                            title='Delete'
                          >
                            <FiTrash2 size={16} />
                            Delete
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

      {/* Create Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center !p-4 z-50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto max-h-[90vh] transition-all duration-300'>
            {/* Header */}
            <div className='!p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl'>
              <h2 className='text-xl font-semibold text-white'>
                Issue New Certificate
              </h2>
              <button
                onClick={closeModal}
                className='text-white/80 hover:text-white'
              >
                <FiX size={26} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className='!p-6 space-y-5 bg-gray-50 rounded-b-2xl'
            >
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Recipient Email
                </label>
                <input
                  type='email'
                  required
                  placeholder='user@example.com'
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Recipient Name (optional)
                </label>
                <input
                  type='text'
                  placeholder='John Doe'
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Certificate Name
                </label>
                <input
                  type='text'
                  required
                  placeholder='React Internship Completion'
                  value={certificateName}
                  onChange={(e) => setCertificateName(e.target.value)}
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Certificate File (PDF or Image)
                </label>
                <input
                  type='file'
                  accept='.pdf,image/*'
                  onChange={onFileChange}
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
                />
                {selectedFile && (
                  <p className='text-xs text-gray-500 !mt-2'>
                    Selected: {selectedFile.name} (
                    {Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div className='flex gap-3 !pt-2'>
                <button
                  type='submit'
                  disabled={submitting}
                  className={`flex-1 !px-5 !py-2.5 rounded-lg font-medium shadow transition-all duration-200 ${
                    submitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {submitting ? 'Issuing…' : 'Issue & Send'}
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
              Are you sure you want to delete this certificate? This action
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

export default CertificatesPage
