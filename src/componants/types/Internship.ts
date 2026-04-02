export interface Internship {
  _id: string
  title: string
  companyName: string
  description: string
  location: string
  durationWeeks: number
  stipend: string
  requirements: string[]
  mode: 'onsite' | 'remote' | 'hybrid'
  deadline: string
  application: string
}
