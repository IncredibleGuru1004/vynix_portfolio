'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Code, Smartphone, Cloud, Database } from 'lucide-react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-max">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Code className="h-8 w-8 text-primary-600" />
              <Smartphone className="h-6 w-6 text-primary-500" />
              <Cloud className="h-6 w-6 text-primary-400" />
              <Database className="h-6 w-6 text-primary-300" />
            </div>
            <span className="text-xl font-bold gradient-text">Vynix</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
                         <a
               href="/register"
               className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
             >
               Join Team
             </a>
             <a
               href="/admin"
               className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
             >
               Admin
             </a>
            <button className="btn-primary">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
                             <a
                 href="/register"
                 className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                 onClick={() => setIsOpen(false)}
               >
                 Join Team
               </a>
               <a
                 href="/admin"
                 className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                 onClick={() => setIsOpen(false)}
               >
                 Admin
               </a>
              <button className="w-full mt-4 btn-primary">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
