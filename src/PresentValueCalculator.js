// src/PresentValueCalculator.js
import React, { useState } from "react";

export default function PresentValueCalculator() {
  const [totalRevenue, setTotalRevenue] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("yearly");
  const [discountRate, setDiscountRate] = useState("");
  const [raiseAmount, setRaiseAmount] = useState("");
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();

    // Parse inputs
    const totalRevenueProjection = parseFloat(totalRevenue);
    const projectionDurationYears = parseFloat(duration);
    const annualDiscountRate = parseFloat(discountRate);
    const raise = parseFloat(raiseAmount);

    if (
      isNaN(totalRevenueProjection) ||
      isNaN(projectionDurationYears) ||
      isNaN(annualDiscountRate) ||
      isNaN(raise) ||
      totalRevenueProjection <= 0 ||
      projectionDurationYears <= 0 ||
      annualDiscountRate < 0 ||
      raise <= 0
    ) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    // Determine number of periods
    const periodsPerYear = frequency === "monthly" ? 12 : 1;
    const nPeriods = projectionDurationYears * periodsPerYear;

    // Revenue per period
    const revenuePerPeriod = totalRevenueProjection / nPeriods;

    // Convert annual discount rate to decimal and then per period
    const discountRatePerPeriod = (annualDiscountRate / 100) / periodsPerYear;

    // Compute present value of all revenue using a loop
    let pvTotalRevenue = 0;
    for (let t = 1; t <= nPeriods; t++) {
      pvTotalRevenue += revenuePerPeriod / Math.pow(1 + discountRatePerPeriod, t);
    }

    // Compute required revenue commitment percentage
    const requiredRevenueCommitmentPercent = (raise / pvTotalRevenue) * 100;

    setResult({
      requiredRevenueCommitmentPercent,
      impliedValuation: pvTotalRevenue,
    });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Present Value of Future Revenue Calculator</h1>
      <form onSubmit={calculate}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Total Revenue Projection (USD):
            <input
              type="number"
              value={totalRevenue}
              onChange={(e) => setTotalRevenue(e.target.value)}
              placeholder="e.g. 500000"
              step="any"
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Projection Duration (years):
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 5"
              step="any"
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Distribution Frequency:
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Annual Discount Rate (%):
            <input
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              placeholder="e.g. 20"
              step="any"
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Raise Amount (USD):
            <input
              type="number"
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(e.target.value)}
              placeholder="e.g. 50000"
              step="any"
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Calculate
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Results:</h2>
          <p>
            Required Revenue Commitment Percent:{" "}
            {result.requiredRevenueCommitmentPercent.toFixed(2)}%
          </p>
          <p>
            Implied Valuation: ${result.impliedValuation.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}