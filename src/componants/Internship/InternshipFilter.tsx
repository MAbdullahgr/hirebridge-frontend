'use client'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { Internship } from '../types/Internship'

interface InternshipFiltersProps {
  internships: Internship[]
  locationFilter: string
  setLocationFilter: (value: string) => void
  modeFilter: string
  setModeFilter: (value: string) => void
}

const InternshipFilters: React.FC<InternshipFiltersProps> = ({
  internships,
  locationFilter,
  setLocationFilter,
  modeFilter,
  setModeFilter,
}) => {
  // Extract unique values dynamically
  const uniqueLocations = Array.from(
    new Set(internships.map((intern) => intern.location))
  )
  const uniqueModes = Array.from(
    new Set(internships.map((intern) => intern.mode))
  )

  // Reusable select component
  const SelectBox = ({
    value,
    onChange,
    options,
    defaultLabel,
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: string[]
    defaultLabel: string
  }) => (
    <div className='relative'>
      <select
        value={value}
        onChange={onChange}
        className='appearance-none bg-white text-black rounded !px-4 !py-2 !pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm'
      >
        <option value=''>{defaultLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
      <FaChevronDown className='w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500' />
    </div>
  )

  return (
    <section
      className='filters flex flex-wrap gap-4 !mb-6 justify-center'
      data-aos='zoom-in-up'
    >
      <SelectBox
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        options={uniqueLocations}
        defaultLabel='All Locations'
      />

      <SelectBox
        value={modeFilter}
        onChange={(e) => setModeFilter(e.target.value)}
        options={uniqueModes}
        defaultLabel='All Modes'
      />
    </section>
  )
}

export default InternshipFilters
