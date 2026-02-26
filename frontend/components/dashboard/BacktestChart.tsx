"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioResponse } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BacktestChartProps {
  data: PortfolioResponse;
}

export function BacktestChart({ data }: BacktestChartProps) {
  const chartData = data.equity_curve.map((point, index) => ({
    date: point.date,
    portfolio: (point.value * 100).toFixed(1),
    benchmark: (data.benchmark_curve[index]?.value * 100).toFixed(1),
  }));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#1e3a5f]">
          Backtest Performance
        </CardTitle>
        <p className="text-xs text-slate-500">
          Portfolio vs Equal-Weight Benchmark (normalized to 100)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={{ stroke: "#e2e8f0" }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={{ stroke: "#e2e8f0" }}
                axisLine={{ stroke: "#e2e8f0" }}
                domain={["dataMin - 5", "dataMax + 5"]}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                labelFormatter={formatDate}
                formatter={(value: string) => [`${value}%`, ""]}
              />
              <Legend
                iconType="line"
                iconSize={12}
                wrapperStyle={{ paddingTop: "10px" }}
              />
              <Line
                type="monotone"
                dataKey="portfolio"
                stroke="#1e3a5f"
                strokeWidth={2.5}
                dot={false}
                name="Optimized Portfolio"
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Equal-Weight Benchmark"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
