'use client'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

interface props {
  gradient: string
}

const AboutUsSection = ({ gradient }: props) => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])

  return (
    <div
      className='!my-20 flex justify-center items-center flex-col !px-4 sm:!px-6 lg:!px-12'
      data-aos='zoom-in-up'
    >
      {/* Heading */}
      <div className='!mb-6 text-center' data-aos='fade-up'>
        <p
          className={`text-2xl sm:text-3xl lg:text-[40px] font-semibold ${gradient} bg-clip-text text-transparent`}
        >
          About Us
        </p>
      </div>

      {/* Card */}
      <div className='w-full max-w-[950px]' data-aos='fade-right'>
        <div className='rounded-2xl bg-gradient-to-r from-[#303e84] to-[#3467a9] flex justify-center items-center !p-[2px]'>
          <div
            className='w-full h-full bg-white rounded-2xl flex justify-center items-center'
            data-aos='fade-left'
          >
            <p
              className='text-center text-[#234D76] text-sm sm:text-base lg:text-lg font-semibold !p-4 sm:!p-6 lg:!p-12'
              data-aos='fade-up'
            >
              At <span className='text-[#5d55ae] font-bold'>HireBridge</span>,
              we connect top-tier talent with global opportunities. Whether
              you&rsquo;re a freelancer, an aspiring intern, or a company
              seeking skilled professionals — we&rsquo;ve built a platform that
              bridges ideas, ambition, and results. From web development to
              AI-powered solutions, our network thrives on innovation, trust,
              and excellence. With clients across the USA, UK, Canada,
              Australia, and beyond, we&rsquo;re not just building careers —
              we&rsquo;re building the future of digital collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsSection
