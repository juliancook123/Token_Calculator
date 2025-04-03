// src/TokenCalculator.js
import React, { useState } from "react";

export default function TokenCalculator() {
  const [equity, setEquity] = useState("");
  const [raise, setRaise] = useState("");
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const equityPercent = parseFloat(equity);
    const targetRaise = parseFloat(raise);
    if (
      isNaN(equityPercent) ||
      isNaN(targetRaise) ||
      equityPercent <= 0 ||
      targetRaise <= 0
    ) {
      alert("Please enter valid numbers for both fields.");
      return;
    }
    const numTokens = equityPercent * 100;
    const tokenPrice = targetRaise / numTokens;
    setResult({ numTokens, tokenPrice });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Token Calculator</h1>
      <form onSubmit={calculate}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Equity Percent:
            <input
              type="number"
              value={equity}
              onChange={(e) => setEquity(e.target.value)}
              placeholder="e.g. 20"
              step="0.01"
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Target Raise (USD):
            <input
              type="number"
              value={raise}
              onChange={(e) => setRaise(e.target.value)}
              placeholder="e.g. 100000"
              step="0.01"
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
          <p>Number of Tokens: {result.numTokens}</p>
          <p>Price per Token: {result.tokenPrice.toFixed(2)} USD</p>
        </div>
      )}
    </div>
  );
}