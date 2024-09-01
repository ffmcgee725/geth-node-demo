import BigNumber from 'bignumber.js';
import { formatAsDecimalAwareString, isValidAddress } from '../../src/utils';

describe('Utility functions', () => {
  describe('formatAsDecimalAwareString', () => {
    it('should format balance correctly', () => {
      const balance = BigNumber(1100000000000000000); // 1.1 ETH
      const decimals = 18;

      const formattedBalance = formatAsDecimalAwareString(balance.toString(), decimals);

      expect(formattedBalance).toBe('1.1');
    });

    it('should handle errors and return null', () => {
      const balance = 'invalid_balance';
      const decimals = 18;

      const formattedBalance = formatAsDecimalAwareString(balance, decimals);

      expect(formattedBalance).toBe("NaN");
    });
  });

  describe('isValidAddress', () => {
    it('should return true for valid address', () => {
      const address = '0x37a8f295612602f2774d331e562be9e61b83a327'
      expect(isValidAddress(address)).toBeTruthy();
    });

    it('should return false for invalid address', () => {
      const address = '0xInvalid_Address';
      expect(isValidAddress(address)).toBeFalsy();
    });
  });
});
