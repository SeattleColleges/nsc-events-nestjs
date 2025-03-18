import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AttendanceSchema } from './schemas/attendance.schema';
import { AttendanceService } from './services/attendance.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Attendance', schema: AttendanceSchema },
    ]),
  ],
  providers: [AttendanceService],
})
export class AttendanceModule {}
