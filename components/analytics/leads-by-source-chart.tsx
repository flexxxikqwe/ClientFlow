"use client"

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

const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#64748b"]

export function LeadsBySourceChart({ data }: LeadsBySourceChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#fff", 
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
