import ContactSection from '../common/ContactSection'
import CeoSection from '../common/CeoSection'
import StatsSection from '../common/StatsSection'
import AboutUsSection from '../common/AboutUsSection'
import VisionSection from '../common/VisionSection'
import TechTabs from '../common/TechTabs'
import Testimonials from '../common/Testemonials'
import HeroSection from '../common/HeroSection'

const HomePage = () => {
  return (
    <div className='overflow-hidden'>
      {/* <div className='w-full h-[400px] shadow-sm overflow-hidden'>
        <div className='h-full w-full flex justify-between'>
          <div className='w-[55%] relative'>
            <Image
              src='/images/shape_1-1.png'
              alt='Shape'
              width={71}
              height={70}
              className='object-cover opacity-35 '
            />
            <div className='absolute top-[70px] left-[120px] '>
              <p className='text-[45px] font-bold leading-normal text-[#234d76]'>
                Global{' '}
                <span className='bg-gradient-to-r from-[#7e44ad] to-[#3467a9] bg-clip-text text-transparent'>
                  Projects, Internships
                </span>{' '}
                &{' '}
                <span className='bg-gradient-to-r from-[#7e44ad] to-[#3467a9] bg-clip-text text-transparent'>
                  Recruitment Services
                </span>
              </p>
              <p className='text-xl font-semibold !mt-6'>
                Connect with Global Projects. Intern with Industry Leaders.
                Launch Your Career Worldwide.
              </p>

              <div className='!mt-5 flex gap-7'>
                <button className='!px-6 !py-2 bg-[#322370] cursor-pointer rounded-lg font-semibold text-white duration-300 transform hover:scale-[1.1] hover:bg-[#7e44ad]'>
                  <Link href='/jobs'>Get Job</Link>
                </button>
                <button className='!px-6 !py-2 bg-[#f0f0f0] cursor-pointer rounded-lg font-semibold text-[#3a6084] duration-300 transform hover:scale-[1.1] hover:bg-[#3a6084] hover:text-white'>
                  <Link href='/about'>More Info</Link>
                </button>
              </div>
            </div>
          </div>

          <div className='w-[45%] flex justify-center items-center'>
            <Image
              src='/images/header_right-removebg-preview.png'
              alt='Header Right'
              priority
              width={350}
              height={500}
              className='object-cover'
            />
          </div>
        </div>
      </div> */}
      <HeroSection />

      <AboutUsSection gradient='bg-gradient-to-r from-[#7e44ad] to-[#3467a9]' />

      <VisionSection
        gradient='bg-gradient-to-r from-[#7e44ad] to-[#3467a9]'
        imgOverlayColor='bg-[#5d55ae8c]'
      />
      <TechTabs />
      <StatsSection
        gradient='bg-gradient-to-r from-[#7e44ad] to-[#3467a9]'
        bgColor='bg-[#c3acd56d]'
      />
      <Testimonials />
      <CeoSection gradient='bg-gradient-to-r from-[#cd94f83f] to-[#719dd240]' />
      <ContactSection />
    </div>
  )
}

export default HomePage
