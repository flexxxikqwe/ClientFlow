"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface LeadsBySourceChartProps {
  data: { name: string; value: number }[]
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.8)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--primary) / 0.4)",
  "hsl(var(--primary) / 0.2)",
  "hsl(var(--muted) / 0.5)"
]

export function LeadsBySourceChart({ data }: LeadsBySourceChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center border border-dashed rounded-xl border-border/50 bg-secondary/5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">No data available</p>
      </div>
    )
  }

  if (!isMounted) {
    return <div className="h-[350px] w-full bg-secondary/5 animate-pulse rounded-xl" />
  }

  return (
    <div className="h-[350px] w-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%" debounce={100}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={75}
            outerRadius={95}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
