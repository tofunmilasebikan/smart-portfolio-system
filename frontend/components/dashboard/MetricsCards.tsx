"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PortfolioResponse } from "@/lib/types";

interface MetricsCardsProps {
  data: PortfolioResponse;
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const metrics = [
    {
      label: "Expected Return",
      value: `${data.expected_return.toFixed(2)}%`,
      description: "Annualized",
      positive: data.expected_return > 0,
    },
    {
      label: "Volatility",
      value: `${data.volatility.toFixed(2)}%`,
      description: "Annualized",
      positive: null,
    },
    {
      label: "Sharpe Ratio",
      value: data.sharpe_ratio.toFixed(2),
      description: "Risk-adjusted",
      positive: data.sharpe_ratio > 0,
    },
    {
      label: "Max Drawdown",
      value: `${data.max_drawdown.toFixed(2)}%`,
      description: "Historical",
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="shadow-sm border-slate-200 hover:shadow-md transition-shadow"
        >
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {metric.label}
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                metric.positive === true
                  ? "text-emerald-600"
                  : metric.positive === false
                  ? "text-red-500"
                  : "text-[#1e3a5f]"
              }`}
            >
              {metric.value}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
