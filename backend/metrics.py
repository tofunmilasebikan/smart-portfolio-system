import numpy as np
import pandas as pd
import yfinance as yf
from typing import Dict, List
from optimize import fetch_price_data, compute_returns


def compute_metrics(
    weights: Dict[str, float],
    mu: np.ndarray,
    cov: np.ndarray,
    risk_free_rate: float = 0.05
) -> Dict[str, float]:
    """Compute portfolio risk metrics."""
    w = np.array(list(weights.values()))
    
    expected_return = float(mu @ w)
    volatility = float(np.sqrt(w @ cov @ w))
    
    sharpe_ratio = (expected_return - risk_free_rate) / volatility if volatility > 0 else 0
    
    return {
        "expected_return": expected_return,
        "volatility": volatility,
        "sharpe_ratio": sharpe_ratio
    }


def compute_max_drawdown(equity_curve: pd.Series) -> float:
    """Compute maximum drawdown from equity curve."""
    rolling_max = equity_curve.expanding().max()
    drawdowns = (equity_curve - rolling_max) / rolling_max
    return float(drawdowns.min())


def run_backtest(
    tickers: List[str],
    weights: Dict[str, float],
    start_date: str,
    end_date: str,
    test_split: float = 0.2
) -> Dict:
    """
    Run backtest using last portion of data as out-of-sample.
    Returns equity curve for portfolio and equal-weight benchmark.
    """
    prices = fetch_price_data(tickers, start_date, end_date)
    
    split_idx = int(len(prices) * (1 - test_split))
    test_prices = prices.iloc[split_idx:].copy()
    
    if test_prices.empty or len(test_prices) < 2:
        test_prices = prices.iloc[-30:].copy()
    
    returns = compute_returns(test_prices)
    
    w = np.array([weights[ticker] for ticker in tickers])
    
    portfolio_returns = returns.values @ w
    
    portfolio_equity = (1 + portfolio_returns).cumprod()
    portfolio_equity = np.insert(portfolio_equity, 0, 1.0)
    
    benchmark_returns = returns.mean(axis=1).values
    benchmark_equity = (1 + benchmark_returns).cumprod()
    benchmark_equity = np.insert(benchmark_equity, 0, 1.0)
    
    dates = [test_prices.index[0].strftime("%Y-%m-%d")] + \
            [d.strftime("%Y-%m-%d") for d in returns.index]
    
    equity_curve = [
        {"date": dates[i], "value": round(float(portfolio_equity[i]), 4)}
        for i in range(len(dates))
    ]
    
    benchmark_curve = [
        {"date": dates[i], "value": round(float(benchmark_equity[i]), 4)}
        for i in range(len(dates))
    ]
    
    max_drawdown = compute_max_drawdown(pd.Series(portfolio_equity))
    
    return {
        "equity_curve": equity_curve,
        "benchmark_curve": benchmark_curve,
        "max_drawdown": max_drawdown
    }
