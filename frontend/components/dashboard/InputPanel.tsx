"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskProfile } from "@/lib/types";

interface InputPanelProps {
  onSubmit: (data: {
    tickers: string[];
    riskProfile: RiskProfile;
    investmentAmount: number;
    startDate: string;
    endDate: string;
  }) => void;
  isLoading: boolean;
}

export function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [tickers, setTickers] = useState("AAPL, MSFT, GOOGL, AMZN, NVDA");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("moderate");
  const [investmentAmount, setInvestmentAmount] = useState("10000");
  const [startDate, setStartDate] = useState("2022-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tickerList = tickers
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    onSubmit({
      tickers: tickerList,
      riskProfile,
      investmentAmount: parseFloat(investmentAmount),
      startDate,
      endDate,
    });
  };

  return (
    <Card className="h-fit shadow-sm border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-[#1e3a5f]">
          Portfolio Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="tickers" className="text-sm font-medium">
              Asset Tickers
            </Label>
            <Input
              id="tickers"
              placeholder="AAPL, MSFT, GOOGL, AMZN"
              value={tickers}
              onChange={(e) => setTickers(e.target.value)}
              className="border-slate-200 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
            />
            <p className="text-xs text-slate-500">
              Enter comma-separated ticker symbols
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk" className="text-sm font-medium">
              Risk Profile
            </Label>
            <Select
              value={riskProfile}
              onValueChange={(v) => setRiskProfile(v as RiskProfile)}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Select risk profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">
                  Conservative (λ = 10)
                </SelectItem>
                <SelectItem value="moderate">Moderate (λ = 5)</SelectItem>
                <SelectItem value="aggressive">Aggressive (λ = 1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Investment Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              min="100"
              step="100"
              placeholder="10000"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="border-slate-200 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start" className="text-sm font-medium">
                Start Date
              </Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end" className="text-sm font-medium">
                End Date
              </Label>
              <Input
                id="end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-slate-200"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-medium py-2.5"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Optimizing...
              </span>
            ) : (
              "Generate Portfolio"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
