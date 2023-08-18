import { Module } from '@nestjs/common';
import { ActivityController } from './controllers/activity/activity.controller';

@Module({
  controllers: [ActivityController]
})
export class ActivityModule {}
