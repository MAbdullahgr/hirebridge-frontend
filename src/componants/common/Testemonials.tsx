'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaQuoteLeft } from 'react-icons/fa'
import Image from 'next/image'

const Testimonials = () => {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
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

  const testimonials = [
    {
      id: 1,
      name: 'Saad Asif',
      job: 'Creative Designer at Colorlib',
      description:
        'Brook presents your services with flexible, convenient and compose layouts. You can select your favorite layouts & elements with unlimited customization.',
      Imgurl: '/images/test1.webp',
    },
    {
      id: 2,
      name: 'Ali Haider',
      job: 'UI/UX Designer at Behance',
      description:
        'Working with Brook was a pleasure. The layout options are user-friendly and the flexibility offered is outstanding.',
      Imgurl: '/images/test2.jpg',
    },
    {
      id: 3,
      name: 'Fahad khan',
      job: 'Product Designer at Dribbble',
      description:
        "The pixel-perfect designs and responsiveness were amazing. Brook's team nailed the concept and delivered a brilliant result.",
      Imgurl: '/images/test3.jpeg',
    },
  ]

  return (
    <section
      className='relative w-full !py-16 sm:!py-20 lg:!py-24 px-4 sm:px-6 lg:px-12'
      data-aos='fade-up'
      data-aos-duration='1200'
    >
      <h2
        className='text-center text-3xl sm:text-4xl lg:text-6xl font-bold font-greatvibes text-[#234D76] mb-8 sm:mb-12'
        data-aos='zoom-in'
        data-aos-delay='200'
      >
        Testimonials
      </h2>

      {/* Embla Viewport */}
      <div
        className='overflow-hidden max-w-full mx-auto sm:!py-10 lg:!py-20'
        ref={emblaRef}
      >
        <div className='flex'>
          {testimonials.map((t, index) => (
            <div
              key={t.id}
              className='flex-[0_0_100%] flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10 text-center lg:text-left px-4 sm:px-10'
              data-aos='fade-up'
              data-aos-delay={200 + index * 200}
            >
              <FaQuoteLeft className='text-4xl sm:text-5xl lg:text-6xl text-[#eaf3fe] mb-4 lg:mb-6' />

              <div className='flex flex-col justify-center items-center lg:items-start'>
                <p className='text-base sm:text-lg lg:text-xl italic text-gray-700 max-w-2xl lg:max-w-3xl mb-4 sm:mb-6'>
                  &rdquo;{t.description}&rdquo;
                </p>

                <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 !mt-4'>
                  <div
                    className='w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden border-[#234D76] border-2'
                    data-aos='zoom-in'
                    data-aos-delay={400 + index * 200}
                  >
                    <Image
                      src={t.Imgurl}
                      alt={t.name}
                      width={70}
                      height={70}
                      className='object-cover rounded-full'
                    />
                  </div>

                  <div
                    className='text-center sm:text-left'
                    data-aos='fade-left'
                    data-aos-delay={500 + index * 200}
                  >
                    <h3 className='text-xl sm:text-2xl lg:text-3xl font-semibold text-[#234D76] font-greatvibes'>
                      {t.name}
                    </h3>
                    <p className='text-gray-500 text-sm sm:text-base'>
                      {t.job}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className='absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl lg:text-4xl text-[#234D76] cursor-pointer disabled:opacity-40'
        data-aos='fade-right'
        data-aos-delay='300'
      >
        ←
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        className='absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl lg:text-4xl text-[#234D76] cursor-pointer disabled:opacity-40'
        data-aos='fade-left'
        data-aos-delay='300'
      >
        →
      </button>
    </section>
  )
}

export default Testimonials
