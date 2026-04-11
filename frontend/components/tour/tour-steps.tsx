import type { ReactNode } from "react";

export type TourStep = {
  id: string;
  title: string;
  /** Spotlight target; omit for centered intro/outro cards */
  target?: "header" | "input-panel" | "disclaimer" | "results";
  content: ReactNode;
};

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Smart Portfolio",
    content: (
      <p className="text-sm text-slate-600 leading-relaxed">
        This is an <strong className="text-[#1e3a5f]">educational</strong> tool
        for learning how <strong>mean–variance optimization</strong> suggests
        splitting money across stocks using historical market data. It is{" "}
        <strong>not</strong> financial advice—think of it as a classroom-style
        dashboard for exploring ideas from quantitative finance.
      </p>
    ),
  },
  {
    id: "overview",
    title: "What you’ll do here",
    content: (
      <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
        <li>
          Pick <strong>tickers</strong> and a <strong>date range</strong> so
          the engine can estimate returns and risk from past prices.
        </li>
        <li>
          Choose a <strong>risk profile</strong>—it controls how much the
          optimizer weighs volatility vs. expected return.
        </li>
        <li>
          Run <strong>Generate Portfolio</strong> to see suggested weights,
          risk metrics, and a simple backtest vs. an equal-weight benchmark.
        </li>
      </ul>
    ),
  },
  {
    id: "header",
    title: "The header",
    target: "header",
    content: (
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong>Mean–variance optimization</strong> is the classic Markowitz
        idea: find portfolio weights that balance expected return against
        variance, using your inputs and historical data. The badge here reminds
        you which method powers the numbers below.
      </p>
    ),
  },
  {
    id: "config",
    title: "Portfolio configuration",
    target: "input-panel",
    content: (
      <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
        <p>
          <strong>Asset tickers</strong> — Stock symbols (e.g. AAPL). The engine
          pulls price history for these names from Yahoo Finance for your date
          range.
        </p>
        <p>
          <strong>Risk profile &amp; λ (lambda)</strong> —{" "}
          <em>Conservative</em> uses higher λ (more penalty on volatility);{" "}
          <em>Aggressive</em> uses lower λ. Same data, different trade-off
          between risk and return in the optimizer.
        </p>
        <p>
          <strong>Investment amount</strong> — Turns weights into dollar
          amounts for the table and charts; it does not change the optimization
          math.
        </p>
        <p>
          <strong>Start / end dates</strong> — Define the window for estimating
          returns and covariance and for the backtest chart.
        </p>
      </div>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    target: "disclaimer",
    content: (
      <p className="text-sm text-slate-600 leading-relaxed">
        The amber box states the tool is for <strong>learning only</strong>.
        Past performance and sample statistics do not guarantee future results.
      </p>
    ),
  },
  {
    id: "results",
    title: "Your results area",
    target: "results",
    content: (
      <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
        <p>
          After you generate a portfolio, this side fills with{" "}
          <strong>metrics</strong> and <strong>charts</strong>.
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Expected return</strong> — Annualized return implied by the
            model and your weights.
          </li>
          <li>
            <strong>Volatility</strong> — Annualized standard deviation of the
            portfolio (a common risk measure).
          </li>
          <li>
            <strong>Sharpe ratio</strong> — Return per unit of risk (using the
            model’s assumptions); useful for comparing risk-adjusted outcomes.
          </li>
          <li>
            <strong>Max drawdown</strong> — Largest peak-to-trough drop in the
            backtest path—a sense of historical downside.
          </li>
          <li>
            <strong>Allocation chart</strong> — Weights and dollars per ticker.
          </li>
          <li>
            <strong>Backtest</strong> — Optimized portfolio vs. an{" "}
            <strong>equal-weight benchmark</strong> (same tickers, equal
            fractions) over your date range.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "done",
    title: "You’re set",
    content: (
      <p className="text-sm text-slate-600 leading-relaxed">
        Use <strong>Generate Portfolio</strong> when the backend is running, and
        explore how changing tickers, dates, and risk profile changes the
        suggested mix. You can open this tour anytime from{" "}
        <strong>Take a tour</strong> in the header.
      </p>
    ),
  },
];
