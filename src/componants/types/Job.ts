// types/jobTypes.ts

// Job listing type (already in your Job.ts)
export interface Job {
  _id: string
  title: string
  role: string
  company: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  mode: 'onsite' | 'remote' | 'hybrid'
  salary?: string
  tags?: string[]
  experience: string
  description: string
  requirements: string
  application: string
  sampleResume?: string
  deadline: string
  status?: 'Active' | 'Inactive'
  createdAt?: string
  updatedAt?: string
}

