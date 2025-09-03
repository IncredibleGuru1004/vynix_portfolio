import { 
  ApiResponse, 
  Project, 
  Service, 
  TeamMember, 
  ContactSubmission, 
  HeroContent,
  ProjectFilters,
  ServiceFilters,
  TeamFilters,
  ContactFilters,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateServiceRequest,
  UpdateServiceRequest,
  CreateTeamMemberRequest,
  UpdateTeamMemberRequest,
  CreateContactRequest,
  UpdateContactRequest,
  CreateHeroContentRequest,
  UpdateHeroContentRequest,
  Analytics,
  SearchResponse
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Projects API
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    const params = new URLSearchParams()
    
    if (filters?.category) params.append('category', filters.category)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

    const queryString = params.toString()
    const endpoint = `/projects${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<Project[]>(endpoint)
    return response.data || []
  }

  async getProject(id: number): Promise<Project> {
    const response = await this.request<Project>(`/projects/${id}`)
    if (!response.data) throw new Error('Project not found')
    return response.data
  }

  async createProject(project: CreateProjectRequest): Promise<Project> {
    const response = await this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    })
    if (!response.data) throw new Error('Failed to create project')
    return response.data
  }

  async updateProject(project: UpdateProjectRequest): Promise<Project> {
    const response = await this.request<Project>(`/projects/${project.id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    })
    if (!response.data) throw new Error('Failed to update project')
    return response.data
  }

  async deleteProject(id: number): Promise<void> {
    await this.request(`/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Services API
  async getServices(filters?: ServiceFilters): Promise<Service[]> {
    const params = new URLSearchParams()
    
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

    const queryString = params.toString()
    const endpoint = `/services${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<Service[]>(endpoint)
    return response.data || []
  }

  async getService(id: number): Promise<Service> {
    const response = await this.request<Service>(`/services/${id}`)
    if (!response.data) throw new Error('Service not found')
    return response.data
  }

  async createService(service: CreateServiceRequest): Promise<Service> {
    const response = await this.request<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    })
    if (!response.data) throw new Error('Failed to create service')
    return response.data
  }

  async updateService(service: UpdateServiceRequest): Promise<Service> {
    const response = await this.request<Service>(`/services/${service.id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    })
    if (!response.data) throw new Error('Failed to update service')
    return response.data
  }

  async deleteService(id: number): Promise<void> {
    await this.request(`/services/${id}`, {
      method: 'DELETE',
    })
  }

  // Team API
  async getTeamMembers(filters?: TeamFilters): Promise<TeamMember[]> {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.availability) params.append('availability', filters.availability)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

    const queryString = params.toString()
    const endpoint = `/team${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<TeamMember[]>(endpoint)
    return response.data || []
  }

  async getTeamMember(id: number): Promise<TeamMember> {
    const response = await this.request<TeamMember>(`/team/${id}`)
    if (!response.data) throw new Error('Team member not found')
    return response.data
  }

  async createTeamMember(member: CreateTeamMemberRequest): Promise<TeamMember> {
    const response = await this.request<TeamMember>('/team', {
      method: 'POST',
      body: JSON.stringify(member),
    })
    if (!response.data) throw new Error('Failed to create team member')
    return response.data
  }

  async updateTeamMember(member: UpdateTeamMemberRequest): Promise<TeamMember> {
    const response = await this.request<TeamMember>(`/team/${member.id}`, {
      method: 'PUT',
      body: JSON.stringify(member),
    })
    if (!response.data) throw new Error('Failed to update team member')
    return response.data
  }

  async deleteTeamMember(id: number): Promise<void> {
    await this.request(`/team/${id}`, {
      method: 'DELETE',
    })
  }

  // Contacts API
  async getContacts(filters?: ContactFilters): Promise<ContactSubmission[]> {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.project) params.append('project', filters.project)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters?.dateTo) params.append('dateTo', filters.dateTo)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

    const queryString = params.toString()
    const endpoint = `/contacts${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<ContactSubmission[]>(endpoint)
    return response.data || []
  }

  async getContact(id: number): Promise<ContactSubmission> {
    const response = await this.request<ContactSubmission>(`/contacts/${id}`)
    if (!response.data) throw new Error('Contact not found')
    return response.data
  }

  async createContact(contact: CreateContactRequest): Promise<ContactSubmission> {
    const response = await this.request<ContactSubmission>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    })
    if (!response.data) throw new Error('Failed to create contact')
    return response.data
  }

  async updateContact(contact: UpdateContactRequest): Promise<ContactSubmission> {
    const response = await this.request<ContactSubmission>(`/contacts/${contact.id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    })
    if (!response.data) throw new Error('Failed to update contact')
    return response.data
  }

  async deleteContact(id: number): Promise<void> {
    await this.request(`/contacts/${id}`, {
      method: 'DELETE',
    })
  }

  // Hero Content API
  async getHeroContent(activeOnly: boolean = false): Promise<HeroContent[]> {
    const params = new URLSearchParams()
    if (activeOnly) params.append('active', 'true')
    
    const queryString = params.toString()
    const endpoint = `/hero${queryString ? `?${queryString}` : ''}`
    
    const response = await this.request<HeroContent[]>(endpoint)
    return response.data || []
  }

  async getActiveHeroContent(): Promise<HeroContent | null> {
    const content = await this.getHeroContent(true)
    return content.length > 0 ? content[0] : null
  }

  async getHeroContentById(id: number): Promise<HeroContent> {
    const response = await this.request<HeroContent>(`/hero/${id}`)
    if (!response.data) throw new Error('Hero content not found')
    return response.data
  }

  async createHeroContent(content: CreateHeroContentRequest): Promise<HeroContent> {
    const response = await this.request<HeroContent>('/hero', {
      method: 'POST',
      body: JSON.stringify(content),
    })
    if (!response.data) throw new Error('Failed to create hero content')
    return response.data
  }

  async updateHeroContent(content: UpdateHeroContentRequest): Promise<HeroContent> {
    const response = await this.request<HeroContent>(`/hero/${content.id}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    })
    if (!response.data) throw new Error('Failed to update hero content')
    return response.data
  }

  async deleteHeroContent(id: number): Promise<void> {
    await this.request(`/hero/${id}`, {
      method: 'DELETE',
    })
  }

  // Analytics API
  async getAnalytics(): Promise<Analytics> {
    const response = await this.request<Analytics>('/analytics')
    if (!response.data) throw new Error('Failed to get analytics')
    return response.data
  }

  // Search API
  async search(query: string): Promise<SearchResponse> {
    const params = new URLSearchParams({ q: query })
    const response = await this.request<SearchResponse>(`/search?${params}`)
    if (!response.data) throw new Error('Search failed')
    return response.data
  }

  // Health Check API
  async healthCheck(): Promise<any> {
    const response = await this.request('/health')
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export individual functions for convenience
export const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getHeroContent,
  getActiveHeroContent,
  getHeroContentById,
  createHeroContent,
  updateHeroContent,
  deleteHeroContent,
  getAnalytics,
  search,
  healthCheck
} = apiClient

