import Sidebar from '@/componants/admin/Sidebar'

const links = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Jobs', href: '/admin/jobs' },
  { label: 'Jobs Applications', href: '/admin/job-applications' },
  { label: 'Internships', href: '/admin/internships' },
  { label: 'Internship Applications', href: '/admin/internship-applications' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Certificates', href: '/admin/certificate' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Contact Requests', href: '/admin/contact-requests' },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex h-screen'>
      <Sidebar title='Admin Panel' links={links} />

      <main className='flex-1 overflow-y-auto bg-gray-100'>
        <div className='p-4 sm:p-6 lg:p-8'>{children}</div>
      </main>
    </div>
  )
}
