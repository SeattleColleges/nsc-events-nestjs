import { Module } from '@nestjs/common';
import { GoogleAuthController } from './controllers/google-calendar.controller';
import { GoogleAuthService } from './services/google-calendar.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
