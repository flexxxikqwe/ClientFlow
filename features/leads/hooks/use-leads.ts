import useSWR from "swr"
import { Lead } from "@/types/leads"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useLeads(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  const { page = 1, limit = 10, search = "", status = "all", sortBy = "created_at", sortOrder = "desc" } = params
  
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    status,
    sortBy,
    sortOrder,
  }).toString()

  const { data, error, isLoading, mutate } = useSWR(`/api/leads?${query}`, fetcher, {
    keepPreviousData: true,
  })

  return {
    leads: (data?.data as Lead[]) || [],
    pagination: data?.pagination || { totalPages: 1, total: 0 },
    error,
    isLoading,
    mutate,
  }
}

export function useLead(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/leads/${id}` : null, fetcher)

  return {
    lead: data as Lead | null,
    error,
    isLoading,
    mutate,
  }
}
