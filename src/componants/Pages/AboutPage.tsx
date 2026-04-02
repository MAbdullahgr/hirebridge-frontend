import TechTabs from '../common/TechTabs'
import Carousal from '../common/Carousal'
import VisionSection from '../common/VisionSection'
import StatsSection from '../common/StatsSection'
import AboutUsSection from '../common/AboutUsSection'
import CeoSection from '../common/CeoSection'
import ContactSection from '../common/ContactSection'

const AboutPage = () => {
  return (
    <div className='overflow-x-hidden'>
      {/* About us Image */}
      <section
        className="
        w-full h-[550px] 
        bg-[url('/images/hero-bg.jpg')] 
        bg-cover bg-center bg-fixed
        bg-blend-overlay 
        bg-gradient-to-b from-[#4a535c80] to-[#b9d1ea5d] 
        flex items-center justify-center 
        pt-20
      "
      >
        <div className='flex flex-col items-center justify-center text-center'>
          <h1
            className="
            text-[60px] font-bold font-['Bebas Neue'] 
            text-[#234D76] leading-tight 
            transition-all duration-500 ease-in-out 
            hover:scale-105 hover:text-[#012346]
          "
          >
            About Us
          </h1>
          <p className='text-lg text-gray-700 mt-2'>
            We are team of talented people.
          </p>
        </div>
      </section>

      <AboutUsSection gradient='bg-gradient-to-r from-[#303e84] to-[#3467a9] ' />
      <CeoSection gradient='bg-gradient-to-r from-[#63a2f03f] to-[#719dd240]' />
      <VisionSection
        gradient='bg-gradient-to-r from-[#303e84] to-[#3467a9]'
        imgOverlayColor='bg-[#5581ae8c]'
      />
      <TechTabs />

      {/* Expertise section */}
      <div
        className='bg-[#f9f9f9] !py-30 !px-20'
        data-aos='fade-up'
        data-aos-duration='1200'
      >
        <div
          className='flex flex-col justify-center items-center !mb-10'
          data-aos='zoom-in'
          data-aos-delay='200'
        >
          <h2 className='text-[#234D76] !mb-2 text-lg font-semibold'>
            OUR STRENGTH
          </h2>
          <h1 className='text-5xl text-[#1a202c] !mb-5'>
            Areas of Our Expertise
          </h1>
          <p className='text-[#555] text-lg leading-tight'>
            HireBridge excels in delivering cutting-edge solutions across
            various domains.
          </p>
        </div>
        <div
          className='bg-white !py-15'
          data-aos='fade-up'
          data-aos-delay='400'
        >
          <Carousal />
        </div>
      </div>

      <StatsSection
        gradient='bg-gradient-to-r from-[#303e84] to-[#3467a9] '
        bgColor='bg-[#accdf76d]'
        imgVisibility='hidden'
      />
      <ContactSection />
    </div>
    // bg-gradient-to-r from-[#303e84] to-[#3467a9]
  )
}

export default AboutPage
