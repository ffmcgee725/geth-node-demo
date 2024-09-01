import { API_KEY } from '../constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateApiKey(apiKey: string): boolean {
    return API_KEY === apiKey;
  }
}
