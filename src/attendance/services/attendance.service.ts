import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from '../schemas/attendance.schema';
import { User } from 'src/auth/schemas/userAuth.model';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<Attendance>,
  ) {
    // activity defined in attendance.schema.ts
  }

  async createAttendance(
    activityId: string,
    user: User,
  ): Promise<{ attendance: Attendance; message: string }> {
    try {
      const data = Object.assign(Attendance, {
        attendedByUser: user,
        attendedActivity: activityId,
      });
      const attendance = await this.attendanceModel.create(data);
      return {
        attendance,
        message: 'Attendance created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
