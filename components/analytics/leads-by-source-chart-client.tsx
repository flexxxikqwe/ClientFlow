"use client"

import dynamic from "next/dynamic"

const Chart = dynamic(() => import("./leads-by-source-chart").then(mod => mod.LeadsBySourceChart), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-secondary/5 animate-pulse rounded-xl" />
})

export function LeadsBySourceChartClient({ data }: { data: { name: string; value: number }[] }) {
  return <Chart data={data} />
}
