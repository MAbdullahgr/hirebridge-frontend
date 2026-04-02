export interface Project {
  _id: number
  projectTitle: string
  shortDescription: string
  techStack: string
  fileUrl?: string | null
  category: string
}
