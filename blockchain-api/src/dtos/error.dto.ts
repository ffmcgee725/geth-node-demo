import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  public statusCode: number;
  @ApiProperty()
  public message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
