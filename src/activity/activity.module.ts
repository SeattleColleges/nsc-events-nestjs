import { Module } from '@nestjs/common';
import { ActivityController } from './controllers/activity/activity.controller';
import { ActivityService } from './services/activity/activity.service';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService]
})
export class ActivityModule {}
