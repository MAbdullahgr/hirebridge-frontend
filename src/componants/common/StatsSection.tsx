'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { number: 100, name: 'Satisfied Client' },
  { number: 150, name: 'Success Stories' },
  { number: 50, name: 'Team Members' },
]

interface props {
  gradient: string
  bgColor: string
  imgVisibility?: string
}

const StatsSection = ({ gradient, bgColor, imgVisibility }: props) => {
  const [startCount, setStartCount] = useState(false)
  const sectionRef = useRef<HTMLDivElement | null>(null)

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartCount(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Counter logic
  const Counter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!startCount) return
      let start = 0
      const incrementTime = 20
      const step = Math.ceil(target / (duration / incrementTime))

      const timer = setInterval(() => {
        start += step
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, incrementTime)

      return () => clearInterval(timer)
    }, [target, duration])

    return (
      <>
        <span>{count}</span>
        <span>+</span>
      </>
    )
  }

  return (
    <div className="relative">
      {/* Background image with overlay */}
      <div
        className={`${imgVisibility} relative w-full h-[350px] sm:h-[450px] lg:h-[600px] 
        bg-[url('/images/home123.webp')] bg-cover bg-center bg-fixed`}
      >
        <div className="absolute inset-0 bg-[#434fae7a]"></div>
      </div>

      {/* Stats Section */}
      <section
        ref={sectionRef}
        className={`${bgColor} flex flex-col lg:flex-row justify-center items-center gap-8 sm:gap-10 lg:gap-14 !px-6 sm:!px-12 lg:!px-20 !py-16 sm:!py-20 lg:!py-[130px]`}
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        {/* Heading */}
        <div data-aos="zoom-in" data-aos-delay="200" className="text-center lg:text-left">
          <p
            className={`text-2xl sm:text-3xl lg:text-[40px] font-semibold ${gradient} bg-clip-text text-transparent`}
          >
            What We’ve Achieved
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 lg:gap-12">
          {stats.map((item) => (
            <div
              key={item.number}
              className={`relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] lg:w-[230px] lg:h-[230px] rounded-full ${gradient} flex flex-col justify-center items-center text-white text-center shadow-[0_10px_30px_rgba(0,0,0,0.1)]`}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="text-2xl sm:text-3xl font-bold">
                <Counter target={item.number} />
              </div>
              <div className="text-base sm:text-lg lg:text-xl font-semibold">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default StatsSection
