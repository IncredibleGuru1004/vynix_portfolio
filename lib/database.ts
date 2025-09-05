import { 
  Project, 
  Service, 
  TeamMember, 
  ContactSubmission, 
  HeroContent,
  ProjectCategory,
  ProjectStatus,
  TeamStatus,
  ContactStatus
} from './types'

// In-memory database simulation
// In a real application, you would use a proper database like PostgreSQL, MongoDB, etc.

class Database {
  private projects: Project[] = []
  private services: Service[] = []
  private teamMembers: TeamMember[] = []
  private contacts: ContactSubmission[] = []
  private heroContent: HeroContent[] = []
  private nextId = 1

  constructor() {
    this.seedData()
  }

  // Projects
  getProjects(): Project[] {
    return [...this.projects]
  }

  getProject(id: number): Project | undefined {
    return this.projects.find(p => p.id === id)
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProject: Project = {
      ...project,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.projects.push(newProject)
    return newProject
  }

  updateProject(id: number, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex(p => p.id === id)
    if (index === -1) return null
    
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    return this.projects[index]
  }

  deleteProject(id: number): boolean {
    const index = this.projects.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.projects.splice(index, 1)
    return true
  }

  // Services
  getServices(): Service[] {
    return [...this.services]
  }

  getService(id: number): Service | undefined {
    return this.services.find(s => s.id === id)
  }

  createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const newService: Service = {
      ...service,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.services.push(newService)
    return newService
  }

  updateService(id: number, updates: Partial<Service>): Service | null {
    const index = this.services.findIndex(s => s.id === id)
    if (index === -1) return null
    
    this.services[index] = {
      ...this.services[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    return this.services[index]
  }

  deleteService(id: number): boolean {
    const index = this.services.findIndex(s => s.id === id)
    if (index === -1) return false
    
    this.services.splice(index, 1)
    return true
  }

  // Team Members
  getTeamMembers(): TeamMember[] {
    return [...this.teamMembers]
  }

  getTeamMember(id: number): TeamMember | undefined {
    return this.teamMembers.find(t => t.id === id)
  }

  createTeamMember(member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): TeamMember {
    const newMember: TeamMember = {
      ...member,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.teamMembers.push(newMember)
    return newMember
  }

  updateTeamMember(id: number, updates: Partial<TeamMember>): TeamMember | null {
    const index = this.teamMembers.findIndex(t => t.id === id)
    if (index === -1) return null
    
    this.teamMembers[index] = {
      ...this.teamMembers[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    return this.teamMembers[index]
  }

  deleteTeamMember(id: number): boolean {
    const index = this.teamMembers.findIndex(t => t.id === id)
    if (index === -1) return false
    
    this.teamMembers.splice(index, 1)
    return true
  }

  // Contacts
  getContacts(): ContactSubmission[] {
    return [...this.contacts]
  }

  getContact(id: number): ContactSubmission | undefined {
    return this.contacts.find(c => c.id === id)
  }

  createContact(contact: Omit<ContactSubmission, 'id' | 'createdAt' | 'updatedAt'>): ContactSubmission {
    const newContact: ContactSubmission = {
      ...contact,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.contacts.push(newContact)
    return newContact
  }

  updateContact(id: number, updates: Partial<ContactSubmission>): ContactSubmission | null {
    const index = this.contacts.findIndex(c => c.id === id)
    if (index === -1) return null
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    return this.contacts[index]
  }

  deleteContact(id: number): boolean {
    const index = this.contacts.findIndex(c => c.id === id)
    if (index === -1) return false
    
    this.contacts.splice(index, 1)
    return true
  }

  // Hero Content
  getHeroContent(): HeroContent[] {
    return [...this.heroContent]
  }

  getActiveHeroContent(): HeroContent | undefined {
    return this.heroContent.find(h => h.isActive)
  }

  createHeroContent(content: Omit<HeroContent, 'id' | 'createdAt' | 'updatedAt'>): HeroContent {
    const newContent: HeroContent = {
      ...content,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.heroContent.push(newContent)
    return newContent
  }

  updateHeroContent(id: number, updates: Partial<HeroContent>): HeroContent | null {
    const index = this.heroContent.findIndex(h => h.id === id)
    if (index === -1) return null
    
    this.heroContent[index] = {
      ...this.heroContent[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    }
    return this.heroContent[index]
  }

  deleteHeroContent(id: number): boolean {
    const index = this.heroContent.findIndex(h => h.id === id)
    if (index === -1) return false
    
    this.heroContent.splice(index, 1)
    return true
  }

  // Seed data
  private seedData() {
    // Seed Projects
    this.projects = [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and MongoDB database. Features include payment integration, inventory management, and admin dashboard.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
        category: 'Web Application' as ProjectCategory,
        status: 'published' as ProjectStatus,
        featured: true,
        order: 1,
        liveUrl: 'https://example-ecommerce.com',
        githubUrl: 'https://github.com/example/ecommerce',
        client: 'TechCorp Inc.',
        duration: '6 months',
        teamSize: 5,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      },
      {
        id: 2,
        title: 'Healthcare Mobile App',
        description: 'Cross-platform mobile application for healthcare providers with patient management, appointment scheduling, and telemedicine features.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
        technologies: ['React Native', 'Firebase', 'Node.js', 'PostgreSQL'],
        category: 'Mobile App' as ProjectCategory,
        status: 'published' as ProjectStatus,
        featured: true,
        order: 2,
        liveUrl: 'https://apps.apple.com/healthcare-app',
        client: 'HealthCare Plus',
        duration: '8 months',
        teamSize: 4,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-18T00:00:00Z'
      },
      {
        id: 3,
        title: 'Financial Analytics Dashboard',
        description: 'Real-time financial data visualization platform with advanced analytics, reporting tools, and secure data processing capabilities.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        technologies: ['Vue.js', 'Python', 'PostgreSQL', 'D3.js', 'Docker'],
        category: 'Data Analytics' as ProjectCategory,
        status: 'draft' as ProjectStatus,
        featured: false,
        order: 3,
        client: 'FinanceCorp',
        duration: '4 months',
        teamSize: 3,
        createdAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-19T00:00:00Z'
      }
    ]

    // Seed Services
    this.services = [
      {
        id: 1,
        title: 'Frontend Development',
        description: 'Modern, responsive web applications using React, Vue.js, and Angular with TypeScript.',
        technologies: ['React.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Next.js'],
        icon: 'Code',
        color: 'from-blue-500 to-blue-600',
        isActive: true,
        order: 1,
        features: ['Responsive Design', 'Performance Optimization', 'SEO Friendly', 'Accessibility'],
        pricing: {
          starting: 5000,
          currency: 'USD',
          unit: 'project'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'Backend Development',
        description: 'Scalable server-side solutions with Node.js, Python, Java, and PHP frameworks.',
        technologies: ['Node.js', 'Python', 'Java', 'PHP', 'Express.js', 'Django', 'Spring Boot'],
        icon: 'Server',
        color: 'from-green-500 to-green-600',
        isActive: true,
        order: 2,
        features: ['RESTful APIs', 'Database Design', 'Authentication', 'Security'],
        pricing: {
          starting: 8000,
          currency: 'USD',
          unit: 'project'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        title: 'Mobile Development',
        description: 'Cross-platform mobile apps with React Native and Flutter for iOS and Android.',
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Xcode'],
        icon: 'Smartphone',
        color: 'from-purple-500 to-purple-600',
        isActive: true,
        order: 3,
        features: ['Cross-platform', 'Native Performance', 'App Store Deployment', 'Push Notifications'],
        pricing: {
          starting: 10000,
          currency: 'USD',
          unit: 'project'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 4,
        title: 'Cloud Solutions',
        description: 'AWS, Azure, and Google Cloud infrastructure with containerization and DevOps.',
        technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD'],
        icon: 'Cloud',
        color: 'from-orange-500 to-orange-600',
        isActive: true,
        order: 4,
        features: ['Infrastructure as Code', 'Auto-scaling', 'Monitoring', 'Disaster Recovery'],
        pricing: {
          starting: 12000,
          currency: 'USD',
          unit: 'project'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 5,
        title: 'Database Design',
        description: 'SQL and NoSQL database solutions with optimization and security best practices.',
        technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs'],
        icon: 'Database',
        color: 'from-red-500 to-red-600',
        isActive: true,
        order: 5,
        features: ['Database Optimization', 'Data Modeling', 'Backup & Recovery', 'Performance Tuning'],
        pricing: {
          starting: 6000,
          currency: 'USD',
          unit: 'project'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 6,
        title: 'Security & Compliance',
        description: 'Enterprise-grade security implementation and compliance with industry standards.',
        technologies: ['SSL/TLS', 'OAuth', 'JWT', 'GDPR', 'HIPAA', 'SOC 2'],
        icon: 'Shield',
        color: 'from-indigo-500 to-indigo-600',
        isActive: true,
        order: 6,
        features: ['Security Audits', 'Penetration Testing', 'Compliance', 'Data Protection'],
        pricing: {
          starting: 15000,
          currency: 'USD',
          unit: 'project'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 7,
        title: 'Performance Optimization',
        description: 'Application performance tuning, caching strategies, and scalability solutions.',
        technologies: ['CDN', 'Caching', 'Load Balancing', 'Monitoring', 'Analytics'],
        icon: 'Zap',
        color: 'from-yellow-500 to-yellow-600',
        isActive: true,
        order: 7,
        features: ['Performance Audits', 'Caching Strategies', 'Load Testing', 'Monitoring Setup'],
        pricing: {
          starting: 7000,
          currency: 'USD',
          unit: 'project'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 8,
        title: 'Team Augmentation',
        description: 'Expert developers and specialists to augment your existing development teams.',
        technologies: ['Agile', 'Scrum', 'DevOps', 'Code Review', 'Mentoring'],
        icon: 'Users',
        color: 'from-pink-500 to-pink-600',
        isActive: true,
        order: 8,
        features: ['Dedicated Teams', 'Code Reviews', 'Mentoring', 'Agile Coaching'],
        pricing: {
          starting: 8000,
          currency: 'USD',
          unit: 'month'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    // Seed Team Members
    this.teamMembers = [
      {
        id: 1,
        name: 'Sarah Chen',
        role: 'Lead Full-Stack Developer',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        bio: 'Expert in React, Node.js, and cloud architecture with 8+ years of experience building scalable web applications.',
        skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'PostgreSQL'],
        icon: 'Code',
        color: 'from-blue-500 to-blue-600',
        social: {
          github: 'https://github.com/sarahchen',
          linkedin: 'https://linkedin.com/in/sarahchen',
          twitter: 'https://twitter.com/sarahchen',
          email: 'sarah@vynixinnovations.com'
        },
        status: 'active' as TeamStatus,
        joinedDate: '2023-01-15',
        experience: 8,
        location: 'San Francisco, CA',
        availability: 'available',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Marcus Rodriguez',
        role: 'Mobile Development Specialist',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        bio: 'Passionate mobile developer specializing in React Native and Flutter with expertise in cross-platform solutions.',
        skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
        icon: 'Smartphone',
        color: 'from-purple-500 to-purple-600',
        social: {
          github: 'https://github.com/marcusrod',
          linkedin: 'https://linkedin.com/in/marcusrod',
          twitter: 'https://twitter.com/marcusrod',
          email: 'marcus@vynixinnovations.com'
        },
        status: 'active' as TeamStatus,
        joinedDate: '2023-03-20',
        experience: 5,
        location: 'Austin, TX',
        availability: 'available',
        createdAt: '2023-03-20T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    // Seed Contacts
    this.contacts = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Corp',
        project: 'Web Application',
        budget: '$50,000 - $100,000',
        message: 'We are looking for a comprehensive web application for our business. The project involves user management, payment processing, and analytics dashboard.',
        status: 'new' as ContactStatus,
        submittedAt: '2024-01-20T10:30:00Z',
        phone: '+1-555-0123',
        priority: 'high',
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@startup.com',
        company: 'StartupXYZ',
        project: 'Mobile App',
        budget: '$25,000 - $50,000',
        message: 'Need a mobile app for our startup. Looking for both iOS and Android versions with backend integration.',
        status: 'read' as ContactStatus,
        submittedAt: '2024-01-19T14:15:00Z',
        priority: 'medium',
        createdAt: '2024-01-19T14:15:00Z',
        updatedAt: '2024-01-19T14:15:00Z'
      }
    ]

    // Seed Hero Content
    this.heroContent = [
      {
        id: 1,
        title: 'Innovative Technology Solutions',
        subtitle: 'Transforming Ideas into Digital Reality',
        description: 'We are a leading IT development agency specializing in cutting-edge web applications, mobile solutions, and cloud infrastructure. Our expert team delivers scalable, secure, and high-performance solutions tailored to your business needs.',
        primaryButton: {
          text: 'Get Started',
          link: '/contact'
        },
        secondaryButton: {
          text: 'View Portfolio',
          link: '/#portfolio'
        },
        backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
        isActive: true,
        order: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]

    this.nextId = Math.max(
      ...this.projects.map(p => p.id),
      ...this.services.map(s => s.id),
      ...this.teamMembers.map(t => t.id),
      ...this.contacts.map(c => c.id),
      ...this.heroContent.map(h => h.id)
    ) + 1
  }
}

// Export singleton instance
export const db = new Database()

