import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ActivityService } from 'src/activity/services/activity/activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get('')
  async getAllActivities() {
    return await this.activityService.getAllActivities();
  }

  @Get(':id')
  async getActivityById(@Param('id') id: string) {
    console.log(id);
    return this.activityService.getActivityById(id);
  }

  @Post('add')
  async addEvent(
    @Body('eventCreatorId') eventCreatorId: string,
    @Body('eventTitle') eventTitle: string,
    @Body('eventDescription') eventDescription: string,
    @Body('eventCategory') eventCategory: string,
    @Body('eventDate') eventDate: Date,
    @Body('eventStartTime') eventStartTime: string,
    @Body('eventEndTime') eventEndTime: string,
    @Body('eventLocation') eventLocation: string,
    @Body('eventCoverPhoto') eventCoverPhoto: string,
    @Body('eventHost') eventHost: string,
    @Body('eventWebsite') eventWebsite: string,
    @Body('eventRegistration') eventRegistration: string,
    @Body('eventCapacity') eventCapacity: string,
    @Body('eventCost') eventCost: string,
    @Body('eventTags') eventTags: string[],
    @Body('eventSchedule') eventSchedule: string,
    @Body('eventSpeakers') eventSpeakers: string[],
    @Body('eventPrerequisites') eventPrerequisites: string,
    @Body('eventCancellationPolicy') eventCancellationPolicy: string,
    @Body('eventContact') eventContact: string,
    @Body('eventSocialMedia') eventSocialMedia: [],
    @Body('eventPrivacy') eventPrivacy: string,
    @Body('eventAccessibility') eventAccessibility: string,
  ) {
    const newEvent = await this.activityService.addEvent(
      eventCreatorId,
      eventTitle,
      eventDescription,
      eventCategory,
      eventDate,
      eventStartTime,
      eventEndTime,
      eventLocation,
      eventCoverPhoto,
      eventHost,
      eventWebsite,
      eventRegistration,
      eventCapacity,
      eventCost,
      eventTags,
      eventSchedule,
      eventSpeakers,
      eventPrerequisites,
      eventCancellationPolicy,
      eventContact,
      eventSocialMedia,
      eventPrivacy,
      eventAccessibility,
    );
    console.log(newEvent);
    return { id: newEvent };
  }

  @Patch('update/:id')
  async updateActivity(
    @Param('id') id: string,
    @Body('eventCreatorId') eventCreatorId: string,
    @Body('eventTitle') eventTitle: string,
    @Body('eventDescription') eventDescription: string,
    @Body('eventCategory') eventCategory: string,
    @Body('eventDate') eventDate: Date,
    @Body('eventStartTime') eventStartTime: string,
    @Body('eventEndTime') eventEndTime: string,
    @Body('eventLocation') eventLocation: string,
    @Body('eventCoverPhoto') eventCoverPhoto: string,
    @Body('eventHost') eventHost: string,
    @Body('eventWebsite') eventWebsite: string,
    @Body('eventRegistration') eventRegistration: string,
    @Body('eventCapacity') eventCapacity: string,
    @Body('eventCost') eventCost: string,
    @Body('eventTags') eventTags: string[],
    @Body('eventSchedule') eventSchedule: string,
    @Body('eventSpeakers') eventSpeakers: string[],
    @Body('eventPrerequisites') eventPrerequisites: string,
    @Body('eventCancellationPolicy') eventCancellationPolicy: string,
    @Body('eventContact') eventContact: string,
    @Body('eventSocialMedia') eventSocialMedia: {"facebook": string, "twitter": string, "instagram": string, "hashtag": string},
    @Body('eventPrivacy') eventPrivacy: string,
    @Body('eventAccessibility') eventAccessibility: string,
  ) {
    await this.activityService.updateActivity(
      id,
      eventCreatorId,
      eventTitle,
      eventDescription,
      eventCategory,
      eventDate,
      eventStartTime,
      eventEndTime,
      eventLocation,
      eventCoverPhoto,
      eventHost,
      eventWebsite,
      eventRegistration,
      eventCapacity,
      eventCost,
      eventTags,
      eventSchedule,
      eventSpeakers,
      eventPrerequisites,
      eventCancellationPolicy,
      eventContact,
      eventSocialMedia,
      eventPrivacy,
      eventAccessibility,
    );
  }
}
