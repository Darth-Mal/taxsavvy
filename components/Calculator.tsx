"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Headset,
  ArrowLeft,
  Calendar,
  Info,
  Wallet,
} from "lucide-react";
import { calculatePAYETax, TaxBandBreakdown } from "@/lib/tax"; // Import from your file

// --- Types for the Result View ---
type CalculationResult = {
  grossIncome: number;
  annualTax: number;
  monthlyTax: number;
  taxableIncome: number;
  cra: number;
  breakdown: TaxBandBreakdown[];
  // Display helpers calculated in the component
  rentRelief: number;
  pensionVal: number;
  nhisVal: number;
};

export default function TaxCalculator() {
  // --- View State ---
  const [view, setView] = useState<"input" | "result">("input");
  const [resultData, setResultData] = useState<CalculationResult | null>(null);

  // --- Form Input States ---
  const [category, setCategory] = useState("Employed");
  const [monthlySalary, setMonthlySalary] = useState<string>("");
  const [annualRent, setAnnualRent] = useState<string>("");

  // Additional Income
  const [showAdditional, setShowAdditional] = useState(true);
  const [rentalIncome, setRentalIncome] = useState<string>("");
  const [investIncome, setInvestIncome] = useState<string>("");
  const [otherIncome, setOtherIncome] = useState<string>("");

  // Deductions Toggles
  const [pensionEnabled, setPensionEnabled] = useState(false);
  const [pensionRate, setPensionRate] = useState<string>("8");
  const [nhisEnabled, setNhisEnabled] = useState(false);

  // --- Helpers ---
  const parseInput = (val: string) => parseFloat(val.replace(/,/g, "")) || 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // --- Calculation Handler ---
  const handleCalculate = () => {
    // 1. Calculate Gross
    const salaryAnnual = parseInput(monthlySalary) * 12;
    const additional =
      parseInput(rentalIncome) +
      parseInput(investIncome) +
      parseInput(otherIncome);
    const grossIncome = salaryAnnual + additional;

    // 2. Calculate Display Deductions (Logic based on Nigeria Tax Act norms)
    const rentVal = parseInput(annualRent);
    // Rent Relief: Lower of 500k or 20% of rent paid
    const rentRelief = rentVal > 0 ? Math.min(500_000, rentVal * 0.2) : 0;

    // Pension: Usually 8% of Gross (simplified)
    const pensionVal = pensionEnabled
      ? grossIncome * (parseInput(pensionRate) / 100)
      : 0;

    // NHIS: Usually 5% (simplified)
    const nhisVal = nhisEnabled ? grossIncome * 0.05 : 0;

    // 3. Run the Logic from lib/tax.ts
    // Note: In a real scenario, you might subtract pension/NHIS from gross before taxing.
    // Here we pass the full gross as per your function signature.
    const taxResult = calculatePAYETax(grossIncome);

    // 4. Save Data & Switch View
    setResultData({
      ...taxResult,
      grossIncome,
      rentRelief,
      pensionVal,
      nhisVal,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    setView("result");
  };

  return (
    <div
      id="calculator"
      className="min-h-screen bg-background py-10 px-4 relative font-sans"
    >
      {/* Floating Support Button */}

      <div className="max-w-3xl mx-auto">
        {/* ================= VIEW: INPUT FORM ================= */}
        {view === "input" && (
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                Enter Your Income Details
              </h1>
              <p className="text-gray-500">All amounts in Nigerian Naira (₦)</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-8 text-primary font-sans text-sm font-medium">
              Based on: Nigeria Tax Act 2025 (Effective 1 January 2026)
            </div>

            {/* Inputs */}
            <div className="space-y-8">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tax Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-secondary appearance-none cursor-pointer focus:outline-none focus:border-primary"
                  >
                    <option>Employed</option>
                    <option>Self-Employed</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <InputGroup
                label="Monthly Gross Salary"
                value={monthlySalary}
                onChange={setMonthlySalary}
                isMonthly={true}
              />

              <div className="space-y-2">
                <InputGroup
                  label="Annual Rent Paid (For Rent Relief)"
                  value={annualRent}
                  onChange={setAnnualRent}
                />
                <p className="text-xs text-gray-400">
                  Rent Relief: Lower of ₦500,000 or 20% of rent paid
                </p>
              </div>

              {/* Additional Income Accordion */}
              <div className="pt-4">
                <button
                  onClick={() => setShowAdditional(!showAdditional)}
                  className="flex items-center gap-2 text-primary font-bold mb-6"
                >
                  {showAdditional ? (
                    <div className="bg-primary/10 p-0.5 rounded">
                      <ChevronUp className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="bg-primary/10 p-0.5 rounded">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  )}
                  Additional Income (Optional)
                </button>
                {showAdditional && (
                  <div className="space-y-6">
                    <InputGroup
                      label="Rental Income (Annual)"
                      value={rentalIncome}
                      onChange={setRentalIncome}
                    />
                    <InputGroup
                      label="Investment Income (Annual)"
                      value={investIncome}
                      onChange={setInvestIncome}
                    />
                    <InputGroup
                      label="Other Income (Annual)"
                      value={otherIncome}
                      onChange={setOtherIncome}
                    />
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* Toggles */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-medium">
                    Include Pension Contributions
                  </span>
                  <Toggle
                    checked={pensionEnabled}
                    onChange={setPensionEnabled}
                  />
                </div>
                {pensionEnabled && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Pension Percentage
                    </label>
                    <input
                      type="number"
                      value={pensionRate}
                      onChange={(e) => setPensionRate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-4 text-secondary focus:border-primary focus:outline-none"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-medium">
                    Include NHIS Contributions
                  </span>
                  <Toggle checked={nhisEnabled} onChange={setNhisEnabled} />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full bg-secondary hover:bg-black text-white font-bold py-5 rounded-xl transition-all mt-8 shadow-xl"
              >
                Calculate Personal Tax
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW: RESULTS ================= */}
        {view === "result" && resultData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6">
            {/* 1. Header Section */}
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
                Your Tax Calculation
              </h1>
              <p className="text-gray-500 text-lg">Personal Income Tax (PIT)</p>

              <div className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-800 px-6 py-2 rounded-lg text-sm font-medium">
                Nigeria Tax Act 2025 (Effective 1 January 2026) | Effective: 1
                January 2026
              </div>
            </div>

            {/* 2. Main Cards (Green & White) */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Annual Card */}
              <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                  <div className="text-emerald-100 text-xs font-bold tracking-wider mb-3 uppercase">
                    Annual Tax
                  </div>
                  <div className="text-5xl font-serif font-bold mb-4">
                    {formatCurrency(resultData.annualTax)}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-100 text-sm font-medium">
                    <Wallet className="w-4 h-4" />
                    Total tax for the year
                  </div>
                </div>
                {/* Decorative blob */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Monthly Card */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div>
                  <div className="text-gray-400 text-xs font-bold tracking-wider mb-3 uppercase">
                    Monthly Tax
                  </div>
                  <div className="text-5xl font-serif font-bold mb-4 text-secondary">
                    {formatCurrency(resultData.monthlyTax)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    Average per month
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Effective Tax Rate */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold text-secondary">
                  Effective Tax Rate
                </h3>
                <span className="text-4xl font-bold text-primary">
                  {(
                    (resultData.annualTax / resultData.grossIncome) * 100 || 0
                  ).toFixed(0)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${
                      (resultData.annualTax / resultData.grossIncome) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 4. Tax Band Breakdown */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-secondary mb-6">
                Tax Band Breakdown
              </h3>
              <div className="space-y-8">
                {resultData.breakdown.map((band, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <div className="font-bold text-lg text-secondary">
                          {/* Logic to label the first band Tax Free if rate is 0 */}
                          {band.rate === 0
                            ? `First ${formatCurrency(
                                band.bandLimit
                              )} (Tax-free)`
                            : band.bandLimit === Infinity
                            ? "Balance (Top Rate)"
                            : `Next ${formatCurrency(band.bandLimit)}`}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                          Tax Rate: {(band.rate * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary text-lg">
                          {formatCurrency(band.tax)}
                        </div>
                        <div className="text-sm text-gray-400">
                          on {formatCurrency(band.taxableAmount)}
                        </div>
                      </div>
                    </div>
                    {/* Band Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${
                          band.taxableAmount > 0
                            ? "bg-primary"
                            : "bg-transparent"
                        }`}
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Income Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-secondary mb-6">
                Income Summary
              </h3>

              <div className="space-y-5">
                <SummaryRow
                  label="Gross Annual Income"
                  value={resultData.grossIncome}
                  bold
                />

                {/* Total Deductions (Sum of calculated deductions + CRA) */}
                <SummaryRow
                  label="Total Deductions"
                  value={
                    -(
                      resultData.rentRelief +
                      resultData.pensionVal +
                      resultData.nhisVal +
                      resultData.cra
                    )
                  }
                  isDeduction
                />

                {/* Indented Sub-items */}
                <div className="pl-6 space-y-4 border-l-2 border-gray-100 my-4 py-2">
                  <SummaryRow
                    label="• Pension Contribution"
                    value={resultData.pensionVal}
                    subItem
                  />
                  <SummaryRow
                    label="• NHIS Contribution"
                    value={resultData.nhisVal}
                    subItem
                  />
                  <SummaryRow
                    label="• Rent Relief"
                    value={resultData.rentRelief}
                    subItem
                  />
                  <SummaryRow
                    label="• Consolidated Relief (CRA)"
                    value={resultData.cra}
                    subItem
                  />
                </div>

                <SummaryRow
                  label="Taxable Income"
                  value={resultData.taxableIncome}
                  bold
                />
                <SummaryRow
                  label="Total Tax"
                  value={-resultData.annualTax}
                  isDeduction
                  bold
                />

                {/* Net Annual Income Box */}
                <div className="pt-4 mt-6 border-t border-gray-100">
                  <div className="bg-emerald-50 rounded-xl p-6 flex justify-between items-center">
                    <span className="font-bold text-secondary text-lg">
                      Net Annual Income
                    </span>
                    <span className="font-bold text-3xl text-primary">
                      {formatCurrency(
                        resultData.grossIncome -
                          resultData.annualTax -
                          resultData.pensionVal -
                          resultData.nhisVal
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Disclaimer */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex gap-4 text-amber-900 text-sm leading-relaxed">
              <Info className="w-6 h-6 shrink-0 text-amber-600 mt-1" />
              <div>
                <span className="font-bold block mb-1 text-amber-800">
                  Disclaimer
                </span>
                This calculation is for informational purposes only and does not
                constitute official tax filing. The first ₦800,000 of taxable
                income is tax-free under the 2026 tax regime. Rent Relief is
                calculated as the lower of ₦500,000 or 20% of rent paid. Please
                consult with a qualified tax professional for official tax
                compliance.
              </div>
            </div>

            {/* Recalculate Button */}
            <button
              onClick={() => {
                setView("input");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-black font-bold py-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Recalculate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= SUB-COMPONENTS =================

const InputGroup = ({ label, value, onChange, isMonthly = false }: any) => {
  const annualValue = isMonthly
    ? (parseFloat(value.replace(/,/g, "")) || 0) * 12
    : 0;

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-sans text-lg pointer-events-none">
          ₦
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-4 text-secondary font-sans text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-200"
          placeholder="0"
        />
        {isMonthly && value && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-medium text-sm">
            {annualValue.toLocaleString()}
          </div>
        )}
      </div>
      {isMonthly && value && (
        <p className="text-xs text-gray-400 mt-1">
          Annual: ₦{annualValue.toLocaleString()}
        </p>
      )}
    </div>
  );
};

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-14 h-8 rounded-full transition-colors duration-300 relative ${
      checked ? "bg-primary" : "bg-gray-100"
    }`}
  >
    <div
      className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-transform duration-300 ${
        checked ? "left-7" : "left-1"
      }`}
    />
  </button>
);

const SummaryRow = ({
  label,
  value,
  bold = false,
  isDeduction = false,
  subItem = false,
}: any) => (
  <div
    className={`flex justify-between items-center ${
      subItem ? "text-gray-500 text-sm" : ""
    }`}
  >
    <span
      className={`${
        bold ? "font-bold text-secondary text-lg" : "text-secondary"
      } ${subItem ? "font-medium" : ""}`}
    >
      {label}
    </span>
    <span
      className={`
      ${bold ? "font-bold text-lg" : ""} 
      ${isDeduction ? "text-red-500 font-medium" : "text-secondary"}
    `}
    >
      {isDeduction && value !== 0 ? "-" : ""}
      {new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      }).format(Math.abs(value))}
    </span>
  </div>
);
