'use client'

import { ReactNode } from 'react'

type Option = {
  value: string
  label: string
}

type FormField = {
  label: string
  type: string
  name: string
  placeholder?: string
  required?: boolean
  options?: Option[] // For select/radio/checkbox
}

type AuthFormProps = {
  title: string
  fields: FormField[]
  buttonText: string
  footer?: ReactNode
  onSubmit: (data: Record<string, string | FileList>) => void | Promise<void>
  backgroundImage?: string
  isLoading?: boolean
  error?: string
  success?: string
  formWidth: string
}

export default function AuthForm({
  title,
  fields,
  buttonText,
  footer,
  onSubmit,
  backgroundImage = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1470&q=80',
  isLoading = false,
  formWidth,
  error,
  success,
}: AuthFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!onSubmit) return

    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}

    fields.forEach((field) => {
      data[field.name] = formData.get(field.name) as string
    })

    await onSubmit(data)
  }

  const renderField = (field: FormField) => {
    if (field.type === 'select' && field.options) {
      return (
        <select
          id={field.name}
          name={field.name}
          required={field.required !== false}
          className='w-full cursor-pointer !p-3 border border-[#444] bg-[#2c2c2c] text-white rounded-[10px] outline-none transition-colors duration-300 text-sm focus:border-white'
        >
          <option value=''>Select {field.label}</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'radio' && field.options) {
      return (
        <div className='space-y-2'>
          {field.options.map((option) => (
            <label
              key={option.value}
              className='flex items-center font-bold text-[#cccccc] text-sm cursor-pointer'
            >
              <input
                type='radio'
                name={field.name}
                value={option.value}
                required={field.required !== false}
                className='mr-2 accent-white'
              />
              {option.label}
            </label>
          ))}
        </div>
      )
    }

    if (field.type === 'checkbox-group' && field.options) {
      return (
        <div className='space-y-2'>
          {field.options.map((option) => (
            <label
              key={option.value}
              className='flex items-center font-bold text-[#cccccc] text-sm cursor-pointer'
            >
              <input
                type='checkbox'
                name={field.name}
                value={option.value}
                className='mr-2 accent-white'
              />
              {option.label}
            </label>
          ))}
        </div>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <label className='flex items-center font-bold text-[#cccccc] text-sm cursor-pointer'>
          <input
            type='checkbox'
            name={field.name}
            className='mr-2 accent-white'
          />
          {field.placeholder || field.label}
        </label>
      )
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required !== false}
          rows={4}
          className='w-full !p-3 border border-[#444] bg-[#2c2c2c] text-white rounded-[10px] outline-none transition-colors duration-300 text-sm focus:border-white resize-none'
        />
      )
    }

    return (
      <input
        type={field.type}
        id={field.name}
        name={field.name}
        placeholder={field.placeholder}
        required={field.required !== false}
        className='w-full !p-3 border  border-[#444] bg-[#2c2c2c] text-white rounded-[10px] outline-none transition-colors duration-300 text-sm focus:border-white'
      />
    )
  }

  return (
    <div
      className='min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center justify-center lg:items-center lg:justify-end !p-4 sm:!p-6 md:!p-8'
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div
        className={`bg-[rgba(30,30,30,0.95)] !p-6 sm:!p-8 md:!p-10 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] w-full max-w-[95%] sm:max-w-[500px] md:max-w-[600px] lg:${formWidth} lg:!mr-10`}
      >
        <h2 className='text-center !mb-6 md:!mb-8 text-white text-xl sm:text-2xl font-bold'>
          {title}
        </h2>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className='!mb-4 md:!mb-5' key={field.name}>
              {field.type !== 'checkbox' && (
                <label
                  htmlFor={field.name}
                  className='block !mb-2 text-[#cccccc] text-sm'
                >
                  {field.label}
                </label>
              )}
              {renderField(field)}
            </div>
          ))}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full !p-3 bg-white text-[#121212] rounded-[10px] cursor-pointer font-bold text-sm sm:text-base transition-colors duration-300 hover:bg-[#dddddd] disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Loading...' : buttonText}
          </button>

          {error && (
            <div className='text-center text-[#ff6666] text-sm !mt-2'>
              {error}
            </div>
          )}

          {success && (
            <div className='mt-4 text-green-400 text-center !my-5 font-medium'>
              {success}
            </div>
          )}

          {footer && (
            <div className='text-center text-[#aaaaaa] text-sm !mt-4'>
              {footer}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
