export interface PortfolioRequest {
  tickers: string[];
  risk_profile: "conservative" | "moderate" | "aggressive";
  investment_amount: number;
  start_date: string;
  end_date: string;
}

export interface PortfolioResponse {
  weights: Record<string, number>;
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  equity_curve: Array<{ date: string; value: number }>;
  benchmark_curve: Array<{ date: string; value: number }>;
  dollar_allocation: Record<string, number>;
}

export type RiskProfile = "conservative" | "moderate" | "aggressive";
