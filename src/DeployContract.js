// DeployContract.js
// This backend function deploys a contract using the viem wallet client and returns the deployed contract address.
// It gracefully handles user cancellation (error code 4001) by returning a message.

import { createWalletClient, custom } from 'viem';
import { defineChain } from 'thirdweb/chains';

/**
 * Deploys a contract to the blockchain using the provided parameters.
 * 
 * @param {Object} options - Deployment options.
 * @param {string} options.account - The account address to deploy from.
 * @param {Object} options.abi - The contract's ABI.
 * @param {string} options.bytecode - The contract's bytecode as a hex string.
 * @param {Array} options.args - Constructor arguments as an array.
 * @param {Object} options.chain - The chain configuration (e.g., from defineChain).
 * @param {any} options.transport - The transport to use (e.g., a JSON-RPC transport). For example, for a browser, you might use custom(window.ethereum).
 * @returns {Promise<string>} The deployed contract address, or a message indicating cancellation.
 * @throws Will throw an error if deployment fails for reasons other than user cancellation.
 */
export async function deployContractBackend({ account, abi, bytecode, args, chain, transport }) {
  try {
    // Create a wallet client using the provided chain and transport.
    const walletClient = createWalletClient({
      chain,
      transport,
    });
    
    // Deploy the contract using the wallet client's deployContract method.
    const deployedAddress = await walletClient.deployContract({
      account,
      abi,
      bytecode,
      args,
    });
    
    return deployedAddress;
  } catch (error) {
    // Handle user cancellation gracefully (error code 4001)
    if (error && error.code === 4001) {
      console.error('User cancelled the transaction:', error);
      return "User cancelled deployment";
    }
    // For other errors, re-throw the error to be handled by the caller.
    throw error;
  }
}

// Example usage (for backend testing):
// (Uncomment the following lines to test in a backend environment, and replace transport as needed)
//
// const sepolia = defineChain(11155111);
// (async () => {
//   try {
//     const deployedAddress = await deployContractBackend({
//       account: '0xYourAccountAddress',
//       abi: yourAbi,  // Replace with your contract ABI
//       bytecode: '0xYourContractBytecode',  // Replace with your contract bytecode
//       args: [1000, 1],
//       chain: sepolia,
//       transport: custom(window.ethereum) // or an HTTP transport in Node.js
//     });
//     console.log('Deployed contract at:', deployedAddress);
//   } catch (err) {
//     console.error('Deployment error:', err);
//   }
// })();