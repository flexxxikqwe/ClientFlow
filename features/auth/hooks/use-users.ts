import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useUsers() {
  const { data, error, isLoading } = useSWR("/api/users", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  })

  return {
    users: (data?.users as { id: string; full_name: string }[]) || [],
    error,
    isLoading,
  }
}
