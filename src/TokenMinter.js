// src/CheckPublishedContract.js
import React, { useEffect, useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

export default function CheckPublishedContract() {
  const [contractData, setContractData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        // Create the Thirdweb client using your clientId
        const client = createThirdwebClient({
          clientId: "7faaf41adc7f834cb26242041a178d63",
        });
        // Define your target chain (e.g., Sepolia with chain id 11155111)
        const chain = sepolia;
        // Replace with your published contract's address
        const publishedContractAddress = "0x2FDccc15a9B61eEefeb22aDe94061f9078C3c4Bd";
        
        // Get the contract from Thirdweb
        const contract = await getContract({
          client,
          chain,
          address: publishedContractAddress,
        });
        const {data , isLoading} = await useReadContract({
          client,
          method: "function tokenURI(uint256 tokenId) returns (string)",
          params: [1n],
        });
        console.log("Contract retrieved:", data , isLoading);
        
        // If the metadata interface is available, try to get metadata.
        // Otherwise, log that it’s not available.
        let metadata = null;
        if (contract.metadata && typeof contract.metadata.get === "function") {
          metadata = await contract.metadata.get();
          console.log("Contract metadata:", metadata);
        } else {
          console.log("Contract metadata interface not available.");
        }
        
        setContractData({
          address: contract.address,
          metadata,
        });
      } catch (err) {
        console.error("Failed to access published contract:", err);
        setError(err.message);
      }
    };

    fetchContractData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Check Published Contract</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {contractData ? (
        <div>
          <p>
            <strong>Contract Address:</strong> {contractData.address}
          </p>
          {contractData.metadata ? (
            <pre>
              <code>{JSON.stringify(contractData.metadata, null, 2)}</code>
            </pre>
          ) : (
            <p>No metadata available.</p>
          )}
        </div>
      ) : (
        !error && <p>Loading contract data...</p>
      )}
    </div>
  );
}