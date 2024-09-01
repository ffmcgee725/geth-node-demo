import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isValidAddress } from '../utils';

@Injectable()
export class IsValidAddressArrayValidationPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata) {
    if (!Array.isArray(value)) {
      throw new BadRequestException('Addresses must be provided as an array.');
    }

    if (value.some((address) => !isValidAddress(address))) {
      throw new BadRequestException('All provided values must be valid ETH format addresses.');
    }

    return value;
  }
}
