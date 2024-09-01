import { ApiProperty } from '@nestjs/swagger';

export class TokenInfoDto {
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public symbol: string;
  @ApiProperty()
  public decimals: number;

  constructor(name: string, symbol: string, decimals: number) {
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
  }
}
