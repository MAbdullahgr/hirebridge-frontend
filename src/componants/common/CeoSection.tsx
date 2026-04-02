'use client'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Image from 'next/image'

interface props {
  gradient: string
}

const CeoSection = ({ gradient }: props) => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])

  return (
    <section
      className={`${gradient} flex flex-col lg:flex-row justify-between items-center !py-10 px-5 sm:px-8 lg:px-16`}
      data-aos='fade-up'
    >
      {/* Left Side (Image + Info) */}
      <div
        className='w-full lg:w-[40%] flex justify-center items-center flex-col mb-8 lg:mb-0'
        data-aos='fade-right'
      >
        <div
          className='w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-full mx-auto bg-[rgba(221,221,221,0.24)] shadow-[0_5px_15px_rgba(0,0,0,0.2)] overflow-hidden'
          data-aos='zoom-in'
        >
          <Image
            src='/images/founder.png'
            alt='CEO'
            width={200}
            height={200}
            className='object-cover transition-transform duration-300 hover:scale-[1.06]'
          />
        </div>

        <div
          className='bg-white !px-5 !py-2 rounded-lg !my-5 font-semibold text-[#333] text-center'
          data-aos='fade-up'
          data-aos-delay='200'
        >
          <strong>Abdul Rehman</strong>
          <br />
          CEO & Founder
        </div>
      </div>

      {/* Right Side (Message) */}
      <div
        className='w-full lg:w-[60%] text-center lg:text-left'
        data-aos='fade-left'
      >
        <h2 className='text-xl sm:text-2xl font-light !mb-4'>
          <span>
            FROM <strong className='text-[#2a3b91]'>CEO TO NEW EMPLOYEE</strong>
          </span>
        </h2>
        <h3 className='text-[#444] text-lg sm:text-xl !mb-3'>
          Welcome to HireBridge
        </h3>
        <p className='text-[#222] text-base sm:text-lg leading-relaxed'>
          At Hire Bridge, we believe that trust is earned through actions — not
          promises.
          <br />
          <br />
          As the founder, I hold three values above all: honesty, punctuality,
          and integrity. These aren’t just words to us — they shape every
          decision we make, every conversation we have, and every connection we
          build.
          <br />
          <br />
          We’re not here to impress — we’re here to deliver, and to do it with
          sincerity and respect.
          <br />
          <br />
          Thank you for placing your trust in us.
        </p>
      </div>
    </section>
  )
}

export default CeoSection
