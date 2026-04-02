import Dashboard from '@/componants/admin/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
}

const page = () => {
  return (
    <>
      <Dashboard />
    </>
  )
}

export default page
