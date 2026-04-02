'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AOS from 'aos'
import 'aos/dist/aos.css'

interface props {
  gradient: string
  imgOverlayColor: string
}

const VisionSection = ({ gradient, imgOverlayColor }: props) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    AOS.init({ duration: 1000, once: true })

    let start = 0
    const end = 150
    const duration = 1500
    const incrementTime = 20
    const step = Math.ceil(end / (duration / incrementTime))

    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className='relative w-full min-h-[70vh] lg:h-[90vh] flex flex-col lg:flex-row justify-between'
      data-aos='fade-up'
    >
      {/* Left Image Side */}
      <div
        className='relative w-full lg:w-1/2 h-[70vh] lg:h-full'
        data-aos='fade-right'
      >
        <Image
          src='/images/visions12.jpeg'
          alt='vision'
          fill
          className='object-cover'
        />
        <div className={`absolute inset-0 ${imgOverlayColor}`}></div>
      </div>

      {/* Text Side */}
      <div
        className='w-full lg:w-1/2 flex justify-center items-center px-6 sm:px-12 lg:px-24 xl:px-60 py-10 lg:py-0'
        data-aos='fade-left'
      >
        <div className='text-center lg:text-left max-w-xl lg:!ml-[200px] lg:!p-4 !mt-[180px]'>
          <h2
            className={`${gradient} bg-clip-text text-transparent text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3`}
          >
            Our Vision
          </h2>
          <p className='text-[#6c757d] text-sm sm:text-base lg:text-lg leading-relaxed'>
            &quot;At HireBridge, our vision is to create a borderless world of
            opportunity — where talent meets purpose, and every student,
            professional, or company has access to growth, innovation, and
            success regardless of location.&quot;
          </p>
        </div>
      </div>

      {/* Counter Circle */}
      <div
        className='absolute top-[50%]  lg:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[350px] lg:h-[350px] rounded-full 
                  bg-gradient-to-br from-[#4457ad44] to-[#a6aeb960] 
                  flex justify-center items-center'
        data-aos='zoom-in'
      >
        <div
          className={`w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] lg:w-[300px] lg:h-[300px] rounded-full 
                    ${gradient}
                    flex flex-col justify-center items-center text-white shadow-lg`}
        >
          <div className='flex items-baseline space-x-1 text-3xl sm:text-4xl lg:text-6xl font-bold'>
            <span>{count}</span>
            <span>+</span>
          </div>
          <p className='mt-2 text-sm sm:text-base lg:text-lg font-medium text-center'>
            Satisfied Clients
          </p>
        </div>
      </div>
    </div>
  )
}

export default VisionSection
