// src/App.js
import React from "react";
import { ThirdwebProvider, ConnectWallet } from "@thirdweb-dev/react";
// import { ContractGraphic , BytecodeDisplay } from "./myContract";
import TokenCalculator from "./TokenCalculator";
//import DeployContract from "./DeployContract";

function App() {
  return (
    <ThirdwebProvider desiredChainId={11155111} clientId="7faaf41adc7f834cb26242041a178d63">
      <div style={{ padding: "2rem" }}>
        <h1>My Crypto App</h1>
        <ConnectWallet />
        <TokenCalculator />
      </div>
    </ThirdwebProvider>
  );
}

export default App;