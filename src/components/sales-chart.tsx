"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#236a00", "#00658d", "#236a00", "#00658d", "#236a00", "#00658d"];

export function SalesChart({ data }: { data: { name: string; sales: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-surface-container-low rounded-[2rem] border border-dashed border-surface-container-highest">
        <p className="text-sm font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">Zero Data Signal</p>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#236a00" stopOpacity={1} />
              <stop offset="100%" stopColor="#83fe70" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="barGradientAlt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00658d" stopOpacity={1} />
              <stop offset="100%" stopColor="#c7e7ff" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#eff4ff" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#0b1c30', fontSize: 10, fontWeight: 800 }}
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#0b1c30', fontSize: 10, fontWeight: 800, opacity: 0.3 }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(35, 106, 0, 0.05)' }}
            contentStyle={{ 
              borderRadius: '20px', 
              border: 'none', 
              boxShadow: '0 20px 50px rgba(11,28,48,0.1)',
              padding: '16px',
              backgroundColor: '#ffffff'
            }}
            itemStyle={{
              color: '#0b1c30',
              fontWeight: 900,
              fontSize: '14px',
              fontFamily: 'Inter'
            }}
            labelStyle={{
              fontSize: '10px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#236a00',
              marginBottom: '4px'
            }}
          />
          <Bar dataKey="sales" radius={[8, 8, 0, 0]} barSize={45}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index % 2 === 0 ? "url(#barGradient)" : "url(#barGradientAlt)"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
