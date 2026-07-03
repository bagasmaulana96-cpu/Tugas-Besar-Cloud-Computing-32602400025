"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
  "#7c3aed",
  "#60a5fa",
  "#22c55e",
  "#f59e0b",
  "#f87171",
  "#a855f7",
];

interface DonutChartProps {
  data: { name: string; value: number }[];
  title: string;
  emptyLabel?: string;
}

function CustomTooltip({ active, payload, total }: any) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
  return (
    <div className="bg-bg-card/90 backdrop-blur-xl border border-bg-border rounded-xl px-3 py-2 text-sm">
      <p className="text-text-primary font-medium">{item.name}</p>
      <p className="text-text-secondary text-xs">
        {item.value.toLocaleString()} ({percent}%)
      </p>
    </div>
  );
}

export default function DonutChart({
  data,
  title,
  emptyLabel = "No data yet",
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const hasData = data.length > 0 && total > 0;
  return (
    <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
      <h3 className="text-lg font-bold text-text-primary mb-4">{title}</h3>
      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-text-muted text-sm gap-2">
          <PieChartIcon size={32} className="text-text-faint" />
          {emptyLabel}
        </div>
      ) : (
        <>
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={2}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-text-primary">
                {total.toLocaleString()}
              </span>
              <span className="text-text-secondary text-xs uppercase tracking-wide">
                Total
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {data.map((item, index) => {
              const percent =
                total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 text-xs text-text-secondary"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.name} ({percent}%)
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
