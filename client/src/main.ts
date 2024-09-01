import { config } from 'dotenv';
import { BlockchainApiClient } from './client';
import addresses from '../addresses.json';

config();

async function main() {
  // Initialize EthereumTokenClient
  const apiUrl = process.env.BLOCKCHAIN_API!;
  const apiKey = process.env.API_KEY!;
  const client = new BlockchainApiClient(apiUrl, apiKey);

  // Fetch token info
  const tokenAddress = '0x0000000000000000000000000000000000001111';
  const tokenInfo = await client.getTokenInfo(tokenAddress);
  if (!tokenInfo) {
    console.error('No token information for provided address -- cannot proceed!');
    return;
  }
  // Fetch all wallets token balances
  const jsonData: Record<string, string[]> = { ...addresses };
  const usersMap = new Map<string, string[]>();
  for (const key of Object.keys(jsonData)) {
    usersMap.set(key, jsonData[key]);
  }

  const allWallets = Array.from(usersMap.values()).flat(1);
  const tokenBalancesForAddresses = await client.getTokenBalanceForAddresses(tokenAddress, allWallets);

  if (!tokenBalancesForAddresses) {
    console.error('Something went wrong and token balances could not be fetched -- cannot proceed!');
    return;
  }

  // Organize total amounts per user
  const userBalances = client.getTotalUserBalance(usersMap, tokenBalancesForAddresses);

  // Print token balances for each address
  console.log('Token Balances for Each Ethereum Address:\n');
  for (const { walletAddress, amount } of tokenBalancesForAddresses) {
    console.log(`${walletAddress}: ${amount.toFixed()} ${tokenInfo.symbol}`);
  }

  // Print total token balance for each user
  console.log('\nTotal Token Balance for Each User:\n');
  for (const { name, amount } of userBalances) {
    console.log(`${name}: ${amount.toFixed()} ${tokenInfo.symbol}`);
  }
}

main();
