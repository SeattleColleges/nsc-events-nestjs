import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface UserDocument extends Document {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role;
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

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  readonly role: Role;
}

export const UserSchema = SchemaFactory.createForClass(U);
