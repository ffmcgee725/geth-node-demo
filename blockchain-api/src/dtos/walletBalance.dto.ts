import { ApiProperty } from '@nestjs/swagger';

export class WalletBalanceDto {
  @ApiProperty()
  public walletAddress: string;
  @ApiProperty()
  public balance: string;

  constructor(walletAddress: string, balance: string) {
    this.walletAddress = walletAddress;
    this.balance = balance;
  }
}
