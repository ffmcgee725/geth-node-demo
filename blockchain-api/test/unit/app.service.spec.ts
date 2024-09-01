import { ethers } from 'ethers';
import { AppService } from '../../src/app.service';
import { TokenInfoDto } from '../../src/dtos/tokenInfo.dto';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletBalanceDto } from '../../src/dtos/walletBalance.dto';
import BigNumber from 'bignumber.js';

// Mock ethers library
jest.mock('ethers');

describe('AppService', () => {
  let appService: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('fetchTokenInfo', () => {
    it('should return token info', async () => {
      const mockTokenName = 'MockToken';
      const mockTokenSymbol = 'MTK';
      const mockTokenDecimals = 18;
      const mockContract = {
        name: jest.fn().mockResolvedValue(mockTokenName),
        symbol: jest.fn().mockResolvedValue(mockTokenSymbol),
        decimals: jest.fn().mockResolvedValue(mockTokenDecimals),
      };

      (ethers.Contract as unknown as jest.Mock).mockImplementationOnce(() => mockContract);

      const tokenInfo = await appService.fetchTokenInfo('tokenAddress');

      expect(tokenInfo).toBeInstanceOf(TokenInfoDto);
      expect(tokenInfo.name).toBe(mockTokenName);
      expect(tokenInfo.symbol).toBe(mockTokenSymbol);
      expect(tokenInfo.decimals).toBe(mockTokenDecimals);
    });

    it('should throw 404 error if token not found', async () => {
      (ethers.Contract as unknown as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Contract not found');
      });

      await expect(appService.fetchTokenInfo('nonExistingTokenAddress')).rejects.toThrow(HttpException);
    });
  });

  describe('fetchBalanceOf', () => {
    it('should return wallet balances', async () => {
      const mockTokenDecimals = 18;
      const mockBalanceOf = BigNumber('1100000000000000000'); // 1.1 ETH

      const mockContract = {
        decimals: jest.fn().mockResolvedValue(mockTokenDecimals),
        balanceOf: jest.fn().mockResolvedValue(mockBalanceOf),
      };

      (ethers.Contract as unknown as jest.Mock).mockImplementation(() => mockContract);

      // Mock formatAsDecimalAwareString function
      const formattedBalanceOf = '1.1';
      jest.mock('../../src/utils', () => ({
        formatAsDecimalAwareString: jest.fn().mockReturnValue(formattedBalanceOf),
      }));

      const walletAddress = '0x37a8f295612602f2774d331e562be9e61b83a327';
      const walletBalances = await appService.fetchBalanceOf('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', [
        walletAddress,
      ]);

      expect(walletBalances).toHaveLength(1);
      expect(walletBalances[0]).toBeInstanceOf(WalletBalanceDto);
      expect(walletBalances[0].walletAddress).toBe(walletAddress);
      expect(walletBalances[0].balance).toBe(formattedBalanceOf);
    });

    it('should throw 400 error if something went wrong', async () => {
      (ethers.Contract as unknown as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Something went wrong');
      });

      await expect(
        appService.fetchBalanceOf('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', [
          '0x37a8f295612602f2774d331e562be9e61b83a327',
        ]),
      ).rejects.toThrow(HttpException);
    });
  });
});
