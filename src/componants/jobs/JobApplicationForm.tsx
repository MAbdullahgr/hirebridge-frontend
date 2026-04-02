'use client'
import React, { useState, useEffect, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'
import api from '@/componants/lib/axios'

import {
  BsArrowLeft,
  BsCheckCircle,
  BsLightningCharge,
  BsBriefcaseFill,
} from 'react-icons/bs'
import {
  FiMail,
  FiPhone,
  FiTool,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'
import { IoMdRocket } from 'react-icons/io'
import { MdAutoAwesome } from 'react-icons/md'
import axios from 'axios'
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
  error?: string
  helperText?: string
  value?: string
}

interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  value?: string
  minRows?: number
}

interface JobApplicationFormData {
  email: string
  phone: string
  position: string
  coverLetter: string
  experience: string
  skills: string
  resume?: FileList
}

export default function JobApplicationForm() {
  const { id } = useParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<JobApplicationFormData>()

  const watchedFields = watch()
  const watchedResume = watch('resume')

  useEffect(() => {
    const textFields: (keyof JobApplicationFormData)[] = [
      'email',
      'phone',
      'position',
      'coverLetter',
      'experience',
      'skills',
    ]
    const filledText = textFields.filter((field) => {
      const v = watchedFields[field]
      return typeof v === 'string' && v.trim() !== ''
    }).length
    const hasResume = !!(watchedResume && watchedResume.length > 0)
    setFormProgress(((filledText + (hasResume ? 1 : 0)) / 7) * 100)
  }, [watchedFields, watchedResume])

  const onSubmit = async (data: JobApplicationFormData) => {
    const jobId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
    if (!jobId) {
      setError('Job ID is missing')
      return
    }

    setIsSubmitting(true)
    setSubmitSuccess(false)
    setError(null)

    try {
      const form = new FormData()
      form.append('email', data.email)
      form.append('phone', data.phone)
      form.append('position', data.position)
      form.append('coverLetter', data.coverLetter)
      form.append('experience', data.experience)
      form.append(
        'skills',
        data.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .join(', ')
      )

      if (data.resume && data.resume[0]) {
        form.append('resume', data.resume[0]) // must be 'resume' to match multer.single('resume')
      } else {
        setError('Resume file is required')
        setIsSubmitting(false)
        return
      }

      const response = await api.post(`/jobs/${jobId}/apply`, form) // let axios set Content-Type

      if (response.data?.success) {
        setSubmitSuccess(true)
        reset()
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setError(response.data?.message || 'Failed to submit application')
      }
    } catch (err: unknown) {
      let message = 'Failed to submit application'
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          message = err.response.data.message
        } else if (err.response?.status === 400) {
          message =
            'You have already applied for this job or invalid data provided'
        } else if (err.response?.status === 401) {
          message = 'Please login to apply for this job'
          setTimeout(() => router.push('/login'), 2000)
        } else {
          message = err.message || message
        }
      } else if (err instanceof Error) {
        message = err.message
      }
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const skillsValue = watch('skills')

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      {/* Background blobs */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>

      {/* Navbar */}
      <nav className='sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm'>
        <div className='max-w-5xl !mx-auto !px-4 sm:!px-6 lg:!px-8'>
          <div className='flex items-center justify-between !py-4'>
            <button
              onClick={() => router.back()}
              className='group inline-flex cursor-pointer items-center gap-2.5 !px-4 !py-2 text-gray-700 hover:text-indigo-600 font-medium transition-all duration-300 hover:bg-indigo-50 rounded-xl'
            >
              <BsArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
              <span className='hidden sm:inline'>Back to Job Details</span>
            </button>

            <div className='hidden sm:flex items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>
                Progress
              </span>
              <div className='w-36 h-2 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500'
                  style={{ width: `${formProgress}%` }}
                />
              </div>
              <span className='text-sm font-bold text-indigo-600'>
                {Math.round(formProgress)}%
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className='relative max-w-5xl !mx-auto !px-4 sm:!px-6 lg:!px-8 !py-10'>
        <div className='bg-white rounded-3xl shadow-2xl overflow-hidden !mb-10 border border-gray-100'>
          {/* Header */}
          <div className='relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 !p-12 overflow-hidden'>
            <div className='absolute inset-0 opacity-10'>
              <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                  <pattern
                    id='dots'
                    width='20'
                    height='20'
                    patternUnits='userSpaceOnUse'
                  >
                    <circle cx='2' cy='2' r='1' fill='white' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#dots)' />
              </svg>
            </div>
            <div className='relative text-center'>
              <div className='inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl !mb-5'>
                <BsBriefcaseFill className='w-12 h-12 text-white' />
              </div>
              <h1 className='text-4xl sm:text-5xl font-bold text-white !mb-2'>
                Job Application
              </h1>
              <p className='text-white/80'>
                Complete your application to apply for this position
              </p>
              <p className='text-white/60 text-sm !mt-2'>
                Your profile name will be used for this application
              </p>
            </div>
          </div>

          {/* Alerts */}
          {submitSuccess && (
            <div className='!mx-8 !mt-6 !mb-4 p-6 bg-green-50 border border-green-200 rounded-2xl text-green-800 shadow-sm flex items-center gap-4'>
              <BsCheckCircle className='w-8 h-8 text-green-600 flex-shrink-0' />
              <div>
                <p className='font-semibold text-lg'>
                  Application Submitted Successfully! 🎉
                </p>
                <p className='text-sm'>
                  Our team will review it and contact you within 3-5 business
                  days.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className='!mx-8 !mt-6 !mb-4 !p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 shadow-sm flex items-center gap-3'>
              <FiAlertCircle className='w-6 h-6 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='!p-10 lg:!p-12 space-y-8'
            encType='multipart/form-data'
            noValidate
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <FormInput
                label='Email Address'
                icon={<FiMail className='w-4 h-4 text-purple-600' />}
                placeholder='your.email@example.com'
                type='email'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
                value={watchedFields.email}
              />
              <FormInput
                label='Phone Number'
                icon={<FiPhone className='w-4 h-4 text-pink-600' />}
                placeholder='+1 (555) 123-4567'
                type='tel'
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\d\s\-\+()]+$/,
                    message: 'Invalid phone number',
                  },
                })}
                error={errors.phone?.message}
                value={watchedFields.phone}
              />
              <FormInput
                label='Position'
                icon={<BsBriefcaseFill className='w-4 h-4 text-indigo-500' />}
                placeholder='Position you are applying for'
                {...register('position', { required: 'Position is required' })}
                error={errors.position?.message}
                value={watchedFields.position}
              />

              {/* Resume File Upload */}
              <div className='group'>
                <label className='flex items-center gap-2.5 text-sm font-semibold text-gray-700 !mb-2'>
                  Resume (PDF/DOC/DOCX)
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type='file'
                  accept='.pdf,.doc,.docx'
                  {...register('resume', {
                    required: 'Resume file is required',
                  })}
                  className='w-full text-sm text-gray-700 file:!mr-3 file:!py-2 file:!px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 border-2 border-gray-200 rounded-xl !px-5 !py-2.5 bg-white'
                />
                {errors.resume && (
                  <p className='!mt-2 text-sm text-red-600 flex items-center gap-1.5'>
                    <FiAlertCircle className='w-4 h-4' />
                    {errors.resume.message as string}
                  </p>
                )}
                <p className='!mt-2 text-xs text-gray-500'>
                  Max size 5MB. Accepted formats: PDF, DOC, DOCX.
                </p>
              </div>
            </div>

            <FormTextarea
              label='Cover Letter'
              placeholder='Dear Hiring Manager, I am excited to apply for this position because...'
              {...register('coverLetter', {
                required: 'Cover letter is required',
                minLength: {
                  value: 50,
                  message: 'Cover letter must be at least 50 characters',
                },
              })}
              error={errors.coverLetter?.message}
              value={watchedFields.coverLetter}
              minRows={6}
            />

            <FormTextarea
              label='Relevant Experience'
              placeholder='• Previous role at Company (2020-2023)\n• Led team of 5 developers\n• Implemented key features'
              {...register('experience', {
                required: 'Experience is required',
                minLength: {
                  value: 20,
                  message: 'Please provide more details about your experience',
                },
              })}
              error={errors.experience?.message}
              value={watchedFields.experience}
              minRows={5}
            />

            <FormInput
              label='Technical Skills'
              icon={<FiTool className='w-4 h-4 text-purple-600' />}
              placeholder='React, TypeScript, Node.js, Tailwind CSS, Git, Docker'
              {...register('skills', {
                required: 'Skills are required',
                minLength: {
                  value: 5,
                  message: 'Please enter at least one skill',
                },
              })}
              error={errors.skills?.message}
              value={watchedFields.skills}
              helperText='Enter skills separated by commas'
            />

            {skillsValue && (
              <div className='!mt-4 !p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200'>
                <p className='text-xs font-semibold text-purple-700 !mb-3 flex items-center gap-2'>
                  <MdAutoAwesome className='w-4 h-4' />
                  Your Skills Preview
                </p>
                <div className='flex flex-wrap gap-2'>
                  {skillsValue.split(',').map((skill, index) =>
                    skill.trim() ? (
                      <span
                        key={index}
                        className='inline-flex items-center gap-1.5 !px-3.5 !py-2 bg-white border border-purple-200 text-purple-700 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow'
                      >
                        <HiOutlineSparkles className='w-4 h-4 text-purple-500' />
                        {skill.trim()}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            )}

            <div className='!mt-10 flex justify-center'>
              <button
                type='submit'
                disabled={isSubmitting || !id}
                className={`group inline-flex items-center gap-3 !px-12 !py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${
                  isSubmitting || !id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700'
                }`}
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <IoMdRocket className='w-6 h-6 transition-transform group-hover:rotate-12' />
                    <span>Submit Application</span>
                    <BsLightningCharge className='w-5 h-5 transition-transform group-hover:translate-x-1' />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

const FormInput = ({
  label,
  icon,
  error,
  helperText,
  value,
  ...props
}: FormInputProps) => (
  <div className='group'>
    <label className='flex items-center gap-2.5 text-sm font-semibold text-gray-700 !mb-2'>
      {icon && (
        <div className='w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center'>
          {icon}
        </div>
      )}
      {label}
      <span className='text-red-500'>*</span>
    </label>
    <div className='relative'>
      <input
        {...props}
        className={`w-full !px-5 !py-3.5 border-2 ${
          error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-200 bg-white hover:border-indigo-300'
        } rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 text-gray-700 font-medium`}
      />
      {!error && value && (
        <FiCheckCircle className='absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500' />
      )}
    </div>
    {error && (
      <p className='!mt-2 text-sm text-red-600 flex items-center gap-1.5'>
        <FiAlertCircle className='w-4 h-4' />
        {error}
      </p>
    )}
    {helperText && !error && (
      <p className='!mt-2 text-xs text-gray-500 flex items-center gap-1.5'>
        <FiInfo className='w-4 h-4' />
        {helperText}
      </p>
    )}
  </div>
)

const FormTextarea = ({
  label,
  error,
  value,
  minRows = 4,
  ...props
}: FormTextareaProps) => (
  <div className='group'>
    <label className='flex items-center gap-2.5 text-sm font-semibold text-gray-700 !mb-2'>
      {label}
      <span className='text-red-500'>*</span>
    </label>
    <textarea
      {...props}
      rows={minRows}
      className={`w-full !px-5 !py-4 border-2 ${
        error
          ? 'border-red-300 bg-red-50'
          : 'border-gray-200 bg-white hover:border-indigo-300'
      } rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 resize-none text-gray-700 leading-relaxed`}
    />
    {error && (
      <p className='!mt-2 text-sm text-red-600 flex items-center gap-1.5'>
        <FiAlertCircle className='w-4 h-4' />
        {error}
      </p>
    )}
    {value && (
      <p className='!mt-1 text-xs text-gray-500 text-right'>
        {value.length} characters
      </p>
    )}
  </div>
)
