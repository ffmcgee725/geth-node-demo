import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isValidAddress } from '../utils';

@Injectable()
export class IsValidAddressValidationPipe implements PipeTransform<string, string> {
  transform(value: string, _: ArgumentMetadata) {
    // Custom validation logic
    if (!isValidAddress(value)) {
      throw new BadRequestException('Must provide a valid ETH format address as "address" query param.');
    }
    return value;
  }
}
