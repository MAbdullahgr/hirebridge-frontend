'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import api from '@/componants/lib/axios'

type ProjectFileUrl = {
  url: string | null
  public_id: string | null
} | null

interface Project {
  _id: string
  projectTitle: string
  category: 'Business' | 'Development' | 'Design'
  techStack: string
  shortDescription: string
  fileUrl?: ProjectFileUrl
  createdAt?: string
  updatedAt?: string
}

interface ProjectFormData {
  projectTitle: string
  category: 'Business' | 'Development' | 'Design'
  techStack: string
  shortDescription: string
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const [formData, setFormData] = useState<ProjectFormData>({
    projectTitle: '',
    category: 'Business',
    techStack: '',
    shortDescription: '',
  })

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/projects', {
        params: { page: currentPage, limit: 10 },
      })
      const data = response.data
      const items = Array.isArray(data) ? data : data?.projects || []
      setProjects(items)
      setTotalPages(data?.totalPages || 1)
      setError('')
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchProjects()
  }, [currentPage, fetchProjects])

  // Reset form
  const resetForm = () => {
    setFormData({
      projectTitle: '',
      category: 'Business',
      techStack: '',
      shortDescription: '',
    })
    setSelectedFile(null)
    setEditingProject(null)
  }

  // Open modal
  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        projectTitle: project.projectTitle || '',
        category: project.category || 'Business',
        techStack: project.techStack || '',
        shortDescription: project.shortDescription || '',
      })
      setSelectedFile(null) // keep existing file unless a new one is chosen
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
      const form = new FormData()
      form.append('projectTitle', formData.projectTitle)
      form.append('category', formData.category)
      form.append('techStack', formData.techStack)
      form.append('shortDescription', formData.shortDescription)
      if (selectedFile) {
        form.append('file', selectedFile) // must be "file" to match multer upload.single('file')
      }

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, form)
      } else {
        await api.post('/projects', form)
      }

      await fetchProjects()
      closeModal()
    } catch (err) {
      console.error('Error saving project:', err)
      alert('Failed to save project. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete project
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`)
      await fetchProjects()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Failed to delete project. Please try again.')
    }
  }

  return (
    <div className='!p-4 sm:!p-6 lg:!p-8'>
      {/* Header */}
      <div className='!mb-6 sm:!mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Project Management
        </h1>
        <button
          onClick={() => openModal()}
          className='inline-flex items-center gap-2 !px-4 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          <FiPlus size={20} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className='!mb-4 !p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {/* Projects Table */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : projects.length === 0 ? (
        <div className='text-center !py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-500 !mb-4'>No projects found</p>
          <button
            onClick={() => openModal()}
            className='text-blue-600 hover:text-blue-700 font-medium'
          >
            Create your first project
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
                    Category
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tech Stack
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
                {projects.map((proj) => (
                  <tr key={proj._id} className='hover:bg-gray-50'>
                    <td className='!px-6 !py-4 text-sm font-medium text-gray-900'>
                      {proj.projectTitle}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500'>
                      {proj.category}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500'>
                      {proj.techStack}
                    </td>
                    <td className='!px-6 !py-4 text-sm text-gray-500 truncate max-w-xs'>
                      {proj.shortDescription}
                    </td>
                    <td className='!px-6 !py-4 text-right text-sm'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => openModal(proj)}
                          className='text-blue-600 hover:text-blue-900 !p-1'
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(proj._id)}
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
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto max-h-[90vh] h-full transition-all duration-300'>
            {/* Header */}
            <div className='!p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl'>
              <h2 className='text-xl font-semibold text-white'>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={closeModal}
                className='text-white/80 hover:text-white transition-colors'
              >
                <FiX size={26} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className='!p-6 space-y-5 bg-gray-50 rounded-b-2xl'
            >
              {/* Project Title */}
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Project Title
                </label>
                <input
                  type='text'
                  required
                  placeholder='Enter project title'
                  value={formData.projectTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, projectTitle: e.target.value })
                  }
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>

              {/* Category */}
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Project['category'],
                    })
                  }
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
                >
                  <option value='Business'>Business</option>
                  <option value='Development'>Development</option>
                  <option value='Design'>Design</option>
                </select>
              </div>

              {/* Tech Stack */}
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Tech Stack
                </label>
                <input
                  type='text'
                  required
                  placeholder='e.g. React, Node.js, MongoDB'
                  value={formData.techStack}
                  onChange={(e) =>
                    setFormData({ ...formData, techStack: e.target.value })
                  }
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
              </div>

              {/* Short Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Short Description
                </label>
                <textarea
                  required
                  placeholder='Write a short description of the project...'
                  rows={4}
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                />
              </div>

              {/* File picker (replaces File URL) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  File (optional)
                </label>
                <input
                  type='file'
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  // Accept anything; Cloudinary uses resource_type: 'auto'
                  // Example if you want specific types: accept='image/*,application/pdf,application/zip'
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
                />
              </div>

              {/* Action Buttons */}
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
                    : editingProject
                    ? 'Update Project'
                    : 'Create Project'}
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
              Are you sure you want to delete this project? This action cannot
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

export default ProjectsPage
