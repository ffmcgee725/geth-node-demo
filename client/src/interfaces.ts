import BigNumber from 'bignumber.js';

export interface TokenInfoResponse {
  name: string;
  symbol: string;
  decimals: number;
}

export interface BalanceResponse {
  walletAddress: string;
  balance: string;
}

export interface TokenBalancePerWalletInterface {
  walletAddress: string;
  amount: BigNumber;
}

export interface UserBalanceInterface {
  name: string;
  amount: BigNumber;
}
