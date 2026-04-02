'use client'

import { Project } from '../types/projectTypes'
import { sampleProjects } from './projectData'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { HiArrowRight, HiEye, HiCode, HiDotsHorizontal } from 'react-icons/hi'
import { MdBusiness, MdDeveloperMode, MdDesignServices } from 'react-icons/md'

interface ProjectGridProps {
  projects?: Project[]
  limit?: number
  showViewAll?: boolean
}

export default function ProjectGrid({
  projects = sampleProjects,
  limit,
  showViewAll = true,
}: ProjectGridProps) {
  const [isVisible, setIsVisible] = useState(false)
  const displayProjects = limit ? projects.slice(0, limit) : projects

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Category color mapping for your 3 categories
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Business':
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: 'text-emerald-600',
          hoverBg: 'hover:from-emerald-100 hover:to-teal-100',
        }
      case 'Development':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          hoverBg: 'hover:from-blue-100 hover:to-indigo-100',
        }
      case 'Design':
        return {
          bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: 'text-purple-600',
          hoverBg: 'hover:from-purple-100 hover:to-pink-100',
        }
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          hoverBg: 'hover:bg-gray-100',
        }
    }
  }

  // Get category icon using react-icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Business':
        return <MdBusiness className='w-4 h-4' />
      case 'Development':
        return <MdDeveloperMode className='w-4 h-4' />
      case 'Design':
        return <MdDesignServices className='w-4 h-4' />
      default:
        return <HiDotsHorizontal className='w-4 h-4' />
    }
  }

  return (
    <section className='!py-20 lg:!py-28 bg-gradient-to-b flex justify-center items-center flex-col from-white via-gray-50/50 to-white'>
      <div className='max-w-7xl mx-auto !px-6'>
        {/* Section Header */}
        <div className='text-center flex justify-center items-center flex-col !mb-16'>
          <span className='inline-block !px-5 !py-2.5 !mb-5 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 bg-indigo-100 rounded-full animate-fade-in uppercase tracking-wider'>
            Portfolio Showcase
          </span>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 !mb-6'>
            Our Featured{' '}
            <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Projects
            </span>
          </h2>
          <p className='text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl'>
            Discover our portfolio of exceptional work across Business,
            Development, and Design that showcases our expertise and innovation.
          </p>
        </div>

        {/* Projects Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {displayProjects.map((project, index) => {
            const categoryStyle = getCategoryStyles(project.category)

            return (
              <div
                key={project._id}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient Top Bar */}
                <div className='h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:h-2 transition-all duration-300'></div>

                {/* Card Content */}
                <div className='!p-8'>
                  {/* Top Section with Badge and Category */}
                  <div className='flex items-start justify-between !mb-5'>
                    {/* Project Number Badge */}
                    <div className='relative'>
                      <span className='inline-flex items-center justify-center w-12 h-12 text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white'></div>
                    </div>

                    {/* Category Badge */}
                    {project.category && (
                      <div
                        className={`inline-flex items-center gap-2 !px-4 !py-2 text-xs font-bold rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-md ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} ${categoryStyle.hoverBg}`}
                      >
                        <span className={categoryStyle.icon}>
                          {getCategoryIcon(project.category)}
                        </span>
                        <span className='uppercase tracking-wider'>
                          {project.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className='text-2xl font-bold text-gray-900 !mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300'>
                    {project.projectTitle}
                  </h3>

                  {/* Description */}
                  <p className='text-gray-600 leading-relaxed !mb-5 line-clamp-3'>
                    {project.shortDescription}
                  </p>

                  {/* Tech Stack */}
                  <div className='!mb-6'>
                    <div className='flex items-center gap-2 !mb-3'>
                      <HiCode className='w-4 h-4 text-indigo-500' />
                      <span className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                        Technologies
                      </span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {project.techStack
                        .split(',')
                        .slice(0, 3)
                        .map((tech, i) => (
                          <span
                            key={i}
                            className='inline-block !px-3 !py-1.5 text-xs font-semibold text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 hover:scale-105 hover:shadow-sm'
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      {project.techStack.split(',').length > 3 && (
                        <span className='inline-flex items-center gap-1 !px-3 !py-1.5 text-xs font-semibold text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200'>
                          <HiDotsHorizontal className='w-3 h-3' />
                          {project.techStack.split(',').length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Decorative Divider */}
                  <div className='relative !mb-6'>
                    <div className='border-t border-gray-100'></div>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500'></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center justify-between'>
                    <Link
                      href={`/projects/${project._id}`}
                      className='inline-flex items-center gap-2 !px-5 !py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
                    >
                      <HiEye className='w-5 h-5' />
                      <span>View Project Details</span>
                    </Link>
                  </div>
                </div>

                {/* Hover Overlay Effect */}
                <div className='absolute inset-0 bg-gradient-to-t from-indigo-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>

                {/* Corner Accent */}
                <div className='absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500'></div>
              </div>
            )
          })}
        </div>

        {/* View All Button - Only show if there are more projects and showViewAll is true */}
        {showViewAll && projects.length > (limit || 0) && (
          <div className='text-center !mt-16'>
            <Link
              href='/projects'
              className='group inline-flex items-center gap-3 !px-12 !py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl'
            >
              <span>View All {projects.length} Projects</span>
              <HiArrowRight className='w-6 h-6 group-hover:translate-x-2 transition-transform' />
            </Link>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </section>
  )
}
