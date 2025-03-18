import { Module } from '@nestjs/common';
import { ActivityController } from './controllers/activity/activity.controller';
import { ActivityService } from './services/activity/activity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitySchema } from './schemas/activity.schema';
import { AuthModule } from '../auth/auth.module';
import { AttendanceService } from 'src/attendance/services/attendance.service';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Activity', schema: ActivitySchema },
      { name: 'Attendance', schema: AttendanceSchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, AttendanceService],
})
export class ActivityModule {}
