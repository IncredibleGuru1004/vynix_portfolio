import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechFlow Solutions - Premier IT Development Agency',
  description: 'Leading IT development agency specializing in web applications, mobile apps, cloud solutions, and digital transformation. Expert team delivering cutting-edge technology solutions.',
  keywords: 'IT development, web development, mobile apps, cloud solutions, digital transformation, software development agency',
  authors: [{ name: 'TechFlow Solutions' }],
  openGraph: {
    title: 'TechFlow Solutions - Premier IT Development Agency',
    description: 'Leading IT development agency specializing in web applications, mobile apps, cloud solutions, and digital transformation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechFlow Solutions - Premier IT Development Agency',
    description: 'Leading IT development agency specializing in web applications, mobile apps, cloud solutions, and digital transformation.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
