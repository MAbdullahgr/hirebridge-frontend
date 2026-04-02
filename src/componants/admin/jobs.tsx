'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import Link from 'next/link'
import api from '@/componants/lib/axios'
import axios from 'axios'

export interface Job {
  _id: string
  title: string
  role: string
  company: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  mode: 'onsite' | 'remote' | 'hybrid'
  salary?: string
  tags?: string[]
  experience: string
  description: string
  requirements: string
  application: string
  sampleResume?: {
    url: string | null
    public_id: string | null
  }
  deadline: string
  status: 'Active' | 'Inactive'
  createdAt?: string
  updatedAt?: string
  applicationsCount?: number
}

interface JobFormData {
  title: string
  role: string
  company: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  mode: 'onsite' | 'remote' | 'hybrid'
  salary: string
  tags: string
  experience: string
  description: string
  requirements: string
  application: string
  sampleResume: File | null
  deadline: string
  status: 'Active' | 'Inactive'
}

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    role: '',
    company: '',
    location: '',
    type: 'Full-time',
    mode: 'onsite',
    salary: '',
    tags: '',
    experience: '',
    description: '',
    requirements: '',
    application: '',
    sampleResume: null,
    deadline: '',
    status: 'Active',
  })

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/jobs', {
        params: { page: currentPage, limit: 10 },
      })
      // Support responses with { jobs, totalPages } or direct array
      setJobs(response.data.jobs || response.data)
      setTotalPages(response.data.totalPages || 1)
      setError('')
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchJobs()
  }, [currentPage, fetchJobs])

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const resetForm = () => {
    setFormData({
      title: '',
      role: '',
      company: '',
      location: '',
      type: 'Full-time',
      mode: 'onsite',
      salary: '',
      tags: '',
      experience: '',
      description: '',
      requirements: '',
      application: '',
      sampleResume: null,
      deadline: '',
      status: 'Active',
    })
    setEditingJob(null)
  }

  const openModal = (job?: Job) => {
    if (job) {
      setEditingJob(job)
      setFormData({
        title: job.title,
        role: job.role,
        company: job.company,
        location: job.location,
        type: job.type,
        mode: job.mode,
        salary: job.salary || '',
        tags: job.tags?.join(', ') || '',
        experience: job.experience,
        description: job.description,
        requirements: job.requirements,
        application: job.application,
        sampleResume: null, // keep null so user can upload new file if they want
        deadline: formatDateForInput(job.deadline),
        status: job.status,
      })
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const form = new FormData()
      form.append('title', formData.title)
      form.append('role', formData.role)
      form.append('company', formData.company)
      form.append('location', formData.location)
      form.append('type', formData.type)
      form.append('mode', formData.mode)
      if (formData.salary) form.append('salary', formData.salary)
      form.append('experience', formData.experience)
      form.append('description', formData.description)
      form.append('requirements', formData.requirements)
      form.append('application', formData.application)
      if (formData.deadline)
        form.append('deadline', new Date(formData.deadline).toISOString())
      form.append('status', formData.status)

      const tagsArr = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      // Keep sending JSON string; backend should parse it
      form.append('tags', JSON.stringify(tagsArr))

      if (formData.sampleResume) {
        // IMPORTANT: must be 'sampleResume' to match multer.single('sampleResume')
        form.append('sampleResume', formData.sampleResume)
      }

      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, form) // let axios set headers
      } else {
        await api.post('/jobs', form) // let axios set headers
      }

      await fetchJobs()
      closeModal()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(
          'Error saving job:',
          err.response?.status,
          err.response?.data || err.message
        )
        alert(
          err.response?.data?.message || 'Failed to save job. Please try again.'
        )
      } else {
        console.error('Unexpected error:', err)
        alert('An unexpected error occurred. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (jobId: string) => {
    try {
      await api.delete(`/jobs/${jobId}`)
      await fetchJobs()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting job:', err)
      alert('Failed to delete job. Please try again.')
    }
  }

  return (
    <div className='!p-4 sm:!p-6 lg:!p-8'>
      {/* Header */}
      <div className='!mb-6 sm:!mb-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Jobs Management
          </h1>
          <button
            onClick={() => openModal()}
            className='inline-flex items-center gap-2 !px-4 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <FiPlus size={20} />
            <span>Add New Job</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='!mb-4 !p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {/* Table / List */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className='text-center !py-12 bg-gray-50 rounded-lg'>
          <p className='text-gray-500 !mb-4'>No jobs found</p>
          <button
            onClick={() => openModal()}
            className='text-blue-600 hover:text-blue-700 font-medium'
          >
            Create your first job
          </button>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {/* Desktop Table */}
          <div className='hidden lg:block overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Job Title
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Role
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Company
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Type/Mode
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Deadline
                  </th>
                  <th className='!px-6 !py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Applications
                  </th>
                  <th className='!px-6 !py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {jobs.map((job) => (
                  <tr key={job._id} className='hover:bg-gray-50'>
                    <td className='!px-6 !py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {job.title}
                      </div>
                    </td>
                    <td className='!px-6 !py-4 whitespace-nowrap text-sm text-gray-500'>
                      {job.role}
                    </td>
                    <td className='!px-6 !py-4 whitespace-nowrap text-sm text-gray-500'>
                      {job.company}
                    </td>
                    <td className='!px-6 !py-4 whitespace-nowrap'>
                      <div className='flex flex-col gap-1'>
                        <span className='!px-2 !py-1 text-xs rounded-full bg-blue-100 text-blue-800'>
                          {job.type}
                        </span>
                        <span className='!px-2 !py-1 text-xs rounded-full bg-purple-100 text-purple-800'>
                          {job.mode}
                        </span>
                      </div>
                    </td>
                    <td className='!px-6 !py-4 whitespace-nowrap'>
                      <span
                        className={`!px-2 !vpy-1 text-xs rounded-full ${
                          job.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className='!px-6 !py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(job.deadline).toLocaleDateString()}
                    </td>
                    <td className='!px-6 !py-4 whitespace-nowrap text-sm text-gray-500'>
                      <Link
                        href={`/admin/job-applications?jobId=${job._id}`}
                        className='text-blue-600 hover:text-blue-700'
                      >
                        {job.applicationsCount || 0}
                      </Link>
                    </td>
                    <td className='!px-6 !py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          onClick={() => openModal(job)}
                          className='text-blue-600 hover:text-blue-900 !p-1'
                          title='Edit'
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(job._id)}
                          className='text-red-600 hover:text-red-900 !p-1'
                          title='Delete'
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

          {/* Mobile Cards */}
          <div className='lg:hidden'>
            {jobs.map((job) => (
              <div key={job._id} className='!p-4 border-b hover:bg-gray-50'>
                <div className='flex justify-between items-start !mb-2'>
                  <div>
                    <h3 className='font-medium text-gray-900'>{job.title}</h3>
                    <p className='text-sm text-gray-600'>{job.role}</p>
                    <p className='text-sm text-gray-500'>{job.company}</p>
                  </div>
                  <span
                    className={`!px-2 !py-1 text-xs rounded-full ${
                      job.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className='flex flex-wrap gap-2 !mb-3 text-sm'>
                  <span className='!px-2 !py-1 text-xs rounded-full bg-blue-100 text-blue-800'>
                    {job.type}
                  </span>
                  <span className='!px-2 !py-1 text-xs rounded-full bg-purple-100 text-purple-800'>
                    {job.mode}
                  </span>
                  <span className='text-gray-500'>
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <Link
                    href={`/admin/job-applications?jobId=${job._id}`}
                    className='text-blue-600 hover:text-blue-700 text-sm'
                  >
                    {job.applicationsCount || 0} applications
                  </Link>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => openModal(job)}
                      className='text-blue-600 hover:text-blue-900'
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(job._id)}
                      className='text-red-600 hover:text-red-900'
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center !p-4 z-50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-y-auto max-h-[90vh] h-full transition-all duration-300'>
            {/* Header */}
            <div className='!p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl'>
              <h2 className='text-xl font-semibold text-white'>
                {editingJob ? 'Edit Job' : 'Create New Job'}
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
              encType='multipart/form-data'
            >
              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Job Title *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder='e.g., Senior Software Engineer'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Role *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder='e.g., Backend Developer'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Company *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Location *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder='e.g., New York, NY'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Job Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as Job['type'],
                      })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
                  >
                    <option value='Full-time'>Full-time</option>
                    <option value='Part-time'>Part-time</option>
                    <option value='Contract'>Contract</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Work Mode *
                  </label>
                  <select
                    required
                    value={formData.mode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mode: e.target.value as Job['mode'],
                      })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
                  >
                    <option value='onsite'>Onsite</option>
                    <option value='remote'>Remote</option>
                    <option value='hybrid'>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Experience Required *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder='e.g., 3-5 years'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Salary
                  </label>
                  <input
                    type='text'
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    placeholder='e.g., $50,000 - $70,000'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Application Deadline *
                  </label>
                  <input
                    type='date'
                    required
                    min={today}
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Job['status'],
                      })
                    }
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white'
                  >
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Tags and Application Method */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Tags (comma-separated)
                  </label>
                  <input
                    type='text'
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder='e.g., JavaScript, React, Node.js'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Application Method *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.application}
                    onChange={(e) =>
                      setFormData({ ...formData, application: e.target.value })
                    }
                    placeholder='e.g., hr@company.com or https://apply.link'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>
              </div>

              {/* Sample Resume Link / File */}
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Sample Resume Link (optional)
                </label>
                <input
                  type='url'
                  value={''} // we prefer file upload; keep URL input empty and optional. If you want to support direct URL editing, add additional state handling.
                  onChange={() => {}}
                  placeholder='Use file upload below to attach a sample resume, or paste a URL here if desired'
                  className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  disabled
                />
                <small className='text-gray-500 text-sm'>
                  Use the file upload below to attach a resume (recommended).
                </small>
              </div>

              {/* File Upload */}
              <div>
                <label className='block text-sm font-medium text-gray-700 !mb-1'>
                  Sample Resume File (optional)
                </label>
                <input
                  type='file'
                  accept='.pdf,.doc,.docx'
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sampleResume: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  className='w-full text-sm text-gray-700 file:mr-3 file:!py-2 file:!px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200'
                />
                {editingJob?.sampleResume?.url && (
                  <p className='text-sm text-gray-500 !mt-2'>
                    Current file:{' '}
                    <a
                      href={editingJob.sampleResume.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      View existing sample
                    </a>
                  </p>
                )}
              </div>

              {/* Text Areas */}
              <div className='space-y-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Job Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder='Describe the job role, responsibilities, and what the candidate will be doing...'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 !mb-1'>
                    Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    placeholder='List the qualifications, skills, and experience required for this position...'
                    className='w-full !px-4 !py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
                  />
                </div>
              </div>

              {/* Action Buttons */}
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
                  {submitting
                    ? 'Saving...'
                    : editingJob
                    ? 'Update Job'
                    : 'Create Job'}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !p-4 z-50'>
          <div className='bg-white rounded-lg max-w-md w-full !p-6'>
            <h3 className='text-lg font-semibold !mb-4'>Confirm Delete</h3>
            <p className='text-gray-600 !mb-6'>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteConfirm(null)}
                className='flex-1 !px-4 !py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm!)}
                className='flex-1 !px-4 !py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
              >
                Delete
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

export default JobsPage
