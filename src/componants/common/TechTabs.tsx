'use client'
import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

interface TechItem {
  name: string
  slogen: string
  bg: string
}

interface TechCategory {
  category: string
  items: TechItem[]
}

const techStackArray: TechCategory[] = [
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', slogen: 'Node.js', bg: '#6da55f' },
      { name: 'PHP', slogen: 'PHP', bg: '#787cb5' },
      { name: 'Java', slogen: 'Java', bg: '#e02e2e' },
      { name: '.Net Core', slogen: '.Net', bg: '#512bd4' },
      { name: 'Python', slogen: 'Python', bg: '#3776ab' },
      { name: 'Ruby on Rails', slogen: 'Rails', bg: '#cc0000' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React', slogen: 'React', bg: '#61dafb' },
      { name: 'Angular', slogen: 'Angular', bg: '#dd0031' },
      { name: 'Vue.js', slogen: 'Vue.js', bg: '#4fc08d' },
      { name: 'Javascript', slogen: 'Javasvript', bg: '#f7df1e' },
      { name: 'HTML5', slogen: 'HTML5', bg: '#e34f26' },
      { name: 'CSS3', slogen: 'CSS3', bg: '#1572b6' },
    ],
  },
  {
    category: 'Databases',
    items: [
      { name: 'MySql', slogen: 'MySql', bg: '#00758f' },
      { name: 'MongoDB', slogen: 'MongoDB', bg: '#47a248' },
      { name: 'PostgreSQL', slogen: 'PostgreSQL', bg: '#336791' },
      { name: 'SQL Server', slogen: 'SQL Server', bg: '#cc2927' },
      { name: 'Cassandra', slogen: 'Cassandra', bg: '#1287b9' },
      { name: 'Redis', slogen: 'Redis', bg: '#dc382d' },
    ],
  },
  {
    category: 'CMS',
    items: [
      { name: 'Wordpress', slogen: 'Wordpress', bg: '#21759b' },
      { name: 'Drupal', slogen: 'Drupal', bg: '#0678af' },
      { name: 'Joomla', slogen: 'Joomla', bg: '#5093cd' },
      { name: 'Shopify', slogen: 'Shopify', bg: '#96bf48' },
      { name: 'Squarespace', slogen: 'Squarespace', bg: '#121212' },
      { name: 'Webflow', slogen: 'Webflow', bg: '#4353ff' },
    ],
  },
  {
    category: 'Cloude Testing',
    items: [
      { name: 'Selenium', slogen: 'Selenium', bg: '#43b02a' },
      { name: 'Jenkins', slogen: 'Jenkins', bg: '#d24939' },
      { name: 'AWS Device Farm', slogen: 'AWS DF', bg: '#ff9900' },
      { name: 'BrowserStack', slogen: 'BrowserStack', bg: '#6c4dab' },
      { name: 'Cypress', slogen: 'Cypress', bg: '#172a3a' },
      { name: 'Playwright', slogen: 'Playwright', bg: '#21272e' },
    ],
  },
]

const TechTabs = () => {
  const [activeTab, setActiveTab] = useState('Backend')

  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <div
        className="flex flex-col justify-center items-center !my-20 sm:!my-28 lg:!my-40 gap-7"
        data-aos="fade-up"
      >
        {/* Heading */}
        <div
          className="flex flex-col justify-center items-center gap-1 text-center"
          data-aos="fade-down"
        >
          <div className="w-16 sm:w-20 h-[0.35rem] bg-[#234D76] mx-auto mb-4 rounded-full"></div>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.75rem] font-semibold text-[#4634a9]">
            Our <span className="text-[#234D76]">Tech Stack</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
            data-aos="fade-right"
          >
            {techStackArray.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveTab(cat.category)}
                className={`!px-5 sm:!px-7 font-semibold sm:font-bold text-sm sm:text-lg shadow-md !py-2 rounded-full cursor-pointer 
              ${
                activeTab === cat.category
                  ? 'bg-[#234D76] text-white'
                  : 'bg-[#ecf0f1] text-[#234D76] hover:bg-[#bdc3c7]'
              }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Active Items */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 sm:gap-10 lg:gap-14 !mt-7"
            data-aos="zoom-in"
          >
            {techStackArray
              .find((cat) => cat.category === activeTab)
              ?.items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-center items-center gap-2 sm:gap-3 transition-transform duration-300 hover:scale-110"
                  data-aos="flip-left"
                  data-aos-delay={i * 100}
                >
                  <div
                    className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[110px] lg:h-[110px] rounded-full flex justify-center items-center text-white text-sm sm:text-lg font-semibold"
                    style={{ backgroundColor: item.bg }}
                  >
                    {item.slogen}
                  </div>
                  <p className="text-[#34495e] text-sm sm:text-lg lg:text-xl text-center">
                    {item.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechTabs
