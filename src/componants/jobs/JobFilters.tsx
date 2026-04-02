'use client'
import React from 'react'
import { Job } from '@/componants/types/Job'
import { FaChevronDown } from 'react-icons/fa'

interface JobFiltersProps {
  jobs: Job[]
  locationFilter: string
  setLocationFilter: (value: string) => void
  remoteFilter: string
  setRemoteFilter: (value: string) => void
  roleFilter: string
  setRoleFilter: (value: string) => void
}

const JobFilters: React.FC<JobFiltersProps> = ({
  jobs,
  locationFilter,
  setLocationFilter,
  remoteFilter,
  setRemoteFilter,
  roleFilter,
  setRoleFilter,
}) => {
  // Extract unique values dynamically
  const uniqueLocations = Array.from(new Set(jobs.map((job) => job.location)))
  const uniqueModes = Array.from(new Set(jobs.map((job) => job.mode)))
  const uniqueRoles = Array.from(new Set(jobs.map((job) => job.role)))

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
        className='appearance-none bg-white text-black rounded !px-4 !py-2 !pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        <option value=''>{defaultLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
      <FaChevronDown className='w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2  pointer-events-none' />
    </div>
  )

  return (
    <section
      className='filters flex flex-wrap gap-4 mb-6 justify-center'
      data-aos='zoom-in-up'
    >
      <SelectBox
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        options={uniqueLocations}
        defaultLabel='All Locations'
      />

      <SelectBox
        value={remoteFilter}
        onChange={(e) => setRemoteFilter(e.target.value)}
        options={uniqueModes}
        defaultLabel='All Modes'
      />

      <SelectBox
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        options={uniqueRoles}
        defaultLabel='All Roles'
      />
    </section>
  )
}

export default JobFilters
