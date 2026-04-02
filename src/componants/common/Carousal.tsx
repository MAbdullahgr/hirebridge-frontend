'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const Carousal = () => {
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }) // autoplay every 3s
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [autoplay.current]
  )

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const slides = [
    {
      img: '/images/1.jpg',
      title: 'Web Development',
      text: 'Responsive and dynamic websites.',
    },
    {
      img: '/images/2.jpg',
      title: 'E-commerce Platforms',
      text: 'Creating robust online stores with secure payment gateways and seamless UX.',
    },
    {
      img: '/images/3.jpg',
      title: 'AI & ML Automations',
      text: 'Implementing intelligent automation solutions using AI and Machine Learning.',
    },
    {
      img: '/images/4.jpg',
      title: 'Mobile App Development',
      text: 'Developing native and cross-platform mobile applications for iOS and Android.',
    },
    {
      img: '/images/5.jpg',
      title: 'Cloud Solutions',
      text: 'Designing, deploying, and managing scalable cloud infrastructure and services.',
    },
    {
      img: '/images/6.jpg',
      title: 'Data Science & Analytics',
      text: 'Transforming raw data into actionable insights for strategic business decisions.',
    },
    {
      img: '/images/7.jpg',
      title: 'UI/UX Design',
      text: 'Crafting intuitive and engaging user interfaces for exceptional user experiences.',
    },
    {
      img: '/images/8.jpg',
      title: 'Digital Marketing Strategies',
      text: 'Boosting online presence and growth through effective digital marketing campaigns.',
    },
    {
      img: '/images/9.jpg',
      title: 'Cybersecurity Solutions',
      text: 'Protecting digital assets with robust security measures and threat intelligence.',
    },
    {
      img: '/images/10.jpg',
      title: 'IoT Solutions',
      text: 'Developing interconnected device solutions for smart environments and industries.',
    },
  ]

  return (
    <div className='relative w-full'>
      {/* Embla Viewport */}
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex gap-4 sm:gap-6 px-4 sm:px-6'>
          {slides.map((s, i) => (
            <div
              key={i}
              className='
                flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] 
                md:flex-[0_0_calc(33.333%-14px)] 
                lg:flex-[0_0_calc(25%-18px)]
                p-3 sm:p-4 text-center cursor-pointer
              '
              data-aos='fade-up'
              data-aos-delay={i * 100} // stagger animation
            >
              <div className='relative w-full h-44 sm:h-52 md:h-60 rounded-xl overflow-hidden shadow'>
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  className='object-cover'
                />
              </div>
              <h2 className='text-base sm:text-lg font-bold mt-3 text-[#234D76]'>
                {s.title}
              </h2>
              <p className='text-[#555] text-xs sm:text-sm'>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className='absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#234d76b3] hover:bg-[#1f1257] text-white text-lg sm:text-2xl !py-2 sm:!py-4 !px-2 sm:!px-3 rounded disabled:opacity-50'
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        className='absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#234d76b3] hover:bg-[#1f1257] text-lg sm:text-2xl !py-2 sm:!py-4 !px-2 sm:!px-3 rounded text-white disabled:opacity-50'
      >
        <FaArrowRight />
      </button>
    </div>
  )
}

export default Carousal
