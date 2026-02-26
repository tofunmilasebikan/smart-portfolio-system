export function validateTickers(input: string): { valid: boolean; tickers: string[]; error?: string } {
  const tickers = input
    .split(",")
    .map((t) => t.trim().toUpperCase())
    .filter((t) => t.length > 0);

  if (tickers.length < 2) {
    return { valid: false, tickers: [], error: "At least 2 assets required for diversification" };
  }

  if (tickers.length > 15) {
    return { valid: false, tickers: [], error: "Maximum 15 assets allowed" };
  }

  const tickerRegex = /^[A-Z]{1,5}$/;
  const invalidTickers = tickers.filter((t) => !tickerRegex.test(t));
  
  if (invalidTickers.length > 0) {
    return { valid: false, tickers: [], error: `Invalid ticker(s): ${invalidTickers.join(", ")}` };
  }

  return { valid: true, tickers };
}

export function validateInvestmentAmount(amount: string): { valid: boolean; value: number; error?: string } {
  const value = parseFloat(amount);

  if (isNaN(value)) {
    return { valid: false, value: 0, error: "Please enter a valid number" };
  }

  if (value < 100) {
    return { valid: false, value: 0, error: "Minimum investment is $100" };
  }

  if (value > 100000000) {
    return { valid: false, value: 0, error: "Maximum investment is $100,000,000" };
  }

  return { valid: true, value };
}

export function validateDateRange(start: string, end: string): { valid: boolean; error?: string } {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();

  if (startDate >= endDate) {
    return { valid: false, error: "Start date must be before end date" };
  }

  if (endDate > today) {
    return { valid: false, error: "End date cannot be in the future" };
  }

  const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (diffDays < 30) {
    return { valid: false, error: "Date range must be at least 30 days" };
  }

  return { valid: true };
}
