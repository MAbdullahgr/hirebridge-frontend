// components/InternshipCard.tsx
'use client'
import React from 'react'
import Link from 'next/link'
import { Internship } from '@/componants/types/Internship'
import {
  HiEye,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
} from 'react-icons/hi'
import { BsBuilding, BsClockHistory } from 'react-icons/bs'
import { FiMapPin, FiMonitor } from 'react-icons/fi'
import { RiUserStarLine } from 'react-icons/ri'

interface InternshipCardProps {
  internship: Internship
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  return (
    <div
      className={`  
        group relative overflow-hidden  
        bg-white hover:bg-gradient-to-br hover:from-blue-50/30 hover:to-indigo-50/20  
        border border-gray-200 hover:border-blue-300  
        rounded-2xl shadow-lg hover:shadow-2xl  
        transform transition-all duration-300 ease-out  
        hover:-translate-y-1  
        !p-6 lg:!p-8 !mb-6  
      `}
      data-aos='fade-up'
    >
      {/* Header Section */}{' '}
      <div className='!mb-5 !pb-5 border-b border-gray-100'>
        {' '}
        <h3 className='text-2xl lg:text-3xl font-bold text-gray-900 !mb-3 group-hover:text-blue-600 transition-colors duration-200 !pr-32'>
          {internship.title}{' '}
        </h3>
        ```
        <div className='flex items-center gap-3 !mb-4'>
          <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md'>
            <BsBuilding className='w-6 h-6 text-white' />
          </div>
          <div>
            <p className='text-lg font-bold text-gray-800'>
              {internship.companyName}
            </p>
            <p className='text-xs text-gray-500 uppercase tracking-wider'>
              Company
            </p>
          </div>
        </div>
        {/* Meta Information Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 !mt-4'>
          <div className='flex items-center gap-2.5 bg-gradient-to-r from-red-50 to-pink-50 !px-3 !py-2 rounded-lg border border-red-100'>
            <FiMapPin className='w-5 h-5 text-red-600 flex-shrink-0' />
            <div className='min-w-0'>
              <p className='text-xs text-gray-500'>Location</p>
              <p className='font-semibold text-gray-700 text-sm truncate'>
                {internship.location}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2.5 bg-gradient-to-r from-green-50 to-emerald-50 !px-3 !py-2 rounded-lg border border-green-100'>
            <FiMonitor className='w-5 h-5 text-green-600 flex-shrink-0' />
            <div className='min-w-0'>
              <p className='text-xs text-gray-500'>Work Mode</p>
              <p className='font-semibold text-gray-700 text-sm truncate'>
                {internship.mode}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 !px-3 !py-2 rounded-lg border border-blue-100'>
            <BsClockHistory className='w-5 h-5 text-blue-600 flex-shrink-0' />
            <div className='min-w-0'>
              <p className='text-xs text-gray-500'>Duration</p>
              <p className='font-semibold text-gray-700 text-sm truncate'>
                {internship.durationWeeks} weeks
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2.5 bg-gradient-to-r from-orange-50 to-amber-50 !px-3 !py-2 rounded-lg border border-orange-100'>
            <RiUserStarLine className='w-5 h-5 text-orange-600 flex-shrink-0' />
            <div className='min-w-0'>
              <p className='text-xs text-gray-500'>Stipend</p>
              <p className='font-semibold text-gray-700 text-sm truncate'>
                {internship.stipend || 'Unpaid'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Description */}
      <div className='!mb-6'>
        <div className='flex items-center gap-2 !mb-2'>
          <HiOutlineSparkles className='w-4 h-4 text-indigo-500' />
          <h4 className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>
            Internship Description
          </h4>
        </div>
        <p className='text-gray-700 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all duration-300'>
          {internship.description}
        </p>
      </div>
      {/* Action Buttons */}
      <div className='flex flex-wrap gap-3 !pt-4 border-t border-gray-100'>
        <Link
          href={`/internship/${internship._id}`}
          className='  
          inline-flex items-center gap-2  
          !px-5 !py-3 rounded-xl  
          bg-gradient-to-r from-blue-600 to-indigo-600  
          hover:from-blue-700 hover:to-indigo-700  
          text-white font-semibold text-sm  
          transform transition-all duration-200  
          hover:scale-105 hover:shadow-xl shadow-lg  
          focus:outline-none focus:ring-4 focus:ring-blue-200  
        '
        >
          <HiEye className='w-5 h-5' />
          View Details
        </Link>

        <Link
          href={`/internship/${internship._id}/apply`}
          className='  
        inline-flex items-center gap-2  
        !px-5 !py-3 rounded-xl  
        bg-gradient-to-r from-indigo-600 to-purple-600   
        hover:from-indigo-700 hover:to-purple-700   
        focus:ring-indigo-200  
        text-white font-semibold text-sm  
        transform transition-all duration-200  
        hover:scale-105 hover:shadow-xl shadow-lg  
        focus:outline-none focus:ring-4  
      '
        >
          <HiOutlinePaperAirplane className='w-5 h-5 rotate-45' />
          Apply for Internship
        </Link>
      </div>
      {/* Decorative Elements */}
      <div className='absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300'></div>
      <div className='absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300'></div>
    </div>
  )
}

export default InternshipCard
