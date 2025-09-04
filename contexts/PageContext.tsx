'use client'

import React, { createContext, useContext, useState } from 'react'

interface PageContextType {
  title: string
  subtitle?: string
  setPageInfo: (title: string, subtitle?: string) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const usePage = () => {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error('usePage must be used within a PageProvider')
  }
  return context
}

interface PageProviderProps {
  children: React.ReactNode
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [title, setTitle] = useState('Admin Panel')
  const [subtitle, setSubtitle] = useState<string | undefined>(undefined)

  const setPageInfo = (newTitle: string, newSubtitle?: string) => {
    setTitle(newTitle)
    setSubtitle(newSubtitle)
  }

  const value = {
    title,
    subtitle,
    setPageInfo
  }

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  )
}
