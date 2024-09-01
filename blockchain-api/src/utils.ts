import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

/**
 * Returns a string representation of a BigNumber with the decimal point in the correct place
 * @param {BigNumber | string} balance representing a number
 * @param {number} decimals number that indicates where to place the decimal point, default value: 18
 * @returns {string} representation of a number in a human readable format
 */
export function formatAsDecimalAwareString(balance: BigNumber | string, decimals = 18): string {
  const bigNumberWithDecimals = BigNumber(balance).dividedBy(BigNumber(10).exponentiatedBy(decimals));
  return bigNumberWithDecimals.toFixed();
}

/**
 * Checks to see if the provided string is a valid ETH address
 * @param {string} string representing an address
 * @returns {boolean} if value is valid address or not
 */
export function isValidAddress(address: string): boolean {
  try {
    if (!address.startsWith('0x')) return false;
    return ethers.utils.isAddress(address);
  } catch (e) {
    return false;
  }
}
