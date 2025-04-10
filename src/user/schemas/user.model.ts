import { Date, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface UserDocument extends Document {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pronouns: string;
  password?: string;
  role: Role;
  attendances?: [string];
}

export interface UserSearchData {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    pronouns: string;
    email: string;
    role: string;
  }[];
  page: number;
  total: number;
  pages: number;
}

export interface UserSearchFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  page?: number;
  role?: string;
}

export interface Attendance {
  activityId: string;
  dateRegistered: Date;
  heardFrom?: string[];
}

export enum Role {
  admin = 'admin',
  creator = 'creator',
  user = 'user',
}
@Schema({
  timestamps: true,
})
export class U extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  pronouns: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  readonly role: Role;

  // embedding the attendance record
  @Prop({
    type: [{ activityId: String, dateRegistered: Date, heardFrom: [] }],
  })
  attendances?: Attendance[];
}

export const UserSchema = SchemaFactory.createForClass(U);
