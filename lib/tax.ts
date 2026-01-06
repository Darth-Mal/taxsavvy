export type TaxBandBreakdown = {
  bandLimit: number;
  rate: number;
  taxableAmount: number;
  tax: number;
};

export function calculatePAYETax(grossIncome: number) {
  const cra = Math.max(200_000, grossIncome * 0.01) + grossIncome * 0.2;

  let taxableIncome = grossIncome - cra;

  // 🔐 GUARANTEE breakdown exists
  const breakdown: TaxBandBreakdown[] = [];

  if (taxableIncome <= 0) {
    return {
      annualTax: 0,
      monthlyTax: 0,
      taxableIncome: 0,
      cra,
      breakdown, // ✅ always present
    };
  }

  const bands = [
    { limit: 300_000, rate: 0.07 },
    { limit: 300_000, rate: 0.11 },
    { limit: 500_000, rate: 0.15 },
    { limit: 500_000, rate: 0.19 },
    { limit: 1_600_000, rate: 0.21 },
    { limit: Infinity, rate: 0.24 },
  ];

  let remaining = taxableIncome;
  let totalTax = 0;

  for (const band of bands) {
    if (remaining <= 0) break;

    const taxableAmount = Math.min(remaining, band.limit);
    const tax = taxableAmount * band.rate;

    breakdown.push({
      bandLimit: band.limit,
      rate: band.rate,
      taxableAmount,
      tax,
    });

    totalTax += tax;
    remaining -= taxableAmount;
  }

  return {
    annualTax: totalTax,
    monthlyTax: totalTax / 12,
    taxableIncome,
    cra,
    breakdown, // ✅ always present
  };
}
