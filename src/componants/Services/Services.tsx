import ServiceCarousel from '@/componants/Services/ServiceCarousel'
import ProjectGrid from '@/componants/projects/ProjectGrid'

export default function ServicesPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Banner */}
      <header className='relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden'>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[url('/banner.jpg')] bg-cover bg-center bg-fixed"></div>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-indigo-900/90'></div>

        {/* Animated Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className='relative z-10 text-center !px-6 max-w-4xl mx-auto'>
          <div className='animate-fade-in-up'>
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white !mb-6 tracking-tight'>
              Our{' '}
              <span className='bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                Services
              </span>
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl text-gray-100 font-light max-w-2xl mx-auto leading-relaxed'>
              Discover how HireBridge can help you grow your career or business
              with our innovative solutions
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
          <svg
            className='w-6 h-6 text-white/60'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 14l-7 7m0 0l-7-7m7 7V3'
            />
          </svg>
        </div>
      </header>

      {/* Services Carousel */}
      <ServiceCarousel />

      {/* Projects Grid - Show only 6 projects */}
      <ProjectGrid limit={6} showViewAll={true} />
    </div>
  )
}
