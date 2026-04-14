"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const Chart = dynamic(() => import("./leads-by-source-chart").then(mod => mod.LeadsBySourceChart), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-secondary/5 animate-pulse rounded-xl" />
})

export function LeadsBySourceChartClient({ data }: { data: { name: string; value: number }[] }) {
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
    <div ref={containerRef} className="h-full w-full min-h-[350px]">
      {isVisible ? (
        <Chart data={data} />
      ) : (
        <div className="h-full w-full bg-secondary/5 animate-pulse rounded-xl" />
      )}
    </div>
  )
}
