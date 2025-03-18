import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Activity } from 'src/activity/schemas/activity.schema';
import { User } from 'src/auth/schemas/userAuth.model';

export enum HeardFrom {
  grove = 'grove',
  board = 'board',
  canvas = 'canvas',
  staff = 'staff',
  colleague = 'colleague',
  announcement = 'announcement',
  other = 'other',
}

@Schema({
  timestamps: true,
})
export class Attendance extends mongoose.Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  attendedByUser: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
  })
  attendedActivity: Activity;

  @Prop()
  readonly heardFrom: HeardFrom;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
