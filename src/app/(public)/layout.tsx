import type { Metadata } from 'next'
import PublicLayoutClient from './PublicLayoutClient'

export const metadata: Metadata = {
  title: 'Hire Bridge | Software Solutions',
  description:
    'Professional software house delivering web, mobile, and cloud solutions.',
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>
}
