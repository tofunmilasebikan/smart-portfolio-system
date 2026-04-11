"""One-off script to emit valid .ipynb files (run: python _generate_notebooks.py)."""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent


def md(text: str) -> dict:
    return {"cell_type": "markdown", "metadata": {}, "source": _lines(text)}


def code(text: str) -> dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": _lines(text),
    }


def _lines(text: str) -> list:
    if not text.endswith("\n"):
        text += "\n"
    return text.splitlines(True)


META = {
    "kernelspec": {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3",
    },
    "language_info": {
        "name": "python",
        "version": "3.9.0",
    },
}


def save(name: str, cells: list) -> None:
    nb = {
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": META,
        "cells": cells,
    }
    path = HERE / name
    path.write_text(json.dumps(nb, indent=1), encoding="utf-8")
    print("Wrote", path)


PATH_SETUP = '''# Allow imports from backend/ (start Jupyter from `notebooks/` or project root)
from pathlib import Path
import sys
for base in [Path.cwd(), Path.cwd() / "notebooks"]:
    for b in [base, base.parent]:
        be = b / "backend"
        if (be / "optimize.py").exists():
            sys.path.insert(0, str(be))
            break
    else:
        continue
    break
else:
    raise RuntimeError("Could not find backend/ — `cd` to smart-portfolio-system or notebooks/")
'''

# --- 01 ---
save(
    "01_data_exploration.ipynb",
    [
        md(
            """# 01 — Data exploration (EDA)

**Capstone:** Smart Portfolio system  
**Purpose:** Load adjusted closes from Yahoo Finance, inspect prices and **log returns**, and visualize **correlation** across assets.

This mirrors the data path used in `backend/optimize.py` (`fetch_price_data`, `compute_returns`)."""
        ),
        code(PATH_SETUP),
        code(
            """TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"]
START, END = "2022-01-01", "2024-12-31"

from optimize import fetch_price_data, compute_returns

prices = fetch_price_data(TICKERS, START, END)
prices.head()"""
        ),
        md("## Price levels (normalized to 1 at start for comparison)"),
        code(
            """import matplotlib.pyplot as plt

norm = prices / prices.iloc[0]
ax = norm.plot(figsize=(10, 5), title="Normalized prices")
ax.set_ylabel("Index (start = 1)")
ax.legend(bbox_to_anchor=(1.02, 1), loc="upper left")
plt.tight_layout()
plt.show()"""
        ),
        md("## Log returns — distribution and correlation"),
        code(
            """rets = compute_returns(prices)
rets.describe()"""
        ),
        code(
            """fig, axes = plt.subplots(1, 2, figsize=(11, 4))
rets.plot(ax=axes[0], alpha=0.7, title="Daily log returns")
axes[0].set_ylabel("log return")

import seaborn as sns
sns.heatmap(rets.corr(), annot=True, fmt=".2f", cmap="vlag", ax=axes[1])
axes[1].set_title("Correlation of daily log returns")
plt.tight_layout()
plt.show()"""
        ),
        md(
            """### Takeaway
- Missing rows are dropped in `fetch_price_data` (`dropna`).
- The engine uses **sample** mean and covariance of log returns (annualized in `estimate_parameters`). Strong correlation implies limited diversification in-sample."""
        ),
    ],
)

# --- 02 ---
save(
    "02_estimation_risk_return.ipynb",
    [
        md(
            """# 02 — Risk & return estimation

**Purpose:** Reproduce **annualized** mean returns $\\mu$ and covariance $\\Sigma$ used in mean–variance optimization (`estimate_parameters` in `optimize.py`).

$\\mu \\approx \\bar{r} \\times 252$, $\\Sigma \\approx \\text{Cov}(r) \\times 252$ for daily log returns."""
        ),
        code(PATH_SETUP),
        code(
            """import numpy as np
import pandas as pd
from optimize import fetch_price_data, compute_returns, estimate_parameters

TICKERS = ["AAPL", "MSFT", "GOOGL"]
START, END = "2022-01-01", "2024-12-31"
prices = fetch_price_data(TICKERS, START, END)
rets = compute_returns(prices)
mu, cov = estimate_parameters(rets)

mu_ann_pct = pd.Series(mu * 100, index=TICKERS, name="mu_ann_%")
mu_ann_pct"""
        ),
        code(
            """cov_df = pd.DataFrame(cov, index=TICKERS, columns=TICKERS)
cov_df"""
        ),
        md("## Equal-weight portfolio — implied volatility"),
        code(
            """w_eq = np.ones(len(TICKERS)) / len(TICKERS)
port_var = float(w_eq @ cov @ w_eq)
port_vol = np.sqrt(port_var)
print(f"Equal-weight annualized vol: {port_vol*100:.2f}%")"""
        ),
        md(
            """### Note
Shrinkage (e.g. Ledoit–Wolf) and alternative estimators were listed in the project proposal as extensions; **this codebase** uses the **sample** covariance for transparency and speed."""
        ),
    ],
)

# --- 03 ---
save(
    "03_mean_variance_optimization.ipynb",
    [
        md(
            """# 03 — Mean–variance optimization

**Purpose:** Solve the same problem as the API: minimize $\\lambda w'\\Sigma w - \\mu'w$ subject to $w \\ge 0$, $\\sum w = 1$.

Risk profiles in the app map to $\\lambda \\in \\{10, 5, 1\\}$ (conservative → aggressive)."""
        ),
        code(PATH_SETUP),
        code(
            """from optimize import run_optimization, optimize_portfolio, fetch_price_data, compute_returns, estimate_parameters

TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"]
START, END = "2022-01-01", "2024-12-31"

weights, mu, cov = run_optimization(TICKERS, START, END, lambda_risk=5)
weights"""
        ),
        md("## Sensitivity: weights vs $\\lambda$"),
        code(
            """import pandas as pd
import numpy as np

lambdas = [10, 5, 1]
rows = []
for lam in lambdas:
    w, _, _ = run_optimization(TICKERS, START, END, lambda_risk=lam)
    rows.append(pd.Series(w, name=f"lambda={lam}"))
pd.DataFrame(rows).T.round(4)"""
        ),
        code(
            """import matplotlib.pyplot as plt

rows = {}
for lam in lambdas:
    w, _, _ = run_optimization(TICKERS, START, END, lambda_risk=lam)
    rows[f"λ={lam}"] = [w[t] for t in TICKERS]
wmat = pd.DataFrame(rows, index=TICKERS)
wmat.plot(kind="bar", figsize=(10, 4), title="Optimized weights by risk aversion λ")
plt.ylabel("weight")
plt.tight_layout()
plt.legend(title="profile")
plt.show()"""
        ),
        md(
            """### Takeaway
Higher $\\lambda$ penalizes variance more heavily; weights shift toward lower-volatility names **in-sample**, subject to estimation noise."""
        ),
    ],
)

# --- 04 ---
save(
    "04_backtesting_metrics.ipynb",
    [
        md(
            """# 04 — Backtesting & risk metrics

**Purpose:** Align with `metrics.py`: **Sharpe**, annualized return/vol from $(\\mu, \\Sigma, w)$, and **max drawdown** + equity curves from `run_backtest` (hold-out tail of the window vs equal-weight benchmark)."""
        ),
        code(PATH_SETUP),
        code(
            """from optimize import run_optimization
from metrics import compute_metrics, run_backtest

TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"]
START, END = "2022-01-01", "2024-12-31"

weights_dict, mu, cov = run_optimization(TICKERS, START, END, lambda_risk=5)
m = compute_metrics(weights_dict, mu, cov)
m"""
        ),
        code(
            """bt = run_backtest(TICKERS, weights_dict, START, END, test_split=0.2)
bt["max_drawdown"], len(bt["equity_curve"])"""
        ),
        code(
            """import matplotlib.pyplot as plt
import pandas as pd

eq = pd.Series({p["date"]: p["value"] for p in bt["equity_curve"]})
bm = pd.Series({p["date"]: p["value"] for p in bt["benchmark_curve"]})
ax = eq.plot(label="optimized (simple cumulative)", figsize=(10, 4))
bm.plot(ax=ax, label="equal-weight benchmark")
ax.legend()
ax.set_title("Normalized equity (hold-out slice — see metrics.run_backtest)")
plt.tight_layout()
plt.show()"""
        ),
        md(
            """### Caveat
`run_backtest` uses the **last** fraction of trading days (`test_split`); it is a **simple** historical simulation, not a full walk-forward study."""
        ),
    ],
)

# --- 05 ---
save(
    "05_summary_limitations.ipynb",
    [
        md(
            """# 05 — Sensitivity, limitations, and alignment with the proposal

**Purpose:** Short experiments notebook: alternate date windows, reflect on **what the app does / does not** do, and document **honest limitations** for the written report."""
        ),
        code(PATH_SETUP),
        code(
            """from optimize import run_optimization
from metrics import compute_metrics

TICKERS = ["AAPL", "MSFT", "GOOGL"]

def table(start, end):
    w, mu, cov = run_optimization(TICKERS, start, end, lambda_risk=5)
    m = compute_metrics(w, mu, cov)
    return {
        "window": f"{start} → {end}",
        "Sharpe": round(m["sharpe_ratio"], 3),
        "E[r]": round(m["expected_return"] * 100, 2),
        "vol": round(m["volatility"] * 100, 2),
    }

import pandas as pd
pd.DataFrame([
    table("2021-01-01", "2023-12-31"),
    table("2022-01-01", "2024-12-31"),
])"""
        ),
        md(
            """## Limitations (for your report)

| Topic | In proposal | In current implementation |
|-------|-------------|---------------------------|
| Asset class | Crypto emphasis possible | Equities via **yfinance** tickers |
| Estimation | Shrinkage, risk parity, etc. (optional) | **Sample** $\\mu$, $\\Sigma$; **one** MVO objective |
| Metrics | VaR, CVaR, Sortino, regimes | **Sharpe**, vol, max drawdown in backtest slice |
| Evaluation | Walk-forward, OOS | Single split / tail hold-out in `run_backtest` |
| UI | Text CLI (proposal) | **Web app** + API for demo |

**Educational use only — not financial advice.**"""
        ),
        md(
            """## Suggested next steps (if extending the project)

1. Ledoit–Wolf or diagonal shrinkage on $\\Sigma$ before optimization.  
2. Explicit **out-of-sample** window (train $\\mu,\\Sigma$ on $T_1$, optimize, evaluate on $T_2$).  
3. Optional **CLI** script calling the same functions as the API.  
4. Export figures from these notebooks into the final PDF report."""
        ),
    ],
)

print("Done.")
