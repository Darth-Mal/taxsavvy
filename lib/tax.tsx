export function calculatePAYETax(grossIncome: number) {
  // 1. CRA
  const cra = Math.max(200_000, grossIncome * 0.01) + grossIncome * 0.2;

  // 2. Taxable income
  let taxableIncome = grossIncome - cra;

  if (taxableIncome <= 0) {
    return {
      annualTax: 0,
      monthlyTax: 0,
      taxableIncome: 0,
      cra,
    };
  }

  // 3. Tax bands
  const bands = [
    { limit: 300_000, rate: 0.07 },
    { limit: 300_000, rate: 0.11 },
    { limit: 500_000, rate: 0.15 },
    { limit: 500_000, rate: 0.19 },
    { limit: 1_600_000, rate: 0.21 },
    { limit: Infinity, rate: 0.24 },
  ];

  let remaining = taxableIncome;
  let tax = 0;

  for (const band of bands) {
    if (remaining <= 0) break;

    const taxableAtThisBand = Math.min(remaining, band.limit);
    tax += taxableAtThisBand * band.rate;
    remaining -= taxableAtThisBand;
  }

  return {
    annualTax: tax,
    monthlyTax: tax / 12,
    taxableIncome,
    cra,
  };
}
