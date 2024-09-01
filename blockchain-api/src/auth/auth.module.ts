import { ApikeyStrategy } from './apiKey.strategy';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  providers: [AuthService, ApikeyStrategy],
  exports: [AuthService],
})
export class AuthModule {}
