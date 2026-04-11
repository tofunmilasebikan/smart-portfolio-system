# Capstone analysis notebooks

These notebooks document **exploratory analysis and experiments** aligned with the Smart Portfolio backend (`../backend/`). They satisfy the proposal deliverable of **4–5 Jupyter notebooks** for analysis and reproducibility.

## Setup

From the project root (`smart-portfolio-system/`):

```bash
cd backend
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r ../notebooks/requirements-notebooks.txt
python -m ipykernel install --user --name=smart-portfolio --display-name="Python (smart-portfolio)"
```

Start Jupyter from **either** the repo root or the `notebooks/` folder:

```bash
cd notebooks
jupyter notebook
# or: jupyter lab
```

Select the kernel that has `yfinance`, `scipy`, and the backend on `PYTHONPATH`. The first code cell in each notebook adds `../backend` to `sys.path` so you can `import optimize`, `metrics`, etc.

## Notebook map

| # | File | Focus |
|---|------|--------|
| 1 | `01_data_exploration.ipynb` | Prices, returns, correlation — EDA |
| 2 | `02_estimation_risk_return.ipynb` | Annualized μ, Σ, portfolio variance |
| 3 | `03_mean_variance_optimization.ipynb` | Optimized weights vs λ (risk profiles) |
| 4 | `04_backtesting_metrics.ipynb` | Backtest slice, Sharpe, max drawdown, vs benchmark |
| 5 | `05_summary_limitations.ipynb` | Short sensitivity + limitations & next steps |

**Disclaimer:** Educational only; not financial advice.

## Regenerating notebook files

The `.ipynb` files were created with `notebooks/_generate_notebooks.py`. To regenerate after edits to the script:

```bash
cd notebooks && python _generate_notebooks.py
```
