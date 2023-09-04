import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface SocialMedia {
  [key: string]: string;
}
@Schema({
  timestamps: true,
})
export class Activity {
  @Prop()
  eventCreatorId: string;

  @Prop()
  eventTitle: string;

  @Prop()
  eventDescription: string;

  @Prop()
  eventCategory: string;

  @Prop()
  eventDate: Date;

  @Prop()
  eventStartTime: string;

  @Prop()
  eventEndTime: string;

  @Prop()
  eventLocation: string;

  @Prop()
  eventCoverPhoto: string;

  @Prop()
  eventHost: string;

  @Prop()
  eventWebsite: string;

  @Prop()
  eventRegistration: string;

  @Prop()
  eventCapacity: string;

  @Prop()
  eventCost: string;

  @Prop()
  eventTags: string[];

  @Prop()
  eventSchedule: string;

  @Prop()
  eventSpeakers: string[];

  @Prop()
  eventPrerequisites: string;

  @Prop()
  eventCancellationPolicy: string;

  @Prop()
  eventContact: string;

  @Prop({ type: Map, of: String })
  eventSocialMedia: SocialMedia; //{ these are key-value pairs so will use an object
  //   facebook: string;
  //   twitter: string;
  //   instagram: string;
  //   hashtag: string;
  // };

  @Prop()
  eventPrivacy: string;

  @Prop()
  eventAccessibility: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

// export const ActivitySchema = new Schema<ActivityDocument>({
//   eventCreatorId: { type: String, required: true, unique: false },
//   eventTitle: { type: String, required: true, unique: true },
//   eventDescription: { type: String, required: true },
//   eventCategory: { type: String, required: false },
//   eventDate: { type: Date, required: true },
//   eventStartTime: { type: String, required: true },
//   eventEndTime: { type: String, required: true },
//   eventLocation: { type: String, required: true },
//   eventCoverPhoto: { type: String, required: true },
//   eventHost: { type: String, required: false },
//   eventWebsite: { type: String, required: true },
//   eventRegistration: { type: String, required: true },
//   eventCapacity: { type: String, required: true },
//   eventCost: { type: String, required: true },
//   eventTags: {
//     type: [],
//     required: false,
//     default: ['pizza'],
//   },
//   eventSchedule: { type: String, required: false },
//   eventSpeakers: [],
//   eventPrerequisites: { type: String, required: false },
//   eventCancellationPolicy: {
//     type: String,
//     required: false,
//     default: undefined,
//   },
//   eventContact: { type: String, required: false },
//   eventSocialMedia: { type: [], required: false },
//   eventPrivacy: { type: String, required: false },
//   eventAccessibility: { type: String, required: true },
// });

// const ActivityModel = models.Activity || model('Activity', ActivitySchema);
// export default ActivityModel as Model<ActivityDocument /*{}, Methods*/>;
