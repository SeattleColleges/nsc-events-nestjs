import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class EventRegistration extends Document {
  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false, default: '' }) // Users can optionally provide their first and last name
  firstName?: string;

  @Prop({ required: false, default: '' }) // Users can optionally provide their first and last name
  lastName?: string;

  @Prop({ required: true })
  referralSources: string[]; // Where did the user hear about the event?
}

export const EventRegistrationSchema =
  SchemaFactory.createForClass(EventRegistration);

// Only one registration per user per event, this should produce a 500 internal server error if duplicate registration is attempted

EventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// On the frontend, we still want to do a findOne() call before attempting to create a new registration,
// so we can show a message to the user that they are already registered
