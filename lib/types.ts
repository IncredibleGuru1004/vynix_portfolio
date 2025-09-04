// Base types
export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

// Project types
export interface Project extends BaseEntity {
  title: string
  description: string
  image: string
  technologies: string[]
  category: ProjectCategory
  status: ProjectStatus
  featured: boolean
  order: number
  liveUrl?: string
  githubUrl?: string
  client?: string
  duration?: string
  teamSize?: number
}

export type ProjectCategory = 
  | 'Web Application'
  | 'Mobile App'
  | 'Data Analytics'
  | 'Cloud Solutions'
  | 'IoT Solutions'
  | 'E-commerce'
  | 'API Development'
  | 'DevOps'

export type ProjectStatus = 'published' | 'draft' | 'archived'

// Service types
export interface Service extends BaseEntity {
  title: string
  description: string
  technologies: string[]
  icon: string
  color: string
  isActive: boolean
  order: number
  features: string[]
  pricing?: {
    starting: number
    currency: string
    unit: string
  }
}

// Team Member types (now derived from approved TeamRegistration)
export interface TeamMember extends BaseEntity {
  name: string
  role: string
  image: string
  bio: string
  skills: string[]
  icon: string
  color: string
  social: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
  }
  status: TeamStatus
  joinedDate: string
  experience: number
  location?: string
  availability: 'available' | 'busy' | 'unavailable'
  // Additional fields from TeamRegistration
  originalRegistrationId?: string
  position?: string
  coverLetter?: string
}

export type TeamStatus = 'active' | 'inactive'

// Team Registration types
export interface TeamRegistration {
  id: string // Firebase uses string IDs
  firstName: string
  lastName: string
  email: string
  phone?: string
  location?: string
  position: string
  experience: string
  skills: string
  github?: string
  linkedin?: string
  portfolio?: string
  coverLetter: string
  availability: 'full-time' | 'part-time' | 'contract' | 'freelance'
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTeamRegistrationRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  location?: string
  position: string
  experience: string
  skills: string
  github?: string
  linkedin?: string
  portfolio?: string
  coverLetter: string
  availability: 'full-time' | 'part-time' | 'contract' | 'freelance'
  avatar?: string
}

export interface UpdateTeamRegistrationRequest {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  reviewedBy?: string
}

export interface TeamRegistrationFilters extends PaginationParams {
  status?: 'pending' | 'approved' | 'rejected'
  position?: string
  experience?: string
  availability?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

// Contact types
export interface ContactSubmission extends BaseEntity {
  name: string
  email: string
  company: string
  project: string
  budget: string
  message: string
  status: ContactStatus
  submittedAt: string
  repliedAt?: string
  phone?: string
  website?: string
  timeline?: string
  priority: 'low' | 'medium' | 'high'
}

export type ContactStatus = 'new' | 'read' | 'replied' | 'archived'

// Hero Content types
export interface HeroContent extends BaseEntity {
  title: string
  subtitle: string
  description: string
  primaryButton: {
    text: string
    link: string
  }
  secondaryButton: {
    text: string
    link: string
  }
  backgroundImage?: string
  isActive: boolean
  order: number
}

// Admin User types
export interface AdminUser extends BaseEntity {
  username: string
  email: string
  role: AdminRole
  isActive: boolean
  lastLogin?: string
  permissions: Permission[]
}

export type AdminRole = 'super_admin' | 'admin' | 'editor'
export type Permission = 
  | 'manage_projects'
  | 'manage_services'
  | 'manage_team'
  | 'manage_contacts'
  | 'manage_hero'
  | 'view_analytics'
  | 'manage_users'

// Firebase Admin User types (for authentication)
export interface FirebaseAdminUser {
  uid: string
  email: string
  displayName?: string
  role: 'admin' | 'team-member'
  isApproved: boolean
  createdAt: Date
  lastLoginAt?: Date
  createdBy?: string
  createdByEmail?: string
  promotedBy?: string
  promotedByEmail?: string
  promotedAt?: Date
  demotedBy?: string
  demotedByEmail?: string
  demotedAt?: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Filter types
export interface ProjectFilters extends PaginationParams {
  category?: ProjectCategory
  status?: ProjectStatus
  featured?: boolean
  search?: string
}

export interface ServiceFilters extends PaginationParams {
  isActive?: boolean
  search?: string
}

export interface TeamFilters extends PaginationParams {
  status?: TeamStatus
  availability?: string
  search?: string
}

export interface ContactFilters extends PaginationParams {
  status?: ContactStatus
  project?: string
  priority?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

// Form types
export interface CreateProjectRequest {
  title: string
  description: string
  image: string
  technologies: string[]
  category: ProjectCategory
  status: ProjectStatus
  featured?: boolean
  liveUrl?: string
  githubUrl?: string
  client?: string
  duration?: string
  teamSize?: number
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: number
}

export interface CreateServiceRequest {
  title: string
  description: string
  technologies: string[]
  icon: string
  color: string
  isActive?: boolean
  features: string[]
  pricing?: {
    starting: number
    currency: string
    unit: string
  }
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: number
}

export interface CreateTeamMemberRequest {
  name: string
  role: string
  image: string
  bio: string
  skills: string[]
  icon: string
  color: string
  social: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
  }
  status: TeamStatus
  joinedDate: string
  experience: number
  location?: string
  availability: 'available' | 'busy' | 'unavailable'
}

export interface UpdateTeamMemberRequest extends Partial<CreateTeamMemberRequest> {
  id: number
}

export interface CreateContactRequest {
  name: string
  email: string
  company: string
  project: string
  budget: string
  message: string
  phone?: string
  website?: string
  timeline?: string
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  id: number
  status?: ContactStatus
}

export interface CreateHeroContentRequest {
  title: string
  subtitle: string
  description: string
  primaryButton: {
    text: string
    link: string
  }
  secondaryButton: {
    text: string
    link: string
  }
  backgroundImage?: string
  isActive?: boolean
}

export interface UpdateHeroContentRequest extends Partial<CreateHeroContentRequest> {
  id: number
}

// Analytics types
export interface Analytics {
  totalProjects: number
  totalServices: number
  totalTeamMembers: number
  totalContacts: number
  newContactsThisMonth: number
  publishedProjects: number
  activeServices: number
  activeTeamMembers: number
  contactStatusBreakdown: {
    new: number
    read: number
    replied: number
    archived: number
  }
  projectCategoryBreakdown: Record<ProjectCategory, number>
  monthlyContactTrend: Array<{
    month: string
    count: number
  }>
}

// Search types
export interface SearchResult {
  type: 'project' | 'service' | 'team' | 'contact'
  id: number
  title: string
  description: string
  url: string
  relevance: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  took: number
}

