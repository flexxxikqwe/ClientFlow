import useSWR from "swr"
import { usePathname } from "next/navigation"
import { Lead } from "@/types/leads"
import { fetcher } from "@/lib/utils/fetcher"
import { getStoredDemoLeads } from "../utils/demo-persistence"
import { useUser } from "@/features/auth/context/user-context"

export function useLeads(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  const { page = 1, limit = 10, search = "", status = "all", sortBy = "created_at", sortOrder = "desc" } = params
  const pathname = usePathname()
  const { isDemo: isUserDemo } = useUser()
  const isDemoMode = isUserDemo || pathname?.startsWith("/demo")
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  })

  if (search) queryParams.append("search", search)
  if (status !== "all") queryParams.append("status", status)

  // Demo fetcher implementation
  const demoFetcher = () => {
    let leads = getStoredDemoLeads()
    
    // Apply status filter
    if (status !== "all") {
      leads = leads.filter(l => l.status.toLowerCase() === status.toLowerCase())
    }

    // Apply search filter
    if (search) {
      const query = search.toLowerCase()
      leads = leads.filter(l => 
        l.first_name.toLowerCase().includes(query) ||
        l.last_name.toLowerCase().includes(query) ||
        l.company?.toLowerCase().includes(query) ||
        l.email?.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    leads.sort((a, b) => {
      const valA = a[sortBy as keyof Lead]
      const valB = b[sortBy as keyof Lead]
      
      if (!valA) return 1
      if (!valB) return -1
      
      let comparison = 0
      if (valA < valB) comparison = -1
      if (valA > valB) comparison = 1
      
      return sortOrder === "asc" ? comparison : -comparison
    })

    // Pagination
    const total = leads.length
    const totalPages = Math.ceil(total / limit)
    const paginatedLeads = leads.slice((page - 1) * limit, page * limit)

    return {
      leads: paginatedLeads,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    }
  }

  const swrKey = isDemoMode 
    ? [`demo-leads`, search, status, sortBy, sortOrder]
    : queryParams.toString() ? `/api/leads?${queryParams.toString()}` : null

  const { data: allDemoLeads, error, isLoading, mutate } = useSWR(
    isDemoMode ? [`demo-leads`] : null,
    isDemoMode ? getStoredDemoLeads : null
  )

  const { data, error: fetchError, isLoading: isFetching } = useSWR(
    swrKey,
    isDemoMode && allDemoLeads ? () => {
      let filtered = [...allDemoLeads]
      
      // Apply status filter
      if (status !== "all") {
        filtered = filtered.filter(l => l.status.toLowerCase() === status.toLowerCase())
      }

      // Apply search filter
      if (search) {
        const query = search.toLowerCase()
        filtered = filtered.filter(l => 
          l.first_name.toLowerCase().includes(query) ||
          l.last_name.toLowerCase().includes(query) ||
          l.company?.toLowerCase().includes(query) ||
          l.email?.toLowerCase().includes(query)
        )
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const valA = a[sortBy as keyof Lead]
        const valB = b[sortBy as keyof Lead]
        
        if (valA === undefined || valA === null) return 1
        if (valB === undefined || valB === null) return -1
        
        let comparison = 0
        if (valA < valB) comparison = -1
        if (valA > valB) comparison = 1
        
        return sortOrder === "asc" ? comparison : -comparison
      })

      // Pagination
      const total = filtered.length
      const totalPages = Math.ceil(total / limit)
      const paginatedLeads = filtered.slice((page - 1) * limit, page * limit)

      return {
        leads: paginatedLeads,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      }
    } : fetcher
  )

  return {
    leads: data?.leads || [],
    pagination: data?.pagination || {
      total: 0,
      page,
      limit,
      totalPages: 0
    },
    isLoading,
    error,
    mutate,
  }
}

export function useLead(id: string | null) {
  const pathname = usePathname()
  const { isDemo: isUserDemo } = useUser()
  const isDemoMode = isUserDemo || pathname?.startsWith("/demo")
  const isDemoId = id?.startsWith("demo-")
  
  const { data: lead, mutate, isLoading, error } = useSWR(
    id && !isDemoMode && !isDemoId ? `/api/leads/${id}` : null, 
    fetcher
  )

  if (isDemoMode || isDemoId) {
    const leads = getStoredDemoLeads()
    const demoLead = leads.find(l => l.id === id)
    return {
      lead: demoLead as Lead,
      isLoading: false,
      error: null,
      mutate: async () => {
        const currentLeads = getStoredDemoLeads()
        return currentLeads.find(l => l.id === id) as Lead
      },
    }
  }

  return {
    lead,
    isLoading,
    error,
    mutate,
  }
}
