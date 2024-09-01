import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { IsValidAddressValidationPipe } from './validations/isValidAddressValidation.pipe';
import { TokenInfoDto } from './dtos/tokenInfo.dto';
import { WalletBalanceDto } from './dtos/walletBalance.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ErrorDto } from './dtos/error.dto';
import { IsValidAddressArrayValidationPipe } from './validations/isValidAddressArrayValidation.pipe';
import { ApiKeyAuthGuard } from './auth/apiKeyAuth.guard';
import { API_HEADER_OPTIONS } from './constants';
@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @UseGuards(ApiKeyAuthGuard)  
  @ApiOperation({ description: 'This is used to retrieve token information about the provided address' })
  @ApiHeader(API_HEADER_OPTIONS)
  @ApiQuery({
    name: 'address',
    type: String,
    description: 'Token address for which to retrieve info',
    required: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorDto,
    description: 'If no valid api key is provided on request, throws an error with status code 401',
    status: HttpStatus.UNAUTHORIZED,
  })
  @ApiNotFoundResponse({
    type: ErrorDto,
    description: 'If token address is not found on chain, throws an error with status code 404',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    type: TokenInfoDto,
    description: 'Token information (name, symbol, decimals)',
    status: HttpStatus.OK,
  })
  @Get('tokenInfo')
  async tokenInfo(@Query('address', IsValidAddressValidationPipe) address: string): Promise<TokenInfoDto> {
    return this.service.fetchTokenInfo(address);
  }

  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({ description: 'This is used to retrieve token balance on the provided wallet addresses' })
  @ApiHeader(API_HEADER_OPTIONS)
  @ApiQuery({
    name: 'address',
    type: String,
    description: 'Token address for which to retrieve balance',
    required: true,
  })
  @ApiBody({
    type: Array,
    description: 'Array of wallet addresses to get the token balance for',
    required: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorDto,
    description: 'If no valid api key is provided on request, throws an error with status code 401',
    status: HttpStatus.UNAUTHORIZED,
  })
  @ApiBadRequestResponse({
    type: ErrorDto,
    description:
      'If something goes wrong while retrieving token balance information with the provided payload, throws an error with status code 400',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    type: [WalletBalanceDto],
    description: 'Array with wallet balance information of provided wallets (walletAddress, balance)',
    status: HttpStatus.OK,
  })
  @Post('balance')
  async balance(
    @Query('address', IsValidAddressValidationPipe) address: string,
    @Body(new IsValidAddressArrayValidationPipe()) walletAddresses: string[],
  ): Promise<WalletBalanceDto[]> {
    return this.service.fetchBalanceOf(address, walletAddresses);
  }
}
