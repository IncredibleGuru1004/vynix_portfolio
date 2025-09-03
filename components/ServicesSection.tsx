'use client'

import { motion } from 'framer-motion'
import { 
  Code, 
  Smartphone, 
  Cloud, 
  Database, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  Cpu, 
  GitBranch,
  Monitor,
  Server
} from 'lucide-react'
import { useServices } from '@/hooks/useApi'

const ServicesSection = () => {
  const { data: services = [], loading, error } = useServices({ isActive: true })

  // Map icon string to component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Code': return Code
      case 'Smartphone': return Smartphone
      case 'Cloud': return Cloud
      case 'Database': return Database
      case 'Globe': return Globe
      case 'Shield': return Shield
      case 'Zap': return Zap
      case 'Users': return Users
      case 'Cpu': return Cpu
      case 'GitBranch': return GitBranch
      case 'Monitor': return Monitor
      case 'Server': return Server
      default: return Code
    }
  }

  // Show loading state
  if (loading) {
    return (
      <section id="services" className="py-20 bg-gray-50">
        <div className="container-max section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show error state
  if (error) {
    return (
      <section id="services" className="py-20 bg-gray-50">
        <div className="container-max section-padding">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load services</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
      </section>
    )
  }

  // Fallback services if API returns empty
  const fallbackServices = [
    {
      icon: Code,
      title: 'Frontend Development',
      description: 'Modern, responsive web applications using React, Vue.js, and Angular with TypeScript.',
      technologies: ['React.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Server,
      title: 'Backend Development',
      description: 'Scalable server-side solutions with Node.js, Python, Java, and PHP frameworks.',
      technologies: ['Node.js', 'Python', 'Java', 'PHP', 'Express.js', 'Django', 'Spring Boot'],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Cross-platform mobile apps with React Native and Flutter for iOS and Android.',
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Xcode'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      description: 'AWS, Azure, and Google Cloud infrastructure with containerization and DevOps.',
      technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Database,
      title: 'Database Design',
      description: 'SQL and NoSQL database solutions with optimization and security best practices.',
      technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs'],
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security implementation and compliance with industry standards.',
      technologies: ['SSL/TLS', 'OAuth', 'JWT', 'GDPR', 'HIPAA', 'SOC 2'],
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Application performance tuning, caching strategies, and scalability solutions.',
      technologies: ['CDN', 'Caching', 'Load Balancing', 'Monitoring', 'Analytics'],
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Users,
      title: 'Team Augmentation',
      description: 'Expert developers and specialists to augment your existing development teams.',
      technologies: ['Agile', 'Scrum', 'DevOps', 'Code Review', 'Mentoring'],
      color: 'from-pink-500 to-pink-600'
    }
  ]

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
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive IT development services covering every aspect of modern software development, 
            from frontend to backend, mobile to cloud, and everything in between.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {(services.length > 0 ? services : fallbackServices).map((service, index) => {
            const IconComponent = getIconComponent(service.icon)
            return (
              <motion.div
                key={service.id || index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Technologies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.technologies.map((tech, techIndex) => (
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

        {/* Tech Stack Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Tech Stack Coverage
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We stay current with the latest technologies and frameworks to deliver 
              cutting-edge solutions that meet modern business requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
              <p className="text-sm text-gray-600">React, Vue, Angular, TypeScript</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
              <p className="text-sm text-gray-600">Node.js, Python, Java, PHP</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Mobile</h4>
              <p className="text-sm text-gray-600">React Native, Flutter</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cloud & DevOps</h4>
              <p className="text-sm text-gray-600">AWS, Azure, Docker, K8s</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesSection
