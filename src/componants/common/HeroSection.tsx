'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AOS from 'aos'
import 'aos/dist/aos.css'

const HeroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true })
  }, [])

  return (
    <div className='w-full min-h-[450px] md:min-h-[500px] shadow-sm overflow-hidden !pb-10'>
      <div className='h-full w-full flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start'>
        {/* Left Side */}
        <div className='relative w-full lg:w-[55%] flex justify-center lg:justify-start !px-4 sm:!px-8 lg:!px-12 !pt-8 sm:!pt-12 lg:!pt-20 text-center lg:text-left'>
          {/* Background Shape */}
          <Image
            src='/images/shape_1-1.png'
            alt='Shape'
            width={71}
            height={70}
            className='object-cover opacity-35 hidden sm:block absolute top-0 left-0'
          />

          <div className='max-w-[700px]' data-aos='fade-right'>
            {/* Heading */}
            <p className='text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold leading-snug lg:leading-normal text-[#234d76]'>
              Global{' '}
              <span className='bg-gradient-to-r from-[#7e44ad] to-[#3467a9] bg-clip-text text-transparent'>
                Projects, Internships
              </span>{' '}
              &{' '}
              <span className='bg-gradient-to-r from-[#7e44ad] to-[#3467a9] bg-clip-text text-transparent'>
                Recruitment Services
              </span>
            </p>

            {/* Subtext */}
            <p
              className='text-sm sm:text-base md:text-lg lg:text-xl font-semibold !mt-3 sm:!mt-4 lg:!mt-6'
              data-aos='fade-up'
              data-aos-delay='200'
            >
              Connect with Global Projects. Intern with Industry Leaders. Launch
              Your Career Worldwide.
            </p>

            {/* Buttons */}
            <div
              className='!mt-4 sm:!mt-6 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-5 lg:gap-7'
              data-aos='zoom-in'
              data-aos-delay='400'
            >
              <Link href='/jobs'>
                <button className='!px-4 sm:!px-6 !py-2 bg-[#322370] cursor-pointer rounded-lg font-semibold text-white duration-300 transform hover:scale-[1.05] hover:bg-[#7e44ad] text-sm sm:text-base'>
                  Get Job
                </button>
              </Link>
              <Link href='/about'>
                <button className='!px-4 sm:!px-6 !py-2 bg-[#f0f0f0] cursor-pointer rounded-lg font-semibold text-[#3a6084] duration-300 transform hover:scale-[1.05] hover:bg-[#3a6084] hover:text-white text-sm sm:text-base'>
                  More Info
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div
          className='w-full lg:w-[45%] flex justify-center items-center !mb-6 lg:!mb-0'
          data-aos='fade-left'
        >
          <Image
            src='/images/header_right-removebg-preview.png'
            alt='Header Right'
            priority
            width={250}
            height={350}
            className='object-contain sm:w-[280px] md:w-[350px] lg:w-[420px]'
          />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
