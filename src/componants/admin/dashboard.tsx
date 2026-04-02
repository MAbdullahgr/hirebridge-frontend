'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  FiBriefcase,
  FiFileText,
  FiUsers,
  FiInbox,
  FiMessageSquare,
  FiLayers,
  FiActivity,
  FiRefreshCcw,
  FiAlertCircle,
} from 'react-icons/fi'

type Stats = {
  Totaljobs: number
  TotalInternships: number
  jobApps: number
  internApps: number
  projects: number
  messages: number
}

type Activity = {
  type?: string
  text: string
  time: string
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:4000'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchJSON = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
    }
    return (await res.json()) as T
  }

  const loadData = useCallback(async () => {
    try {
      setError(null)
      const [statsRaw, actsRaw] = await Promise.all([
        fetchJSON<Stats>(`${API_BASE}/api/contact/stats`),
        fetchJSON<Activity[] | { activities: Activity[] }>(
          `${API_BASE}/api/contact/activities`
        ),
      ])

      setStats({
        Totaljobs: Number((statsRaw as any)?.Totaljobs ?? 0),
        TotalInternships: Number((statsRaw as any)?.TotalInternships ?? 0),
        jobApps: Number((statsRaw as any)?.jobApps ?? 0),
        internApps: Number((statsRaw as any)?.internApps ?? 0),
        projects: Number((statsRaw as any)?.projects ?? 0),
        messages: Number((statsRaw as any)?.messages ?? 0),
      })

      const acts = Array.isArray(actsRaw)
        ? actsRaw
        : Array.isArray((actsRaw as any)?.activities)
        ? (actsRaw as any).activities
        : []
      setActivities(acts)
    } catch (e: any) {
      console.error(e)
      setError(
        'Unable to fetch data. Check that your API is running and CORS allows http://localhost:3000.'
      )
      setStats(null)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats?.Totaljobs ?? 0,
      icon: FiBriefcase,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Job Applications',
      value: stats?.jobApps ?? 0,
      icon: FiFileText,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Total Internships',
      value: stats?.TotalInternships ?? 0,
      icon: FiUsers,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Internship Applications',
      value: stats?.internApps ?? 0,
      icon: FiInbox,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      title: 'Total Projects',
      value: stats?.projects ?? 0,
      icon: FiLayers,
      color: 'text-pink-600 bg-pink-50',
    },
    {
      title: 'Messages Received',
      value: stats?.messages ?? 0,
      icon: FiMessageSquare,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ]

  const typeColor = (t?: string) => {
    switch (t) {
      case 'job':
      case 'job-application':
        return 'bg-blue-100 text-blue-700'
      case 'internship':
      case 'internship-application':
        return 'bg-emerald-100 text-emerald-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 !py-10'>
      <div className='max-w-7xl !mx-auto !px-6 lg:!px-8 !space-y-8'>
        {/* Header */}
        <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl lg:text-4xl font-bold text-gray-900'>
              HireBridge Admin Dashboard
            </h1>
            <p className='text-gray-600 !mt-2'>
              Manage jobs, internships, and messages with ease.
            </p>
          </div>
          <div className='flex items-center gap-2 !mt-4 sm:!mt-0'>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className='bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 !px-4 !py-2 disabled:opacity-60'
            >
              <FiRefreshCcw
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 !p-4'>
            <FiAlertCircle className='w-5 h-5' />
            <p className='text-sm'>{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <section>
          <h2 className='text-xl font-semibold text-gray-800 !mb-4'>
            Quick Overview
          </h2>

          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className='bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse flex items-center gap-4 !p-6'
                >
                  <div className='rounded-xl bg-gray-100 !p-6' />
                  <div className='flex-1'>
                    <div className='h-3 w-24 bg-gray-100 rounded' />
                    <div className='h-5 w-16 bg-gray-100 rounded !mt-2' />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {statCards.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className='bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 !p-6'
                  >
                    <div className={`rounded-xl ${item.color} !p-3`}>
                      <Icon className='w-6 h-6' />
                    </div>
                    <div>
                      <h3 className='text-sm text-gray-600 font-medium'>
                        {item.title}
                      </h3>
                      <p className='text-2xl font-bold text-gray-900 !mt-1'>
                        {item.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className='bg-white border border-gray-100 rounded-2xl shadow-sm !p-6'>
          <div className='flex items-center justify-between !mb-5'>
            <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
              <FiActivity className='text-blue-600' /> Recent Activity
            </h2>
            <button
              onClick={handleRefresh}
              className='text-sm text-blue-600 hover:underline'
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <ul className='!space-y-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className='flex items-start gap-3'>
                  <span className='w-2 h-2 rounded-full bg-gray-200 mt-2' />
                  <div className='flex-1'>
                    <div className='h-3 w-64 bg-gray-100 rounded' />
                    <div className='h-3 w-40 bg-gray-100 rounded !mt-2' />
                  </div>
                </li>
              ))}
            </ul>
          ) : activities.length === 0 ? (
            <p className='text-gray-500 text-sm'>No recent activity.</p>
          ) : (
            <ul className='!space-y-4'>
              {activities.map((act, index) => (
                <li key={index} className='group'>
                  <div className='flex items-start gap-3'>
                    <span className='w-2 h-2 rounded-full mt-2 bg-gray-300' />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`text-[11px] font-medium rounded-full !px-2 !py-0.5 ${typeColor(
                            act.type
                          )}`}
                        >
                          {act.type || 'update'}
                        </span>
                        <p className='text-gray-800 text-sm font-medium'>
                          {act.text}
                        </p>
                      </div>
                      <p className='text-xs text-gray-500 !mt-1'>
                        {new Date(act.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
