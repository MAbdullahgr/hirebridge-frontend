import JobsPage from '@/componants/admin/jobs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jobs',
  description: 'Jobs',
}

const page = () => {
  return (
    <>
      <JobsPage />
    </>
  )
}

export default page
