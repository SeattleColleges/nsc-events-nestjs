import { Module } from '@nestjs/common';
import { ActivityController } from './controllers/activity/activity.controller';
import { ActivityService } from './services/activity/activity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitySchema } from './schemas/activity.schema';
import { AuthModule } from '../auth/auth.module';
import { S3Service } from './services/activity/s3.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Activity', schema: ActivitySchema }]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, S3Service],
  exports: [MongooseModule],
})
export class ActivityModule {}
