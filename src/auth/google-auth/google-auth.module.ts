import { Module } from '@nestjs/common';
import { GoogleAuthController } from './controllers/google-calendar.controller';
import { GoogleAuthService } from './services/google-calendar.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, AuthModule, UserModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
