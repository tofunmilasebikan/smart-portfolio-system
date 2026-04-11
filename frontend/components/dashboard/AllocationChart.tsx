"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioResponse } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface AllocationChartProps {
  data: PortfolioResponse;
}

const COLORS = ["#1e3a5f", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export function AllocationChart({ data }: AllocationChartProps) {
  const chartData = Object.entries(data.weights).map(([name, value]) => ({
    name,
    value,
    dollars: data.dollar_allocation[name],
  }));

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#1e3a5f]">
          Portfolio Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${typeof value === "number" ? value.toFixed(2) : "—"}%`,
                  String(name),
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase">
                <th className="text-left font-medium pb-2">Asset</th>
                <th className="text-right font-medium pb-2">Weight</th>
                <th className="text-right font-medium pb-2">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={item.name} className="border-t border-slate-50">
                  <td className="py-2 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-[#1e3a5f]">
                      {item.name}
                    </span>
                  </td>
                  <td className="py-2 text-right text-slate-600">
                    {item.value.toFixed(2)}%
                  </td>
                  <td className="py-2 text-right font-medium text-[#1e3a5f]">
                    ${item.dollars.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
