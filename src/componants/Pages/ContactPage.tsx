'use client'
import Link from 'next/link'
import {
  FaEnvelope,
  FaWhatsapp,
  FaGlobe,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa'
import Image from 'next/image'
import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { isAxiosError } from '../lib/utils'
import api from '../lib/axios'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    subject: '',
    message: '',
  })

  const [status, setStatus] = useState<{
    submitted: boolean
    submitting: boolean
    info: { error: boolean; msg: string | null }
  }>({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  })

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: 'All fields are required.' },
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: 'Please enter a valid email address.' },
      })
      return
    }

    setStatus({
      submitted: false,
      submitting: true,
      info: { error: false, msg: null },
    })

    try {
      await api.post('/contact/messages', formData, { withCredentials: true })

      // Success
      setFormData({ username: '', email: '', subject: '', message: '' })
      setStatus({
        submitted: true,
        submitting: false,
        info: {
          error: false,
          msg: 'Message sent successfully! We will contact you soon.',
        },
      })

      setTimeout(
        () =>
          setStatus({
            submitted: false,
            submitting: false,
            info: { error: false, msg: null },
          }),
        5000
      )
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setStatus({
          submitted: false,
          submitting: false,
          info: {
            error: true,
            msg: err.response?.data?.message || 'Failed to send message',
          },
        })
      } else if (err instanceof Error) {
        setStatus({
          submitted: false,
          submitting: false,
          info: { error: true, msg: err.message },
        })
      } else {
        setStatus({
          submitted: false,
          submitting: false,
          info: { error: true, msg: 'Failed to send message' },
        })
      }
    }
  }

  return (
    <div className='overflow-x-hidden text-gray-800'>
      <div className='relative w-full h-[350px] !mb-5'>
        <Image
          src='/contact.png'
          alt='contact image'
          fill
          className='object-cover'
        />
        <div className='!px-6 !py-10 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center'>
          <h1
            className='text-4xl !mb-2.5 font-bold'
            data-aos='fade-up'
            data-aos-delay='0'
          >
            Contact Us
          </h1>
          <p className='text-lg' data-aos='fade-up' data-aos-delay='200'>
            We&rsquo;d love to hear from you. Reach out for services,
            internships or collaborations.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className='!p-5 sm:!p-24'>
        <div className='flex flex-col lg:flex-row justify-between w-full'>
          {/* Contact Info */}
          <div
            className='w-full lg:w-[50%] !px-4 sm:!px-8 lg:!px-16 !pt-10'
            data-aos='fade-right'
            data-aos-delay='100'
          >
            <h2 className='text-[#3d5afe] text-2xl font-semibold !mb-4'>
              Contact Information
            </h2>
            <p className='flex items-center text-lg gap-4'>
              <i className='text-[#5e35b1]'>
                <FaEnvelope />
              </i>
              infohirebridge@gmail.com
            </p>
            <p className='flex items-center text-lg gap-4'>
              <i className='text-[#5e35b1]'>
                <FaWhatsapp />
              </i>
              +92 317 0741138
            </p>
            <p className='flex items-center text-lg gap-4'>
              <i className='text-[#5e35b1]'>
                <FaGlobe />
              </i>
              Available Worldwide
            </p>

            <div className='flex gap-4 !mt-4 text-xl'>
              <Link
                href='https://www.linkedin.com/company/hirebridge1/'
                target='_blank'
              >
                <FaLinkedin className='text-[#5e35b1]' />
              </Link>
              <Link
                href='https://www.instagram.com/infohirebridge?igsh=MTVydW5iY2ZuYWJwNw%3D%3D&utm_source=qr'
                target='_blank'
              >
                <FaInstagram className='text-[#5e35b1]' />
              </Link>
              <Link
                href='https://www.facebook.com/share/16e78B6CTa/?mibextid=wwXIfr'
                target='_blank'
              >
                <FaFacebook className='text-[#5e35b1]' />
              </Link>
            </div>
          </div>

          {/* Inquiry Form */}
          <div
            className='w-full lg:w-[50%] !mt-10'
            data-aos='fade-left'
            data-aos-delay='200'
          >
            <h2 className='text-[#3d5afe] text-2xl font-semibold !mb-4'>
              Send an Inquiry
            </h2>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
              <input
                type='text'
                name='username'
                placeholder='Your Name'
                className='border border-gray-500 !py-2.5 !px-4 rounded-sm'
                required
                value={formData.username}
                onChange={handleChange}
                disabled={status.submitting}
              />
              <input
                type='email'
                name='email'
                placeholder='Your Email'
                required
                className='border border-gray-500 !py-2.5 !px-4 rounded-sm'
                value={formData.email}
                onChange={handleChange}
                disabled={status.submitting}
              />
              <input
                type='text'
                name='subject'
                placeholder='Subject'
                required
                className='border border-gray-500 !py-2.5 !px-4 rounded-sm'
                value={formData.subject}
                onChange={handleChange}
                disabled={status.submitting}
              />
              <textarea
                name='message'
                placeholder='Your Message'
                rows={5}
                required
                className='border border-gray-500 !py-2.5 !px-4 rounded-sm'
                value={formData.message}
                onChange={handleChange}
                disabled={status.submitting}
              ></textarea>

              {/* Status Messages */}
              {status.info.msg && (
                <div
                  className={`!py-2.5 !px-4 rounded-sm text-sm ${
                    status.info.error
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}
                >
                  {status.info.msg}
                </div>
              )}

              <div>
                <button
                  type='submit'
                  disabled={status.submitting}
                  className={`bg-[#5e35b1] text-white !py-3 !px-4 rounded-lg w-full ${
                    status.submitting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-[#4527a0]'
                  }`}
                >
                  {status.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
