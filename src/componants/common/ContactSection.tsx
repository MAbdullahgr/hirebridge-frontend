'use client'

import Link from 'next/link'
import { FaLinkedin, FaFacebook, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const ContactSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])

  return (
    <section className='bg-white'>
      <div className='flex flex-col justify-center items-center !py-20 px-4 sm:px-6 lg:px-8'>
        {/* Heading */}
        <h2
          className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#234D76] !mb-4 text-center'
          data-aos='fade-up'
        >
          Let’s Connect
        </h2>

        {/* Subtext */}
        <p
          className='!mb-7 text-base !px-2 sm:text-lg max-w-[800px] text-center text-gray-600'
          data-aos='fade-up'
          data-aos-delay='200'
        >
          Reach out to HireBridge on any platform you prefer. We&rsquo;re here
          to help you grow.
        </p>

        {/* Social Links */}
        <div className='flex flex-wrap justify-center gap-3 sm:gap-5 w-full sm:w-auto'>
          <Link
            href='https://www.linkedin.com/company/hirebridge1/'
            target='_blank'
            className='flex gap-2 items-center justify-center duration-300 rounded-full !py-2 !px-4 sm:!px-6 bg-gray-100 hover:text-white hover:bg-[#0077b5] text-sm sm:text-base'
            data-aos='zoom-in'
            data-aos-delay='200'
          >
            <FaLinkedin /> LinkedIn
          </Link>
          <Link
            href='https://www.facebook.com/profile.php?id=61577394473791'
            target='_blank'
            className='flex gap-2 items-center justify-center duration-300 rounded-full !py-2 !px-4 sm:!px-6 bg-gray-100 hover:text-white hover:bg-[#1877f2] text-sm sm:text-base'
            data-aos='zoom-in'
            data-aos-delay='400'
          >
            <FaFacebook /> Facebook
          </Link>
          <Link
            href='https://wa.me/923170741138'
            target='_blank'
            className='flex gap-2 flex-wrap items-center justify-center duration-300 rounded-full !py-2 !px-4 sm:!px-6 bg-gray-100 hover:text-white hover:bg-[#25d366] text-sm sm:text-base'
            data-aos='zoom-in'
            data-aos-delay='600'
          >
            <FaWhatsapp /> WhatsApp
            <span className='text-xs sm:text-sm'>(+92 317 0741138)</span>
          </Link>
          <Link
            href='mailto:infohirebridge@gmail.com'
            className='flex gap-2 flex-wrap items-center justify-center duration-300 rounded-full !py-2 !px-4 sm:!px-6 bg-gray-100 hover:text-white hover:bg-[#ea4335] text-sm sm:text-base'
            data-aos='zoom-in'
            data-aos-delay='800'
          >
            <FaEnvelope /> Email
            <span className='text-xs sm:text-sm'>
              (infohirebridge@gmail.com)
            </span>
          </Link>
          <Link
            href='/jobs'
            className='bg-[#234D76] flex justify-center items-center !px-5 sm:!px-6 !py-2 text-white rounded-full border-2 border-[#234D76] hover:bg-white hover:text-[#234D76] hover:border-[#234D76] text-sm sm:text-base font-medium'
            data-aos='zoom-in'
            data-aos-delay='1000'
          >
            Get a Job
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
