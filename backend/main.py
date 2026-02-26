from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

from optimize import run_optimization
from metrics import compute_metrics, run_backtest

load_dotenv()

app = FastAPI(
    title="Smart Portfolio Recommendation API",
    description="Quantitative portfolio optimization engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PortfolioRequest(BaseModel):
    tickers: List[str]
    risk_profile: str  # "conservative", "moderate", "aggressive"
    investment_amount: float
    start_date: str
    end_date: str


class PortfolioResponse(BaseModel):
    weights: dict
    expected_return: float
    volatility: float
    sharpe_ratio: float
    max_drawdown: float
    equity_curve: List[dict]
    benchmark_curve: List[dict]
    dollar_allocation: dict


@app.get("/")
def read_root():
    return {"status": "healthy", "message": "Smart Portfolio API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/optimize", response_model=PortfolioResponse)
def optimize_portfolio(request: PortfolioRequest):
    risk_aversion_map = {
        "conservative": 10,
        "moderate": 5,
        "aggressive": 1
    }
    
    if request.risk_profile.lower() not in risk_aversion_map:
        raise HTTPException(status_code=400, detail="Invalid risk profile")
    
    if len(request.tickers) < 2:
        raise HTTPException(status_code=400, detail="At least 2 assets required")
    
    lambda_risk = risk_aversion_map[request.risk_profile.lower()]
    
    try:
        weights, mu, cov = run_optimization(
            tickers=request.tickers,
            start_date=request.start_date,
            end_date=request.end_date,
            lambda_risk=lambda_risk
        )
        
        metrics = compute_metrics(weights, mu, cov)
        
        backtest_results = run_backtest(
            tickers=request.tickers,
            weights=weights,
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        dollar_allocation = {
            ticker: round(weight * request.investment_amount, 2)
            for ticker, weight in weights.items()
        }
        
        return PortfolioResponse(
            weights={k: round(v * 100, 2) for k, v in weights.items()},
            expected_return=round(metrics["expected_return"] * 100, 2),
            volatility=round(metrics["volatility"] * 100, 2),
            sharpe_ratio=round(metrics["sharpe_ratio"], 2),
            max_drawdown=round(backtest_results["max_drawdown"] * 100, 2),
            equity_curve=backtest_results["equity_curve"],
            benchmark_curve=backtest_results["benchmark_curve"],
            dollar_allocation=dollar_allocation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
