'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'
import { BsArrowLeft, BsCheckCircle } from 'react-icons/bs'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import { MdVerified } from 'react-icons/md'
import api from '../lib/axios'

interface InternshipApplicationFormData {
  email: string
  phone: string
  fieldOfStudy: string
  university: string
  cgpa: string
  semester: string
  resume: FileList // changed to FileList for file input
  reason: string
}

const mockInternshipData = {
  _id: '1',
  title: 'Fill in all your Details',
}

export default function InternshipApplicationForm() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const internshipDetails = mockInternshipData

  const { register, handleSubmit, watch, reset } =
    useForm<InternshipApplicationFormData>()

  const watchedFields = watch()

  useEffect(() => {
    const fields: (keyof InternshipApplicationFormData)[] = [
      'email',
      'phone',
      'fieldOfStudy',
      'university',
      'cgpa',
      'semester',
      'resume',
      'reason',
    ]
    const filledFields = fields.filter((field) => {
      const value = watchedFields[field]
      if (field === 'resume') {
        return value && value.length > 0
      }
      return value && (value as string).trim() !== ''
    })
    setFormProgress((filledFields.length / fields.length) * 100)
  }, [watchedFields])

  const onSubmit = async (data: InternshipApplicationFormData) => {
    setIsSubmitting(true)
    setErrorMessage('')
    setSubmitSuccess(false)

    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('fieldOfStudy', data.fieldOfStudy)
      formData.append('university', data.university)
      formData.append('cgpa', data.cgpa)
      formData.append('semester', data.semester)
      formData.append('reason', data.reason)

      if (data.resume && data.resume[0]) {
        formData.append('resume', data.resume[0]) // backend expects field name 'resume'
      }

      await api.post(`/internships/${id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setSubmitSuccess(true)
      reset()
    } catch (error: unknown) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage('Something went wrong')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitSuccess(false), 5000)
    }
  }

  const semesters = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester',
    'Graduated',
    'Post-Graduate',
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50'>
      <nav className='sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm'>
        <div className='max-w-5xl !mx-auto !px-4 sm:!px-6 lg:!px-8'>
          <div className='flex items-center justify-between !py-4'>
            <button
              onClick={() => router.back()}
              className='group inline-flex items-center gap-2.5 !px-4 !py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 hover:bg-emerald-50 rounded-xl'
            >
              <BsArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
              <span className='hidden sm:inline'>
                Back to Internship Details
              </span>
            </button>

            <div className='hidden sm:flex items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>
                Progress
              </span>
              <div className='w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500'
                  style={{ width: `${formProgress}%` }}
                />
              </div>
              <span className='text-sm font-bold text-emerald-600'>
                {Math.round(formProgress)}%
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className='relative max-w-5xl !mx-auto !px-4 sm:!px-6 lg:!px-8 !py-8'>
        <div className='bg-white rounded-3xl shadow-2xl overflow-hidden !mb-8 border border-gray-100'>
          <div className='relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 !p-10 text-center'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl !mb-4'>
              <HiOutlineAcademicCap className='w-10 h-10 text-white' />
            </div>
            <h1 className='text-4xl font-bold text-white !mb-3'>
              Internship Application
            </h1>
            <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-md !px-5 !py-2.5 rounded-full'>
              <MdVerified className='w-5 h-5 text-white' />
              <p className='text-white font-medium'>
                {internshipDetails.title}
              </p>
            </div>
          </div>

          {submitSuccess && (
            <div className='!mx-8 !mt-6 !mb-4 !p-5 bg-green-50 border border-green-200 rounded-2xl'>
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                  <BsCheckCircle className='w-6 h-6 text-green-600' />
                </div>
                <div className='flex-1'>
                  <p className='text-green-800 font-semibold text-lg !mb-1'>
                    Application Submitted Successfully! 🎓
                  </p>
                  <p className='text-green-600'>
                    We’ve received your internship application. Our team will
                    review it soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className='!mx-8 !mt-6 !mb-4 !p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700'>
              ⚠️ {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='!p-8 lg:!p-10 space-y-8'
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div>
                <label className='font-semibold text-gray-700 !mb-2 block'>
                  Email Address *
                </label>
                <input
                  type='email'
                  {...register('email', { required: 'Email is required' })}
                  className='w-full !p-3 border rounded-lg'
                  placeholder='student@email.com'
                />
              </div>
              <div>
                <label className='font-semibold text-gray-700 !mb-2 block'>
                  Phone Number *
                </label>
                <input
                  type='tel'
                  {...register('phone', { required: 'Phone is required' })}
                  className='w-full !p-3 border rounded-lg'
                  placeholder='1234567890'
                />
              </div>
              <div>
                <label className='font-semibold text-gray-700 !mb-2 block'>
                  Field of Study *
                </label>
                <input
                  {...register('fieldOfStudy', {
                    required: 'Field of study is required',
                  })}
                  className='w-full !p-3 border rounded-lg'
                  placeholder='Computer Science'
                />
              </div>
              <div>
                <label className='font-semibold text-gray-700 !mb-2 block'>
                  University *
                </label>
                <input
                  {...register('university', {
                    required: 'University is required',
                  })}
                  className='w-full !p-3 border rounded-lg'
                  placeholder='XYZ University'
                />
              </div>
              <div>
                <label className='font-semibold text-gray-700 !mb-2 block'>
                  CGPA *
                </label>
                <input
                  type='text'
                  {...register('cgpa', { required: 'CGPA is required' })}
                  className='w-full !p-3 border rounded-lg'
                  placeholder='3.8'
                />
              </div>
              <div>
                <label className='font-semibold text-gray-700 !mb-2 block'>
                  Semester *
                </label>
                <select
                  {...register('semester', {
                    required: 'Semester is required',
                  })}
                  className='w-full !p-3 border rounded-lg'
                >
                  <option value=''>Select your semester</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resume File Upload (Cloudinary Integration) */}
              <div className='lg:col-span-2'>
                <label className='font-semibold text-gray-700 !mb-2 block'>
                  Upload Resume (PDF/DOC/DOCX) *
                </label>
                <input
                  type='file'
                  accept='.pdf,.doc,.docx'
                  {...register('resume', { required: 'Resume is required' })}
                  className='w-full !p-3 border rounded-lg bg-gray-50 file:!mr-4 file:!py-2 file:!px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200'
                />
              </div>

              <div className='lg:col-span-2'>
                <label className='font-semibold text-gray-700 !mb-2 block'>
                  Why do you want this internship? *
                </label>
                <textarea
                  rows={6}
                  {...register('reason', { required: 'Reason is required' })}
                  className='w-full !p-3 border rounded-lg'
                  placeholder='I am passionate about this field...'
                />
              </div>
            </div>

            <div className='flex justify-center'>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`!px-10 !py-4 rounded-2xl font-bold text-white ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
