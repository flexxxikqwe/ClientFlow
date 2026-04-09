"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const Chart = dynamic(() => import("./leads-per-day-chart").then(mod => mod.LeadsPerDayChart), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-secondary/5 animate-pulse rounded-xl" />
})

export function LeadsPerDayChartClient({ data }: { data: { date: string; count: number }[] }) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" } // Start loading 200px before it enters viewport
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="h-[400px] w-full">
      {isVisible ? (
        <Chart data={data} />
      ) : (
        <div className="h-[400px] w-full bg-secondary/5 animate-pulse rounded-xl" />
      )}
    </div>
  )
}
