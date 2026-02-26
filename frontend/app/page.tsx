"use client";

import { useState } from "react";
import {
  InputPanel,
  MetricsCards,
  AllocationChart,
  BacktestChart,
} from "@/components/dashboard";
import { PortfolioResponse, RiskProfile } from "@/lib/types";
import { mockPortfolioData } from "@/lib/mock-data";

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    tickers: string[];
    riskProfile: RiskProfile;
    investmentAmount: number;
    startDate: string;
    endDate: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${apiUrl}/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tickers: data.tickers,
          risk_profile: data.riskProfile,
          investment_amount: data.investmentAmount,
          start_date: data.startDate,
          end_date: data.endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to optimize portfolio");
      }

      const result: PortfolioResponse = await response.json();
      setPortfolioData(result);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setPortfolioData(mockPortfolioData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#1e3a5f]">
                Smart Portfolio
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Quantitative Portfolio Optimization
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                Mean-Variance Optimization
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <InputPanel onSubmit={handleSubmit} isLoading={isLoading} />

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Disclaimer:</strong> This tool is for educational
                purposes only. Not financial advice.
              </p>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </p>
                <p className="text-xs text-red-500 mt-1">
                  Showing mock data for demonstration.
                </p>
              </div>
            )}

            {portfolioData ? (
              <>
                <MetricsCards data={portfolioData} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <AllocationChart data={portfolioData} />
                  <BacktestChart data={portfolioData} />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-slate-200 border-dashed">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-700">
                    No Portfolio Generated
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">
                    Configure your portfolio parameters and click "Generate
                    Portfolio" to see optimization results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-slate-400 text-center">
            Built for Senior Seminar Capstone Project • Mean-Variance
            Optimization Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
