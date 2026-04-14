"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface LeadsPerDayChartProps {
  data: { date: string; count: number }[]
}

export function LeadsPerDayChart({ data }: LeadsPerDayChartProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Small delay to ensure parent dimensions are settled and avoid hydration mismatch
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center border border-dashed rounded-xl border-border/50 bg-secondary/5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">No data available for this period</p>
      </div>
    )
  }

  if (!isReady) {
    return <div className="h-full w-full bg-secondary/5 animate-pulse rounded-xl" />
  }

  return (
    <div className="h-full w-full relative min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" debounce={100}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border) / 0.3)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground) / 0.5)", fontWeight: 600 }}
            minTickGap={30}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground) / 0.5)", fontWeight: 600 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card) / 0.95)", 
              border: "1px solid hsl(var(--border) / 0.5)",
              borderRadius: "12px",
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              fontSize: "12px",
              fontWeight: 600,
              color: "hsl(var(--foreground))"
            }}
            itemStyle={{ color: "hsl(var(--primary))" }}
            cursor={{ stroke: "hsl(var(--primary) / 0.2)", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorCount)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
