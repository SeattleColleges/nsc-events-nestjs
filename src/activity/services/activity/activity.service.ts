import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityDocument } from 'src/activity/types/activity.model';
import { CreateActivityDto } from '../../types/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel('Activity') private activityModel: Model<ActivityDocument>,
  ) {
    // activity defined in activity.module.ts
  }
  async getAllActivities(): Promise<ActivityDocument[]> {
    return await this.activityModel.find().exec();
    // only reason to map is to transform the data. In the case of user.
    // I was mapping to transform the data to hide sensitive information
    // But we should use serialization which comes in a later video, and we will
    // on a future iteration. May need it here for eventCreatorId.
  }

  async getActivityById(id: string): Promise<ActivityDocument> {
    console.log('service id: ', id);
    let activity: ActivityDocument;
    try {
      activity = await this.activityModel.findById(id).exec();
    } catch (error) {
      throw new HttpException('Activity not found!', 404);
    }
    if (!activity) {
      throw new HttpException('Activity not found!', 404);
    }
    return {
      eventCreatorId: activity.eventCreatorId,
      eventTitle: activity.eventTitle,
      eventDescription: activity.eventDescription,
      eventCategory: activity.eventCategory,
      eventDate: activity.eventDate,
      eventStartTime: activity.eventStartTime,
      eventEndTime: activity.eventEndTime,
      eventLocation: activity.eventLocation,
      eventCoverPhoto: activity.eventCoverPhoto,
      eventHost: activity.eventHost,
      eventWebsite: activity.eventWebsite,
      eventRegistration: activity.eventRegistration,
      eventCapacity: activity.eventCapacity,
      eventCost: activity.eventCost,
      eventTags: activity.eventTags,
      eventSchedule: activity.eventSchedule,
      eventSpeakers: activity.eventSpeakers,
      eventPrerequisites: activity.eventPrerequisites,
      eventCancellationPolicy: activity.eventCancellationPolicy,
      eventContact: activity.eventContact,
      eventSocialMedia: activity.eventSocialMedia,
      eventPrivacy: activity.eventPrivacy,
      eventAccessibility: activity.eventAccessibility,
    } as ActivityDocument;
  }

  async addEvent(createActivityDto: CreateActivityDto): Promise<any> {
    const newEvent = new this.activityModel(createActivityDto);
    const result = await newEvent.save();
    return result._id;
  }

  async updateActivity(id: string, createActivityDto: CreateActivityDto) {
    const updatedActivity = await this.activityModel.findById(id).exec();

    Object.keys(createActivityDto).forEach((key) => {
      updatedActivity[key] = createActivityDto[key];
    });

    return await updatedActivity.save();
  }
}
