import React from 'react';
import { ConnectWallet, ThirdwebProvider } from '@thirdweb-dev/react';
import TokenCalculator from './TokenCalculator';
import PresentValueCalculator from "./PresentValueCalculator";

function App() {
  return (
    <ThirdwebProvider desiredChainId="rinkeby">
      <div>
        <h1>My Crypto App</h1>
        <ConnectWallet />
        <hr />
        <TokenCalculator />
        <PresentValueCalculator/>
      </div>
    </ThirdwebProvider>
  );
}

export default App;