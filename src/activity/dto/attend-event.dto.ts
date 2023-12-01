export class AttendEventDto {
  activityId: string;
  attendee?: {
    firstName: string;
    lastName: string;
  };
}
