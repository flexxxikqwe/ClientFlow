import useSWR from "swr"
import { Lead } from "@/types/leads"
import { LocalStore } from "@/lib/store"
import { useMemo } from "react"

export function useLeads(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  const { page = 1, limit = 10, search = "", status = "all", sortBy = "created_at", sortOrder = "desc" } = params
  
  // Use SWR for local state management and easy revalidation
  const { data: allLeads, mutate } = useSWR("local_leads", () => LocalStore.getLeads(), {
    fallbackData: [],
    revalidateOnFocus: false
  })

  const { filteredLeads, total } = useMemo(() => {
    let filtered = [...(allLeads || [])]

    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter(l => 
        l.first_name.toLowerCase().includes(s) || 
        l.last_name.toLowerCase().includes(s) || 
        l.email?.toLowerCase().includes(s) || 
        l.company?.toLowerCase().includes(s)
      )
    }

    if (status !== "all") {
      filtered = filtered.filter(l => l.status === status)
    }

    filtered.sort((a, b) => {
      const valA = (a as any)[sortBy] || ""
      const valB = (b as any)[sortBy] || ""
      if (sortOrder === "asc") return valA > valB ? 1 : -1
      return valA < valB ? 1 : -1
    })

    const total = filtered.length
    const start = (page - 1) * limit
    const paginated = filtered.slice(start, start + limit)

    return { filteredLeads: paginated, total }
  }, [allLeads, search, status, sortBy, sortOrder, page, limit])

  return {
    leads: filteredLeads,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    isLoading: !allLeads,
    error: null,
    mutate,
  }
}

export function useLead(id: string | null) {
  const { data: lead, mutate, isLoading } = useSWR(id ? `lead_${id}` : null, () => id ? LocalStore.getLead(id) : null)

  return {
    lead,
    isLoading,
    mutate,
  }
}
