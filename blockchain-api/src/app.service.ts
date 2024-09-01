import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { formatAsDecimalAwareString } from './utils';
import { WalletBalanceDto } from './dtos/walletBalance.dto';
import { TokenInfoDto } from './dtos/tokenInfo.dto';
import { config } from 'dotenv';
import abi from './abis/token.json';

config();

@Injectable()
export class AppService {
  private provider: ethers.providers.StaticJsonRpcProvider;
  constructor() {
    const endpoint = process.env.GETH_NODE_RPC || 'http://172.16.254.4:8545';
    const networkId = Number(process.env.GETH_NODE_CHAIN_ID) || 21;
    this.provider = new ethers.providers.StaticJsonRpcProvider(endpoint, networkId);
  }

  /**
   * Fetches token information for the provided address
   * @param {string} address for which to gather information
   * @returns {TokenInfoDto} name, symbol and decimals of the token
   */
  async fetchTokenInfo(address: string): Promise<TokenInfoDto> {
    try {
      const contract = new ethers.Contract(address, abi, this.provider);
      const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
      return new TokenInfoDto(name, symbol, decimals);
    } catch (e) {
      throw new HttpException(`token with address ${address} not found in network`, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Fetches the token balance (of the address provided) for all the wallet addresses passed as second argument
   * @param {string} tokenAddress for which to fetch the balance
   * @param {string[]} walletAddresses to check the balance of provided token
   * @returns {WalletBalanceDto[]} an array of objects containing a wallet address and the respective token balance
   */
  async fetchBalanceOf(tokenAddress: string, walletAddresses: string[]): Promise<WalletBalanceDto[]> {
    try {
      const contract = new ethers.Contract(tokenAddress, abi, this.provider);
      const decimals = await contract.decimals();
      const result = await Promise.all(
        walletAddresses.map(async (wallet) => this.assembleWalletBalanceDto(contract, wallet, decimals)),
      );
      return result;
    } catch (e) {
      throw new HttpException(`Something went wrong: ${e.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetches token balance for a wallet and assembles an object containing the wallet address and respective balance
   * @param {ethers.Contract} contract abstraction 
   * @param {string} walletAddress to fetch token balance for
   * @param {number} decimals precision of the token
   * @returns {WalletBalanceDto} object containing a wallet address and the respective token balance
   */
  private async assembleWalletBalanceDto(
    contract: ethers.Contract,
    walletAddress: string,
    decimals: number,
  ): Promise<WalletBalanceDto> {
    const balance = await contract.balanceOf(walletAddress);
    const formattedBalance = formatAsDecimalAwareString(balance.toString(), decimals);
    return new WalletBalanceDto(walletAddress, formattedBalance);
  }
}
