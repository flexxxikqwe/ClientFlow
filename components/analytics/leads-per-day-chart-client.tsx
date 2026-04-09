"use client"

import dynamic from "next/dynamic"

const Chart = dynamic(() => import("./leads-per-day-chart").then(mod => mod.LeadsPerDayChart), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-secondary/5 animate-pulse rounded-xl" />
})

export function LeadsPerDayChartClient({ data }: { data: { date: string; count: number }[] }) {
  return <Chart data={data} />
}
