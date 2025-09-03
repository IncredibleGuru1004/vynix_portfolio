import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { 
  Project, 
  Service, 
  TeamMember, 
  ContactSubmission, 
  HeroContent,
  ProjectFilters,
  ServiceFilters,
  TeamFilters,
  ContactFilters,
  Analytics
} from '@/lib/types'

// Generic hook for API data fetching
function useApiData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Projects hooks
export function useProjects(filters?: ProjectFilters) {
  return useApiData(
    () => apiClient.getProjects(filters),
    [JSON.stringify(filters)]
  )
}

export function useProject(id: number) {
  return useApiData(
    () => apiClient.getProject(id),
    [id]
  )
}

export function useCreateProject() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = useCallback(async (projectData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.createProject(projectData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createProject, loading, error }
}

export function useUpdateProject() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProject = useCallback(async (projectData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.updateProject(projectData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateProject, loading, error }
}

export function useDeleteProject() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteProject = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteProject(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteProject, loading, error }
}

// Services hooks
export function useServices(filters?: ServiceFilters) {
  return useApiData(
    () => apiClient.getServices(filters),
    [JSON.stringify(filters)]
  )
}

export function useService(id: number) {
  return useApiData(
    () => apiClient.getService(id),
    [id]
  )
}

export function useCreateService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createService = useCallback(async (serviceData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.createService(serviceData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createService, loading, error }
}

export function useUpdateService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateService = useCallback(async (serviceData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.updateService(serviceData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateService, loading, error }
}

export function useDeleteService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteService = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteService(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteService, loading, error }
}

// Team hooks
export function useTeamMembers(filters?: TeamFilters) {
  return useApiData(
    () => apiClient.getTeamMembers(filters),
    [JSON.stringify(filters)]
  )
}

export function useTeamMember(id: number) {
  return useApiData(
    () => apiClient.getTeamMember(id),
    [id]
  )
}

export function useCreateTeamMember() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTeamMember = useCallback(async (memberData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.createTeamMember(memberData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team member')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createTeamMember, loading, error }
}

export function useUpdateTeamMember() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateTeamMember = useCallback(async (memberData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.updateTeamMember(memberData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team member')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateTeamMember, loading, error }
}

export function useDeleteTeamMember() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteTeamMember = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteTeamMember(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team member')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteTeamMember, loading, error }
}

// Contacts hooks
export function useContacts(filters?: ContactFilters) {
  return useApiData(
    () => apiClient.getContacts(filters),
    [JSON.stringify(filters)]
  )
}

export function useContact(id: number) {
  return useApiData(
    () => apiClient.getContact(id),
    [id]
  )
}

export function useCreateContact() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createContact = useCallback(async (contactData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.createContact(contactData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contact')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createContact, loading, error }
}

export function useUpdateContact() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateContact = useCallback(async (contactData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.updateContact(contactData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateContact, loading, error }
}

export function useDeleteContact() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteContact = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteContact(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteContact, loading, error }
}

// Hero Content hooks
export function useHeroContent(activeOnly: boolean = false) {
  return useApiData(
    () => apiClient.getHeroContent(activeOnly),
    [activeOnly]
  )
}

export function useActiveHeroContent() {
  return useApiData(
    () => apiClient.getActiveHeroContent(),
    []
  )
}

export function useCreateHeroContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createHeroContent = useCallback(async (contentData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.createHeroContent(contentData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hero content')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createHeroContent, loading, error }
}

export function useUpdateHeroContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateHeroContent = useCallback(async (contentData: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.updateHeroContent(contentData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update hero content')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateHeroContent, loading, error }
}

export function useDeleteHeroContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteHeroContent = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteHeroContent(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete hero content')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteHeroContent, loading, error }
}

// Analytics hook
export function useAnalytics() {
  return useApiData(
    () => apiClient.getAnalytics(),
    []
  )
}

// Search hook
export function useSearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      return { results: [], total: 0, query, took: 0 }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.search(query)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { search, loading, error }
}
