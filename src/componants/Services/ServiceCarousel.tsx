'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import { Service } from '../types/serviceTypes'
import api from '../lib/axios'

export default function ServiceCarousel() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services') // http://localhost:4000/api/services
        setServices(res.data.services) // ✅ use res.data.services, not res.data
      } catch (err) {
        console.error('Failed to fetch services', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  if (loading)
    return (
      <div className='flex justify-center items-center !h-64 text-gray-600 font-semibold'>
        Loading services...
      </div>
    )

  return (
    <section className='!py-12 sm:!py-16 lg:!py-28 flex justify-center items-center bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden'>
      {/* Background Decoration */}
      <div className='absolute top-0 right-0 w-56 sm:w-72 lg:w-96 h-56 sm:h-72 lg:h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-56 sm:w-72 lg:w-96 h-56 sm:h-72 lg:h-96 bg-gradient-to-tr from-indigo-100/30 to-cyan-100/30 rounded-full blur-3xl'></div>

      <div className='relative z-10 flex justify-center items-center flex-col w-full'>
        <div className='text-center !mb-10 sm:!mb-14 lg:!mb-16 max-w-3xl mx-auto !px-4 sm:!px-6'>
          <span className='inline-block !px-3 sm:!px-4 !py-1.5 sm:!py-2 !mb-3 sm:!mb-4 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-100 rounded-full'>
            What We Offer
          </span>
          <h2 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 !mb-4 sm:!mb-6'>
            Our Premium{' '}
            <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
              Services
            </span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed'>
            Comprehensive solutions tailored to meet your unique business needs
          </p>
        </div>

        <div className='max-w-6xl mx-auto !px-4 sm:!px-6 w-full'>
          <div className='overflow-hidden rounded-2xl' ref={emblaRef}>
            <div className='flex -mx-2 sm:-mx-3'>
              {services.map((service) => (
                <div
                  key={service._id}
                  className='flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] !px-2 sm:!px-3'
                >
                  <div className='group relative bg-white rounded-2xl !p-6 sm:!p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full border border-gray-100 overflow-hidden'>
                    {/* Gradient Overlay on Hover */}
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                    {/* Icon */}
                    <div className='relative !mb-4 sm:!mb-6'>
                      <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300'>
                        {service.servicetitle.charAt(0)}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className='relative text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 !mb-2 sm:!mb-4 group-hover:text-blue-600 transition-colors duration-300'>
                      {service.servicetitle}
                    </h3>
                    <p className='relative text-sm sm:text-base text-gray-600 leading-relaxed !mb-6 sm:!mb-8 line-clamp-3'>
                      {service.description}
                    </p>

                    {/* CTA Button */}
                    <button className='relative inline-flex items-center !px-4 sm:!px-6 !py-2.5 sm:!py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl group'>
                      <span>Contact Us</span>
                      <svg
                        className='w-4 h-4 sm:w-5 sm:h-5 !ml-2 group-hover:translate-x-1 transition-transform'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 7l5 5m0 0l-5 5m5-5H6'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className='flex flex-wrap items-center justify-center !mt-6 sm:!mt-8 lg:!mt-10 gap-3 sm:gap-4'>
            <button
              onClick={scrollPrev}
              className='!p-2.5 sm:!p-3 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white transition-all duration-300 group'
              aria-label='Previous slide'
            >
              <svg
                className='w-5 h-5 sm:w-6 sm:h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>

            {/* Dots */}
            <div className='flex gap-1.5 sm:gap-2'>
              {services.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? 'w-5 sm:w-8 bg-gradient-to-r from-blue-600 to-indigo-600'
                      : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className='!p-2.5 sm:!p-3 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white transition-all duration-300 group'
              aria-label='Next slide'
            >
              <svg
                className='w-5 h-5 sm:w-6 sm:h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
