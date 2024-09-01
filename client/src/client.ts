import axios from 'axios';
import BigNumber from 'bignumber.js';
import { BalanceResponse, TokenBalancePerWalletInterface, TokenInfoResponse, UserBalanceInterface } from './interfaces';

export class BlockchainApiClient {
  private endpoint: string;
  private apiKey: string;

  constructor(endpoint: string, apiKey: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  /**
   * Fetches token information for the provided address
   * @param {string} tokenAddress for which to gather information
   * @returns {TokenInfoResponse | undefined} object containing name, symbol and decimals of the token. If an error occurs, returns `undefined`
   */
  public async getTokenInfo(tokenAddress: string): Promise<TokenInfoResponse | undefined> {
    try {
      const response = await axios.get(`${this.endpoint}/tokenInfo?address=${tokenAddress}`, {
        headers: {
          'api-key': this.apiKey,
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Fetches the token balance (of the address provided) for all the wallet addresses passed as second argument
   * @param {string} tokenAddress for which to fetch the balance
   * @param {string[]} walletAddresses to check the balance of provided token
   * @returns {TokenBalancePerWalletInterface[] | undefined} an array of objects containing a wallet address and the respective token amount. If an error occurs, returns `undefined`
   */
  public async getTokenBalanceForAddresses(
    tokenAddress: string,
    walletAddresses: string[],
  ): Promise<TokenBalancePerWalletInterface[] | undefined> {
    try {
      const response = await axios.post(`${this.endpoint}/balance?address=${tokenAddress}`, walletAddresses, {
        headers: {
          'api-key': this.apiKey,
        },
      });
      return response.data.map(({ walletAddress, balance }: BalanceResponse) => {
        return { walletAddress, amount: BigNumber(balance) };
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Sums the amount of each wallet provided by user, and returns array of objects containing user name and total token amount held
   * @param {Map<string, string[]> } allUsers map of user as key, and array of wallet addresses as value
   * @param {TokenBalancePerWalletInterface[]} tokenBalancesPerWallet array of objects containing a wallet address and the respective token amount
   * @returns {UserBalanceInterface[]} array of objects containing user name and total token amount held
   */
  public getTotalUserBalance(
    allUsers: Map<string, string[]>,
    tokenBalancesPerWallet: TokenBalancePerWalletInterface[],
  ): UserBalanceInterface[] {
    return Array.from(allUsers.keys()).map((user) =>
      this.assembleTotalAmountPerUser(allUsers, user, tokenBalancesPerWallet),
    );
  }

  /**
   *
   * @param {Map<string, string[]>} users map of user as key, and array of wallet addresses as value
   * @param {string} name of the current user being handled
   * @param {TokenBalancePerWalletInterface[]} tokenBalancesPerWallet array of objects containing a wallet address and the respective token amount
   * @returns {UserBalanceInterface} object containing user name and total token amount held
   */
  private assembleTotalAmountPerUser(
    users: Map<string, string[]>,
    name: string,
    tokenBalancesPerWallet: TokenBalancePerWalletInterface[],
  ): UserBalanceInterface {
    const walletsIterable = users.get(name)?.values();
    if (!walletsIterable) {
      return { name, amount: BigNumber(0) };
    }

    const wallets = Array.from(walletsIterable);
    const totalBalance: BigNumber = tokenBalancesPerWallet
      .filter((entry) => wallets.includes(entry.walletAddress))
      .reduce((prev, curr) => BigNumber(curr.amount).plus(prev), BigNumber(0));

    return { name, amount: totalBalance };
  }
}
