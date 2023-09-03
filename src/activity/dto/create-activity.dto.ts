import { SocialMedia } from '../schemas/activity.schema';

export class CreateActivityDto {
  readonly eventCreatorId: string;
  readonly eventTitle: string;
  readonly eventDescription: string;
  readonly eventCategory: string;
  readonly eventDate: Date;
  readonly eventStartTime: string;
  readonly eventEndTime: string;
  readonly eventLocation: string;
  readonly eventCoverPhoto: string;
  readonly eventHost: string;
  readonly eventWebsite: string;
  readonly eventRegistration: string;
  readonly eventCapacity: string;
  readonly eventCost: string;
  readonly eventTags: string[];
  readonly eventSchedule: string;
  readonly eventSpeakers: string[];
  readonly eventPrerequisites: string;
  readonly eventCancellationPolicy: string;
  readonly eventContact: string;
  readonly eventSocialMedia: SocialMedia;
  readonly eventPrivacy: string;
  readonly eventAccessibility: string;
}
