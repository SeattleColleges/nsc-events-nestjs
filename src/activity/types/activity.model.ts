import { Model, models, model } from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface ActivityDocument extends Document {
  eventCreatorId: string;
  eventTitle: string;
  eventDescription: string;
  eventCategory: string;
  eventDate: Date;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventCoverPhoto: string;
  eventHost: string;
  eventWebsite: string;
  eventRegistration: string;
  eventCapacity: string;
  eventCost: string;
  eventTags: string[];
  eventSchedule: string;
  eventSpeakers: string[];
  eventPrerequisites: string;
  eventCancellationPolicy: string;
  eventContact: string;
  eventSocialMedia: object; //{
  //   facebook: string;
  //   twitter: string;
  //   instagram: string;
  //   hashtag: string;
  // };
  eventPrivacy: string;
  eventAccessibility: string;
}

export const ActivitySchema = new Schema<ActivityDocument>({
  eventCreatorId: { type: String, required: true, unique: false },
  eventTitle: { type: String, required: true, unique: true },
  eventDescription: { type: String, required: true },
  eventCategory: { type: String, required: false },
  eventDate: { type: Date, required: true },
  eventStartTime: { type: String, required: true },
  eventEndTime: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventCoverPhoto: { type: String, required: true },
  eventHost: { type: String, required: false },
  eventWebsite: { type: String, required: true },
  eventRegistration: { type: String, required: true },
  eventCapacity: { type: String, required: true },
  eventCost: { type: String, required: true },
  eventTags: {
    type: [],
    required: false,
    default: ['pizza'],
  },
  eventSchedule: { type: String, required: false },
  eventSpeakers: [],
  eventPrerequisites: { type: String, required: false },
  eventCancellationPolicy: {
    type: String,
    required: false,
    default: undefined,
  },
  eventContact: { type: String, required: false },
  eventSocialMedia: { type: [], required: false },
  eventPrivacy: { type: String, required: false },
  eventAccessibility: { type: String, required: true },
});

const ActivityModel = models.Activity || model('Activity', ActivitySchema);
export default ActivityModel as Model<ActivityDocument /*{}, Methods*/>;
