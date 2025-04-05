// src/TokenCalculator.js
import React, { useState } from "react";
import { createWalletClient, custom } from "viem";
import { defineChain } from "thirdweb/chains";
import { deployContractBackend } from "./DeployContract"; // Import your backend deploy function
import getABI from "./returnABI";

export default function TokenCalculator() {
  const [equity, setEquity] = useState("");
  const [raise, setRaise] = useState("");
  const [result, setResult] = useState(null);
  const [deployAddress, setDeployAddress] = useState(null);
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployError, setDeployError] = useState(null);

  const handleCalculate = (e) => {
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
    // Recommended parameters based on calculations:
    const numTokens = equityPercent * 100;
    const tokenPrice = targetRaise / numTokens;
    setResult({ numTokens, tokenPrice });
  };

  const handleDeploy = async () => {
    setDeployLoading(true);
    setDeployError(null);
    
    try {
      // For this example, we use the connected wallet address from window.ethereum.
      // In production, you might integrate a proper wallet connection flow.
      const account = window.ethereum.selectedAddress;
      if (!account) {
        alert("Please connect your wallet.");
        setDeployLoading(false);
        return;
      }
      
      const sepolia = defineChain(11155111);
      // Retrieve ABI and bytecode from your getABI function.
      const { abi, bytecode } = getABI();
      
      // Use the calculated parameters as constructor arguments:
      const args = [result.numTokens, result.tokenPrice];
      
      // Deploy the contract using our backend function.
      const deployedAddress = await deployContractBackend({
        account,
        abi,
        bytecode,
        args,
        chain: sepolia,
        transport: custom(window.ethereum)
      });
      
      // If the deployment was cancelled, deployedAddress will be "User cancelled deployment"
      if (deployedAddress === "User cancelled deployment") {
        console.log("Deployment cancelled by user.");
        // Do nothing further (or you could set a state to indicate cancellation if desired)
      } else {
        setDeployAddress(deployedAddress);
      }
    } catch (err) {
      console.error("Deployment failed:", err);
      // Only set error state if it's not a cancellation error.
      if (err.code !== 4001) {
        setDeployError(err.message || "Failed to deploy contract");
      }
    } finally {
      setDeployLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Token Calculator</h1>
      <form onSubmit={handleCalculate}>
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
          <h2>Recommended Contract Parameters:</h2>
          <p>Initial Supply (Number of Tokens): {result.numTokens}</p>
          <p>Price per Token: {result.tokenPrice.toFixed(2)} USD</p>
          <button 
            onClick={handleDeploy} 
            style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
            disabled={deployLoading}
          >
            {deployLoading ? "Deploying..." : "Deploy Contract"}
          </button>
          {deployError && <p style={{ color: "red" }}></p>}
          {deployAddress && <p>Contract Deployed at: {deployAddress}</p>}
        </div>
      )}
    </div>
  );
}