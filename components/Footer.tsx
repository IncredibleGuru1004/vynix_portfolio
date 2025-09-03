'use client'

import { motion } from 'framer-motion'
import { Code, Smartphone, Cloud, Database, Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const services = [
    'Web Development',
    'Mobile Apps',
    'Cloud Solutions',
    'Database Design',
    'DevOps',
    'Security'
  ]

  const technologies = [
    'React',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'MongoDB'
  ]

  const company = [
    'About Us',
    'Our Team',
    'Careers',
    'Blog',
    'Case Studies',
    'Contact'
  ]

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: 'mailto:hello@vynix.com', label: 'Email' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex items-center space-x-1">
                    <Code className="h-8 w-8 text-primary-400" />
                    <Smartphone className="h-6 w-6 text-primary-500" />
                    <Cloud className="h-6 w-6 text-primary-600" />
                    <Database className="h-6 w-6 text-primary-700" />
                  </div>
                  <span className="text-2xl font-bold">Vynix</span>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  Premier IT development agency specializing in cutting-edge web applications, 
                  mobile solutions, cloud infrastructure, and digital transformation services.
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors duration-200 group"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Services */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <ul className="space-y-2">
                  {services.map((service, index) => (
                    <li key={index}>
                      <a
                        href="#services"
                        className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                      >
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Technologies */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4">Technologies</h3>
                <ul className="space-y-2">
                  {technologies.map((tech, index) => (
                    <li key={index}>
                      <span className="text-gray-300 hover:text-primary-400 transition-colors duration-200 cursor-pointer">
                        {tech}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Company */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  {company.map((item, index) => (
                    <li key={index}>
                      <a
                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                        className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-gray-800"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">123 Tech Street</p>
                  <p className="text-gray-300">San Francisco, CA 94105</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-gray-300">+1 (555) 987-6543</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">hello@vynix.com</p>
                  <p className="text-gray-300">support@vynix.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="py-6 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Vynix Innovations. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#privacy"
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
