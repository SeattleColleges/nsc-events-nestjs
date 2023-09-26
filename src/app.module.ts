import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
/*
import { UserModule } from './user/user.module';
*/
import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    /*UserModule,*/
    ActivityModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
