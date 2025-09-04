'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Code, Smartphone, Cloud, Database, Shield, Zap } from 'lucide-react'
import { useTeamMembers } from '@/hooks/useApi'

const TeamSection = () => {
  const { data: teamMembers = [], loading, error } = useTeamMembers({ status: 'active' })

  // Map icon string to component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Code': return Code
      case 'Smartphone': return Smartphone
      case 'Cloud': return Cloud
      case 'Database': return Database
      case 'Shield': return Shield
      case 'Zap': return Zap
      default: return Code
    }
  }

  // Show loading state
  if (loading) {
    return (
      <section id="team" className="py-20 bg-gray-50">
        <div className="container-max section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team members...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show error state
  if (error) {
    return (
      <section id="team" className="py-20 bg-gray-50">
        <div className="container-max section-padding">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load team members</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
      </section>
    )
  }

  // Fallback team members if API returns empty
  const fallbackTeamMembers = [
    {
      name: 'Sarah Chen',
      role: 'Lead Full-Stack Developer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Expert in React, Node.js, and cloud architecture with 8+ years of experience building scalable web applications.',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'PostgreSQL'],
      icon: Code,
      color: 'from-blue-500 to-blue-600',
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: undefined
      }
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Mobile Development Specialist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Passionate mobile developer specializing in React Native and Flutter with expertise in cross-platform solutions.',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: undefined
      }
    },
    {
      name: 'Emily Watson',
      role: 'DevOps & Cloud Engineer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Cloud infrastructure expert with deep knowledge of AWS, Azure, and containerization technologies.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
      icon: Cloud,
      color: 'from-orange-500 to-orange-600',
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: undefined
      }
    },
    {
      name: 'David Kim',
      role: 'Backend & Database Architect',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Database design specialist with expertise in both SQL and NoSQL solutions for high-performance applications.',
      skills: ['Python', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL'],
      icon: Database,
      color: 'from-green-500 to-green-600',
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: undefined
      }
    },
    {
      name: 'Lisa Thompson',
      role: 'Security & QA Engineer',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
      bio: 'Security-focused engineer ensuring applications meet enterprise-grade security standards and compliance requirements.',
      skills: ['Security Testing', 'Penetration Testing', 'GDPR', 'HIPAA', 'Automation'],
      icon: Shield,
      color: 'from-red-500 to-red-600',
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: undefined
      }
    },
    {
      name: 'Alex Johnson',
      role: 'Performance & Optimization Expert',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      bio: 'Performance optimization specialist focused on creating lightning-fast, scalable applications with modern tools.',
      skills: ['Performance Tuning', 'Caching', 'CDN', 'Monitoring', 'Analytics'],
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      social: {
        github: '#',
        linkedin: '#',
        twitter: '#',
        email: undefined
      }
    }
  ]

  const stats = [
    { number: '50+', label: 'Years Combined Experience' },
    { number: '15+', label: 'Technologies Mastered' },
    { number: '100%', label: 'Client Satisfaction' },
    { number: '24/7', label: 'Support Available' }
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
    <section id="team" className="section-padding bg-gray-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our <span className="gradient-text">Expert Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our diverse team of skilled professionals brings together decades of experience 
            across multiple technologies and industries to deliver exceptional results.
          </p>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Team Members */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {((teamMembers && teamMembers.length > 0) ? teamMembers : fallbackTeamMembers).map((member, index) => {
            const IconComponent = getIconComponent(typeof member.icon === 'string' ? member.icon : 'Code')
            return (
              <motion.div
                key={'id' in member ? member.id : index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                {/* Member Image */}
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                </div>

              {/* Member Info */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-3">
                {member.social.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 group-hover:scale-110"
                  >
                    <Github className="h-4 w-4 text-gray-600" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors duration-200 group-hover:scale-110"
                  >
                    <Linkedin className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                  </a>
                )}
                {member.social.twitter && (
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors duration-200 group-hover:scale-110"
                  >
                    <Twitter className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                  </a>
                )}
                {member.social.email && (
                  <a
                    href={`mailto:${member.social.email}`}
                    className="p-2 bg-gray-100 hover:bg-primary-100 rounded-full transition-colors duration-200 group-hover:scale-110"
                  >
                    <Mail className="h-4 w-4 text-gray-600 hover:text-primary-600" />
                  </a>
                )}
              </div>
            </motion.div>
            )
          })}
        </motion.div>

        {/* Team Culture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Team Culture
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in fostering a collaborative environment where innovation thrives 
              and every team member can contribute their unique expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Continuous Learning</h4>
              <p className="text-sm text-gray-600">We stay ahead of technology trends through continuous learning and professional development.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Quality First</h4>
              <p className="text-sm text-gray-600">Every project undergoes rigorous testing and quality assurance to ensure excellence.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Innovation Driven</h4>
              <p className="text-sm text-gray-600">We embrace new technologies and methodologies to deliver cutting-edge solutions.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TeamSection
