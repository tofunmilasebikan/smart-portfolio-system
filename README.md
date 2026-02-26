# Smart Portfolio Recommendation System

A quantitative portfolio optimization web application built for a Senior Seminar capstone project.

## Overview

This application provides professional-grade portfolio optimization using mean-variance analysis. Users can input a list of assets, select a risk profile, and receive optimized portfolio allocations with comprehensive risk metrics.

**Disclaimer:** This tool is for educational purposes only. It is not financial advice.

## Features

- **Portfolio Optimization**: Mean-variance optimization with customizable risk aversion
- **Risk Metrics**: Expected return, volatility, Sharpe ratio, maximum drawdown
- **Backtesting**: Out-of-sample performance comparison with equal-weight benchmark
- **Visual Dashboard**: Clean, professional interface with interactive charts

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- Recharts

### Backend
- FastAPI (Python)
- yfinance for market data
- NumPy, Pandas, SciPy for quantitative analysis

## Project Structure

```
smart-portfolio-system/
├── frontend/           # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   └── lib/           # Utilities and types
├── backend/           # FastAPI application
│   ├── main.py        # API endpoints
│   ├── optimize.py    # Optimization engine
│   └── metrics.py     # Risk metrics
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

### `POST /optimize`

Request body:
```json
{
  "tickers": ["AAPL", "MSFT", "GOOGL"],
  "risk_profile": "moderate",
  "investment_amount": 10000,
  "start_date": "2022-01-01",
  "end_date": "2024-12-31"
}
```

Response:
```json
{
  "weights": {"AAPL": 35.2, "MSFT": 40.1, "GOOGL": 24.7},
  "expected_return": 18.4,
  "volatility": 22.1,
  "sharpe_ratio": 0.87,
  "max_drawdown": -15.3,
  "equity_curve": [...],
  "benchmark_curve": [...],
  "dollar_allocation": {"AAPL": 3520, "MSFT": 4010, "GOOGL": 2470}
}
```

## Optimization Methodology

### Mean-Variance Optimization

The optimizer minimizes:
```
λ * w^T Σ w - μ^T w
```

Subject to:
- `sum(w) = 1` (fully invested)
- `0 ≤ w ≤ 1` (long-only, no leverage)

Where:
- `λ` = risk aversion parameter
- `w` = portfolio weights
- `Σ` = covariance matrix
- `μ` = expected returns

### Risk Aversion Mapping
- Conservative: λ = 10
- Moderate: λ = 5
- Aggressive: λ = 1

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## License

This project is for educational purposes as part of a Senior Seminar capstone.

## Author

Built for Senior Seminar Capstone Project
