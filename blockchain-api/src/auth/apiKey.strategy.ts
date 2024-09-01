import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApikeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor(private authService: AuthService) {
    super({ header: 'api-key', prefix: '' }, true, async (apiKey, done) => {
      if (this.authService.validateApiKey(apiKey)) {
        done(null, true);
      }
      done(new UnauthorizedException(), null);
    });
  }
}
