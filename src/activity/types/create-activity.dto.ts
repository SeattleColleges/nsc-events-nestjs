export class CreateActivityDto {
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
  eventSocialMedia: any[];
  eventPrivacy: string;
  eventAccessibility: string;
}
