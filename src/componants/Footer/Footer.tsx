// components/Footer.jsx
'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true, // whether animation should happen only once
    })
  }, [])

  return (
    <footer
      className='relative w-full overflow-hidden !px-5 !pb-[60px]'
      style={{
        background:
          'linear-gradient(135deg, #234D76 0%, #322370 25%, #8e44ad 60%, #0e3d7e 100%)',
      }}
    >
      <div className='relative z-10 !mx-auto max-w-[1300px] w-full h-full overflow-hidden'>
        {/* Logo Section */}
        <div className='text-center !pb-[100px]' data-aos='fade-down'>
          <div className='relative w-[150px] h-[50px] !mx-auto transition-transform duration-300 hover:scale-110 brightness-0 invert'>
            <Image
              src='/images/logo.png'
              alt='HireBridge Logo'
              width={150}
              height={50}
              className='object-contain'
            />
          </div>
        </div>

        {/* Footer Content */}
        <div className='flex flex-wrap justify-between items-center gap-[30px] text-left md:flex-row flex-col md:text-left'>
          {/* Reach Us Column */}
          <div
            className='flex-1 min-w-[180px]  items-center'
            data-aos='fade-up'
            data-aos-delay='100'
          >
            <h4 className='text-base !mb-[15px] text-center font-bold text-white'>
              Reach Us
            </h4>
            <div className='space-y-2 '>
              <p className='text-sm text-gray-300 text-center flex items-center md:justify-start justify-center gap-2'>
                <FaPhoneAlt className='text-[#8e44ad] flex-shrink-0' />
                <span>+92 317 0741138</span>
              </p>
              <p className='text-sm text-gray-300 flex items-center text-center md:justify-start justify-center gap-2'>
                <FaEnvelope className='text-[#8e44ad] flex-shrink-0' />
                <span>infohirebridge@gmail.com</span>
              </p>
              <p className='text-sm text-gray-300 flex items-center text-center md:justify-start justify-center gap-2'>
                <FaMapMarkerAlt className='text-[#8e44ad] flex-shrink-0' />
                <span>Lahore, Pakistan</span>
              </p>
            </div>
          </div>

          {/* Company Column */}
          <div
            className='flex-1 min-w-[180px] text-center'
            data-aos='fade-up'
            data-aos-delay='200'
          >
            <h4 className='text-base  !mb-[15px] font-bold text-white'>
              Company
            </h4>
            <div className='space-y-2 '>
              <p>
                <Link
                  href='/about'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  About
                </Link>
              </p>
              <p>
                <Link
                  href='/contact'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  Contact
                </Link>
              </p>
              <p>
                <Link
                  href='/jobs'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  Jobs
                </Link>
              </p>
            </div>
          </div>

          {/* Legal Column */}
          <div
            className='flex-1 min-w-[180px] text-center'
            data-aos='fade-up'
            data-aos-delay='300'
          >
            <h4 className='text-base !mb-[15px] font-bold text-white'>Legal</h4>
            <div className='space-y-2'>
              <p>
                <Link
                  href='/privacy-policy'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  Privacy Policy
                </Link>
              </p>
              <p>
                <Link
                  href='/terms-services'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  Terms & Services
                </Link>
              </p>
              <p>
                <Link
                  href='/refund-policy'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  Refund Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div
            className='flex-1 min-w-[180px] text-center'
            data-aos='fade-up'
            data-aos-delay='400'
          >
            <h4 className='text-base !mb-[15px] font-bold text-white'>
              Quick Links
            </h4>
            <div className='space-y-2'>
              <p>
                <Link
                  href='/services'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  Services
                </Link>
              </p>
              <p>
                <Link
                  href='/projects'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  Projects
                </Link>
              </p>
              <p>
                <Link
                  href='/internship'
                  className='text-sm text-gray-300 hover:text-white hover:scale-105 transition-all inline-block'
                >
                  Internships
                </Link>
              </p>
            </div>
          </div>

          {/* Newsletter Column */}
          <div
            className='flex-1 min-w-[180px] md:items-start items-center'
            data-aos='fade-up'
            data-aos-delay='500'
          >
            <h4 className='text-base !mb-[15px] font-bold text-white'>
              Join Our Newsletter
            </h4>
            <form className='flex gap-[10px] !mb-[10px] flex-wrap md:flex-row flex-col'>
              <input
                type='email'
                placeholder='Your email address'
                required
                className='flex-1 !px-[10px] !py-[10px] bg-white border-none rounded-[20px] text-sm focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[200px]'
              />
              <button
                type='submit'
                className='!px-5 !py-[10px] bg-gradient-to-r from-[#8e44ad] to-[#234D76] border-none rounded-[20px] text-white cursor-pointer transition-transform duration-300 hover:scale-105 font-medium'
              >
                Subscribe
              </button>
            </form>
            <small className='text-xs text-gray-400'>
              * Get weekly updates from HireBridge.
            </small>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
