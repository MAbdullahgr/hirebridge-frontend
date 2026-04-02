'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { FiTrash2, FiEye, FiX } from 'react-icons/fi'
import api from '@/componants/lib/axios'

interface ContactMessage {
  _id: string
  username: string
  email: string
  subject: string
  message: string
  createdAt?: string
  updatedAt?: string
}

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  )
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/contact/messages', {
        params: { page: currentPage, limit: 10 },
      })
      const data = res.data
      setMessages(data.contacts || [])
      setTotalPages(data.totalPages || 1)
      setError('')
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/contact/messages/${id}`)
      await fetchMessages()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting message:', err)
      alert('Failed to delete message.')
    }
  }

  return (
    <div className='!p-4 sm:!p-6 lg:!p-8'>
      {/* Header */}
      <div className='!mb-6 sm:!mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Contact Messages
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className='!mb-4 !p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : messages.length === 0 ? (
        <div className='text-center !py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-500'>No messages found</p>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Subject
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Message
                  </th>
                  <th className='!px-6 !py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {messages.map((msg) => (
                  <tr key={msg._id} className='hover:bg-gray-50'>
                    <td className='!px-6 !py-4 text-sm font-medium text-gray-900'>
                      {msg.username}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500'>
                      {msg.email}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500'>
                      {msg.subject}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500 truncate max-w-xs'>
                      {msg.message}
                    </td>
                    <td className='!px-6 !py-4 text-right text-sm'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className='text-blue-600 hover:text-blue-900 !p-1'
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(msg._id)}
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

      {/* View Message Modal */}
      {selectedMessage && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !p-4 z-50'>
          <div className='bg-white rounded-lg max-w-lg w-full !p-6'>
            <div className='flex justify-between items-center border-b !pb-3'>
              <h2 className='text-lg font-semibold'>Message Details</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className='text-gray-400 hover:text-gray-600'
              >
                <FiX size={22} />
              </button>
            </div>

            <div className='!mt-4 space-y-3'>
              <p>
                <span className='font-medium'>Name:</span>{' '}
                {selectedMessage.username}
              </p>
              <p>
                <span className='font-medium'>Email:</span>{' '}
                {selectedMessage.email}
              </p>
              <p>
                <span className='font-medium'>Subject:</span>{' '}
                {selectedMessage.subject}
              </p>
              <p className='break-words'>
                <span className='font-medium'>Message:</span>{' '}
                {selectedMessage.message}
              </p>
              <p className='text-sm text-gray-500'>
                Sent:{' '}
                {new Date(selectedMessage.createdAt || '').toLocaleString()}
              </p>
            </div>

            <div className='flex justify-end !mt-6'>
              <button
                onClick={() => setSelectedMessage(null)}
                className='!px-5 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !p-4 z-50'>
          <div className='bg-white rounded-lg max-w-md w-full !p-6'>
            <h3 className='text-lg font-semibold !mb-4'>Confirm Delete</h3>
            <p className='text-gray-600 !mb-6'>
              Are you sure you want to delete this message? This action cannot
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

export default ContactMessagesPage
