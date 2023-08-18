import { Model, models, model } from 'mongoose';
import { Document, Schema } from 'mongoose';
// import bcrypt from 'bcrypt';

export interface ActivityDocument extends Document {
    // eventCreatorId: string;
    eventTitle: string;
    // eventDescription: string;
    eventCategory: string;
    // eventDate: string;
    // eventStartTime: string;
    // eventEndTime: string;
    // eventLocation: string;
    // eventCoverPhoto: string;
    // eventHost: string;
    // eventWebsite: string;
    // eventRegistration: string;
    // eventCapacity: number;
    // eventCost: string;
    eventTags: string[];
    // eventSchedule: string;
    // eventSpeakers: string[];
    // eventPrerequisites: string;
    // eventCancellationPolicy: string;
    // eventContact: string;
    // eventSocialMedia: {
    //     facebook: string;
    //     twitter: string;
    //     instagram: string;
    //     hashtag: string;
    // };
    // eventPrivacy: string;
    // eventAccessibility: string;
}

export enum Category {
    Professional_Development = 'professional Development',
    Social = 'social',
    Tech = 'tech',
    Conference = 'conference',
    Networking = 'networking',
    Pizza = 'pizza',
    LGBTQIA = 'LGBTQIA'
  }

export const ActivitySchema = new Schema<ActivityDocument /*{}, Methods*/>({
    // eventCreatorId: "",
    eventTitle: { type: String, required: true, unique: true },
    // eventDescription: "",
    eventCategory: { type: String, required: false },
    // eventDate: "",
    // eventStartTime: "",
    // eventEndTime: "",
    // eventLocation: "",
    // eventCoverPhoto: "",
    // eventHost: "",
    // eventWebsite: "",
    // eventRegistration: "",
    // eventCapacity: 0,
    // eventCost: "",
    eventTags: { type: String[Category.Conference,Category.LGBTQIA,Category.Networking,Category.Pizza,Category.Professional_Development,Category.Social,Category.Tech], required: false, default: Category.Pizza },
    // eventSchedule: "",
    // eventSpeakers: [],
    // eventPrerequisites: "",
    // eventCancellationPolicy: "",
    // eventContact: "",
    // eventSocialMedia: {
    //     facebook: "",
    //     twitter: "",
    //     instagram: "",
    //     hashtag: ""
    // },
    // eventPrivacy: "",
    // eventAccessibility: ""
});

const ActivityModel = models.Activity || model('Activity', ActivitySchema);
export default ActivityModel as Model<ActivityDocument /*{}, Methods*/>;