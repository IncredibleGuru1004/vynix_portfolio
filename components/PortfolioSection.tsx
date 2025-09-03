'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Smartphone, Globe, Database, Cloud } from 'lucide-react'
import { useProjects } from '@/hooks/useApi'

const PortfolioSection = () => {
  const { data: projects = [], loading, error } = useProjects({ status: 'published' })

  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Application': return Globe
      case 'Mobile App': return Smartphone
      case 'Data Analytics': return Database
      case 'Cloud Solutions': return Cloud
      case 'IoT Solutions': return Globe
      default: return Globe
    }
  }

  // Show loading state
  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="container-max section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show error state
  if (error) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="container-max section-padding">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load projects</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
      </section>
    )
  }

  // Fallback projects if API returns empty
  const fallbackProjects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and MongoDB database. Features include payment integration, inventory management, and admin dashboard.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
      category: 'Web Application',
      icon: Globe,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Healthcare Mobile App',
      description: 'Cross-platform mobile application for healthcare providers with patient management, appointment scheduling, and telemedicine features.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      technologies: ['React Native', 'Firebase', 'Node.js', 'PostgreSQL'],
      category: 'Mobile App',
      icon: Smartphone,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Financial Analytics Dashboard',
      description: 'Real-time financial data visualization platform with advanced analytics, reporting tools, and secure data processing capabilities.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      technologies: ['Vue.js', 'Python', 'PostgreSQL', 'D3.js', 'Docker'],
      category: 'Data Analytics',
      icon: Database,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Cloud Infrastructure Migration',
      description: 'Complete cloud migration project for enterprise client, moving from on-premise to AWS with microservices architecture and CI/CD pipeline.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
      category: 'Cloud Solutions',
      icon: Cloud,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Learning Management System',
      description: 'Comprehensive LMS platform with course creation, student tracking, video streaming, and assessment tools for educational institutions.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      technologies: ['Angular', 'Java', 'MySQL', 'Redis', 'Azure'],
      category: 'Web Application',
      icon: Globe,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'IoT Fleet Management',
      description: 'Real-time fleet tracking and management system with GPS integration, driver monitoring, and predictive maintenance features.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
      technologies: ['React', 'Python', 'MongoDB', 'MQTT', 'Google Cloud'],
      category: 'IoT Solutions',
      icon: Database,
      color: 'from-red-500 to-red-600'
    }
  ]

  const categories = ['All', 'Web Application', 'Mobile App', 'Data Analytics', 'Cloud Solutions', 'IoT Solutions']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our diverse portfolio of successful projects across various industries and technologies. 
            Each project represents our commitment to excellence and innovation.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                index === 0
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {(projects.length > 0 ? projects : fallbackProjects).map((project, index) => {
            const CategoryIcon = getCategoryIcon(project.category)
            return (
              <motion.div
                key={project.id || index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full text-white text-sm font-medium">
                      <CategoryIcon className="h-4 w-4" />
                      <span>{project.category}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-white" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                        >
                          <Github className="h-4 w-4 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Next Project?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can bring your vision to life with cutting-edge technology 
              and expert development practices.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Get Started Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PortfolioSection
