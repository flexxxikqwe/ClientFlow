"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const Chart = dynamic(() => import("./leads-by-source-chart").then(mod => mod.LeadsBySourceChart), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-secondary/5 animate-pulse rounded-xl" />
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
    <div ref={containerRef} className="h-[400px] w-full">
      {isVisible ? (
        <Chart data={data} />
      ) : (
        <div className="h-[400px] w-full bg-secondary/5 animate-pulse rounded-xl" />
      )}
    </div>
  )
}
