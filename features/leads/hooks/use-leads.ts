import useSWR from "swr"
import { Lead } from "@/types/leads"
import { fetcher } from "@/lib/utils/fetcher"

export function useLeads(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  const { page = 1, limit = 10, search = "", status = "all", sortBy = "created_at", sortOrder = "desc" } = params
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  })

  if (search) queryParams.append("search", search)
  if (status !== "all") queryParams.append("status", status)

  const { data, error, isLoading, mutate } = useSWR(
    `/api/leads?${queryParams.toString()}`,
    fetcher
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
  const { data: lead, mutate, isLoading, error } = useSWR(
    id ? `/api/leads/${id}` : null, 
    fetcher
  )

  return {
    lead,
    isLoading,
    error,
    mutate,
  }
}
