import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize
from typing import List, Tuple, Dict


def fetch_price_data(tickers: List[str], start_date: str, end_date: str) -> pd.DataFrame:
    """Fetch adjusted close prices for given tickers."""
    data = yf.download(tickers, start=start_date, end=end_date, progress=False)
    
    if len(tickers) == 1:
        prices = data["Adj Close"].to_frame(tickers[0])
    else:
        prices = data["Adj Close"]
    
    prices = prices.dropna()
    
    if prices.empty:
        raise ValueError("No price data available for the given date range")
    
    return prices


def compute_returns(prices: pd.DataFrame) -> pd.DataFrame:
    """Compute daily log returns."""
    return np.log(prices / prices.shift(1)).dropna()


def estimate_parameters(returns: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
    """Estimate annualized mean returns and covariance matrix."""
    trading_days = 252
    
    mu = returns.mean().values * trading_days
    cov = returns.cov().values * trading_days
    
    return mu, cov


def optimize_portfolio(
    mu: np.ndarray,
    cov: np.ndarray,
    lambda_risk: float
) -> np.ndarray:
    """
    Mean-variance optimization with risk aversion parameter.
    
    Minimize: lambda * w^T Σ w - μ^T w
    Subject to: sum(w) = 1, 0 <= w <= 1
    """
    n_assets = len(mu)
    
    def objective(w):
        portfolio_variance = w @ cov @ w
        portfolio_return = mu @ w
        return lambda_risk * portfolio_variance - portfolio_return
    
    constraints = [
        {"type": "eq", "fun": lambda w: np.sum(w) - 1}
    ]
    
    bounds = [(0, 1) for _ in range(n_assets)]
    
    initial_weights = np.ones(n_assets) / n_assets
    
    result = minimize(
        objective,
        initial_weights,
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
        options={"maxiter": 1000}
    )
    
    if not result.success:
        raise ValueError(f"Optimization failed: {result.message}")
    
    weights = result.x
    weights = np.maximum(weights, 0)
    weights = weights / weights.sum()
    
    return weights


def run_optimization(
    tickers: List[str],
    start_date: str,
    end_date: str,
    lambda_risk: float
) -> Tuple[Dict[str, float], np.ndarray, np.ndarray]:
    """Run full optimization pipeline."""
    prices = fetch_price_data(tickers, start_date, end_date)
    returns = compute_returns(prices)
    mu, cov = estimate_parameters(returns)
    weights = optimize_portfolio(mu, cov, lambda_risk)
    
    weights_dict = {ticker: float(w) for ticker, w in zip(tickers, weights)}
    
    return weights_dict, mu, cov
