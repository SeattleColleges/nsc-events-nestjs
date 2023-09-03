import { Module } from '@nestjs/common';
import { ActivityController } from './controllers/activity/activity.controller';
import { ActivityService } from './services/activity/activity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitySchema } from './schemas/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Activity', schema: ActivitySchema }]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
